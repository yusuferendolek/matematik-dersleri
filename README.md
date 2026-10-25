# Oyun Defteri

Matematik ve fen konuları için sınıfta ya da evde oynanan etkileşimli oyunlar. Hepsi tek bir sitede, aynı görünümde ve tek bir başlık çubuğuyla toplanır: sol üstteki menüden (İçindekiler) istediğin oyuna geçebilir, oklarla sıradakine ilerleyebilirsin. Açık mod kareli defter, koyu mod kara tahta görünümündedir; sağ üstteki düğmeyle değişir ve seçim hatırlanır.

## Kullanım

- **İnternet varsa:** sitenin Vercel adresini aç.
- **İnternet yoksa:** `site` klasörünü (USB ile ya da zipleyip) bilgisayara kopyala, `site/index.html` dosyasına çift tıkla. Hiçbir şey internetten yüklenmez; yazı tipleri dahil her şey klasörün içindedir. Chrome ya da Edge önerilir.
- Sunucu (backend) yoktur; site düz HTML, CSS ve JavaScript dosyalarından oluşur.

## Oyunlar

| Ders | Konu | Oyun | Sınıf | Durum |
|---|---|---|---|---|
| Matematik | Sayılar | Uzay Savunması: Milyonlar | 5 | hazırlanıyor |
| | | Sihirli Sayı Çözümleyici | 5 | hazırlanıyor |
| | | Yuvarlama Tepesi | 4–5 | hazır |
| | | Sayı Örüntüsü Treni | – | hazırlanıyor |
| | Kesirler | Kesir Boyama | 5 | hazırlanıyor |
| | | Kesir Avcısı | 5 | hazırlanıyor |
| | Ondalık ve yüzde | Patron Kasiyer | – | hazırlanıyor |
| | Açılar | Meteor Avcısı | 5 | hazır |
| | | Açı Tahmincisi | 5 | hazırlanıyor |
| | Alan ve çevre | Çiftlik Mimarı | 5 | hazırlanıyor |
| | | En Küçük Çevre Avcısı | 5 | hazırlanıyor |
| | | Maliyet Hesaplayıcı | – | hazırlanıyor |
| | Çarpanlar ve katlar | Ortak Katlar ve Çarpanlar | 6 | hazırlanıyor |
| | Veri ve olasılık | Şans Çarkı | – | hazırlanıyor |
| | | Soru Dedektifi | 11 | hazırlanıyor |
| | | Korelasyon Dedektifi | 11 | hazırlanıyor |
| Fen Bilgisi | Elektrik | Elektrik Devreleri | 7 | hazır |

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

- Vercel'in ücretsiz (Hobby) planı yeterlidir. Bir kez [vercel.com/new](https://vercel.com/new) üzerinden bu GitHub reposunu içe aktar; ayar gerekmez (`vercel.json` hepsini söyler). Sonrasında `main`'e her push otomatik yayınlanır.
- Build adımı yalnızca `node scripts/check.js` çalıştırır: dışarıdan kaynak yüklenmediğini, her sayfanın ortak tema ve kabuğu kullandığını, oyun listesiyle dosyaların uyuştuğunu ve JS'in geçerli olduğunu denetler. Hata varsa yayın yapılmaz, canlıdaki son sağlam sürüm kalır.
- GitHub Actions her push'ta `check.js` ve `smoke.js`'i çalıştırır.
- Yerelde: `node scripts/check.js` ve `node scripts/smoke.js` (Chrome gerekir).
