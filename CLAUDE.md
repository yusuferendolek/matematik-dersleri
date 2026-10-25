# Oyun Defteri – Claude için notlar

Mustafa'nın tek tek yazdığı matematik/fen oyun HTML'lerini tek sitede, tek temada ve tek başlık çubuğunda topluyoruz. Site statik (sunucu yok), Vercel'in ücretsiz (Hobby) planında yayınlanır. Arayüz dili Türkçe.

## Kullanıcının kararları

- Site adı **Oyun Defteri**. Kurum adı hiçbir yerde geçmez (bu projede kurum yok).
- Başlık çubuğu **tek** olur: oyunun kendi başlığı/üst çubuğu kaldırılır, içindeki her şey (sekmeler, puan, rekor, can, ses düğmesi…) bizim başlığa taşınır. Hiçbir özellik kaybolmaz.
- Oyun seçimi başlığın **solundan** yapılır (İçindekiler çekmecesi), oklarla önceki/sonraki oyuna geçilir.
- Mat/Fen seçici **yok**: iki ders de her zaman listelenir.
- Karanlık mod var (sistem ayarıyla başlar, seçim hatırlanır).
- Tekrar etmeyen her oyun sitede olur. `mat4-1 yuvarlama` ile `mat5-3 yuvarlama` birebir aynı: tek oyun. Kesir boyamanın v2'si kullanılır.
- Oyunların mantığına dokunulmaz; görünüm ortak temaya taşınır, kırık şeyler düzeltilir (`alert()` yerine temalı pencere, sabit genişlikler, eksik ikon vb.).
- Dışarıdan kaynak (CDN, Google Fonts, Tailwind CDN, Font Awesome, Chart.js) yüklenmez; her şey sitenin içinde olur.

## Tasarım dili

Açık mod **Defter**: kareli kâğıt, solda kırmızı kenar çizgisi, konular fosforlu kalemle işaretli. Koyu mod **Tahta**: yeşil kara tahta, konular renkli tebeşirle.

- Yazı tipi: Atkinson Hyperlegible Next (her yerde; rakamlar net). El yazısı Caveat yalnızca büyük başlıklarda (ör. "İçindekiler", "Matematik").
- Ölçü birimi 24px defter karesi.
- Renkler CSS değişkeni olarak tanımlıdır; oyunlarda sabit renk yazılmaz, değişken kullanılır (canvas çizimlerinde de değişkenden okunur ki tema değişince güncellensin).
- Her konunun tek bir fosfor/tebeşir rengi vardır ve o konunun her yerinde aynı renk kullanılır.
- Kaçınılanlar: koyu cam (glassmorphism), birbirinin aynısı yuvarlak kart ızgarası, emoji yığını, büyük harfli etiketler.
