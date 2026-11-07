# Oyun Defteri

Matematik ve fen konuları için sınıfta ya da evde oynanan 23 etkileşimli oyun. Hepsi tek bir sitede, aynı görünümde ve tek bir başlık çubuğuyla toplanır: sol üstteki menüden (İçindekiler) istediğiniz oyuna geçebilir, oklarla sıradakine ilerleyebilirsiniz. Açık mod kareli defter, koyu mod kara tahta görünümündedir; sağ üstteki düğmeyle değişir ve seçim hatırlanır.

**Canlı site:** https://mustafa-cubukcu.vercel.app

## Kullanım

- **İnternet varsa:** canlı siteyi açın.
- **İnternet yoksa:** `site` klasörünü (USB ile ya da zipleyerek) bilgisayara kopyalayın, `site/index.html` dosyasına çift tıklayın. Hiçbir şey internetten yüklenmez; yazı tipleri dahil her şey klasörün içindedir. Chrome ya da Edge önerilir.
- Sunucu (backend) yoktur; site düz HTML, CSS ve JavaScript dosyalarından oluşur.
- Telefon, tablet, bilgisayar ve projeksiyonda çalışır.

## Oyunlar

| Ders | Konu | Oyun | Sınıf |
|---|---|---|---|
| Matematik | Sayılar | Uzay Savunması: Milyonlar | 5 |
| | | Sihirli Sayı Çözümleyici | 5 |
| | | Yuvarlama Tepesi | 4–5 |
| | | Sayı Örüntüsü Treni | – |
| | | Çarpma ve Bölme Atölyesi | – |
| | Kesirler | Kesir Boyama | 5 |
| | | Kesir Avcısı | 5 |
| | Ondalık ve yüzde | Patron Kasiyer | – |
| | Açılar | Meteor Avcısı | 5 |
| | | Açı Tahmincisi | 5 |
| | | Açı Dedektifi | – |
| | Alan ve çevre | Çiftlik Mimarı | 5 |
| | | En Küçük Çevre Avcısı | 5 |
| | | Maliyet Hesaplayıcı | – |
| | | Paralelkenar ve Üçgenin Alanı | 6 |
| | Çarpanlar ve katlar | Ortak Katlar ve Çarpanlar | 6 |
| | | Asal Çarpan Laboratuvarı | – |
| | | Bölünebilme Sepeti | 6 |
| | Veri ve olasılık | Şans Çarkı | – |
| | | Deneysel Olasılık Laboratuvarı | – |
| | | Soru Dedektifi | 11 |
| | | Korelasyon Dedektifi | 11 |
| Fen Bilgisi | Elektrik | Elektrik Devreleri | 7 |

Oyunları Mustafa yazdı; orijinal hâlleri `mustafa-htmls/` klasöründe değiştirilmeden duruyor. Sitedeki sürümlerde görünüm ortak temaya taşındı, oyunların kendi üst çubukları başlık çubuğuna alındı ve orijinallerdeki hatalar düzeltildi (ayrıntılar commit mesajlarında).

## Klasörler

```
site/                 yayınlanan site (Vercel bunu sunar)
  index.html          ana sayfa: İçindekiler
  ortak/tema.css      ortak tema: renkler, yazı tipleri, başlık çubuğu, düğmeler, paneller
  ortak/kabuk.js      başlık çubuğu, İçindekiler menüsü, tema, oyun listesi, ortak pencere
  ortak/fontlar/      yazı tipleri (internetsiz çalışsın diye site içinde)
  oyunlar/*.html      her oyun ayrı sayfa
mustafa-htmls/        oyunların orijinal hâlleri (değiştirilmez, yayınlanmaz)
scripts/check.js      statik kontroller
scripts/smoke.js      her sayfayı internetsiz Chrome'da açan duman testi
```

## Yayın (Vercel) ve testler

- Vercel projesi `mustafa-cubukcu` (ücretsiz Hobby planı) bu GitHub reposuna bağlıdır: `main`'e her push otomatik yayınlanır.
- Build adımı yalnızca `node scripts/check.js` çalıştırır: dışarıdan kaynak yüklenmediğini, her sayfanın ortak tema ve kabuğu kullandığını, oyun listesiyle dosyaların uyuştuğunu ve JS'in geçerli olduğunu denetler. Hata varsa yayın yapılmaz, canlıdaki son sağlam sürüm kalır.
- GitHub Actions her push'ta `check.js` ve `smoke.js`'i çalıştırır.
- Yerelde:
  - `node scripts/check.js` – bütün site; `node scripts/check.js oyunlar/x.html` – tek sayfa
  - `node scripts/smoke.js` – her sayfayı internetsiz headless Chrome'da açar (Chrome gerekir)
  - Siteyi tarayıcıda görmek için `site/index.html`'e çift tıklayın ya da `npx serve site` çalıştırın.
