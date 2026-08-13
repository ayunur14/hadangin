# HADANGIN

**AI Context Guard Web yang dilokalkan untuk Indonesia: hadang informasi manipulatif sebelum berubah menjadi tindakan berisiko.**

HADANGIN adalah prototipe lokal dari konsep **AI Context Guard Web** untuk
UNESCO Youth Hackathon 2026. Platform ini membantu pengguna Indonesia
melakukan _pause, verify, reflect,_ dan _evaluate_ sebelum mempercayai atau
membagikan konten digital mencurigakan.

Alih-alih sekadar memberi label “true/false” atau “hoaks/bukan hoaks”,
HADANGIN menempatkan AI sebagai _second opinion_ dan melatih pengguna membentuk
penilaian sendiri melalui metode lokal **J.E.D.A.**: Jeda, Emosi, Data, dan
Aksi. Metode ini menerjemahkan prinsip MIL menjadi pengalaman interaktif yang
terinspirasi budaya hadang/gobak sodor: informasi “dihadang” sebelum bergerak
menuju tindakan berisiko.

> Human First -> AI Second -> Human Final
>
> Think Before You Trust. Reflect Before You Share.

## Menjalankan Project

Halaman **Latihan Hadang** menggunakan Three.js dan harus dibuka melalui Vite,
bukan langsung melalui `file://`.

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

Build produksi dapat diperiksa dengan:

```bash
npm run build
npm run preview
```

## Arena Gobak Sodor 3D

Hero halaman Latihan Hadang memakai scene 3D prosedural dari
`training-3d.js`. Versi dummy ini belum membutuhkan file `.glb` dan mencakup:

- lapangan Gobak Sodor dengan empat garis J.E.D.A.;
- empat penjaga low-poly: Jeda, Emosi, Data, dan Aksi;
- token informasi manipulatif yang bergerak menuju tindakan;
- pendopo, tanaman, dan bendera merah-putih sebagai konteks visual Indonesia;
- kamera orbit terbatas, kontrol pause/reset, dan pemilihan penjaga dengan klik;
- penghubung dari setiap penjaga menuju skenario latihan yang relevan.

Scene ini dapat diganti dengan model `.glb` final melalui `GLTFLoader` tanpa
mengubah alur skenario pada `app.js`.

## Mini Game Gobak Sodor 2D

Arena pada alur verifikasi tidak membutuhkan Node.js atau library tambahan.
Pengguna menggerakkan penjaga aktif dengan `W`/`S` atau tombol panah, lalu
menekan `Spasi` untuk memperluas jangkauan hadang. Pada perangkat sentuh,
gunakan tiga tombol kontrol yang tampil di arena.

Token informasi terus bergerak menuju tindakan. Menangkap token akan menambah
skor dan membuka pertanyaan J.E.D.A., sedangkan token yang lolos mengurangi
nyawa. Ronde diulang ketika tiga token berhasil lolos.

## Dua Mode Pemeriksaan

Setiap input teks, gambar, audio, QR, dan tautan menyediakan dua pilihan:

- **Deteksi AI** menampilkan prediksi simulatif, papan sinyal J/E/D/A, confidence,
  XAI, ketidakpastian, dan langkah verifikasi tanpa membuka game.
- **AI Plus** menjalankan alur lengkap Human First, mini game J.E.D.A., AI Lens,
  keputusan final, dan refleksi.

Konten tetap tersimpan ketika pengguna berpindah dari hasil Deteksi AI menuju
AI Plus.

## Positioning Proposal

- **AI Context Guard Web** adalah konsep proposal: platform web ringan untuk
  membantu semua generasi memeriksa konten digital sebelum percaya atau share.
- **HADANGIN** adalah bentuk lokal Indonesia: bahasa Indonesia, skenario dekat
  dengan WhatsApp/komunitas/keluarga, dan metafora permainan hadang/gobak sodor.
- **J.E.D.A.** adalah modul refleksi MIL: _Pause_ lewat Jeda, _Question_ lewat
  Emosi, _Check_ lewat Data, dan _Decide_ lewat Aksi serta keputusan final.
- **AI bukan hakim**: AI Lens hanya menunjukkan sinyal, ketidakpastian, dan
  langkah verifikasi agar keputusan akhir tetap milik manusia.

## Onboarding Naratif

Halaman utama kini membuka pengalaman dengan cerita singkat sebelum pengguna
masuk ke tool pemeriksaan. Narasinya menempatkan pengguna dalam situasi umum:
ada pesan digital yang terasa mendesak dan meminta tindakan cepat. Dari situ,
HADANGIN menjelaskan empat momen belajar:

1. **Informasi datang** - konten mencurigakan muncul sebagai pesan, screenshot,
   QR, audio, atau tautan.
2. **Ambil J.E.D.A.** - pengguna berhenti untuk membaca tekanan, emosi, bukti,
   dan risiko tindakan.
3. **Minta second opinion** - AI Lens membantu melihat sinyal manipulasi dan hal
   yang masih perlu diverifikasi.
4. **Putuskan dengan sadar** - keputusan akhir tetap milik manusia, lalu
   refleksi mencatat perubahan penilaian.

## Explainable AI Detection

AI Lens kini menampilkan simulasi hasil deteksi yang lebih sesuai dengan konsep
proposal. Setiap skenario memiliki panel explainable detection yang berisi:

- visual highlight / red-box simulation pada area atau frasa yang perlu dicurigai;
- confidence score sebagai sinyal model, bukan verdict final;
- penjelasan singkat untuk setiap clue yang ditandai;
- daftar clue yang terlihat, seperti urgency, identity gap, phishing link,
  synthetic media signal, atau false positive risk;
- pertanyaan reflektif agar pengguna tetap membangun penilaian sendiri.

Simulasi ini menjaga prinsip **AI Second**: AI membantu menunjukkan apa yang
perlu diperiksa, tetapi keputusan akhir tetap berada pada manusia.

## HADANGIN Insight Dashboard

Dashboard prototipe tersedia di route `#/dashboard` untuk menunjukkan bagaimana
platform dapat mengukur dampak pembelajaran MIL dan pola manipulasi. Dashboard
ini masih menggunakan data simulatif untuk kebutuhan demo, dengan bagian utama:

- **Impact Summary**: pemeriksaan simulatif, safer decision shift, MIL Habit
  Score, dan penurunan forward risk.
- **Before vs After Judgment**: pergeseran keputusan dari “lanjut/share” menuju
  “verifikasi dulu” atau “berhenti”.
- **Manipulation Pattern Map**: urgency, fear, fake authority, emotional
  clickbait, suspicious link, synthetic media, dan financial request.
- **Media Type Breakdown**: distribusi teks/WhatsApp, gambar, QR/link, dan audio.
- **J.E.D.A. Skill Growth**: skor latihan Jeda, Emosi, Data, dan Aksi.
- **Scenario & Workshop Insights**: performa skenario dan ringkasan simulasi
  kelas/komunitas.

## Fitur Utama

- Positioning HADANGIN sebagai prototipe lokal AI Context Guard Web.
- Onboarding naratif yang menjelaskan kenapa pengguna perlu berhenti, memeriksa konteks, memakai AI sebagai lensa, dan mengambil keputusan sendiri.
- Pemeriksaan teks, pesan, gambar, audio, QR, dan tautan secara simulatif.
- Penilaian awal pengguna sebelum hasil AI ditampilkan.
- Arena Gobak Sodor / Hadang dalam format game 2D fullscreen.
- Empat checkpoint J.E.D.A.: Jeda, Emosi, Data, dan Aksi.
- Popup pertanyaan interaktif yang dapat ditutup dan dibuka kembali.
- AI Lens dengan sinyal manipulasi, ketidakpastian, rekomendasi verifikasi, confidence score, dan explainable visual highlight simulation.
- HADANGIN Insight Dashboard untuk simulasi impact measurement, pattern map, dan workshop insight.
- Perbandingan keputusan sebelum dan sesudah pemeriksaan.
- Critical Thinking Snapshot sebagai hasil refleksi.
- Tujuh skenario latihan manipulasi digital.
- Tampilan responsif untuk desktop, tablet, dan mobile.

## Alur Pemeriksaan

1. **Content** - pengguna memasukkan informasi yang ingin diperiksa.
2. **My Judgment / Pause** - pengguna menentukan respons dan tingkat keyakinan awal.
3. **J.E.D.A. / Question & Check** - informasi dihadang melalui empat garis nalar.
4. **AI Lens / Verify** - AI memberikan sinyal dan second opinion.
5. **Final Decision / Decide** - pengguna membuat keputusan akhir.
6. **Reflection / Share Responsibly** - sistem menampilkan perubahan penilaian dan snapshot nalar.

## Empat Penjaga J.E.D.A.

### J - Jeda

Mengenali deadline, keadaan darurat, ancaman, hadiah, kelangkaan, dan tekanan
sosial yang mendorong tindakan cepat.

### E - Emosi

Mengidentifikasi emosi yang dipancing dan melihat kembali pesan dengan bahasa
yang lebih netral.

### D - Data

Memisahkan klaim dari bukti serta memilih sumber verifikasi yang independen.

### A - Aksi

Memahami tindakan yang diminta, konsekuensinya, dan alternatif yang lebih aman.

## Skenario Latihan

- Pesan keluarga darurat.
- QR pembayaran.
- Lowongan kerja dengan biaya di muka.
- Pesan bank dan tautan mencurigakan.
- Informasi viral tanpa sumber primer.
- Media manipulatif dan promosi investasi.
- AI Bisa Salah, untuk melatih pengguna menghadapi automation bias.

## Menjalankan Proyek

Proyek ini tidak memerlukan instalasi dependency, build process, atau backend.

1. Buka folder proyek:

   ```text
   D:\Ayu Nur\unesco
   ```

2. Buka `index.html` menggunakan browser modern.

Alternatifnya, gunakan static server lokal dari editor atau tool pilihan Anda.

## Struktur File

```text
unesco/
|-- index.html
|-- styles.css
|-- app.js
|-- README.md
|-- assets/
|   |-- hadangin-logo.png
|   |-- hadangin-logo-source.png
|   |-- hadang-court-2d.png
|   |-- hadang-hero-animation.mp4
|   `-- hadang-hero.png
`-- scripts/
    `-- visual-check.mjs
```

### File Utama

- `index.html` menyediakan struktur halaman, navbar, footer, dan entry point.
- `styles.css` berisi design system, layout responsif, arena fullscreen, dan
  animasi permainan.
- `app.js` mengelola routing SPA, state pemeriksaan, skenario, pertanyaan,
  AI Lens, dan hasil refleksi.
- `scripts/visual-check.mjs` menjalankan pemeriksaan alur dan screenshot melalui
  Chrome DevTools Protocol pada lingkungan pengembangan Windows.

## Kontrol Permainan

- Tekan **Mulai Permainan** untuk masuk ke arena.
- Pilih jawaban pada popup penjaga aktif.
- Tekan **Hadang Garis** untuk berpindah ke checkpoint berikutnya.
- Tekan tombol `x` untuk menutup popup dan melihat arena penuh.
- Klik penjaga aktif atau **Buka Pertanyaan** untuk menampilkan popup kembali.
- Pada desktop, gerakkan pointer di atas arena untuk melihat efek kedalaman 2D.

## Batasan Prototipe

- Seluruh analisis AI masih berupa data simulasi.
- File yang dipilih tidak dikirim atau dianalisis oleh server.
- Tidak tersedia autentikasi, database, fact-check API, atau model forensik asli.
- Hasil AI bukan verdict dan tidak boleh digunakan sebagai satu-satunya dasar
  keputusan.

## Teknologi

- HTML5
- CSS3
- JavaScript tanpa framework
- Hash-based SPA routing
- Responsive layout dan CSS animation
- Local video dan raster game assets

## Validasi

Prototipe telah diperiksa pada viewport desktop dan mobile. Alur otomatis
mencakup:

- Human First sampai Critical Thinking Snapshot.
- Perpindahan empat checkpoint J.E.D.A.
- Tutup dan buka kembali popup pertanyaan.
- Skenario keluarga, QR pembayaran, lowongan kerja, dan AI false positive.
- Pemeriksaan overflow horizontal pada viewport mobile 390 px.

## Status

Frontend-only MVP untuk demonstrasi konsep UNESCO Media and Information
Literacy dan positioning AI Context Guard Web yang dilokalkan menjadi HADANGIN.

Copyright 2026 HADANGIN.
