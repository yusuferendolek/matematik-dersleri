# Oyun Defteri – Claude için notlar

Mustafa'nın tek tek yazdığı matematik/fen oyun HTML'lerini (`mustafa-htmls/`) tek sitede, tek temada ve tek başlık çubuğunda topluyoruz. Site `site/` klasörüdür: statik, sunucusuz, internetsiz çalışır; Vercel'in ücretsiz (Hobby) planında yayınlanır. Arayüz dili Türkçe. Repo: github.com/yusuferendolek/matematik-dersleri (`main`).

## Kullanıcının kararları

- Site adı **Oyun Defteri**. Kurum adı hiçbir yerde geçmez (bu projede kurum yok).
- Başlık çubuğu **tek** olur: oyunun kendi başlığı/üst çubuğu kaldırılır, içindeki her şey (sekmeler, puan, rekor, can, ses düğmesi, ipucu…) bizim başlığa taşınır. Hiçbir özellik kaybolmaz.
- Oyun seçimi başlığın **solundan** yapılır (İçindekiler çekmecesi), oklarla önceki/sonraki oyuna geçilir.
- Mat/Fen seçici **yok**: iki ders de her zaman listelenir.
- Karanlık mod var (sistem ayarıyla başlar, seçim hatırlanır).
- Tekrar etmeyen her oyun sitede olur. `mat4-1 yuvarlama` ile `mat5-3 yuvarlama` birebir aynı: tek oyun. Kesir boyamanın v2'si kullanılır.
- Oyunların mantığına dokunulmaz; görünüm ortak temaya taşınır, kırık şeyler düzeltilir (`alert()` yerine temalı pencere, sabit genişlikler, eksik ikon, yanlış metin vb.).
- **İnternetsiz** çalışır: dışarıdan kaynak (CDN, Google Fonts, Tailwind CDN, Font Awesome, Chart.js) yüklenmez; her şey sitenin içindedir. `site/index.html` çift tıklanınca da çalışmalı.
- Sunucu (backend) yok.

## Tasarım dili

Açık mod **Defter**: kareli kâğıt, solda kırmızı kenar çizgisi, konular fosforlu kalemle işaretli. Koyu mod **Tahta**: yeşil kara tahta, konular renkli tebeşirle. Oyun sahneleri (uzay, devre, tepe…) ayrı koyu kutular değildir; deftere kalemle / tahtaya tebeşirle çizilmiş gibidir.

- Yazı tipi: Atkinson Hyperlegible Next (her yerde). Rakamlar Figtree'den gelir (Atkinson'ın sıfırı çizgili). El yazısı Caveat yalnızca büyük başlıklarda ("İçindekiler", "Matematik", pencere başlıkları).
- Ölçü birimi 24px defter karesi.
- Kaçınılanlar: koyu cam (glassmorphism), birbirinin aynısı yuvarlak kart ızgarası, emoji yığını, büyük harfli etiketler/düğmeler.

## Yapı

- `site/ortak/tema.css` – renk değişkenleri (iki tema), yazı tipleri, başlık çubuğu, İçindekiler, ortak parçalar.
- `site/ortak/kabuk.js` – tema, **oyun listesi** (`OYUNLAR`, `KONULAR`, `HAZIR`), başlık çubuğu, çekmece, `Kabuk.pencere`, `Kabuk.renk`, `Kabuk.temaDegisince`, `Kabuk.kalpler`.
- `site/oyunlar/<id>.html` – her oyun ayrı sayfa. Sayfalar arası geçiş normal bağlantıdır (`@view-transition` ile yumuşak).
- `scripts/check.js` (Vercel build'i bunu çalıştırır) ve `scripts/smoke.js` (internetsiz headless Chrome).

## Bir oyunu dönüştürme

1. Orijinali `mustafa-htmls/` içinden baştan sona oku. Yeni dosya: `site/oyunlar/<id>.html` (`id` kabuk.js'teki `OYUNLAR` listesinde).
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
     <div class="bar-orta"><!-- oyunun sekmeleri (.sekmeler > .sekme[aria-selected]) ya da kısa ipucu --></div>
     <div class="bar-sag"><!-- puan/rekor: <span class="durum"><span class="durum-ad">Puan</span><b class="durum-deger" id="…">0</b></span>; can: <span class="kalpler"> + Kabuk.kalpler(n) --></div>
   </header>
   <script>Kabuk.bar('<id>');</script>
   <main class="oyun">…</main>
   <script>/* oyunun kodu */</script>
   </body></html>
   ```
3. Oyunun kendi başlığı (h1, logo, alt başlık) kaldırılır; başlık çubuğu oyunun adını ve "N. sınıf Ders" bilgisini zaten gösterir. Oyunun üst çubuğundaki her şey `.bar-orta` / `.bar-sag`'a taşınır, id'ler aynı kalır ki oyun kodu çalışmaya devam etsin.
4. Renkler yalnızca değişkenlerden: `--kagit --yuzey --yuzey-2 --kenarlik --murekkep(-2,-3) --kalem --kalem-yazi --mavi --kirmizi --yesil --turuncu --sari --mor --dogru --yanlis --k-<konu>`. Canvas'ta `Kabuk.renk('mavi')` ile oku, `Kabuk.temaDegisince(fn)` ile yenile.
5. Ortak parçaları kullan: `.panel`, `.panel-baslik`, `.dugme` (`.ana`, `.tehlike`, `.basari`, `.buyuk`, `.kucuk`), `.giris`, `.sekmeler/.sekme`, `.rozet`, `.geri-bildirim (.dogru/.yanlis)`, `.sahne`, `.ani-mesaj`, `.ipucu`. Tailwind sınıfları ve Font Awesome ikonları kalkar (gerekirse küçük satır içi SVG).
6. `alert/confirm/prompt` yok → `Kabuk.pencere({ baslik, html, dugme, ikinci })` (Promise döner).
7. Sabit 600–1500px genişlikler kalkar; `clamp()`, `%`, container query (`cqw`) ile ekrana sığdır. Telefonda da kullanılabilir olmalı.
8. Metinler cümle düzeninde, BÜYÜK HARF değil; emoji yalnızca içeriğin parçasıysa (ör. market ürünleri).
9. kabuk.js'teki `HAZIR` listesine id'yi ekle. `node scripts/check.js` ve `node scripts/smoke.js` geçmeli; iki temada ve telefon genişliğinde ekran görüntüsüyle kontrol et.
10. Orijinalde düzeltilen hataları commit mesajına yaz.

## Durum

Hazır: Yuvarlama Tepesi, Meteor Avcısı, Elektrik Devreleri. Kalan 14 oyun `HAZIR` listesine eklendikçe İçindekiler'de açılır. Bütün oyunlar bitince `HAZIR` listesi ve "hazırlanıyor" durumu kaldırılacak.

Sınıfı bilinmeyenler (kullanıcıya soruldu): Sayı Örüntüsü Treni, Patron Kasiyer, Maliyet Hesaplayıcı, Şans Çarkı.
