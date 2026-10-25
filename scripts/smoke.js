// Duman testi: her sayfayı internetsiz, sessiz bir Chrome'da açar; temayı değiştirir, İçindekiler'i açıp kapatır,
// JS hatası, boş başlık ya da internete çıkma denemesi olursa başarısız olur.
// Çalıştırma: node scripts/smoke.js   (Chrome bulunamazsa CHROME=/yol/chrome)
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { SITE } = require('./check');

const CHROME = process.env.CHROME || (process.platform === 'win32'
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const sayfalar = ['index.html', ...fs.readdirSync(path.join(SITE, 'oyunlar')).filter(f => f.endsWith('.html')).map(f => 'oyunlar/' + f)];

async function main() {
  const port = 9300 + Math.floor(Math.random() * 600);
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'smoke-'));
  // proxy'yi olmayan bir adrese yönlendirerek internet tamamen kapatılır
  const chrome = spawn(CHROME, ['--headless=new', '--mute-audio', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--proxy-server=http://127.0.0.1:9', '--proxy-bypass-list=<-loopback>',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, '--window-size=1280,800', 'about:blank']);
  chrome.stdout.on('data', () => {}); chrome.stderr.on('data', () => {});
  try {
    let ws;
    for (let i = 0; i < 80 && !ws; i++) {
      try { const p = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch (e) { /* henüz açılmadı */ }
      if (!ws) await sleep(150);
    }
    if (!ws) throw new Error(`Chrome açılmadı (${CHROME})`);
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });

    let id = 0; const bekleyen = new Map(); const hatalar = [];
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && bekleyen.has(m.id)) { bekleyen.get(m.id)(m); bekleyen.delete(m.id); }
      if (m.method === 'Runtime.exceptionThrown') hatalar.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') hatalar.push('console.error: ' + m.params.args.map(a => a.value ?? a.description).join(' '));
      if (m.method === 'Network.requestWillBeSent' && !/^(file|data|blob|about):/.test(m.params.request.url)) hatalar.push('internete çıkma denemesi: ' + m.params.request.url);
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) hatalar.push('yükleme hatası: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
    });
    const gonder = (method, params = {}) => new Promise(r => { const i = ++id; bekleyen.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const calistir = async ifade => (await gonder('Runtime.evaluate', { expression: ifade, returnByValue: true })).result?.result?.value;

    await gonder('Page.enable'); await gonder('Runtime.enable'); await gonder('Network.enable'); await gonder('Log.enable');

    let basarisiz = 0;
    for (const s of sayfalar) {
      const once = hatalar.length;
      await gonder('Page.navigate', { url: pathToFileURL(path.join(SITE, s)).href });
      await sleep(900);
      const bas = await calistir(`!!document.querySelector('#bar .kenar-btn') && !!document.querySelector('#bar .araclar') && !!document.querySelector('#cekmece .satir')`);
      await calistir(`document.getElementById('temaBtn').click()`); await sleep(200);
      const tema = await calistir(`document.documentElement.dataset.tema`);
      await calistir(`document.getElementById('temaBtn').click()`); await sleep(100);
      await calistir(`document.getElementById('menuBtn').click()`); await sleep(300);
      const acik = await calistir(`document.body.classList.contains('cekmece-acik')`);
      await calistir(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`); await sleep(100);
      await calistir(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`); await sleep(400);
      const hs = hatalar.slice(once)
        .concat(bas ? [] : ['başlık çubuğu kurulmamış'])
        .concat(tema ? [] : ['tema okunamadı'])
        .concat(acik ? [] : ['İçindekiler açılmadı']);
      if (hs.length) { basarisiz++; console.log(`✗ ${s}\n    ${hs.join('\n    ')}`); }
    }

    ws.close();
    console.log(basarisiz ? `\n${basarisiz} sayfa başarısız` : `✓ ${sayfalar.length} sayfanın hepsi internetsiz açıldı, hata yok`);
    process.exitCode = basarisiz ? 1 : 0;
  } finally {
    chrome.kill();
    setTimeout(() => { try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {} }, 500);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
