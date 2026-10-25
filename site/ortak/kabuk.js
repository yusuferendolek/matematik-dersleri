/* Oyun Defteri – ortak kabuk.
   Her sayfa <head> içinde yükler (tema ilk boyamadan önce uygulanır), sonra
   <header class="bar" id="bar">…</header> öğesinin hemen ardından Kabuk.bar('oyun-id') çağırır.
   Oyunun başlıkta duracak parçaları header içine .bar-orta (sekmeler) ve .bar-sag (puan, can…) olarak yazılır. */
(() => {
  'use strict';

  const KOK = new URL('..', document.currentScript.src).href; // sitenin kök adresi
  const TEMA_ANAHTAR = 'od-tema';

  /* ---------- tema ---------- */
  function kayitliTema() {
    try { return localStorage.getItem(TEMA_ANAHTAR); } catch (e) { return null; }
  }
  const sistemKoyu = () => window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.tema = kayitliTema() || (sistemKoyu() ? 'tahta' : 'defter');

  function temaDegistir(yeni) {
    document.documentElement.dataset.tema = yeni;
    try { localStorage.setItem(TEMA_ANAHTAR, yeni); } catch (e) { /* depolama kapalıysa sadece bu sayfada geçerli */ }
    temaDugmesi();
    document.dispatchEvent(new CustomEvent('od-tema', { detail: yeni }));
  }
  // başka sekmede tema değişirse bu sekme de uysun
  addEventListener('storage', e => { if (e.key === TEMA_ANAHTAR && e.newValue) temaDegistir(e.newValue); });

  /* ---------- oyun listesi ---------- */
  const DERSLER = { mat: 'Matematik', fen: 'Fen Bilgisi' };
  const KONULAR = [
    { id: 'sayilar', ders: 'mat', ad: 'Sayılar' },
    { id: 'kesirler', ders: 'mat', ad: 'Kesirler' },
    { id: 'ondalik', ders: 'mat', ad: 'Ondalık ve yüzde' },
    { id: 'acilar', ders: 'mat', ad: 'Açılar' },
    { id: 'alan', ders: 'mat', ad: 'Alan ve çevre' },
    { id: 'carpan', ders: 'mat', ad: 'Çarpanlar ve katlar' },
    { id: 'veri', ders: 'mat', ad: 'Veri ve olasılık' },
    { id: 'elektrik', ders: 'fen', ad: 'Elektrik' }
  ];
  // sinif: bilinmiyorsa null. kaynak: mustafa-htmls/ içindeki orijinal dosya.
  const OYUNLAR = [
    { id: 'uzay-savunmasi', konu: 'sayilar', ad: 'Uzay Savunması: Milyonlar', not: 'Göktaşındaki sayının okunuşunu rakamlarla yaz.', sinif: '5', kaynak: 'mat5-1 milyonlar okuma (1).html' },
    { id: 'sayi-cozumleyici', konu: 'sayilar', ad: 'Sihirli Sayı Çözümleyici', not: 'Sayıyı basamaklarına ve bölüklerine ayır.', sinif: '5', kaynak: 'mat5-2 basamak çözümleme (1).html' },
    { id: 'yuvarlama-tepesi', konu: 'sayilar', ad: 'Yuvarlama Tepesi', not: 'Sayıyı en yakın onluğa, yüzlüğe ya da binliğe yuvarla.', sinif: '4–5', kaynak: 'mat5-3 yuvarlama (1).html' },
    { id: 'oruntu-treni', konu: 'sayilar', ad: 'Sayı Örüntüsü Treni', not: 'Örüntünün kuralını bul, eksik vagonu doldur.', sinif: null, kaynak: 'sayı örüntüsü (1).html' },
    { id: 'kesir-boyama', konu: 'kesirler', ad: 'Kesir Boyama', not: 'Şekli böl, hedef kesir kadarını boya.', sinif: '5', kaynak: 'mat 5-5 kesir boyam v2.html' },
    { id: 'kesir-avcisi', konu: 'kesirler', ad: 'Kesir Avcısı', not: 'Kesri sayı doğrusunda doğru yere yerleştir.', sinif: '5', kaynak: 'mat5-4 kesir sayı doğrusu (1).html' },
    { id: 'patron-kasiyer', konu: 'ondalik', ad: 'Patron Kasiyer', not: 'İndirimli fiyatları hesapla, marketini büyüt.', sinif: null, kaynak: 'market ondalık, yüzde işlem (1).html' },
    { id: 'meteor-avcisi', konu: 'acilar', ad: 'Meteor Avcısı', not: 'İletkiyle açıyı ölç, meteoru vur.', sinif: '5', kaynak: 'mat 5-1 açı ölçme ile gök taşı.html' },
    { id: 'aci-tahmincisi', konu: 'acilar', ad: 'Açı Tahmincisi', not: 'İstenen açıyı göz kararıyla çiz.', sinif: '5', kaynak: 'mat5-2 açı tahmin oyunu.html' },
    { id: 'ciftlik-mimari', konu: 'alan', ad: 'Çiftlik Mimarı', not: 'Alanı ya da çevresi verilen dikdörtgenleri çiz.', sinif: '5', kaynak: 'mat 5-7 dikdörtgen alan çevre (1).html' },
    { id: 'cevre-avcisi', konu: 'alan', ad: 'En Küçük Çevre Avcısı', not: 'Zarın verdiği alanı en küçük çevreyle kur.', sinif: '5', kaynak: 'oyun.html' },
    { id: 'maliyet-hesaplayici', konu: 'alan', ad: 'Maliyet Hesaplayıcı', not: 'Kareleri boya, alanın ve çevrenin maliyetini gör.', sinif: null, kaynak: 'alan_cevre_maliyet_hesaplayici (1).html' },
    { id: 'ortak-katlar', konu: 'carpan', ad: 'Ortak Katlar ve Çarpanlar', not: 'İki sayının ortak katlarını ve çarpanlarını bul.', sinif: '6', kaynak: 'mat6-1 ortak_katlar_ve_arpanlar.html' },
    { id: 'sans-carki', konu: 'veri', ad: 'Şans Çarkı', not: 'Çarkı çevir, sonuçların grafiğini izle.', sinif: null, kaynak: 'çark (1).html' },
    { id: 'soru-dedektifi', konu: 'veri', ad: 'Soru Dedektifi', not: 'Araştırma sorusundaki değişken türünü bul.', sinif: '11', kaynak: 'ara_t_rma_sorular_dedektifi.html' },
    { id: 'korelasyon-dedektifi', konu: 'veri', ad: 'Korelasyon Dedektifi', not: 'Serpme grafiğindeki ilişkinin yönünü ve gücünü yorumla.', sinif: '11', kaynak: 'korelasyon_ve_serpme_grafikleri_dedektifi-2.html' },
    { id: 'elektrik-devreleri', konu: 'elektrik', ad: 'Elektrik Devreleri', not: 'Seri ve paralel devre kur, akımı gözle.', sinif: '7', kaynak: 'elektrik_devreleri_sim_lasyonu.html' }
  ];
  // ortak temaya taşınmış oyunlar; hepsi taşınınca bu liste kalkacak
  const HAZIR = ['yuvarlama-tepesi', 'meteor-avcisi', 'elektrik-devreleri'];
  const hazirMi = o => HAZIR.includes(o.id);

  const konuOf = id => KONULAR.find(k => k.id === id);
  const dersOf = o => konuOf(o.konu).ders;
  const oyunAdresi = id => KOK + 'oyunlar/' + id + '.html';
  const sinifYazisi = o => (o.sinif ? o.sinif + '. sınıf ' : '') + DERSLER[dersOf(o)];

  /* ---------- küçük yardımcılar ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (ic, sinif = 'svg', ek = '') => `<svg class="${sinif}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${ek}>${ic}</svg>`;
  const IKON = {
    menu: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
    geri: '<path d="M15 5l-7 7 7 7"/>',
    ileri: '<path d="M9 5l7 7-7 7"/>',
    ay: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    gunes: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    tamEkran: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    sayilar: '<text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor" stroke="none" font-family="Atkinson Hyperlegible Next, sans-serif">123</text>',
    kesirler: '<circle cx="12" cy="12" r="8.5"/><path d="M12 12V3.5A8.5 8.5 0 0 1 20.5 12z" fill="currentColor"/>',
    ondalik: '<circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M18.5 5.5l-13 13"/>',
    acilar: '<path d="M4 19h16M4 19L15 6"/><path d="M10.5 19a6.5 6.5 0 0 0-2-4.8"/>',
    alan: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16" stroke-width="1.2"/>',
    carpan: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    veri: '<path d="M4 4v16h16"/><circle cx="9" cy="14" r="1.3" fill="currentColor"/><circle cx="12.5" cy="11" r="1.3" fill="currentColor"/><circle cx="16" cy="8.5" r="1.3" fill="currentColor"/><circle cx="18" cy="6" r="1.3" fill="currentColor"/>',
    elektrik: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
  };
  const KALP = '<path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/>';

  /* ---------- İçindekiler ---------- */
  function liste(acikId) {
    return Object.keys(DERSLER).map(d => `
      <section class="ders-blok">
        <h2 class="ders-baslik">${DERSLER[d]}</h2>
        <div class="sutunlar">${KONULAR.filter(k => k.ders === d).map(k => `
          <div class="konu">
            <h3 class="konu-baslik"><span class="fosfor" style="--fk:var(--k-${k.id})">${k.ad}</span></h3>
            <ul class="liste">${OYUNLAR.filter(o => o.konu === k.id).map(o => {
              const ic = `${svg(IKON[k.id])}
                <span class="satir-ust"><span class="satir-ad">${esc(o.ad)}</span><span class="nokta"></span><span class="sinif">${hazirMi(o) ? (o.sinif ? o.sinif + '. sınıf' : '') : 'hazırlanıyor'}</span></span>
                <span class="satir-not">${esc(o.not)}</span>`;
              return `<li>${hazirMi(o)
                ? `<a class="satir" href="${oyunAdresi(o.id)}"${o.id === acikId ? ' aria-current="page"' : ''}>${ic}</a>`
                : `<span class="satir yakinda">${ic}</span>`}</li>`;
            }).join('')}
            </ul>
          </div>`).join('')}
        </div>
      </section>`).join('');
  }

  /* ---------- başlık çubuğu ---------- */
  let bar = null;

  function temaDugmesi() {
    const b = document.getElementById('temaBtn');
    if (!b) return;
    const tahta = document.documentElement.dataset.tema === 'tahta';
    b.innerHTML = svg(tahta ? IKON.gunes : IKON.ay);
    b.setAttribute('aria-label', tahta ? 'Açık moda geç' : 'Koyu moda geç');
    b.title = b.getAttribute('aria-label');
  }

  function cekmece(acik) {
    document.body.classList.toggle('cekmece-acik', acik);
    const m = document.getElementById('menuBtn');
    if (m) m.setAttribute('aria-expanded', acik);
    if (acik) setTimeout(() => document.getElementById('cekmece').focus(), 50);
  }

  function kur(oyunId) {
    bar = document.getElementById('bar');
    const oyun = OYUNLAR.find(o => o.id === oyunId) || null;
    const orta = bar.querySelector('.bar-orta') || Object.assign(document.createElement('div'), { className: 'bar-orta' });
    const sag = bar.querySelector('.bar-sag');

    // sol: menü düğmesi, oyunun yeri, önceki/sonraki
    const sol = document.createDocumentFragment();
    const tmp = document.createElement('div');
    let adim = '';
    if (oyun) {
      const sira = OYUNLAR.filter(hazirMi);
      const i = sira.indexOf(oyun);
      const onceki = sira[(i - 1 + sira.length) % sira.length], sonraki = sira[(i + 1) % sira.length];
      adim = `<div class="adim">
        <a class="ikon-btn" href="${oyunAdresi(onceki.id)}" aria-label="Önceki oyun: ${esc(onceki.ad)}" title="Önceki: ${esc(onceki.ad)}">${svg(IKON.geri)}</a>
        <a class="ikon-btn" href="${oyunAdresi(sonraki.id)}" aria-label="Sonraki oyun: ${esc(sonraki.ad)}" title="Sonraki: ${esc(sonraki.ad)}">${svg(IKON.ileri)}</a>
      </div>`;
    }
    tmp.innerHTML = `<button class="kenar-btn" id="menuBtn" aria-label="İçindekiler" title="İçindekiler" aria-expanded="false" aria-controls="cekmece">${svg(IKON.menu)}</button>
      <div class="yer">${oyun
        ? `<span class="yer-ust"><span class="fosfor" style="--fk:var(--k-${oyun.konu})">${esc(sinifYazisi(oyun))}</span></span><h1 class="yer-ad">${esc(oyun.ad)}</h1>`
        : '<h1 class="yer-ad site"><a href="' + KOK + 'index.html">Oyun Defteri</a></h1>'}</div>${adim}`;
    while (tmp.firstChild) sol.appendChild(tmp.firstChild);
    bar.insertBefore(sol, bar.firstChild);
    if (!orta.parentNode) bar.insertBefore(orta, sag || null);

    // sağ: tema ve tam ekran (oyunun kendi sağ parçalarından sonra)
    const araclar = document.createElement('div');
    araclar.className = 'araclar';
    araclar.innerHTML = `<button class="ikon-btn" id="temaBtn"></button>
      <button class="ikon-btn tam-ekran-btn" id="tamEkranBtn" aria-label="Tam ekran" title="Tam ekran">${svg(IKON.tamEkran)}</button>`;
    bar.appendChild(araclar);
    temaDugmesi();

    // çekmece
    const perde = Object.assign(document.createElement('div'), { className: 'perde', id: 'perde' });
    const nav = document.createElement('nav');
    nav.className = 'cekmece'; nav.id = 'cekmece'; nav.tabIndex = -1;
    nav.setAttribute('aria-label', 'İçindekiler');
    nav.innerHTML = `<div class="cekmece-ust">
        <button class="kenar-btn" id="kapatBtn" aria-label="İçindekileri kapat">${svg(IKON.kapat)}</button>
        <h2>İçindekiler</h2>
      </div>
      <div class="cekmece-ic">${liste(oyunId)}</div>`;
    bar.after(perde, nav);

    document.getElementById('menuBtn').onclick = () => cekmece(true);
    document.getElementById('kapatBtn').onclick = () => { cekmece(false); document.getElementById('menuBtn').focus(); };
    perde.onclick = () => cekmece(false);
    document.getElementById('temaBtn').onclick = () => temaDegistir(document.documentElement.dataset.tema === 'tahta' ? 'defter' : 'tahta');
    document.getElementById('tamEkranBtn').onclick = () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    };
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('cekmece-acik')) { cekmece(false); document.getElementById('menuBtn').focus(); }
    });
    if (oyun) document.title = oyun.ad + ' – Oyun Defteri';
  }

  /* ---------- pencere (alert yerine) ----------
     Kabuk.pencere({ baslik, html, dugme, ikinci }) → Promise: 'ana' ya da 'ikinci' */
  function pencere({ baslik = '', html = '', dugme = 'Tamam', ikinci = null } = {}) {
    return new Promise(coz => {
      const onceki = document.activeElement;
      const perde = document.createElement('div');
      perde.className = 'pencere-perde';
      perde.innerHTML = `<div class="pencere" role="dialog" aria-modal="true" aria-labelledby="pencereBaslik">
          <h2 id="pencereBaslik">${baslik}</h2>
          <div class="pencere-ic">${html}</div>
          <div class="pencere-dugmeler">
            ${ikinci ? `<button class="dugme buyuk" data-sonuc="ikinci">${ikinci}</button>` : ''}
            <button class="dugme ana buyuk" data-sonuc="ana">${dugme}</button>
          </div>
        </div>`;
      document.body.appendChild(perde);
      const kapat = sonuc => {
        perde.remove();
        removeEventListener('keydown', tus, true);
        if (onceki && onceki.focus) onceki.focus();
        coz(sonuc);
      };
      const tus = e => {
        if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); kapat(e.key === 'Enter' ? 'ana' : (ikinci ? 'ikinci' : 'ana')); }
      };
      addEventListener('keydown', tus, true);
      perde.addEventListener('click', e => { const b = e.target.closest('[data-sonuc]'); if (b) kapat(b.dataset.sonuc); });
      setTimeout(() => perde.querySelector('[data-sonuc="ana"]').focus(), 30);
    });
  }

  /* çizimler için tema rengi: Kabuk.renk('kalem') → '#2346C8' */
  const renk = ad => getComputedStyle(document.documentElement).getPropertyValue('--' + ad).trim();
  const temaDegisince = fn => document.addEventListener('od-tema', e => fn(e.detail));

  /* can göstergesi: Kabuk.kalpler(2, 3) */
  const kalpler = (kalan, toplam = 3) => {
    let h = '';
    for (let i = 0; i < toplam; i++) h += svg(KALP, '', i < kalan ? 'fill="currentColor"' : 'opacity=".45"');
    return h;
  };

  window.Kabuk = { bar: kur, pencere, renk, temaDegisince, kalpler, liste, OYUNLAR, KONULAR, DERSLER, oyunAdresi, KOK };
})();
