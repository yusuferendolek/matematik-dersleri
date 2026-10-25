// Statik kontroller. CI'da ve Vercel build'inde (vercel.json) çalışır; hata varsa yayın yapılmaz.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = path.join(__dirname, '..', 'site');

function dosyalar(dir, uzanti) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? dosyalar(p, uzanti) : (p.endsWith(uzanti) ? [p] : []);
  });
}

// tek sayfa verilirse (node scripts/check.js oyunlar/x.html) sadece o sayfa denetlenir; HAZIR listesine bakılmaz
function check(tekSayfa) {
  const errors = [];
  const rel = p => path.relative(SITE, p).replace(/\\/g, '/');
  const secili = f => !tekSayfa || rel(f) === tekSayfa.replace(/\\/g, '/').replace(/^site\//, '');

  // site internetsiz çalışmalı: dışarıdan hiçbir şey yüklenmez
  const DIS = /(?:src|href)\s*=\s*["']?(?:https?:)?\/\/[^"'\s>]+|url\(\s*["']?(?:https?:)?\/\/[^)]+\)|@import|fetch\(\s*["'`]https?:/gi;
  for (const f of [...dosyalar(SITE, '.html'), ...dosyalar(SITE, '.css'), ...dosyalar(SITE, '.js')].filter(secili)) {
    const dis = fs.readFileSync(f, 'utf8').match(DIS);
    if (dis) errors.push(`${rel(f)}: dış kaynak var (site internetsiz çalışmalı): ${dis.join(', ')}`);
  }

  for (const f of dosyalar(SITE, '.js')) {
    try { new vm.Script(fs.readFileSync(f, 'utf8'), { filename: rel(f) }); } catch (e) { errors.push(`${rel(f)}: JS sözdizimi hatası: ${e.message}`); }
  }

  // oyun listesi kabuk.js içinde
  const kabuk = fs.readFileSync(path.join(SITE, 'ortak', 'kabuk.js'), 'utf8');
  const kayitli = [...kabuk.matchAll(/\{ id: '([a-z0-9-]+)', konu:/g)].map(m => m[1]);
  const hazirM = kabuk.match(/const HAZIR = \[([^\]]*)\]/);
  const hazir = hazirM ? [...hazirM[1].matchAll(/'([a-z0-9-]+)'/g)].map(m => m[1]) : kayitli;
  for (const id of tekSayfa ? [] : hazir) {
    if (!kayitli.includes(id)) errors.push(`HAZIR listesindeki "${id}" OYUNLAR listesinde yok`);
    if (!fs.existsSync(path.join(SITE, 'oyunlar', id + '.html'))) errors.push(`oyunlar/${id}.html yok (kabuk.js listesinde hazır görünüyor)`);
  }

  if (tekSayfa && !dosyalar(SITE, '.html').some(secili)) errors.push(`${tekSayfa} bulunamadı`);
  for (const f of dosyalar(SITE, '.html').filter(secili)) {
    const html = fs.readFileSync(f, 'utf8');
    const ad = rel(f);
    const oyunMu = ad.startsWith('oyunlar/');
    if (!/<meta charset="utf-8">/i.test(html)) errors.push(`${ad}: <meta charset="utf-8"> yok`);
    if (!/<meta name="viewport"/.test(html)) errors.push(`${ad}: viewport etiketi yok`);
    if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${ad}: <title> yok`);
    const kok = oyunMu ? '../' : '';
    if (!html.includes(`href="${kok}ortak/tema.css"`)) errors.push(`${ad}: ${kok}ortak/tema.css bağlı değil`);
    if (!html.includes(`src="${kok}ortak/kabuk.js"`)) errors.push(`${ad}: ${kok}ortak/kabuk.js bağlı değil`);
    if (!/<header class="bar" id="bar">/.test(html)) errors.push(`${ad}: <header class="bar" id="bar"> yok`);
    if (/\b(?:alert|confirm|prompt)\(/.test(html)) errors.push(`${ad}: alert/confirm/prompt var; Kabuk.pencere kullanılmalı`);
    for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
      try { new vm.Script(m[1], { filename: ad }); } catch (e) { errors.push(`${ad}: JS sözdizimi hatası: ${e.message}`); }
    }
    if (oyunMu) {
      const id = path.basename(f, '.html');
      if (!kayitli.includes(id)) errors.push(`${ad}: kabuk.js OYUNLAR listesinde yok`);
      else if (!tekSayfa && !hazir.includes(id)) errors.push(`${ad}: kabuk.js HAZIR listesinde yok`);
      if (!html.includes(`Kabuk.bar('${id}')`)) errors.push(`${ad}: Kabuk.bar('${id}') çağrısı yok`);
    }
  }

  return { errors, sayfa: dosyalar(SITE, '.html').length, hazir };
}

module.exports = { check, SITE };

if (require.main === module) {
  const tek = process.argv[2];
  const { errors, sayfa, hazir } = check(tek);
  if (errors.length) { errors.forEach(e => console.error('✗ ' + e)); process.exit(1); }
  console.log(tek ? `✓ ${tek}: dış kaynak yok, JS geçerli, iskelet tamam` : `✓ ${sayfa} sayfa, ${hazir.length} oyun: dış kaynak yok, JS geçerli, oyun listesi tutarlı`);
}
