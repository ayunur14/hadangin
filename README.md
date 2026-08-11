# HADANGIN

**Hadang informasi manipulatif sebelum berubah menjadi tindakan berisiko.**

HADANGIN adalah prototipe frontend interaktif untuk Media and Information
Literacy (MIL). Pengguna membentuk penilaian sendiri, menghadang informasi di
empat garis nalar, menggunakan AI sebagai second opinion, lalu menentukan
keputusan akhir.

> Human First -> AI Second -> Human Final

## Fitur Utama

- Pemeriksaan teks, pesan, gambar, audio, QR, dan tautan secara simulatif.
- Penilaian awal pengguna sebelum hasil AI ditampilkan.
- Arena Gobak Sodor / Hadang dalam format game 2D fullscreen.
- Empat checkpoint J.E.D.A.: Jeda, Emosi, Data, dan Aksi.
- Popup pertanyaan interaktif yang dapat ditutup dan dibuka kembali.
- AI Lens dengan sinyal manipulasi, ketidakpastian, dan rekomendasi verifikasi.
- Perbandingan keputusan sebelum dan sesudah pemeriksaan.
- Critical Thinking Snapshot sebagai hasil refleksi.
- Tujuh skenario latihan manipulasi digital.
- Tampilan responsif untuk desktop, tablet, dan mobile.

## Alur Pemeriksaan

1. **Content** - pengguna memasukkan informasi yang ingin diperiksa.
2. **My Judgment** - pengguna menentukan respons dan tingkat keyakinan awal.
3. **J.E.D.A.** - informasi dihadang melalui empat garis nalar.
4. **AI Lens** - AI memberikan sinyal dan second opinion.
5. **Final Decision** - pengguna membuat keputusan akhir.
6. **Reflection** - sistem menampilkan perubahan penilaian dan snapshot nalar.

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
Literacy.

Copyright 2026 HADANGIN.
