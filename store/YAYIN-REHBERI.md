# Yayın rehberi

Oyunu Google Play ve App Store'a çıkarmak için kalan adımlar. Kod tarafında yapılabilecek her şey hazır; buradakiler senin hesaplarınla yapılması gereken işler. Her bölümün sonunda bana ne vermen gerektiği yazıyor.

> Şifreleri, `.jks` / `.p8` dosyalarını ve `keystore.properties` dosyasını kimseyle paylaşma, git'e ekleme. Bunlar `.gitignore`'da; yanlışlıkla gönderilmezler.

---

## 1. AdMob (reklam hesabı)

1. https://admob.google.com adresinde hesap aç (oyunun Google hesabıyla).
2. **Uygulamalar › Uygulama ekle** ile iki uygulama ekle: biri Android, biri iOS. Mağazada henüz yoksa "listelenmedi" seçeneğiyle eklenebilir.
3. Her uygulamada iki reklam birimi oluştur: **Reklam birimi ekle › Geçiş reklamı (Interstitial)** ve **Reklam birimi ekle › Ödüllü reklam (Rewarded)**. Ödüllü reklamın ödül ayarı önemli değil (oyun ödülü kendisi veriyor), varsayılan kalabilir.
4. **Gizlilik ve mesajlaşma › Avrupa düzenlemeleri** bölümünde izin mesajı oluşturup yayınla (iki uygulama için de). Oyun bu mesajı Avrupa'daki oyunculara kendisi gösteriyor; mesaj yayınlanmazsa izin ekranı çıkmaz.
5. İsteğe bağlı: aynı yerde **IDFA açıklama mesajı** (iOS) oluşturursan, Apple'ın takip izni sorulmadan önce kısa bir açıklama gösterilir.

**Bana vereceklerin** (bunlar gizli değildir):
- Android uygulama kimliği: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
- Android geçiş reklamı birimi: `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ`
- Android ödüllü reklam birimi (aynı biçimde)
- iOS uygulama kimliği, iOS geçiş reklamı birimi ve iOS ödüllü reklam birimi (aynı biçimde)

Bunları koda yerleştirip deneme modunu kapatırım. O zamana kadar oyun Google'ın deneme reklamlarını gösterir.

### app-ads.txt
AdMob, reklam gelirinin tam akması için mağazadaki "geliştirici web sitesi" adresinin **kök dizininde** bir `app-ads.txt` dosyası ister. Gizlilik sayfası `furkanozturk06.github.io/vicdanlihakim/` altında olduğu için dosya `furkanozturk06.github.io/app-ads.txt` adresinde durmalı. Bunun için GitHub'da adı tam olarak `furkanozturk06.github.io` olan bir depo gerekiyor. Yayıncı kimliğini (`pub-…`) verince dosyanın içeriğini hazırlarım.

---

## 2. Android imza anahtarı ve AAB

Google Play imzalı bir `.aab` dosyası ister. İmza ayarı kodda hazır; yalnızca anahtarı oluşturman gerekiyor. **Anahtar dosyasını ve şifresini kaybedersen oyuna güncelleme çıkamazsın**; iki yere yedekle.

1. Komut satırında `android` klasörüne geç ve şunu çalıştır (Android Studio'nun Java'sı yüklü olmalı):

   ```
   keytool -genkeypair -v -keystore upload-key.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```

   Şifreyi ve istenen bilgileri (ad, şehir…) sen gir.
2. `android/keystore.properties.example` dosyasını aynı klasöre `keystore.properties` adıyla kopyala, içindeki iki şifreyi kendi şifrenle değiştir.
3. Bana "anahtar hazır" de. `./gradlew bundleRelease` ile imzalı dosyayı üretirim: `android/app/build/outputs/bundle/release/app-release.aab`.

Play Console'da **Play Uygulama İmzalama** açık kalsın (varsayılan): Google uygulamayı kendi anahtarıyla imzalar, seninki yalnızca "yükleme anahtarı" olur.

---

## 3. Google Play Console

1. Geliştirici hesabı (tek seferlik kayıt ücreti) ve kimlik doğrulaması.
2. **Uygulama oluştur:** ad `Hakim Koltuğu`, varsayılan dil Türkçe, oyun, ücretsiz.
3. **Mağaza girişi:** metinler `store/magaza-metinleri.md` dosyasında (Türkçe ve İngilizce).
   - Telefon ekran görüntüleri: `store/screenshots/tr/` ve `store/screenshots/en/` (1080×1920)
   - Öne çıkan görsel: `store/feature-graphic-tr.png`, `store/feature-graphic-en.png`
   - Tablet ekran görüntüsü istenirse: `store/screenshots/ipad-tr/` ve `ipad-en/` kullanılabilir.
4. **Uygulama içeriği** formları:
   - Gizlilik politikası: https://furkanozturk06.github.io/vicdanlihakim/gizlilik.html
   - Reklamlar: **Evet, reklam içeriyor**
   - Uygulama erişimi: tüm özellikler herkese açık, giriş yok
   - İçerik derecelendirme (IARC anketi): suç, şiddet temaları, idam; gerçekçi kan/vahşet yok, cinsel içerik yok, kumar yok → muhtemelen PEGI 16
   - Hedef kitle: 18 yaş ve üstü (çocuklara yönelik değil)
   - Veri güvenliği: `store/magaza-metinleri.md` sonundaki nota göre (reklam kimliği ve cihaz bilgileri AdMob tarafından reklam ve analiz için toplanır; aktarımda şifrelenir; geliştirici kendisi veri toplamaz)
5. **Test:** Hesap yeni açılmış kişisel bir hesapsa, herkese açık yayından önce **en az 12 kişiyle 14 gün kapalı test** zorunlu. Test edecek kişilerin Gmail adreslerini topla.
6. Kapalı test süresi dolunca **Üretim**e yükle ve incelemeye gönder.

---

## 4. App Store (Mac olmadan, Codemagic ile)

1. **developer.apple.com › Certificates, Identifiers & Profiles › Identifiers:** `com.vicdanlihakim.oyun` paket kimliğini ekle.
2. **App Store Connect › Uygulamalar › +:** yeni uygulama, bu paket kimliğiyle. Ad: `Hakim Koltuğu`.
3. **App Store Connect › Kullanıcılar ve Erişim › Entegrasyonlar › App Store Connect API:** "App Manager" yetkisiyle anahtar oluştur. Issuer ID, Key ID ve `.p8` dosyasını al (dosya bir kez indirilebilir).
4. **codemagic.io:** GitHub hesabınla giriş yap, `vicdanlihakim` deposunu ekle. **Team settings › Integrations › Developer Portal** bölümüne anahtarı ekle; adını tam olarak `app-store-connect` koy.
5. Codemagic'te **iOS – TestFlight** iş akışını başlat. 15–20 dakikada uygulama TestFlight'a düşer; iPhone'una TestFlight'ı kurup dene. Hata olursa derleme kaydını bana gönder.
6. **App Store sayfası:**
   - iPhone ekran görüntüleri (6,9 inç): `store/screenshots/iphone-tr/` ve `iphone-en/` (1290×2796)
   - iPad ekran görüntüleri (13 inç): `store/screenshots/ipad-tr/` ve `ipad-en/` (2048×2732)
   - Metinler: `store/magaza-metinleri.md`
   - **Uygulama gizliliği** soruları: "Seni takip etmek için kullanılan veriler › Tanımlayıcılar (Cihaz kimliği)" ve "Kullanım verileri (Reklam verileri)"; amaç: üçüncü taraf reklamcılık. Kimliğe bağlı değil.
   - Yaş derecelendirmesi: şiddet ve olgun temalar → muhtemelen 17+
   - Şifreleme sorusu: oyunun ayarlarında "özel şifreleme kullanmıyor" diye işaretli; soru çıkmamalı.
7. TestFlight'ta denedikten sonra sürümü incelemeye gönder.

---

## 5. Yayından hemen önce (benim yapacaklarım)

- Gerçek AdMob kimliklerini yerleştirip deneme modunu kapatmak.
- Sürüm numarasını kontrol etmek (şimdilik 1.0, derleme 1).
- Son bir tam test ve imzalı AAB üretmek.
