# Oyun Defteri – Claude için notlar

Mustafa'nın tek tek yazdığı matematik/fen oyun HTML'lerini (`mustafa-htmls/`) tek sitede, tek temada ve tek başlık çubuğunda topladık. Site `site/` klasörüdür: statik, sunucusuz, internetsiz çalışır. Arayüz dili Türkçe.

- Repo: github.com/yusuferendolek/matematik-dersleri (`main`)
- Vercel projesi: `mustafa-cubukcu` (Hobby), GitHub'a bağlı; `main`'e her push otomatik yayınlanır → https://mustafa-cubukcu.vercel.app
- Yerel `.vercel/` ve `.env.local` (Vercel CLI oluşturur) git'e girmez.
- **`cicekdev` branch'i** GitHub Pages'te yayınlanır → https://yusuferendolek.github.io/matematik-dersleri/ (kökteki `index.html` `site/`'a yönlendirir, `.nojekyll` dosyalar işlenmeden yayınlansın diye). `vercel.app` Turkcell'de engelli olduğu için bu ikinci adres var. `main`'den tek farkı ana sayfadaki fotoğraf (`site/photo/cicek.jfif`, `.ana-foto`). `main`'e her değişiklikten sonra `git switch cicekdev && git merge main && git push` ile o branch da güncellenir.
- GitHub Actions (CI) hesap fatura sorunu yüzünden kilitli ("account is locked due to a billing issue"); testler yerelde çalıştırılır, Vercel build'i de `check.js`'i çalıştırır.

## Kullanıcının kararları

- Site adı **Oyun Defteri**. Kurum adı hiçbir yerde geçmez (bu projede kurum yok).
- **Hitap her yerde "siz"**: yönergeler, mesajlar, pencereler, placeholder/title/aria-label ve fiil olan düğmeler ("Başlayın", "Çevirin", "Tekrar oynayın"). Fiil olmayan etiketler ("Sıradaki soru", "Kalan can") olduğu gibi. Metin ve hitap gibi içerik kararlarını kullanıcıya sormadan değiştirme.
- Başlık çubuğu **tek** olur: oyunun kendi başlığı/üst çubuğu kaldırılır, içindeki her şey (sekmeler, puan, rekor, can, ses düğmesi, ipucu…) bizim başlığa taşınır. Hiçbir özellik kaybolmaz.
- Oyun seçimi başlığın **solundan** yapılır (İçindekiler çekmecesi), oklarla önceki/sonraki oyuna geçilir.
- Mat/Fen seçici **yok**: iki ders de her zaman listelenir.
- Karanlık mod var (sistem ayarıyla başlar, seçim hatırlanır).
- `main`'de ana sayfada fotoğraf yok (kullanıcı kaldırttı); fotoğraf yalnızca `cicekdev` branch'inde.
- Tekrar etmeyen her oyun sitede: `mat4-1 yuvarlama` ile `mat5-3 yuvarlama` birebir aynı (tek oyun); kesir boyamanın v2'si kullanılır.
- Oyunların mantığına dokunulmaz; görünüm ortak temaya taşınır, gerçek hatalar ve yanlış metinler düzeltilir.
- **İnternetsiz** çalışır: dışarıdan kaynak (CDN, Google Fonts, Tailwind, Font Awesome, Chart.js) yüklenmez. `site/index.html` çift tıklanınca da çalışmalı.
- Sunucu (backend) yok.
- Sınıfı bilinmeyen oyunlar (Sayı Örüntüsü Treni, Patron Kasiyer, Maliyet Hesaplayıcı, Şans Çarkı, Çarpma ve Bölme Atölyesi, Açı Dedektifi, Asal Çarpan Laboratuvarı, Deneysel Olasılık Laboratuvarı) sınıfsız kalır; kullanıcı da bilmiyor.

## Tasarım dili

Açık mod **Defter**: kareli kâğıt, solda kırmızı kenar çizgisi, konular fosforlu kalemle işaretli. Koyu mod **Tahta**: yeşil kara tahta, konular renkli tebeşirle. Oyun sahneleri (uzay, devre, tepe, tren…) ayrı koyu kutular değildir; deftere kalemle / tahtaya tebeşirle çizilmiş gibidir.

- Yazı tipi: Atkinson Hyperlegible Next (her yerde). Rakamlar Figtree'den gelir (Atkinson'ın sıfırı çizgili). El yazısı Caveat yalnızca büyük başlıklarda ("İçindekiler", "Matematik", pencere başlıkları).
- Ölçü birimi 24px defter karesi.
- Kaçınılanlar: koyu cam (glassmorphism), birbirinin aynısı yuvarlak kart ızgarası, emoji yığını, büyük harfli etiketler/düğmeler.

## Yapı

- `site/ortak/tema.css` – renk değişkenleri (iki tema), yazı tipleri, başlık çubuğu, İçindekiler, ana sayfa, ortak parçalar.
- `site/ortak/kabuk.js` – tema, **oyun listesi** (`OYUNLAR`, `KONULAR`, `DERSLER`), başlık çubuğu, çekmece, `Kabuk.pencere`, `Kabuk.renk`, `Kabuk.temaDegisince`, `Kabuk.kalpler`.
- `site/oyunlar/<id>.html` – her oyun ayrı sayfa. Sayfalar arası geçiş normal bağlantıdır (`@view-transition` ile yumuşak).
- `scripts/check.js` (Vercel build'i bunu çalıştırır; tek sayfa için `node scripts/check.js oyunlar/x.html`) ve `scripts/smoke.js` (internetsiz headless Chrome).
- Ana sayfa gövdesinin sınıfı `.ana-govde`; `.ana` yalnızca `.dugme.ana` (ana eylem düğmesi) için kullanılır.
- Başlık çubuğu ekrana göre: masaüstünde tek satır; ≤1000px'te sekmeler/ipucu ikinci satıra iner; telefonda (≤640px) sayaçlar da kendi satırına iner; tablette sayaçlar ilk satıra sığmazsa kabuk.js ölçüp `.sag-satir` sınıfıyla indirir; yatay telefonda (yükseklik ≤520px) her şey tek satırda kalır (sayaçlar sığmazsa yana kayar). Oyunlar da yatay telefon için gerekirse `@media (max-height: 520px) and (orientation: landscape)` ile sıkılaşır (Meteor, Yuvarlama).

## Yeni bir oyun ekleme / dönüştürme

1. Orijinali baştan sona oku. Yeni dosya: `site/oyunlar/<id>.html`; `id`, ad, kısa açıklama (`not`, "siz" hitabıyla), konu ve sınıfı kabuk.js'teki `OYUNLAR` listesine ekle (yeni konuysa `KONULAR`'a ve tema.css'e `--k-<konu>` rengini de).
2. İskelet:
   ```html
   <!doctype html><html lang="tr"><head>
   <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
   <title>Oyunun Adı – Oyun Defteri</title>
   <link rel="stylesheet" href="../ortak/tema.css">
   <script src="../ortak/kabuk.js"></script>
   <style>/* yalnızca bu oyuna özel stiller, sadece tema değişkenleriyle */</style>
   </head>
   <body class="oyun-sayfasi">
   <header class="bar" id="bar">
     <div class="bar-orta"><!-- oyunun sekmeleri (.sekmeler > .sekme[aria-selected]) ya da kısa ipucu (.ipucu) --></div>
     <div class="bar-sag"><!-- puan/rekor: <span class="durum"><span class="durum-ad">Puan</span><b class="durum-deger" id="…">0</b></span>; can: <span class="kalpler"> + Kabuk.kalpler(n); ses: .ikon-btn --></div>
   </header>
   <script>Kabuk.bar('<id>');</script>
   <main class="oyun">…</main>
   <script>/* oyunun kodu */</script>
   </body></html>
   ```
3. Oyunun kendi başlığı (h1, logo, alt başlık) kaldırılır; başlık çubuğu oyunun adını ve "N. sınıf Ders" bilgisini zaten gösterir. Oyunun üst çubuğundaki her şey `.bar-orta` / `.bar-sag`'a taşınır, id'ler aynı kalır ki oyun kodu çalışsın. Başlık 1280px'te tek satıra sığmalı. Sayfada ikinci bir üst çubuk/başlık şeridi **asla** olmaz; başlığa sığmayan denetimler `<main>` içinde **solda bir panele** konur (telefonda içeriğin üstüne iner). Kareli defter / tahta zemini görünür kalır.
4. Renkler yalnızca değişkenlerden: `--kagit --yuzey --yuzey-2 --kenarlik --murekkep(-2,-3) --kalem --kalem-yazi --mavi --kirmizi --yesil --turuncu --sari --mor --dogru --yanlis --k-<konu>`. Canvas'ta `Kabuk.renk('mavi')` ile oku, `Kabuk.temaDegisince(fn)` ile yenile.
5. Ortak parçalar: `.panel`, `.panel-baslik`, `.dugme` (`.ana`, `.tehlike`, `.basari`, `.buyuk`, `.kucuk`), `.giris`, `.sekmeler/.sekme`, `.durum`, `.kalpler`, `.rozet`, `.geri-bildirim (.dogru/.yanlis)`, `.sahne`, `.ani-mesaj`, `.ipucu`. Tailwind sınıfları ve Font Awesome ikonları kullanılmaz (gerekirse küçük satır içi SVG).
6. `alert/confirm/prompt` yok → `Kabuk.pencere({ baslik, html, dugme, ikinci })` (Promise döner). Oyun sonu özetleri de pencere olur.
7. Sabit 600–1500px genişlikler kalkar; `clamp()`, `%`, container query (`cqw`) ile ekrana sığdır. 390px telefonda kullanılabilir olmalı.
8. Metinler cümle düzeninde, BÜYÜK HARF değil; emoji yalnızca içeriğin parçasıysa (ör. market ürünleri). Hitap "siz".
9. `node scripts/check.js` ve `node scripts/smoke.js` geçmeli; iki temada, 1440, 768 (tablet), 390 (telefon) ve yatay 844×390 boyutunda ekran görüntüsüyle kontrol et. Sürükleme/çizme olan oyunlarda dokunmatikle de dene (canvas'ta `touch-action: none`, dokunma olayları ya da pointer olayları).
10. Orijinalde düzeltilen hataları commit mesajına yaz.

## Durum ve açık notlar

- 23 oyunun hepsi ortak temada ve yayında (6 oyun Kasım 2026'da eklendi).
- Şans Çarkı'nda dört dilim eşit görünür ama kırmızı %40 olasılıkla gelir (orijinalde de böyle; muhtemelen "çark adil mi?" dersi için bilerek). Değiştirilmedi.
- Alan–çevre oyunlarındaki (Çiftlik Mimarı, En Küçük Çevre Avcısı, Maliyet Hesaplayıcı) ızgara stilleri üç sayfada kopya duruyor; istenirse tema.css'e taşınabilir.
