import {
  isCommunityVisionActive,
  mountCommunityVision,
  setCommunityVisionProgress,
  startCommunityVision,
  stopCommunityVision,
  suspendCommunityVision,
} from "./community-vision.js";

const DEFAULT_MESSAGE = "Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!";
const OFFLINE_KIT_URL = new URL("./assets/hadangin-offline-kit.png", import.meta.url).href;
const HERO_VIDEO_URL = new URL("./assets/tolong_buatkan_video_songnya.mp4", import.meta.url).href;

const scenarios = [
  {
    id: "family-emergency",
    no: "01",
    title: "Pesan Keluarga Darurat",
    description: "Nomor baru mengaku sebagai keluarga dan meminta transfer segera.",
    triggers: ["Urgency", "Fear", "Attachment"],
    inputType: "text",
    format: "Teks / Pesan",
    source: "Pesan WhatsApp dari nomor baru",
    mission: "Pastikan identitas pengirim sebelum merespons permintaan transfer.",
    content: DEFAULT_MESSAGE,
    featured: true,
  },
  {
    id: "qr-payment",
    no: "02",
    title: "QR Pembayaran",
    description: "QR pengganti ditempel di atas kode pembayaran resmi sebuah merchant.",
    triggers: ["Trust", "Habit", "Convenience"],
    inputType: "qr",
    inputMode: "image",
    format: "Gambar QR",
    source: "Foto QR di meja kasir",
    mission: "Periksa pemilik QR dan nama penerima sebelum pembayaran diproses.",
    content: "QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.",
  },
  {
    id: "job-offer",
    no: "03",
    title: "Lowongan Kerja",
    description: "Tawaran kerja bergaji tinggi meminta deposit untuk proses administrasi.",
    triggers: ["Hope", "Authority", "Scarcity"],
    inputType: "image",
    format: "Screenshot",
    source: "Poster lowongan dari grup percakapan",
    mission: "Bedakan tampilan profesional dari bukti rekrutmen yang dapat diverifikasi.",
    content: "Selamat, Anda lolos seleksi awal. Transfer biaya administrasi hari ini untuk mengamankan posisi.",
  },
  {
    id: "bank-message",
    no: "04",
    title: "Pesan Bank",
    description: "Pesan mengancam pemblokiran rekening dan mengarahkan ke sebuah tautan.",
    triggers: ["Fear", "Authority", "Urgency"],
    inputType: "qr",
    inputMode: "link",
    format: "Tautan",
    source: "SMS mengatasnamakan bank",
    mission: "Baca struktur alamat tanpa membuka tautan dan cocokkan dengan kanal bank resmi.",
    content: "Rekening Anda akan diblokir dalam 30 menit. Klik tautan ini untuk verifikasi identitas.",
    payload: "https://secure-verifikasi-akun.example/login?session=30min",
  },
  {
    id: "viral-info",
    no: "05",
    title: "Informasi Viral",
    description: "Unggahan emosional mendorong pengguna menyebarkan klaim tanpa sumber.",
    triggers: ["Anger", "Social Pressure"],
    inputType: "image",
    format: "Screenshot",
    source: "Tangkapan layar unggahan viral",
    mission: "Temukan sumber primer, tanggal, dan konteks sebelum membagikan ulang.",
    content: "Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!",
  },
  {
    id: "manipulated-media",
    no: "06",
    title: "Media Manipulatif",
    description: "Video tokoh publik tampak nyata, tetapi konteks dan sumbernya tidak jelas.",
    triggers: ["Realism", "Authority"],
    inputType: "image",
    format: "Frame Video",
    source: "Potongan video dari akun tidak dikenal",
    mission: "Periksa sinkronisasi visual, sumber asli, dan legalitas ajakan investasi.",
    content: "Video eksklusif tokoh publik membagikan peluang investasi yang hanya tersedia hari ini.",
  },
  {
    id: "ai-can-be-wrong",
    no: "07",
    title: "AI Bisa Salah",
    description: "Bukti resmi dapat lebih kuat daripada sinyal AI. Latih keberanian untuk tidak setuju.",
    triggers: ["Automation Bias"],
    inputType: "text",
    format: "Notifikasi Resmi",
    source: "Pemberitahuan dalam aplikasi layanan",
    mission: "Bandingkan skor AI dengan bukti resmi dan kenali kemungkinan false positive.",
    content: "Pemberitahuan resmi: jadwal layanan berubah. Periksa pembaruan pada aplikasi resmi.",
    aiWrong: true,
  },
  {
    id: "audio-impersonation",
    no: "08",
    title: "Voice Note Keluarga",
    description: "Rekaman suara mirip anggota keluarga meminta transfer dan melarang kamu menelepon.",
    triggers: ["Voice Clone", "Urgency", "Fear"],
    inputType: "audio",
    format: "Voice Note",
    source: "Rekaman 18 detik dari nomor baru",
    mission: "Nilai pola suara, isi permintaan, dan lakukan konfirmasi melalui kanal lain.",
    content: "Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu.",
  },
];

const scenarioProfiles = {
  "family-emergency": {
    neutralOriginal: "MAMA KECELAKAAN! TRANSFER SEKARANG!",
    neutralVersion: "Seseorang meminta kamu mentransfer Rp3.000.000.",
    claim: "Pengirim mengaku sebagai ibu dan sedang mengalami keadaan darurat.",
    evidenceOptions: ["Foto dari nomor tersebut", "Voice note dari nomor tersebut", "Nomor rekening yang diberikan", "Telepon nomor ibu yang tersimpan"],
    preferredEvidence: "Telepon nomor ibu yang tersimpan",
    actionOptions: ["Transfer", "Klik", "Berikan OTP", "Share"],
    riskOptions: ["Kehilangan uang", "Akun diambil alih", "Data pribadi bocor", "Misinformasi menyebar"],
    saferOptions: ["Telepon nomor tersimpan", "Buka aplikasi resmi sendiri", "Cari sumber independen", "Tunggu dan cek ulang"],
    aiNotices: [["Pressure", '“sekarang”, “tolong cepat”'], ["Emotion", "Emergency framing"], ["Identity", "Identitas belum terkonfirmasi"], ["Requested action", "Transfer segera"]],
    aiLevel: "High",
    aiScore: 82,
    unknowns: ["Identitas asli pengirim.", "Apakah keadaan darurat benar terjadi.", "Konteks lengkap di luar pesan ini.", "Apakah model salah membaca sinyal."],
    verification: ["Hubungi nomor keluarga yang tersimpan.", "Periksa penerima sebelum pembayaran.", "Tanya anggota keluarga lain.", "Gunakan kanal di luar pesan ini."],
  },
  "qr-payment": {
    neutralOriginal: "QR LAMA RUSAK. SCAN YANG BARU SEKARANG!",
    neutralVersion: "Sebuah kode QR baru meminta kamu melakukan pembayaran.",
    claim: "Kode QR baru diklaim sebagai kanal pembayaran resmi merchant.",
    evidenceOptions: ["Logo merchant pada stiker", "Warna QR yang terlihat resmi", "Konfirmasi langsung kepada kasir", "Jumlah orang yang sudah memindai"],
    preferredEvidence: "Konfirmasi langsung kepada kasir",
    actionOptions: ["Scan", "Transfer", "Download", "Berikan OTP"],
    riskOptions: ["Pembayaran masuk ke pihak salah", "Data rekening bocor", "Perangkat terinfeksi", "Saldo tertahan"],
    saferOptions: ["Konfirmasi QR kepada kasir", "Periksa nama penerima", "Gunakan mesin pembayaran resmi", "Batalkan dan cek ulang"],
    aiNotices: [["Pressure", "Dorongan menyelesaikan antrean"], ["Habit", "Scan tanpa memeriksa penerima"], ["Identity", "Pemilik QR belum terkonfirmasi"], ["Requested action", "Pembayaran melalui QR baru"]],
    aiLevel: "Medium",
    aiScore: 74,
    unknowns: ["Siapa pemilik rekening tujuan.", "Apakah QR benar diganti merchant.", "Kondisi stiker sebelum difoto.", "Apakah deteksi visual melewatkan perubahan."],
    verification: ["Tanyakan QR resmi kepada kasir.", "Periksa nama penerima sebelum membayar.", "Bandingkan dengan QR di kasir utama.", "Simpan bukti transaksi."],
  },
  "job-offer": {
    neutralOriginal: "POSISI TERBATAS! BAYAR DEPOSIT HARI INI!",
    neutralVersion: "Pihak yang menawarkan pekerjaan meminta biaya administrasi.",
    claim: "Pengirim mengaku mewakili perusahaan dan menjanjikan posisi kerja.",
    evidenceOptions: ["Testimoni di pesan", "Logo perusahaan", "Kontak HR pada situs resmi perusahaan", "Screenshot slip gaji"],
    preferredEvidence: "Kontak HR pada situs resmi perusahaan",
    actionOptions: ["Transfer", "Kirim data pribadi", "Download", "Klik"],
    riskOptions: ["Kehilangan uang", "Identitas disalahgunakan", "Perangkat terinfeksi", "Akun diambil alih"],
    saferOptions: ["Hubungi HR melalui situs resmi", "Cari lowongan di kanal perusahaan", "Tolak biaya di muka", "Periksa legalitas perusahaan"],
    aiNotices: [["Pressure", "Posisi disebut terbatas"], ["Emotion", "Harapan mendapat pekerjaan"], ["Authority", "Mengatasnamakan perusahaan"], ["Requested action", "Deposit administrasi"]],
    aiLevel: "High",
    aiScore: 88,
    unknowns: ["Hubungan pengirim dengan perusahaan.", "Apakah posisi tersebut benar tersedia.", "Keaslian dokumen yang dilampirkan.", "Kebijakan rekrutmen perusahaan."],
    verification: ["Cari lowongan pada situs resmi.", "Hubungi HR melalui kontak independen.", "Periksa domain email pengirim.", "Jangan membayar biaya rekrutmen di muka."],
  },
  "bank-message": {
    neutralOriginal: "REKENING DIBLOKIR 30 MENIT LAGI. KLIK!",
    neutralVersion: "Sebuah pesan meminta verifikasi rekening melalui tautan.",
    claim: "Pengirim mengaku sebagai bank dan menyatakan rekening akan diblokir.",
    evidenceOptions: ["Logo bank di pesan", "Nomor pengirim terlihat rapi", "Notifikasi di aplikasi bank resmi", "Tautan yang dikirim"],
    preferredEvidence: "Notifikasi di aplikasi bank resmi",
    actionOptions: ["Klik", "Berikan OTP", "Download", "Kirim data pribadi"],
    riskOptions: ["Akun diambil alih", "Kehilangan uang", "Data pribadi bocor", "Perangkat terinfeksi"],
    saferOptions: ["Buka aplikasi bank sendiri", "Hubungi nomor di kartu", "Ketik alamat resmi secara manual", "Tunggu dan cek notifikasi resmi"],
    aiNotices: [["Pressure", "Ancaman blokir dalam 30 menit"], ["Authority", "Mengatasnamakan bank"], ["Link", "Domain tujuan perlu diperiksa"], ["Requested action", "Verifikasi identitas"]],
    aiLevel: "High",
    aiScore: 91,
    unknowns: ["Status rekening sebenarnya.", "Pemilik domain tujuan.", "Apakah bank mengirim pemberitahuan lain.", "Identitas operator pesan."],
    verification: ["Buka aplikasi bank tanpa memakai tautan.", "Hubungi nomor resmi pada kartu.", "Periksa domain di situs resmi bank.", "Jangan pernah membagikan OTP."],
  },
  "viral-info": {
    neutralOriginal: "SEBARKAN SEBELUM DIHAPUS! MEREKA MENUTUPI FAKTA!",
    neutralVersion: "Sebuah unggahan membuat klaim tanpa menyertakan sumber yang jelas.",
    claim: "Unggahan mengklaim informasi penting sedang sengaja disembunyikan.",
    evidenceOptions: ["Jumlah share", "Komentar yang setuju", "Sumber primer dan laporan independen", "Akun yang pertama mengirim"],
    preferredEvidence: "Sumber primer dan laporan independen",
    actionOptions: ["Share", "Klik", "Download", "Kirim data pribadi"],
    riskOptions: ["Misinformasi menyebar", "Reputasi pihak dirugikan", "Konflik meningkat", "Data pribadi bocor"],
    saferOptions: ["Cari sumber primer", "Baca laporan dari beberapa sumber", "Periksa tanggal dan konteks", "Tunda membagikan"],
    aiNotices: [["Pressure", "Dorongan menyebarkan segera"], ["Emotion", "Kemarahan dan rasa curiga"], ["Source", "Sumber primer tidak terlihat"], ["Requested action", "Membagikan ulang"]],
    aiLevel: "Medium",
    aiScore: 77,
    unknowns: ["Asal klaim pertama.", "Konteks kejadian lengkap.", "Apakah materi sudah dipotong.", "Motif akun yang menyebarkan."],
    verification: ["Cari sumber primer.", "Bandingkan laporan independen.", "Periksa tanggal, lokasi, dan konteks.", "Jangan jadikan viralitas sebagai bukti."],
  },
  "manipulated-media": {
    neutralOriginal: "VIDEO ASLI! INVESTASI INI HANYA HARI INI!",
    neutralVersion: "Sebuah video tokoh publik mempromosikan peluang investasi.",
    claim: "Video diklaim menampilkan tokoh publik yang mendukung sebuah investasi.",
    evidenceOptions: ["Wajah terlihat realistis", "Banyak komentar positif", "Pernyataan pada kanal resmi tokoh", "Kualitas video tinggi"],
    preferredEvidence: "Pernyataan pada kanal resmi tokoh",
    actionOptions: ["Investasi / pembelian", "Klik", "Transfer", "Share"],
    riskOptions: ["Kehilangan uang", "Misinformasi menyebar", "Identitas disalahgunakan", "Akun diambil alih"],
    saferOptions: ["Periksa kanal resmi tokoh", "Cari unggahan asli", "Periksa izin lembaga terkait", "Tunda keputusan investasi"],
    aiNotices: [["Visual", "Sinkronisasi wajah perlu ditinjau"], ["Audio", "Pola suara tampak tidak konsisten"], ["Context", "Sumber unggahan tidak jelas"], ["Requested action", "Investasi segera"]],
    aiLevel: "High",
    aiScore: 84,
    unknowns: ["Siapa pembuat video.", "Apakah cuplikan sudah disunting.", "Konteks rekaman asli.", "Legalitas produk investasi."],
    verification: ["Cari video pada kanal resmi tokoh.", "Gunakan pencarian balik frame.", "Periksa izin produk investasi.", "Jangan bertindak hanya dari kemiripan visual."],
  },
  "audio-impersonation": {
    neutralOriginal: "NAK, INI MAMA. TOLONG TRANSFER SEKARANG, JANGAN TELEPON DULU!",
    neutralVersion: "Seseorang dalam rekaman suara meminta kamu mentransfer uang.",
    claim: "Pembicara mengaku sebagai anggota keluarga dan sedang mengalami keadaan darurat.",
    evidenceOptions: ["Suara terdengar mirip", "Nomor pengirim memakai foto keluarga", "Telepon nomor keluarga yang tersimpan", "Rekaman menyebut nama panggilan"],
    preferredEvidence: "Telepon nomor keluarga yang tersimpan",
    actionOptions: ["Transfer", "Kirim voice note balasan", "Berikan OTP", "Teruskan rekaman"],
    riskOptions: ["Kehilangan uang", "Identitas suara disalahgunakan", "Akun diambil alih", "Kepanikan menyebar"],
    saferOptions: ["Telepon nomor tersimpan", "Ajukan pertanyaan rahasia keluarga", "Konfirmasi ke anggota keluarga lain", "Tunda transfer"],
    aiNotices: [["Voice pattern", "Pola prosodi tidak konsisten"], ["Urgency", "Transfer diminta segera"], ["Identity", "Kemiripan suara bukan bukti identitas"], ["Audio trace", "Jejak kompresi terdeteksi"]],
    aiLevel: "High",
    aiScore: 81,
    unknowns: ["Identitas asli pembicara.", "Apakah suara sintetis atau rekaman asli yang terkompresi.", "Konteks sebelum dan sesudah potongan audio.", "Apakah pola suara kebetulan mirip data referensi."],
    verification: ["Telepon nomor keluarga yang sudah tersimpan.", "Gunakan pertanyaan yang hanya diketahui keluarga.", "Konfirmasi kepada anggota keluarga lain.", "Jangan transfer berdasarkan kemiripan suara."],
  },
  "ai-can-be-wrong": {
    neutralOriginal: "PEMBERITAHUAN RESMI: JADWAL LAYANAN BERUBAH.",
    neutralVersion: "Sebuah layanan menginformasikan perubahan jadwal.",
    claim: "Pemberitahuan menyatakan jadwal layanan resmi telah berubah.",
    evidenceOptions: ["AI menandainya mencurigakan", "Tampilan pesannya formal", "Pembaruan yang sama di aplikasi resmi", "Pendapat di media sosial"],
    preferredEvidence: "Pembaruan yang sama di aplikasi resmi",
    actionOptions: ["Buka aplikasi resmi", "Share", "Klik", "Download"],
    riskOptions: ["Salah memahami jadwal", "Membagikan informasi usang", "Mengabaikan pengumuman sah", "Tidak ada risiko besar"],
    saferOptions: ["Cocokkan dengan aplikasi resmi", "Hubungi layanan resmi", "Periksa waktu publikasi", "Gunakan kanal resmi lain"],
    aiNotices: [["Language", "Bahasa formal terdeteksi"], ["Pattern", "Format mirip pesan massal"], ["Identity", "Pengirim tampak resmi"], ["Requested action", "Buka aplikasi resmi"]],
    aiLevel: "Medium",
    aiScore: 68,
    unknowns: ["AI tidak mengakses akun layananmu.", "Model belum melihat bukti di aplikasi resmi.", "Format resmi dapat menyerupai pesan palsu.", "Sinyal model dapat menjadi false positive."],
    verification: ["Cocokkan isi di aplikasi resmi.", "Periksa pengirim pada kanal resmi.", "Prioritaskan bukti yang dapat diverifikasi.", "Tidak perlu mengikuti AI jika bukti lebih kuat."],
  },
};

const detectionProfiles = {
  "family-emergency": {
    mode: "message",
    title: "Pesan darurat keluarga",
    subtitle: "Simulasi analisis teks WhatsApp",
    summary: "Model menemukan tekanan aksi cepat, identitas belum terverifikasi, dan permintaan transfer yang sulit dibatalkan.",
    confidenceLabel: "Manipulation likelihood",
    highlights: [
      { label: "Urgency", detail: "'sekarang' dan 'tolong cepat' mempersempit ruang berpikir.", x: 12, y: 20, w: 44, h: 18 },
      { label: "Identity gap", detail: "Nomor baru mengaku keluarga tanpa bukti independen.", x: 36, y: 44, w: 48, h: 18 },
      { label: "Risky action", detail: "Permintaan transfer muncul sebelum identitas dikonfirmasi.", x: 18, y: 69, w: 58, h: 16 },
    ],
    clues: ["Tekanan waktu tinggi", "Identitas pengirim belum dikonfirmasi", "Aksi finansial diminta di awal", "Kanal verifikasi independen tersedia"],
    reflectiveQuestions: ["Apakah kamu sudah menelepon nomor keluarga yang tersimpan?", "Apa risiko jika transfer dilakukan sebelum konfirmasi?", "Siapa sumber lain yang bisa mengonfirmasi keadaan darurat ini?"],
  },
  "qr-payment": {
    mode: "qr",
    title: "QR pembayaran mencurigakan",
    subtitle: "Simulasi analisis QR/link",
    summary: "Model menandai kemungkinan QR pengganti, tetapi penerima pembayaran tetap harus diverifikasi langsung kepada merchant.",
    confidenceLabel: "QR risk signal",
    highlights: [
      { label: "Overlay", detail: "Area stiker tampak seperti lapisan baru di atas permukaan lama.", x: 21, y: 24, w: 56, h: 44 },
      { label: "Recipient unknown", detail: "Pemilik rekening tujuan belum terlihat sebelum pembayaran.", x: 18, y: 73, w: 64, h: 14 },
    ],
    clues: ["QR baru menggantikan kanal lama", "Penerima dana belum terlihat", "Konteks kasir perlu dicek langsung", "Pembayaran adalah aksi sulit dibatalkan"],
    reflectiveQuestions: ["Apakah nama penerima cocok dengan merchant?", "Apakah kasir mengonfirmasi QR ini secara langsung?", "Apakah ada kanal pembayaran resmi lain?"],
  },
  "job-offer": {
    mode: "message",
    title: "Tawaran kerja berbiaya di muka",
    subtitle: "Simulasi analisis teks rekrutmen",
    summary: "Model menemukan kombinasi scarcity, otoritas palsu, dan permintaan deposit yang umum pada penipuan lowongan.",
    confidenceLabel: "Scam pattern likelihood",
    highlights: [
      { label: "Scarcity", detail: "'posisi terbatas' mendorong keputusan cepat.", x: 14, y: 19, w: 48, h: 18 },
      { label: "Authority", detail: "Mengatasnamakan perusahaan tanpa kanal resmi.", x: 26, y: 43, w: 54, h: 18 },
      { label: "Upfront fee", detail: "Biaya administrasi diminta sebelum verifikasi HR.", x: 18, y: 69, w: 62, h: 16 },
    ],
    clues: ["Ada biaya rekrutmen di muka", "Klaim perusahaan belum diverifikasi", "Tekanan waktu tinggi", "Kontak HR resmi tersedia sebagai pembanding"],
    reflectiveQuestions: ["Apakah perusahaan resmi meminta deposit?", "Apakah domain email pengirim cocok dengan perusahaan?", "Bisakah posisi ini ditemukan di kanal karier resmi?"],
  },
  "bank-message": {
    mode: "link",
    title: "Pesan bank dan tautan verifikasi",
    subtitle: "Simulasi analisis teks + link",
    summary: "Model menandai ancaman pemblokiran, otoritas bank, dan tautan verifikasi sebagai pola phishing berisiko tinggi.",
    confidenceLabel: "Phishing likelihood",
    highlights: [
      { label: "Threat", detail: "Ancaman blokir 30 menit menciptakan rasa takut.", x: 12, y: 18, w: 55, h: 18 },
      { label: "External link", detail: "Tautan mengarahkan keluar dari kanal resmi yang diketik sendiri.", x: 24, y: 50, w: 58, h: 18 },
      { label: "Credential risk", detail: "Verifikasi identitas dapat berujung data pribadi/OTP.", x: 18, y: 72, w: 64, h: 14 },
    ],
    clues: ["Menggunakan ancaman pemblokiran", "Mengarahkan ke tautan", "Mengatasnamakan institusi finansial", "OTP dan kredensial tidak boleh dibagikan"],
    reflectiveQuestions: ["Apakah notifikasi yang sama ada di aplikasi bank resmi?", "Apakah kamu mengetik alamat resmi sendiri, bukan dari link?", "Apakah pesan meminta OTP atau data sensitif?"],
  },
  "viral-info": {
    mode: "message",
    title: "Klaim viral tanpa sumber primer",
    subtitle: "Simulasi analisis headline sosial",
    summary: "Model menemukan ajakan menyebarkan segera, framing konspiratif, dan ketiadaan sumber primer.",
    confidenceLabel: "Disinformation signal",
    highlights: [
      { label: "Share pressure", detail: "Ajakan menyebarkan muncul sebelum bukti diberikan.", x: 13, y: 20, w: 56, h: 18 },
      { label: "Conspiracy frame", detail: "'mereka menutupi fakta' memancing curiga dan marah.", x: 22, y: 45, w: 58, h: 18 },
      { label: "No source", detail: "Tidak ada sumber primer yang bisa diverifikasi.", x: 24, y: 70, w: 50, h: 15 },
    ],
    clues: ["Viralitas dipakai sebagai tekanan sosial", "Sumber primer tidak terlihat", "Bahasa emosional kuat", "Perlu cek tanggal dan konteks"],
    reflectiveQuestions: ["Sumber primer klaim ini apa?", "Apakah ada laporan independen yang menyebut hal sama?", "Apa dampaknya jika kamu share dan ternyata keliru?"],
  },
  "manipulated-media": {
    mode: "media",
    title: "Video tokoh publik / media manipulatif",
    subtitle: "Simulasi analisis visual + audio",
    summary: "Model menandai area wajah, sinkronisasi audio, dan konteks unggahan sebagai sinyal yang perlu diverifikasi.",
    confidenceLabel: "Synthetic media likelihood",
    highlights: [
      { label: "Face sync", detail: "Gerak mulut dan ekspresi tampak tidak sepenuhnya selaras.", x: 34, y: 18, w: 30, h: 34 },
      { label: "Hand / edge", detail: "Tepi objek dan tangan tampak terlalu halus atau berubah bentuk.", x: 14, y: 56, w: 25, h: 22 },
      { label: "Call to invest", detail: "Ajakan investasi segera muncul tanpa kanal resmi.", x: 47, y: 67, w: 38, h: 16 },
    ],
    clues: ["Sinkronisasi wajah perlu diperiksa", "Pola audio tampak tidak konsisten", "Sumber unggahan tidak jelas", "Ada ajakan finansial cepat"],
    reflectiveQuestions: ["Apakah video ini ada di kanal resmi tokoh?", "Apakah ada versi asli dengan konteks lengkap?", "Apakah produk investasi punya izin resmi?"],
  },
  "audio-impersonation": {
    mode: "audio",
    title: "Rekaman suara impersonasi",
    subtitle: "Simulasi pencocokan pola audio + transkrip",
    summary: "Model simulasi menemukan tekanan transfer, perubahan prosodi, dan jejak kompresi. Kemiripan pola suara tidak membuktikan identitas pembicara.",
    confidenceLabel: "Voice manipulation signal",
    dataset: { name: "Voice Scam Pattern Set", size: "18.420 sampel", matches: "37 cluster serupa" },
    highlights: [
      { label: "Prosody shift", detail: "Intonasi berubah tajam pada bagian permintaan transfer.", start: "00:04", end: "00:07" },
      { label: "Compression trace", detail: "Ada pola kompresi berulang yang dapat berasal dari edit atau aplikasi pesan.", start: "00:08", end: "00:11" },
      { label: "Urgent instruction", detail: "Frasa 'sekarang' dan 'jangan telepon' membatasi verifikasi.", start: "00:12", end: "00:16" },
    ],
    clues: ["Kemiripan suara bukan bukti identitas", "Ada larangan melakukan verifikasi", "Aksi finansial diminta segera", "Konteks rekaman tidak lengkap"],
    reflectiveQuestions: ["Sudahkah kamu menelepon nomor keluarga yang tersimpan?", "Adakah pertanyaan yang hanya keluarga asli dapat jawab?", "Apa risiko jika model salah membaca audio terkompresi?"],
  },
  "ai-can-be-wrong": {
    mode: "official",
    title: "Kemungkinan false positive AI",
    subtitle: "Simulasi analisis dengan bukti resmi lebih kuat",
    summary: "Model menemukan format massal yang tampak mencurigakan, tetapi bukti pada aplikasi resmi dapat membantah sinyal AI.",
    confidenceLabel: "Suspicious signal",
    highlights: [
      { label: "Formal template", detail: "Format pengumuman massal kadang mirip pesan palsu.", x: 14, y: 22, w: 54, h: 18 },
      { label: "Official channel needed", detail: "Keputusan harus mengikuti bukti di aplikasi/kanal resmi.", x: 20, y: 54, w: 60, h: 18 },
    ],
    clues: ["Sinyal AI tidak sama dengan kebenaran", "Bukti resmi bisa lebih kuat", "Format formal dapat memicu false positive", "Manusia tetap memegang keputusan akhir"],
    reflectiveQuestions: ["Apakah aplikasi resmi menampilkan pengumuman yang sama?", "Bukti mana yang lebih dapat diverifikasi daripada skor AI?", "Kapan kamu perlu tidak setuju dengan AI?"],
  },
};

function activeProfile() {
  return scenarioProfiles[state.scenarioId] || scenarioProfiles["family-emergency"];
}

function activeDetection() {
  return detectionProfiles[state.scenarioId] || detectionProfiles["family-emergency"];
}

function analysisProfile() {
  if (state.trainingScenario) return activeProfile();
  if (state.inputType === "image") return scenarioProfiles["manipulated-media"];
  if (state.inputType === "audio") return scenarioProfiles["audio-impersonation"];
  if (state.inputType === "qr") return scenarioProfiles[state.qrInputMode === "image" ? "qr-payment" : "bank-message"];
  return activeProfile();
}

function analysisDetection() {
  if (state.trainingScenario) return activeDetection();
  if (state.inputType === "image") return detectionProfiles["manipulated-media"];
  if (state.inputType === "audio") return detectionProfiles["audio-impersonation"];
  if (state.inputType === "qr") return detectionProfiles[state.qrInputMode === "image" ? "qr-payment" : "bank-message"];
  return activeDetection();
}

function safeHostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "domain-belum-terbaca";
  }
}

function currentScenario() {
  return scenarios.find((item) => item.id === state.scenarioId) || scenarios[0];
}

const state = {
  route: "verify",
  inputType: "text",
  content: DEFAULT_MESSAGE,
  fileName: "",
  imageDataUrl: "",
  audioDataUrl: "",
  qrImageDataUrl: "",
  qrInputMode: "link",
  xaiMode: "bounding",
  audioXaiMode: "voice",
  qrXaiMode: "risk",
  inFlow: false,
  directDetection: false,
  stage: 2,
  hadangStep: 0,
  initialDecision: "",
  initialConfidence: 68,
  pressure: [],
  emotion: [],
  neutralImpact: "",
  evidence: "",
  requestedAction: "",
  consequence: "",
  saferAction: "",
  finalDecision: "",
  finalConfidence: 72,
  reflection: [],
  priority: "",
  result: false,
  questionOpen: true,
  gameScore: 0,
  gameLives: 3,
  gameCombo: 1,
  gameCatches: 0,
  gameRoundComplete: false,
  gameOver: false,
  guardY: 54,
  scenarioId: "family-emergency",
  aiWrong: false,
  trainingScenario: false,
  casePrompt: "",
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let toastTimer;

function setTheme(theme, persist = true) {
  const nextTheme = theme === "light" ? "light" : "blue";
  document.documentElement.dataset.theme = nextTheme;
  const toggle = document.querySelector("[data-theme-toggle]");
  const isLight = nextTheme === "light";
  if (toggle) {
    const label = isLight ? "Gunakan tema biru gelap" : "Gunakan tema putih biru";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.title = label;
  }
  if (persist) {
    try { localStorage.setItem("hadangin-theme", nextTheme); } catch {}
  }
}

setTheme(document.documentElement.dataset.theme, false);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function routeFromHash() {
  const path = location.hash.replace(/^#\/?/, "").split("/")[0];
  if (path === "training") return "training";
  if (path === "community") return "community";
  if (path === "dashboard") return "dashboard";
  if (path === "how-it-works") return "how";
  if (path === "about") return "about";
  return "verify";
}

function setActiveNav() {
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === state.route);
  });
  document.querySelector(".main-nav").classList.remove("open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}

function resetFlow() {
  Object.assign(state, {
    inFlow: false,
    directDetection: false,
    stage: 2,
    hadangStep: 0,
    initialDecision: "",
    initialConfidence: 68,
    pressure: [],
    emotion: [],
    neutralImpact: "",
    evidence: "",
    requestedAction: "",
    consequence: "",
    saferAction: "",
    finalDecision: "",
    finalConfidence: 72,
    reflection: [],
    priority: "",
    result: false,
    questionOpen: true,
    gameScore: 0,
    gameLives: 3,
    gameCombo: 1,
    gameCatches: 0,
    gameRoundComplete: false,
    gameOver: false,
    guardY: 54,
    aiWrong: false,
  });
}

function goToRoute(route) {
  const hashes = { verify: "#/verify", training: "#/training", community: "#/community", dashboard: "#/dashboard", how: "#/how-it-works", about: "#/about" };
  location.hash = hashes[route];
}

function render(options = {}) {
  stopArenaGame();
  stopCommunityTimer();
  suspendCommunityVision();
  window.dispatchEvent(new CustomEvent("hadang:before-render"));
  const previousScroll = window.scrollY;
  const previousPanelScroll = document.querySelector(".game-question-panel")?.scrollTop || 0;
  state.route = routeFromHash();
  setActiveNav();
  if (state.route === "training") app.innerHTML = trainingPage();
  else if (state.route === "community") app.innerHTML = communityPage();
  else if (state.route === "dashboard") app.innerHTML = dashboardPage();
  else if (state.route === "how") app.innerHTML = howPage();
  else if (state.route === "about") app.innerHTML = aboutPage();
  else app.innerHTML = state.inFlow ? verificationFlow() : verifyPage();
  window.dispatchEvent(new CustomEvent("hadang:rendered", { detail: { route: state.route } }));
  requestAnimationFrame(maybeStartArenaGame);
  if (state.route === "community" && communityState.mode === "vision" && communityState.phase === 1) {
    requestAnimationFrame(() => mountCommunityVision(communityState.completedLines));
  } else if (isCommunityVisionActive()) {
    stopCommunityVision();
  }
  document.body.classList.toggle("game-active", state.route === "verify" && state.inFlow && state.stage === 3);
  requestAnimationFrame(() => {
    if (options.preserveScroll) {
      window.scrollTo({ top: previousScroll, behavior: "instant" });
      const panel = document.querySelector(".game-question-panel");
      if (panel) panel.scrollTop = previousPanelScroll;
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  });
}

function hero() {
  return `
    <section class="hero">
      <video class="hero-video" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1">
        <source src="${HERO_VIDEO_URL}" type="video/mp4" />
      </video>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">AI Context Guard Web &middot; Indonesian Local Prototype</p>
          <h1>HADANGIN: Hadang Sebelum Terjebak.</h1>
          <p class="lead">HADANGIN memposisikan AI Context Guard Web dalam konteks Indonesia: bantu pengguna pause, verify, reflect, dan evaluate sebelum klik, transfer, scan, atau membagikan informasi digital.</p>
          <div class="localization-note"><strong>Localized from AI Context Guard Web</strong><span>Metode J.E.D.A. menerjemahkan prinsip MIL menjadi pengalaman interaktif berbasis budaya hadang/gobak sodor.</span></div>
          <div class="hero-actions button-row">
            <button class="button" data-scroll-to="verify-tool">Mulai Pemeriksaan <span aria-hidden="true">&#8594;</span></button>
            <a class="button button-secondary" href="#/training">Coba Latihan</a>
          </div>
          <div class="hero-principle"><span>Human First</span><i></i><span>AI Second</span><i></i><span>Human Final</span></div>
        </div>
      </div>
      <span class="hero-scroll">Gulir untuk memahami alur</span>
    </section>`;
}

function onboardingSection() {
  const moments = [
    ["1", "Informasi datang", "Pesan, screenshot, QR, audio, atau tautan terasa mendesak dan meminta tindakan cepat."],
    ["2", "Ambil J.E.D.A.", "Berhenti sejenak untuk membaca tekanan, emosi, bukti, dan risiko tindakan yang diminta."],
    ["3", "Minta second opinion", "AI Lens membantu melihat sinyal manipulasi dan hal yang masih perlu diverifikasi."],
    ["4", "Putuskan dengan sadar", "Keputusan akhir tetap milikmu, lalu refleksi mencatat apa yang mengubah penilaianmu."],
  ];
  return `<section class="section section-white onboarding-section" id="onboarding">
    <div class="page-shell">
      <div class="onboarding-layout">
        <div class="onboarding-story">
          <p class="section-kicker">Sebelum mulai</p>
          <h2>Bayangkan ada pesan yang membuatmu ingin langsung bertindak.</h2>
          <p>HADANGIN tidak memulai dari jawaban AI. Pengguna diajak memahami situasi dulu: apa isi informasinya, tekanan apa yang muncul, bukti apa yang tersedia, dan tindakan apa yang paling aman.</p>
          <p class="story-highlight">Tujuannya bukan sekadar menemukan “hoaks” atau “bukan hoaks”, tetapi membangun kebiasaan berpikir: berhenti dulu, periksa konteks, gunakan AI sebagai lensa, lalu ambil keputusan sendiri.</p>
        </div>
        <div class="onboarding-path" aria-label="Alur onboarding HADANGIN">
          ${moments.map(([no, title, text]) => `<article class="onboarding-card"><span>${no}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function verifyPage() {
  return `${hero()}
    ${onboardingSection()}
    <section class="section" id="verify-tool">
      <div class="page-shell">
        <div class="section-header center">
          <p class="section-kicker">AI Context Guard versi lokal</p>
          <h2>Periksa Informasi Mencurigakan</h2>
          <p>Masukkan konten yang ingin kamu evaluasi. Pilih Deteksi AI untuk hasil langsung, atau AI Plus untuk alur Human First dan latihan J.E.D.A.</p>
        </div>
        <div class="card tool-card">
          <div class="card-header">
            <div><h3>Pilih jenis konten</h3><p>Gunakan contoh yang tersedia atau masukkan kontenmu sendiri.</p></div>
            <span class="status-pill">Pemrosesan lokal</span>
          </div>
          <div class="tabs" role="tablist" aria-label="Jenis konten">
            ${tabButton("image", "Gambar / Screenshot")}
            ${tabButton("text", "Teks / Pesan")}
            ${tabButton("audio", "Audio")}
            ${tabButton("qr", "QR / Link")}
          </div>
          ${inputPane()}
          <div class="privacy-note">Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.</div>
          <div class="check-mode-picker">
            <div><strong>Pilih cara pemeriksaan</strong><span>Keduanya menggunakan Explainable AI. AI Plus menambahkan latihan penalaran dan permainan J.E.D.A.</span></div>
            <div class="check-mode-actions"><button class="button button-secondary" data-action="direct-ai"><span class="mode-button-icon" aria-hidden="true">AI</span><span><strong>Deteksi AI</strong><small>Prediksi + XAI langsung</small></span></button><button class="button" data-action="start-check"><span class="mode-button-icon plus" aria-hidden="true">+</span><span><strong>AI Plus</strong><small>Human First + Game J.E.D.A.</small></span><i aria-hidden="true">&#8594;</i></button></div>
          </div>
        </div>
      </div>
    </section>
    <div class="feature-strip" aria-label="Prinsip pemeriksaan">
      <article><span class="feature-number">01 / PAUSE</span><h3>Bentuk penilaian awal</h3><p>Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.</p></article>
      <article><span class="feature-number">02 / J.E.D.A.</span><h3>Question &amp; check</h3><p>Metode lokal untuk mengenali tekanan, emosi, data, dan risiko aksi.</p></article>
      <article><span class="feature-number">03 / DECIDE</span><h3>Bandingkan, lalu putuskan</h3><p>AI memberi second opinion. Keputusan final tetap berada padamu.</p></article>
    </div>`;
}

function tabButton(type, label) {
  return `<button class="tab ${state.inputType === type ? "active" : ""}" role="tab" aria-selected="${state.inputType === type}" data-input-type="${type}">${label}</button>`;
}

function inputPane() {
  if (state.inputType === "text") {
    return `<div class="input-zone"><textarea id="content-input" aria-label="Teks atau pesan mencurigakan" placeholder="Tempel pesan atau klaim di sini...">${escapeHtml(state.content)}</textarea></div>`;
  }
  if (state.inputType === "qr") {
    const modeSwitch = `<div class="media-input-modes" role="group" aria-label="Cara memasukkan QR atau tautan"><button type="button" class="${state.qrInputMode === "link" ? "active" : ""}" data-qr-input-mode="link">Tempel Tautan</button><button type="button" class="${state.qrInputMode === "image" ? "active" : ""}" data-qr-input-mode="image">Upload QR</button></div>`;
    if (state.qrInputMode === "image") {
      if (state.qrImageDataUrl) {
        return `${modeSwitch}<div class="image-upload-preview qr-upload-preview" data-drop-zone><div class="uploaded-image-frame"><img src="${state.qrImageDataUrl}" alt="Preview QR ${escapeHtml(state.fileName)}" /></div><div class="uploaded-file-meta"><div><span>QR siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>AI simulasi akan memetakan struktur QR dan tujuan yang terbaca.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti QR</label><button class="icon-remove" type="button" data-action="remove-qr" aria-label="Hapus QR" title="Hapus QR">&times;</button></div></div><input class="file-input" id="file-input" type="file" accept="image/*" /></div>`;
      }
      return `${modeSwitch}<div class="input-zone" data-drop-zone><div class="upload-content"><div class="upload-symbol" aria-hidden="true">#</div><strong>Upload gambar QR</strong><p>Tarik screenshot atau foto QR ke sini. PNG, JPG, dan WEBP hingga 10 MB.</p><label class="button button-secondary" for="file-input">Pilih Gambar QR</label><input class="file-input" id="file-input" type="file" accept="image/*" /></div></div>`;
    }
    return `${modeSwitch}<div class="link-input-zone"><div class="link-input-icon" aria-hidden="true">//</div><div><strong>Alamat tujuan yang ingin diperiksa</strong><p>Tautan tidak akan dibuka. Simulasi hanya membaca struktur alamatnya.</p></div><input id="content-input" type="url" aria-label="Tautan mencurigakan" placeholder="https://contoh-tautan.com/verifikasi" value="${state.content.startsWith("http") ? escapeHtml(state.content) : ""}" /><div class="link-safety-note"><span></span>Pratinjau aman: tanpa membuka situs tujuan</div></div>`;
  }
  const isAudio = state.inputType === "audio";
  if (isAudio && state.audioDataUrl) {
    return `<div class="audio-upload-preview" data-drop-zone><div class="audio-file-head"><div class="audio-file-icon" aria-hidden="true">~</div><div><span>Rekaman siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>Putar dan dengarkan konteks sebelum memulai.</small></div><button class="icon-remove" type="button" data-action="remove-audio" aria-label="Hapus audio" title="Hapus audio">&times;</button></div>${waveformBars(42, "input-wave")}<audio controls preload="metadata" src="${state.audioDataUrl}">Browser tidak mendukung pemutar audio.</audio><label class="button button-secondary button-small" for="file-input">Ganti Audio</label><input class="file-input" id="file-input" type="file" accept="audio/*" /></div>`;
  }
  if (!isAudio && state.imageDataUrl) {
    return `<div class="image-upload-preview" data-drop-zone>
      <div class="uploaded-image-frame"><img src="${state.imageDataUrl}" alt="Preview ${escapeHtml(state.fileName)}" /></div>
      <div class="uploaded-file-meta"><div><span>Gambar siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>Gambar akan tetap terlihat sampai tahap Explainable AI.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti Gambar</label><button class="icon-remove" type="button" data-action="remove-image" aria-label="Hapus gambar" title="Hapus gambar">&times;</button></div></div>
      <input class="file-input" id="file-input" type="file" accept="image/*" />
    </div>`;
  }
  return `<div class="input-zone" data-drop-zone><div class="upload-content"><div class="upload-symbol" aria-hidden="true">${isAudio ? "~" : "+"}</div><strong>${state.fileName ? escapeHtml(state.fileName) : `Pilih ${isAudio ? "rekaman audio" : "gambar atau screenshot"}`}</strong><p>${isAudio ? "Tarik MP3, WAV, atau M4A hingga 10 MB" : "Tarik gambar ke sini atau pilih PNG, JPG, dan WEBP hingga 10 MB"}</p><label class="button button-secondary" for="file-input">Pilih File</label><input class="file-input" id="file-input" type="file" accept="${isAudio ? "audio/*" : "image/*"}" /></div></div>`;
}

function waveformBars(count = 48, className = "") {
  return `<div class="audio-waveform ${className}" aria-hidden="true">${Array.from({ length: count }, (_, index) => `<i style="--amp:${22 + ((index * 37 + index * index * 3) % 70)}%"></i>`).join("")}</div>`;
}

function progress() {
  const labels = ["Content", "My Judgment", "J.E.D.A.", "AI Lens", "Final Decision", "Reflection"];
  const current = state.result ? 6 : state.stage;
  return `<div class="progress-wrap">
    <div class="progress-steps">${labels.map((label, index) => {
      const step = index + 1;
      const cls = step < current ? "done" : step === current ? "active" : "";
      return `<div class="progress-step ${cls}"><span class="num">${step < current ? "&#10003;" : step}</span><span>${label}</span></div>`;
    }).join("")}</div>
    <div class="mobile-progress"><div class="mobile-progress-head"><span>Langkah ${current} dari 6</span><span>${labels[current - 1]}</span></div><div class="meter"><span style="width:${(current / 6) * 100}%"></span></div></div>
  </div>`;
}

function verificationFlow() {
  if (state.directDetection) return directDetectionResult();
  let content = humanFirst();
  if (state.stage === 3) content = hadangFlow();
  if (state.stage === 4) content = aiLens();
  if (state.stage === 5) content = humanFinal();
  if (state.stage === 6) content = state.result ? resultScreen() : reflectionScreen();
  const gameMode = state.stage === 3;
  return `${progress()}<section class="flow-canvas ${gameMode ? "game-flow-canvas" : ""}"><div class="${gameMode ? "game-flow-shell" : "page-shell"}">${content}</div></section>`;
}

function humanFirst() {
  const decisions = ["Lanjut", "Verifikasi Dulu", "Berhenti", "Belum Yakin"];
  const scenario = currentScenario();
  return `<div class="flow-card">
    <header><p class="section-kicker">Human First</p><h2>Sebelum AI Membantu...</h2><p>Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.</p>${state.trainingScenario ? `<div class="active-case-ribbon"><span>Kasus ${scenario.no}</span><strong>${escapeHtml(scenario.title)}</strong><i>${escapeHtml(scenario.format)}</i></div>` : ""}</header>
    ${inspectionContext()}
    <div class="question">
      <span class="question-label">Apa respons pertamamu jika ini terjadi di dunia nyata?</span>
      <div class="choice-grid">${decisions.map((item) => choice(item, state.initialDecision, "initial-decision")).join("")}</div>
    </div>
    <div class="question">
      <span class="question-label">Seberapa yakin kamu dengan keputusan itu?</span>
      ${confidenceSlider("initial-confidence", state.initialConfidence)}
      <p class="helper">AI belum akan ditampilkan sampai kamu menyelesaikan tahap berpikir awal.</p>
    </div>
    <div class="flow-actions"><button class="button button-ghost" data-action="cancel-flow">Kembali</button><button class="button" data-action="lock-initial" ${state.initialDecision ? "" : "disabled"}>Kunci Penilaian Awal</button></div>
  </div>`;
}

function inspectionContext() {
  if (state.trainingScenario) return trainingScenarioContext(currentScenario());
  if (state.inputType === "image" && state.imageDataUrl) {
    return `<div class="human-image-context"><img src="${state.imageDataUrl}" alt="Gambar yang sedang diperiksa" /><div><span class="label">Gambar yang diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><p>Amati konteks, sumber, detail visual, dan tindakan yang diminta sebelum melihat analisis AI.</p></div></div>`;
  }
  if (state.inputType === "audio" && state.audioDataUrl) {
    return `<div class="human-audio-context"><div><span class="label">Rekaman yang diperiksa</span><strong>${escapeHtml(state.fileName)}</strong>${waveformBars(38, "human-wave")}<audio controls preload="metadata" src="${state.audioDataUrl}"></audio></div><div class="transcript-preview"><span>Transkrip simulasi</span><p>"Nak, ini Mama. Nomor Mama sedang bermasalah. Tolong transfer sekarang dan jangan telepon dulu."</p><small>Transkrip ini adalah contoh frontend, bukan hasil speech-to-text aktual.</small></div></div>`;
  }
  if (state.inputType === "qr" && state.qrInputMode === "image" && state.qrImageDataUrl) {
    return `<div class="human-image-context"><img src="${state.qrImageDataUrl}" alt="QR yang sedang diperiksa" /><div><span class="label">QR yang diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><p>Periksa lokasi QR, pemilik media, serta nama penerima sebelum memindai atau membayar.</p></div></div>`;
  }
  if (state.inputType === "qr") {
    return `<div class="human-link-context"><span class="label">Tautan yang diperiksa</span><strong>${escapeHtml(safeHostname(state.content))}</strong><code>${escapeHtml(state.content)}</code><p>Jangan buka tautan dari panel ini. Nilai klaim pengirim dan cari kanal resmi secara mandiri.</p></div>`;
  }
  return `<div class="message-panel"><span class="label">Informasi yang diperiksa</span><blockquote>${escapeHtml(state.content || DEFAULT_MESSAGE)}</blockquote></div>`;
}

function trainingScenarioContext(scenario) {
  if (scenario.inputType === "qr" && scenario.inputMode === "image") {
    return `<div class="training-case-context"><div class="case-visual qr-case"><div class="qr-pattern" aria-label="Ilustrasi QR pembayaran"><span></span><span></span><span></span></div><i>STIKER BARU</i><small>MEJA KASIR</small></div><div class="case-copy"><span class="label">${escapeHtml(scenario.source)}</span><strong>QR pembayaran pengganti</strong><blockquote>${escapeHtml(scenario.content)}</blockquote><p>Amati posisi stiker dan pastikan nama penerima sebelum memindai.</p></div></div>`;
  }
  if (scenario.inputType === "qr") {
    return `<div class="human-link-context"><span class="label">${escapeHtml(scenario.source)}</span><blockquote>${escapeHtml(scenario.content)}</blockquote><strong>${escapeHtml(safeHostname(state.content))}</strong><code>${escapeHtml(state.content)}</code><p>Alamat ditampilkan tanpa dibuka. Cocokkan dengan domain resmi melalui kanal independen.</p></div>`;
  }
  if (scenario.inputType === "audio") {
    return `<div class="human-audio-context training-audio-context"><div><span class="label">${escapeHtml(scenario.source)}</span><strong>Voice note keluarga / 00:18</strong>${waveformBars(38, "human-wave")}<div class="audio-simulation-status"><i></i>Rekaman latihan siap dianalisis</div></div><div class="transcript-preview"><span>Transkrip kasus</span><p>"${escapeHtml(scenario.content)}"</p><small>Perhatikan larangan menelepon dan permintaan transfer mendesak.</small></div></div>`;
  }
  if (scenario.inputType === "image") {
    return `<div class="training-case-context"><div class="case-visual ${scenario.id === "manipulated-media" ? "video-case" : "social-case"}">${scenario.id === "manipulated-media" ? `<div class="video-person"><span></span></div><b>LIVE</b><em>INVESTASI HANYA HARI INI</em>` : `<div class="social-avatar"></div><small>${scenario.id === "job-offer" ? "INFO KARIER" : "UNGGAHAN VIRAL"}</small><strong>${escapeHtml(scenario.content)}</strong><div class="social-stats"><span>12,8K</span><span>Bagikan</span></div>`}</div><div class="case-copy"><span class="label">${escapeHtml(scenario.source)}</span><strong>${escapeHtml(scenario.title)}</strong><blockquote>${escapeHtml(scenario.content)}</blockquote><p>${escapeHtml(scenario.mission)}</p></div></div>`;
  }
  return `<div class="message-panel training-message-context"><div class="message-meta"><span>${escapeHtml(scenario.source)}</span><i>${escapeHtml(scenario.format)}</i></div><span class="label">Informasi yang diperiksa</span><blockquote>${escapeHtml(scenario.content)}</blockquote><p>${escapeHtml(scenario.mission)}</p></div>`;
}

function confidenceSlider(id, value) {
  return `<div class="confidence-box"><div class="confidence-head"><span>0 - belum yakin</span><span class="confidence-value">${value}% yakin</span></div><input type="range" min="0" max="100" value="${value}" data-range="${id}" aria-label="Tingkat keyakinan ${value} persen" /></div>`;
}

function choice(label, selected, key, extraClass = "") {
  return `<button class="choice ${selected === label ? `selected ${extraClass}` : ""}" data-select="${key}" data-value="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
}

function multiChoice(label, values, key) {
  return `<button class="choice ${values.includes(label) ? "selected selected-teal" : ""}" data-multi="${key}" data-value="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
}

function hadangFlow() {
  if (state.hadangStep === -1) return transitionScreen();
  const guardNames = ["Jeda", "Emosi", "Data", "Aksi"];
  const hasResponse = [state.pressure.length > 0, state.emotion.length > 0, Boolean(state.evidence), Boolean(state.requestedAction)][state.hadangStep];
  return `<div class="hadang-play-layout fullscreen-play-layout">
    <div class="game-world fullscreen-game-world">
      ${arena()}
      <div class="live-readout"><span class="live-dot"></span><div><small>STATUS ARENA</small><strong data-game-status>${state.gameRoundComplete ? `Token tertangkap. Buka pertanyaan ${guardNames[state.hadangStep]}.` : `Gerakkan penjaga ${guardNames[state.hadangStep]} dan tangkap token.`}</strong></div><div class="game-live-stats"><span><small>SKOR</small><b data-game-score>${state.gameScore}</b></span><span><small>NYAWA</small><b data-game-lives>${"&#9829;".repeat(state.gameLives)}${"&#9825;".repeat(3 - state.gameLives)}</b></span></div></div>
      ${state.questionOpen ? `<div class="question-scrim" aria-hidden="true"></div>` : ""}
      ${state.questionOpen ? `<aside class="game-question-panel game-question-modal ${hasResponse ? "settled" : "entering"}" id="game-question-panel" role="dialog" aria-modal="false" aria-label="Pertanyaan penjaga ${guardNames[state.hadangStep]}">
        <div class="question-panel-top"><span>POS PENJAGA 0${state.hadangStep + 1}</span><span>${state.hadangStep + 1} / 4</span><button class="question-close" type="button" data-action="hide-question" aria-label="Tutup pertanyaan" title="Tutup pertanyaan">&times;</button></div>
        ${hadangStepContent()}
      </aside>` : `<button class="question-reopen" type="button" data-action="focus-question"><span>0${state.hadangStep + 1}</span><strong>Buka Pertanyaan ${guardNames[state.hadangStep]}</strong></button>`}
    </div>
  </div>`;
}

function transitionScreen() {
  return `<div class="transition-panel game-transition game-fullscreen-intro">
    ${gameStage(-1, true)}
    <div class="game-start-modal" role="dialog" aria-label="Misi Arena Hadang">
      <span class="start-level">MISI HADANGIN</span>
      <h2>Jangan biarkan informasi lolos menuju tindakan.</h2>
      <p>Gerakkan penjaga aktif di garisnya, tangkap token informasi, lalu jawab pertanyaan J.E.D.A. Jangan biarkan tiga token lolos menuju tindakan.</p>
      <div class="start-rules"><span><b>J</b> Jeda</span><span><b>E</b> Emosi</span><span><b>D</b> Data</span><span><b>A</b> Aksi</span></div>
      <div class="game-control-hint"><span><kbd>W</kbd><kbd>&uarr;</kbd> Naik</span><span><kbd>S</kbd><kbd>&darr;</kbd> Turun</span><span><kbd>Spasi</kbd> Hadang</span></div>
      <button class="button button-teal" data-action="enter-arena">Mulai Permainan <span aria-hidden="true">&#8594;</span></button>
    </div>
  </div>`;
}

function arena() {
  return gameStage(state.hadangStep, false);
}

function gameStage(step, intro = false) {
  const guards = [
    ["J", "JEDA", 22],
    ["E", "EMOSI", 40],
    ["D", "DATA", 58],
    ["A", "AKSI", 76],
  ];
  const activeStep = step < 0 ? 0 : step;
  const tokenPositions = [12, 31, 49, 67];
  const tokenLeft = intro ? 8 : tokenPositions[activeStep];
  const stageMessages = ["Kenali tekanan sebelum bergerak", "Pisahkan emosi dari isi pesan", "Cari bukti yang berdiri sendiri", "Ukur risiko sebelum bertindak"];
  return `<div class="hadang-game-stage ${intro ? "intro-stage" : "arena-stage interactive-arena"}" style="--token-left:${tokenLeft}%; --player-y:${state.guardY}%" tabindex="${intro ? "-1" : "0"}" aria-label="Arena Gobak Sodor Hadang Nalar, garis aktif ${guards[activeStep][1]}">
    <div class="game-stage-art" aria-hidden="true"></div>
    <div class="game-stage-shade" aria-hidden="true"></div>
    <div class="game-hud"><span class="hud-badge">LEVEL 01</span><span class="hud-status"><i></i>${intro ? "4 garis nalar" : `Garis ${activeStep + 1} dari 4`}</span></div>
    <div class="incoming-zone"><span>MASUK</span></div>
    ${guards.map(([letter, name, left], index) => {
      const status = index < activeStep && !intro ? "done" : index === activeStep ? "active" : "locked";
      return `<span class="checkpoint-line ${status}" style="--guard-left:${left}%" aria-hidden="true"></span><button class="guard-marker ${status} ${status === "active" && !intro ? "player-guard" : ""}" style="--guard-left:${left}%" type="button" ${status === "active" ? 'data-action="focus-question"' : 'tabindex="-1"'} aria-label="Penjaga ${name}, ${status === "done" ? "selesai" : status === "active" ? "aktif" : "terkunci"}"><b>${letter}</b><span>${name}</span>${status === "done" ? "<i>&#10003;</i>" : ""}</button>`;
    }).join("")}
    <div class="info-runner ${intro ? "is-running" : "game-token"}" data-game-token><span class="runner-card"><i></i><i></i><i></i></span><strong>INFO</strong><small data-token-kind>${intro ? "mencurigakan" : "pesan mendesak"}</small></div>
    <div class="action-gate"><span>TINDAKAN</span><small>Jangan biarkan lolos</small></div>
    ${intro ? "" : `<div class="arena-controls" aria-label="Kontrol sentuh"><button type="button" data-game-control="up" aria-label="Gerak naik">&#9650;</button><button type="button" data-game-control="block" aria-label="Hadang token">HADANG</button><button type="button" data-game-control="down" aria-label="Gerak turun">&#9660;</button></div>`}
    <div class="game-mission-bar"><span>${intro ? "Informasi bergerak menuju aksi" : stageMessages[activeStep]}${intro ? "" : " · W/S atau panah untuk bergerak"}</span><div class="mission-pips">${guards.map((_, index) => `<i class="${index < activeStep && !intro ? "done" : index === activeStep ? "active" : ""}"></i>`).join("")}</div></div>
    ${!intro && state.gameOver ? `<div class="game-over-panel"><span>MISI GAGAL</span><strong>Tiga informasi lolos.</strong><p>Ulangi ronde dan jaga garis ${guards[activeStep][1]}.</p><button class="button button-teal" type="button" data-action="retry-round">Ulangi Ronde</button></div>` : ""}
  </div>`;
}

let arenaRuntime = null;
const arenaKeys = new Set();

function stopArenaGame() {
  if (!arenaRuntime) return;
  cancelAnimationFrame(arenaRuntime.frame);
  arenaRuntime = null;
  arenaKeys.clear();
}

function maybeStartArenaGame() {
  const stage = document.querySelector(".arena-stage.interactive-arena");
  if (!stage || state.questionOpen || state.gameRoundComplete || state.gameOver) return;
  startArenaGame(stage);
}

function startArenaGame(stage) {
  stopArenaGame();
  const guardLeft = [22, 40, 58, 76][state.hadangStep];
  const tokenKinds = ["pesan mendesak", "tautan palsu", "QR mencurigakan", "voice note", "klaim viral"];
  const spawnIndex = state.gameCatches + (3 - state.gameLives) + state.hadangStep;
  const tokenY = [36, 66, 43, 62, 32, 57][spawnIndex % 6];
  const runtime = {
    stage,
    token: stage.querySelector("[data-game-token]"),
    guard: stage.querySelector(".player-guard"),
    x: Math.max(6, guardLeft - 17),
    y: tokenY,
    guardY: Math.min(70, Math.max(31, state.guardY)),
    guardLeft,
    speed: 7.3 + state.hadangStep * 0.65,
    blockingUntil: 0,
    lastTime: performance.now(),
    frame: 0,
  };
  arenaRuntime = runtime;
  runtime.token?.classList.remove("caught", "escaped");
  runtime.guard?.classList.remove("caught-token", "is-blocking");
  const kind = tokenKinds[spawnIndex % tokenKinds.length];
  runtime.token?.querySelector("[data-token-kind]")?.replaceChildren(kind);
  stage.classList.add("game-running");
  stage.focus({ preventScroll: true });

  const tick = (time) => {
    if (arenaRuntime !== runtime || !runtime.token || !runtime.guard) return;
    const delta = Math.min((time - runtime.lastTime) / 1000, 0.05);
    runtime.lastTime = time;
    const direction = (arenaKeys.has("arrowdown") || arenaKeys.has("s") ? 1 : 0) - (arenaKeys.has("arrowup") || arenaKeys.has("w") ? 1 : 0);
    runtime.guardY = Math.min(70, Math.max(31, runtime.guardY + direction * 38 * delta));
    runtime.x += runtime.speed * delta;
    runtime.guard.style.top = `${runtime.guardY}%`;
    runtime.token.style.left = `${runtime.x}%`;
    runtime.token.style.top = `${runtime.y}%`;
    runtime.guard.classList.toggle("is-blocking", time < runtime.blockingUntil);

    const blockRange = time < runtime.blockingUntil ? 14 : 8;
    const atLine = Math.abs(runtime.x - runtime.guardLeft) < 1.25;
    const aligned = Math.abs(runtime.y - runtime.guardY) < blockRange;
    if (atLine && aligned) {
      catchInformation(runtime);
      return;
    }
    if (runtime.x > runtime.guardLeft + 8) {
      missInformation(runtime);
      return;
    }
    runtime.frame = requestAnimationFrame(tick);
  };
  runtime.frame = requestAnimationFrame(tick);
}

function blockInformation() {
  if (!arenaRuntime) return;
  arenaRuntime.blockingUntil = performance.now() + 650;
  arenaRuntime.guard?.classList.add("is-blocking");
}

function catchInformation(runtime) {
  if (arenaRuntime !== runtime) return;
  cancelAnimationFrame(runtime.frame);
  runtime.token.classList.add("caught");
  runtime.guard.classList.add("caught-token");
  state.guardY = runtime.guardY;
  state.gameCatches += 1;
  state.gameScore += 100 * state.gameCombo;
  state.gameCombo = Math.min(4, state.gameCombo + 1);
  state.gameRoundComplete = true;
  updateArenaHud(`Token tertangkap di garis ${["Jeda", "Emosi", "Data", "Aksi"][state.hadangStep]}!`, true);
  arenaRuntime = null;
  setTimeout(() => {
    state.questionOpen = true;
    render({ preserveScroll: true });
  }, 520);
}

function missInformation(runtime) {
  if (arenaRuntime !== runtime) return;
  cancelAnimationFrame(runtime.frame);
  runtime.token.classList.add("escaped");
  state.guardY = runtime.guardY;
  state.gameLives = Math.max(0, state.gameLives - 1);
  state.gameCombo = 1;
  updateArenaHud("Informasi lolos. Bersiap untuk token berikutnya.", false);
  arenaRuntime = null;
  if (state.gameLives === 0) {
    state.gameOver = true;
    setTimeout(() => render({ preserveScroll: true }), 480);
  } else {
    setTimeout(() => maybeStartArenaGame(), 620);
  }
}

function updateArenaHud(message, caught) {
  const status = document.querySelector("[data-game-status]");
  const score = document.querySelector("[data-game-score]");
  const lives = document.querySelector("[data-game-lives]");
  if (status) status.textContent = message;
  if (score) score.textContent = state.gameScore;
  if (lives) lives.innerHTML = `${"&#9829;".repeat(state.gameLives)}${"&#9825;".repeat(3 - state.gameLives)}`;
  document.querySelector(".live-readout")?.classList.toggle("catch-success", caught);
}

function resetArenaRound(resetLives = false) {
  stopArenaGame();
  if (resetLives) {
    state.gameLives = 3;
    state.gameCombo = 1;
  }
  state.gameRoundComplete = false;
  state.gameOver = false;
  state.questionOpen = false;
  state.guardY = 54;
}

function hadangStepContent() {
  const profile = activeProfile();
  if (state.hadangStep === 0) {
    const choices = ["Deadline", "Darurat", "Ancaman", "Hadiah", "Kesempatan terbatas", "Tekanan sosial", "Tidak ada tekanan"];
    return `<header><p class="section-kicker">Garis 01 - Jeda</p><h2>Berhenti sejenak dari dorongan bertindak.</h2><p>Apa yang membuat informasi ini terasa harus segera ditindaklanjuti?</p></header>
      <div class="choice-grid compact">${choices.map((item) => multiChoice(item, state.pressure, "pressure")).join("")}</div>
      ${state.pressure.length ? `<div class="insight"><div><strong>Ruang berpikir sedang dipersempit.</strong><br>Tekanan waktu dapat mengurangi ruang untuk mengevaluasi informasi.</div></div>` : ""}
      ${hadangActions("Hadang Garis 1", state.pressure.length > 0)}`;
  }
  if (state.hadangStep === 1) {
    const choices = ["Takut", "Panik", "Kasihan", "Percaya", "Marah", "FOMO", "Harapan", "Penasaran", "Kedekatan emosional", "Tidak yakin"];
    return `<header><p class="section-kicker">Garis 02 - Emosi</p><h2>Kenali emosi yang sedang dipancing.</h2><p>Emosi bukan kesalahan. Mengenalinya membantu kamu menjaga jarak dari tekanan.</p></header>
      <div class="choice-grid compact">${choices.map((item) => multiChoice(item, state.emotion, "emotion")).join("")}</div>
      <div class="neutralizer">
        <div class="message-panel"><span class="label">Pesan asli - tekanan aktif</span><blockquote>${escapeHtml(profile.neutralOriginal)}</blockquote></div>
        <div class="message-panel neutral"><span class="label">Tanpa tekanan emosi</span><blockquote>${escapeHtml(profile.neutralVersion)}</blockquote></div>
      </div>
      <div class="question"><span class="question-label">Setelah bahasanya dibuat netral, apakah keputusanmu terasa berbeda?</span><div class="choice-grid compact">${["Ya", "Sedikit", "Tidak"].map((item) => choice(item, state.neutralImpact, "neutral-impact")).join("")}</div></div>
      ${hadangActions("Hadang Garis 2", state.emotion.length > 0 && state.neutralImpact)}`;
  }
  if (state.hadangStep === 2) {
    const choices = profile.evidenceOptions;
    return `<header><p class="section-kicker">Garis 03 - Data</p><h2>Pisahkan klaim dari buktinya.</h2><p>Bukti yang baik tidak hanya berasal dari pihak yang membuat klaim.</p></header>
      <div class="split-evidence"><section><h4>Klaim</h4><p>${escapeHtml(profile.claim)}</p></section><section><h4>Bukti independen</h4><p>${state.evidence ? escapeHtml(state.evidence) : "Belum dipilih"}</p></section></div>
      <div class="question"><span class="question-label">Mana yang paling independen untuk memverifikasi klaim ini?</span><div class="choice-grid">${choices.map((item) => choice(item, state.evidence, "evidence")).join("")}</div></div>
      ${state.evidence ? `<div class="insight"><div><strong>${state.evidence === profile.preferredEvidence ? "Pilihan verifikasi yang kuat." : "Bukti ini belum cukup independen."}</strong><br>Bandingkan informasi melalui kanal yang tidak diberikan oleh pesan mencurigakan.</div></div>` : ""}
      ${hadangActions("Hadang Garis 3", Boolean(state.evidence))}`;
  }
  const actions = profile.actionOptions;
  const consequences = profile.riskOptions;
  const safer = profile.saferOptions;
  return `<header><p class="section-kicker">Garis 04 - Aksi</p><h2>Lihat tindakan dan konsekuensinya.</h2><p>Pesan manipulatif sering dibuat untuk mempercepat aksi yang sulit dibatalkan.</p></header>
    <div class="question"><span class="question-label">Apa sebenarnya yang diminta informasi ini darimu?</span><div class="choice-grid compact">${actions.map((item) => choice(item, state.requestedAction, "requested-action")).join("")}</div></div>
    <div class="question"><span class="question-label">Apa konsekuensinya jika keputusanmu salah?</span><div class="choice-grid">${consequences.map((item) => choice(item, state.consequence, "consequence")).join("")}</div></div>
    <div class="question"><span class="question-label">Apa langkah alternatif yang lebih aman?</span><div class="choice-grid">${safer.map((item) => choice(item, state.saferAction, "safer-action")).join("")}</div></div>
    ${hadangActions("Hadang Sebelum Bertindak", state.requestedAction && state.consequence && state.saferAction)}`;
}

function hadangActions(label, enabled) {
  return `<div class="flow-actions"><button class="button button-ghost" data-action="hadang-back">Kembali</button><button class="button button-teal" data-action="hadang-next" ${enabled ? "" : "disabled"}>${label}</button></div>`;
}

function detectionPanel(profile, detection) {
  const previewText = state.content || DEFAULT_MESSAGE;
  const isUploadedImage = state.inputType === "image" && state.imageDataUrl;
  const isUploadedAudio = state.inputType === "audio" && state.audioDataUrl;
  const isImageAnalysis = state.inputType === "image" && (isUploadedImage || state.trainingScenario);
  const isAudioAnalysis = state.inputType === "audio" && (isUploadedAudio || state.trainingScenario);
  const isQrAnalysis = state.inputType === "qr";
  const dataset = detection.dataset || (isQrAnalysis
    ? { name: state.qrInputMode === "image" ? "QR Abuse Reference Set" : "URL Threat Pattern Set", size: state.qrInputMode === "image" ? "42.680 struktur QR" : "1,2 juta snapshot URL", matches: state.qrInputMode === "image" ? "19 pola tujuan serupa" : "63 pola domain serupa" }
    : null);
  let previewContent = `${detectionPreviewContent(detection, previewText)}${detection.highlights.map((item, index) => `<span class="red-box" style="--x:${item.x}%; --y:${item.y}%; --w:${item.w}%; --h:${item.h}%"><b>${index + 1}</b></span>`).join("")}`;
  if (isImageAnalysis) previewContent = `<div class="xai-image-stage">${isUploadedImage ? `<img class="xai-source-image" src="${state.imageDataUrl}" alt="Gambar upload dengan penjelasan XAI" />` : trainingDetectionVisual(currentScenario())}${state.xaiMode === "heatmap" ? `<div class="xai-heatmap" aria-hidden="true">${detection.highlights.map((item) => `<span style="--hx:${item.x + item.w / 2}%; --hy:${item.y + item.h / 2}%; --hs:${Math.max(item.w, item.h) * 1.7}%"></span>`).join("")}</div>` : detection.highlights.map((item, index) => `<span class="red-box" style="--x:${item.x}%; --y:${item.y}%; --w:${item.w}%; --h:${item.h}%"><b>${index + 1}</b></span>`).join("")}</div>`;
  if (isAudioAnalysis) previewContent = audioAnalysisPreview();
  if (isQrAnalysis) previewContent = qrAnalysisPreview();
  return `<section class="detection-panel" aria-label="Explainable AI detection simulation">
    <div class="detection-header">
      <div><p class="section-kicker">Explainable detection</p><h3>${escapeHtml(detection.title)}</h3><p>${escapeHtml(detection.subtitle)}</p></div>
      <div class="confidence-badge"><span>${escapeHtml(detection.confidenceLabel)}</span><strong>${profile.aiScore}%</strong></div>
    </div>
    ${analysisModeBar(isImageAnalysis, isAudioAnalysis, isQrAnalysis)}
    <div class="detection-grid">
      <div class="detection-preview ${escapeHtml(detection.mode)}">
        <div class="preview-toolbar"><span></span><span></span><span></span><strong>AI Context Scan</strong></div>
        <div class="preview-canvas ${isImageAnalysis ? `uploaded-xai ${state.xaiMode}` : ""} ${isAudioAnalysis ? `audio-xai ${state.audioXaiMode}` : ""} ${isQrAnalysis ? `qr-xai ${state.qrXaiMode}` : ""}">
          ${previewContent}
          ${isImageAnalysis ? `<div class="xai-legend"><span><i></i>${state.xaiMode === "heatmap" ? "Pengaruh tinggi" : "Area perhatian model"}</span><small>Simulasi XAI</small></div>` : ""}
        </div>
        <p class="preview-disclaimer">Highlight menunjukkan area yang memengaruhi hasil analisis dan bukan merupakan bukti final.</p>
      </div>
      <div class="detection-explain">
        <p class="detection-summary">${escapeHtml(detection.summary)}</p>
        ${dataset ? `<div class="dataset-card"><span>Dataset referensi simulasi</span><strong>${escapeHtml(dataset.name)}</strong><div><small>${escapeHtml(dataset.size)}</small><small>${escapeHtml(dataset.matches)}</small></div><p>Statistik dibuat untuk demonstrasi UI dan bukan hasil model produksi.</p></div>` : ""}
        <div class="highlight-list">
          ${detection.highlights.map((item, index) => `<article><span>${index + 1}</span><div><h4>${escapeHtml(item.label)}${item.start ? `<small>${escapeHtml(item.start)}-${escapeHtml(item.end)}</small>` : ""}</h4><p>${escapeHtml(item.detail)}</p></div></article>`).join("")}
        </div>
      </div>
    </div>
    <div class="clue-question-grid">
      <section class="info-panel clue-panel"><h3>Clue yang terlihat</h3><ul>${detection.clues.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section class="info-panel question-panel"><h3>Pertanyaan reflektif</h3><ul>${detection.reflectiveQuestions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    </div>
  </section>`;
}

function trainingDetectionVisual(scenario) {
  if (scenario.id === "manipulated-media") {
    return `<div class="training-xai-source video-xai-source"><span class="xai-subject"></span><b>LIVE</b><div><small>AKUN TIDAK TERVERIFIKASI</small><strong>Investasi eksklusif hanya hari ini</strong></div></div>`;
  }
  return `<div class="training-xai-source social-xai-source"><div class="xai-post-head"><span></span><div><small>${scenario.id === "job-offer" ? "INFO KARIER" : "AKUN VIRAL"}</small><b>${scenario.id === "job-offer" ? "Rekrutmen prioritas" : "12,8 ribu kali dibagikan"}</b></div></div><strong>${escapeHtml(scenario.content)}</strong><div class="xai-post-action">${scenario.id === "job-offer" ? "Bayar biaya administrasi" : "Sebarkan sekarang"}</div></div>`;
}

function analysisModeBar(isImage, isAudio, isQr) {
  if (isImage) return `<div class="xai-mode-bar"><div><strong>Visual Penjelasan XAI</strong><span>Pilih cara model menampilkan area yang memengaruhi sinyal.</span></div><div class="xai-segmented" role="group" aria-label="Mode visual XAI"><button class="${state.xaiMode === "bounding" ? "active" : ""}" type="button" data-xai-mode="bounding">Bounding Box</button><button class="${state.xaiMode === "heatmap" ? "active" : ""}" type="button" data-xai-mode="heatmap">Heatmap</button></div></div>`;
  if (isAudio) return `<div class="xai-mode-bar"><div><strong>Penjelasan Pola Audio</strong><span>Bandingkan sinyal suara dan distribusi frekuensi simulatif.</span></div><div class="xai-segmented" role="group" aria-label="Mode analisis audio"><button class="${state.audioXaiMode === "voice" ? "active" : ""}" type="button" data-audio-xai-mode="voice">Voice Pattern</button><button class="${state.audioXaiMode === "spectrogram" ? "active" : ""}" type="button" data-audio-xai-mode="spectrogram">Spectrogram</button></div></div>`;
  if (isQr) return `<div class="xai-mode-bar"><div><strong>Penjelasan Risiko Tujuan</strong><span>Lihat sinyal struktur dan jalur yang mungkin dilalui.</span></div><div class="xai-segmented" role="group" aria-label="Mode analisis QR atau tautan"><button class="${state.qrXaiMode === "risk" ? "active" : ""}" type="button" data-qr-xai-mode="risk">Risk Map</button><button class="${state.qrXaiMode === "redirect" ? "active" : ""}" type="button" data-qr-xai-mode="redirect">Redirect Chain</button></div></div>`;
  return "";
}

function audioAnalysisPreview() {
  return `<div class="audio-analysis-stage"><div class="audio-analysis-meta"><span>VOICE SAMPLE / 00:18</span><b>${state.audioXaiMode === "voice" ? "Pola suara" : "Spektrum frekuensi"}</b></div><div class="${state.audioXaiMode === "spectrogram" ? "spectrogram-panel" : "voice-pattern-panel"}">${waveformBars(58, "analysis-wave")}<span class="audio-marker marker-one">1</span><span class="audio-marker marker-two">2</span><span class="audio-marker marker-three">3</span></div><div class="audio-time-axis"><span>00:00</span><span>00:06</span><span>00:12</span><span>00:18</span></div>${state.audioDataUrl ? `<audio controls preload="metadata" src="${state.audioDataUrl}"></audio>` : `<div class="audio-simulation-status"><i></i>Sampel audio skenario aktif</div>`}<div class="ai-transcript"><span>Transkrip simulasi</span><p>Nak, ini Mama. Nomor Mama bermasalah. <mark>Tolong transfer sekarang</mark> dan <mark>jangan telepon dulu</mark>.</p></div></div>`;
}

function qrAnalysisPreview() {
  const isImage = state.qrInputMode === "image" && (state.qrImageDataUrl || state.trainingScenario);
  if (state.qrXaiMode === "redirect") {
    return `<div class="redirect-analysis"><span class="analysis-label">SIMULATED REDIRECT TRACE</span><div class="redirect-chain"><div><i>1</i><span>Input pengguna<small>${isImage ? "QR image decode" : escapeHtml(safeHostname(state.content))}</small></span></div><b></b><div class="warn"><i>2</i><span>Short redirect<small>tracking-gateway.example</small></span></div><b></b><div class="danger"><i>3</i><span>Form kredensial<small>secure-login-check.example</small></span></div></div><p>Rantai ini adalah visualisasi dataset simulasi. HADANGIN tidak membuka alamat tersebut.</p></div>`;
  }
  if (isImage) {
    return `<div class="qr-image-analysis">${state.qrImageDataUrl ? `<img src="${state.qrImageDataUrl}" alt="QR upload dalam pemetaan risiko" />` : `<div class="qr-case-scan"><div class="qr-pattern" aria-label="QR skenario latihan"><span></span><span></span><span></span></div><small>STIKER TERDETEKSI</small></div>`}<span class="qr-scan-line"></span><span class="qr-focus focus-a">1</span><span class="qr-focus focus-b">2</span></div><div class="qr-destination"><span>Tujuan terbaca / simulasi</span><strong>merchant-pay-check.example</strong><small>Nama penerima belum cocok dengan merchant</small></div>`;
  }
  const hostname = safeHostname(state.content);
  const parts = state.content.replace(/^https?:\/\//i, "").split(/([./?=&-])/).filter(Boolean);
  return `<div class="url-risk-analysis"><span class="analysis-label">URL TOKEN RISK MAP</span><div class="url-token-map">${parts.slice(0, 18).map((part, index) => `<span class="${index === 0 || /login|verify|secure|otp/i.test(part) ? "flagged" : ""}">${escapeHtml(part)}</span>`).join("")}</div><div class="domain-facts"><div><span>Host terbaca</span><strong>${escapeHtml(hostname)}</strong></div><div><span>Pola terdeteksi</span><strong>Login + urgency</strong></div><div><span>Status</span><strong>Perlu verifikasi</strong></div></div></div>`;
}

function detectionPreviewContent(detection, previewText) {
  if (detection.mode === "qr") {
    return `<div class="qr-preview"><span></span><span></span><span></span><i></i></div><div class="preview-caption">QR baru di area pembayaran</div>`;
  }
  if (detection.mode === "media") {
    return `<div class="media-preview"><span class="media-face"></span><span class="media-body"></span><i></i><em></em></div><div class="preview-caption">Frame video / gambar yang dianalisis</div>`;
  }
  if (detection.mode === "link") {
    return `<div class="link-preview"><strong>Bank Alert</strong><p>Rekening Anda akan diblokir dalam 30 menit.</p><code>https://secure-verifikasi.example/login</code></div>`;
  }
  if (detection.mode === "official") {
    return `<div class="official-preview"><strong>Pemberitahuan Resmi</strong><p>${escapeHtml(previewText)}</p><span>Perlu dicocokkan dengan aplikasi resmi.</span></div>`;
  }
  return `<div class="message-preview"><p>${escapeHtml(previewText)}</p></div>`;
}

function directDetectionResult() {
  const profile = analysisProfile();
  const detection = analysisDetection();
  const arenaSignals = [
    ["J", "Jeda", profile.aiNotices[0]?.[1] || "Tekanan perlu diperiksa", Math.min(96, profile.aiScore + 6), "amber"],
    ["E", "Emosi", profile.aiNotices[1]?.[1] || "Respons emosional terdeteksi", Math.max(42, profile.aiScore - 9), "red"],
    ["D", "Data", profile.aiNotices[2]?.[1] || "Bukti belum terkonfirmasi", Math.max(48, profile.aiScore - 4), "blue"],
    ["A", "Aksi", profile.aiNotices[3]?.[1] || "Tindakan berisiko terdeteksi", Math.min(98, profile.aiScore + 3), "teal"],
  ];
  const verdict = profile.aiScore >= 80 ? "Risiko tinggi - verifikasi sebelum bertindak" : profile.aiScore >= 70 ? "Perlu verifikasi lebih lanjut" : "Sinyal sedang - periksa bukti resmi";
  return `<section class="direct-detection-page"><div class="page-shell">
    <div class="direct-result-topbar"><button class="button button-ghost button-small" type="button" data-action="back-to-input">&#8592; Ganti Konten</button><span>Mode Deteksi AI &middot; Explainable AI</span><button class="button button-small" type="button" data-action="switch-to-plus">Lanjut AI Plus &#8594;</button></div>
    <header class="direct-result-header"><div><p class="section-kicker">Hasil prediksi langsung</p><h1>AI menghadang empat sinyal sebelum tindakan.</h1><p>Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.</p></div><div class="direct-verdict"><span>${escapeHtml(detection.confidenceLabel)}</span><strong>${profile.aiScore}%</strong><p>${escapeHtml(verdict)}</p></div></header>
    <section class="ai-court-board" aria-label="Papan sinyal J.E.D.A. hasil prediksi AI"><div class="court-entry"><span>INPUT</span><i></i></div><div class="court-track">${arenaSignals.map(([letter, name, detail, score, tone], index) => `<article class="court-signal ${tone}"><div class="court-line"></div><span class="court-letter">${letter}</span><div><small>GARIS 0${index + 1}</small><strong>${name}</strong><p>${escapeHtml(detail)}</p><div class="court-score"><i style="--score:${score}%"></i><b>${score}</b></div></div></article>`).join("")}</div><div class="court-gate"><span>AKSI</span><strong>${profile.aiScore >= 80 ? "TAHAN" : "CEK"}</strong></div></section>
    ${detectionPanel(profile, detection)}
    <div class="ai-notice-grid">${profile.aiNotices.map(([label, value]) => `<div class="signal-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <div class="ai-columns direct-ai-columns"><section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${profile.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><section class="info-panel verify"><h3>Langkah verifikasi berikutnya</h3><ul>${profile.verification.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section></div>
    <div class="direct-result-footer"><div><strong>Butuh penilaian yang lebih lengkap?</strong><p>Masuk ke AI Plus untuk membentuk penilaian awal, memainkan J.E.D.A., lalu membandingkannya dengan AI.</p></div><button class="button" type="button" data-action="switch-to-plus">Mulai AI Plus &#8594;</button></div>
  </div></section>`;
}

function aiLens() {
  const profile = analysisProfile();
  const detection = analysisDetection();
  return `<div class="flow-card">
    <header class="ai-header"><span class="ai-scan-icon" aria-hidden="true"></span><div><p class="section-kicker">AI Second</p><h2>AI Lens</h2><p>Second opinion dengan visual clue, confidence score, dan pertanyaan reflektif - bukan keputusan akhir.</p></div></header>
    ${detectionPanel(profile, detection)}
    <div class="ai-notice-grid">${profile.aiNotices.map(([label, value]) => `<div class="signal-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <div class="forensic-meter"><div class="forensic-meter-head"><strong>${state.aiWrong ? "Suspicious Signals" : "Manipulation Signals"}: ${profile.aiLevel}</strong><span>${profile.aiScore}% indikator model</span></div><div class="meter"><span style="width:${profile.aiScore}%"></span></div><p>Nilai ini menunjukkan sinyal model, bukan kebenaran final. Gunakan hasil ini untuk menentukan apa yang perlu dicek, bukan untuk langsung percaya.</p></div>
    <div class="ai-columns">
      <section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${profile.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section class="info-panel verify"><h3>Yang dapat kamu verifikasi</h3><ul>${profile.verification.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    </div>
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-hadang">Kembali ke J.E.D.A.</button><button class="button" data-action="compare-judgment">Bandingkan dengan Penilaian Saya</button></div>
  </div>`;
}

function humanFinal() {
  const profile = analysisProfile();
  const decisions = state.aiWrong ? ["Saya setuju dengan AI", "Saya tidak setuju dengan AI", "Verifikasi lagi", "Belum yakin"] : ["Lanjut", "Verifikasi Dulu", "Berhenti", "Belum Yakin"];
  return `<div class="flow-card">
    <header><p class="section-kicker">Human Final</p><h2>Bandingkan. Pertimbangkan. Putuskan.</h2><p>AI memberi sinyal; bukti dan penalaranmu menentukan maknanya.</p></header>
    <div class="comparison"><div><span class="comparison-label">Penilaian awal saya</span><strong>${escapeHtml(state.initialDecision)}</strong><p>Confidence: ${state.initialConfidence}%</p></div><div><span class="comparison-label">AI Lens</span><strong>${state.aiWrong ? "Suspicious" : "Manipulation"} Signals: ${profile.aiScore}%</strong><p>${escapeHtml(profile.aiNotices.slice(2).map(([label, value]) => `${label}: ${value}`).join(" · "))}</p></div></div>
    <div class="question"><span class="question-label">Setelah melihat bukti dan AI Lens, apa keputusanmu sekarang?</span><div class="choice-grid">${decisions.map((item) => choice(item, state.finalDecision, "final-decision")).join("")}</div></div>
    <div class="question"><span class="question-label">Seberapa yakin kamu dengan keputusan final itu?</span>${confidenceSlider("final-confidence", state.finalConfidence)}</div>
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-ai">Kembali</button><button class="button button-teal" data-action="lock-final" ${state.finalDecision ? "" : "disabled"}>Kunci Keputusan Akhir</button></div>
  </div>`;
}

function reflectionScreen() {
  const items = ["Bukti / sumber", "Emosi", "Tekanan waktu", "Risiko tindakan", "Analisis AI", "Verifikasi independen", "Tidak berubah"];
  const priority = ["AI", "Bukti independen", "Opini viral", "Kanal resmi", "Belum yakin"];
  return `<div class="flow-card">
    <header><p class="section-kicker">Reflect &amp; Learn</p><h2>Apa yang Mengubah Pikiranmu?</h2><p>Refleksi membantu kamu mengenali pola yang dapat digunakan di situasi berikutnya.</p></header>
    <div class="question"><div class="question-label">Pilih paling banyak dua faktor. <span class="max-note">${state.reflection.length}/2 dipilih</span></div><div class="choice-grid compact">${items.map((item) => multiChoice(item, state.reflection, "reflection")).join("")}</div></div>
    <div class="question"><span class="question-label">Jika AI bertentangan dengan bukti independen, mana yang seharusnya kamu prioritaskan?</span><div class="choice-grid">${priority.map((item) => choice(item, state.priority, "priority")).join("")}</div></div>
    ${state.priority && !["Bukti independen", "Kanal resmi"].includes(state.priority) ? `<div class="insight"><div><strong>Berhenti sejenak.</strong><br>Pertimbangkan kembali sumber mana yang dapat diverifikasi secara independen.</div></div>` : ""}
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-final">Kembali</button><button class="button button-teal" data-action="show-result" ${state.reflection.length && state.priority ? "" : "disabled"}>Lihat Snapshot Nalar</button></div>
  </div>`;
}

function resultScreen() {
  const profile = analysisProfile();
  const goodFinal = ["Verifikasi Dulu", "Berhenti", "Saya tidak setuju dengan AI", "Verifikasi lagi"].includes(state.finalDecision);
  const skills = [
    ["Mengenali tekanan", state.pressure.length > 1 ? 88 : 76],
    ["Kesadaran emosi", state.emotion.length > 1 ? 84 : 72],
    ["Pemeriksaan bukti", state.evidence === profile.preferredEvidence ? 92 : 70],
    ["Kesadaran risiko aksi", state.saferAction ? 86 : 68],
  ];
  return `<div class="flow-card">
    <header><p class="section-kicker">Critical Thinking Snapshot</p><h2>${state.aiWrong && state.finalDecision === "Saya tidak setuju dengan AI" ? "Penilaian baik. AI bukan otoritas final." : "Pemeriksaan selesai."}</h2><p>${goodFinal ? "Kamu memberi ruang bagi bukti baru sebelum menentukan tindakan." : "Snapshot ini menunjukkan area yang bisa diperkuat pada pemeriksaan berikutnya."}</p></header>
    <div class="skill-list">${skills.map(([label, score]) => `<div class="skill-row"><span>${label}</span><div class="skill-bar"><i style="width:${score}%"></i></div><b>${score}</b></div>`).join("")}</div>
    <div class="before-after"><div class="snapshot-box"><small>Sebelum</small><strong>${escapeHtml(state.initialDecision)} - ${state.initialConfidence}% yakin</strong></div><span class="arrow" aria-hidden="true">&#8594;</span><div class="snapshot-box after"><small>Sesudah</small><strong>${escapeHtml(state.finalDecision)} - ${state.finalConfidence}% yakin</strong></div></div>
    <p class="learning-message"><strong>Perubahan keputusan bukan kelemahan.</strong> Itu tanda kamu memasukkan bukti baru ke dalam penilaian.</p>
    <div class="flow-actions"><button class="button button-ghost" data-action="restart-flow">Periksa Lagi</button><a class="button" href="#/training">Lanjut Latihan</a></div>
  </div>`;
}

const communityAudiences = ["Keluarga", "Dewasa & Lansia", "Sekolah", "Komunitas Umum"];
const communityDurations = ["30 menit", "60 menit", "90 menit"];
const communityPacks = [
  { id: "family", title: "Keluarga & Keuangan", format: "Teks + Voice Note", caseTitle: "Pesan Keluarga Darurat", content: DEFAULT_MESSAGE, note: "Fokus pada urgency, identitas, dan transfer yang sulit dibatalkan." },
  { id: "public", title: "Hoaks di Ruang Publik", format: "Screenshot + Video", caseTitle: "Informasi Viral", content: "Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!", note: "Fokus pada sumber primer, konteks, dan tekanan untuk membagikan." },
  { id: "transaction", title: "Aman Bertransaksi", format: "QR + Tautan", caseTitle: "QR Pembayaran", content: "QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.", note: "Fokus pada penerima, domain tujuan, dan kanal pembayaran resmi." },
];

const communityTactics = [
  ["urgency", "Urgency", "Waktu dipersempit agar korban bertindak sebelum berpikir."],
  ["authority", "Authority", "Nama, seragam, atau institusi dipakai untuk meminjam kepercayaan."],
  ["fear", "Fear", "Ancaman kerugian atau keadaan darurat memancing kepanikan."],
  ["social", "Social Pressure", "Viralitas dan perilaku orang lain dipakai sebagai pengganti bukti."],
];

const communityChallenges = {
  family: [
    { letter: "J", title: "Jeda", prompt: "Bagian mana yang paling mempersempit waktu berpikir?", instruction: "Letakkan tiga Kartu Kutipan di seberang garis. Penjaga J mengambil satu kartu sebelum timer habis.", options: ["Transfer Rp3 juta sekarang", "HP Mama rusak", "Nomor rekening ini"], correct: 0, insight: "Kata 'sekarang' mendorong tindakan sebelum identitas dikonfirmasi." },
    { letter: "E", title: "Emosi", prompt: "Emosi utama apa yang sedang dimanfaatkan?", instruction: "Buat tiga zona emosi di lantai. Tim Hadang berpindah bersama ke zona pilihannya.", options: ["Takut dan panik", "Bangga", "Bosan"], correct: 0, insight: "Keadaan darurat keluarga memanfaatkan rasa takut dan tanggung jawab." },
    { letter: "D", title: "Data", prompt: "Bukti independen mana yang paling kuat?", instruction: "Sebar tiga Kartu Bukti di ruangan. Penjaga D mengambil bukti terkuat dan membawanya ke garis.", options: ["Voice note nomor baru", "Telepon nomor Mama yang tersimpan", "Foto profil pengirim"], correct: 1, insight: "Konfirmasi lewat kanal yang sudah dikenal lebih kuat daripada bukti dari pengirim yang sama." },
    { letter: "A", title: "Aksi", prompt: "Tindakan paling aman sebelum transfer adalah...", instruction: "Warga berdiri di salah satu Zona Keputusan: Lanjut, Verifikasi, atau Berhenti.", options: ["Transfer sebagian dulu", "Hubungi keluarga lewat kanal lain", "Balas dan minta foto"], correct: 1, insight: "Pindah kanal dan konfirmasi identitas sebelum melakukan tindakan finansial." },
  ],
  public: [
    { letter: "J", title: "Jeda", prompt: "Frasa mana yang mendorong kita menyebarkan tanpa memeriksa?", instruction: "Penjaga J memilih Kartu Kutipan dan menaruhnya di garis.", options: ["Sebarkan sekarang sebelum dihapus", "Informasi ini sedang ramai", "Ada unggahan baru"], correct: 0, insight: "Ancaman penghapusan menciptakan kelangkaan waktu palsu." },
    { letter: "E", title: "Emosi", prompt: "Emosi apa yang paling mungkin mendorong tombol share?", instruction: "Peserta bergerak ke Zona Emosi yang paling sesuai lalu menyebut alasannya.", options: ["Marah dan curiga", "Tenang", "Bingung ringan"], correct: 0, insight: "Kemarahan membuat klaim terasa layak dibagikan sebelum sumbernya jelas." },
    { letter: "D", title: "Data", prompt: "Apa pemeriksaan paling independen untuk klaim viral?", instruction: "Penjaga D mengambil satu Kartu Bukti dari sisi ruangan.", options: ["Jumlah share", "Komentar yang setuju", "Sumber primer dan laporan pembanding"], correct: 2, insight: "Viralitas bukan bukti; sumber primer dan pembanding memberi konteks." },
    { letter: "A", title: "Aksi", prompt: "Apa tindakan aman ketika konteks belum lengkap?", instruction: "Warga berpindah ke Zona Keputusan sebelum timer habis.", options: ["Bagikan dengan tanda tanya", "Tunda dan cari konteks", "Kirim ke grup keluarga"], correct: 1, insight: "Menunda share mencegah klaim tanpa konteks menyebar lebih jauh." },
  ],
  transaction: [
    { letter: "J", title: "Jeda", prompt: "Apa yang membuat orang ingin langsung memindai QR?", instruction: "Penjaga J mengambil Kartu Pemicu yang paling tepat.", options: ["Antrean dan ingin cepat selesai", "Warna stiker", "Ukuran kode"], correct: 0, insight: "Kebiasaan dan tekanan antrean dapat mengurangi pemeriksaan penerima." },
    { letter: "E", title: "Emosi", prompt: "Kondisi apa yang sedang dimanfaatkan?", instruction: "Tim bergerak ke Zona Emosi lalu menjelaskan pilihannya.", options: ["Nyaman dan terburu-buru", "Sedih", "Bangga"], correct: 0, insight: "Rasa nyaman pada rutinitas pembayaran dapat menurunkan kewaspadaan." },
    { letter: "D", title: "Data", prompt: "Bukti terkuat bahwa QR memang resmi adalah...", instruction: "Penjaga D memilih satu Kartu Bukti dan menyerahkannya kepada Warga.", options: ["Logo pada stiker", "Konfirmasi kasir dan nama penerima", "QR terlihat baru"], correct: 1, insight: "Konfirmasi kasir dan identitas penerima lebih kuat daripada tampilan stiker." },
    { letter: "A", title: "Aksi", prompt: "Apa yang harus dilakukan sebelum menyelesaikan pembayaran?", instruction: "Warga memilih Zona Keputusan secara fisik.", options: ["Masukkan PIN secepatnya", "Periksa nama penerima", "Foto QR untuk nanti"], correct: 1, insight: "Nama penerima harus sesuai sebelum transaksi yang sulit dibatalkan." },
  ],
};

const communityVoteLabels = ["Lanjut", "Verifikasi Dulu", "Berhenti", "Belum Yakin"];

const communityState = {
  mode: "setup",
  playMode: "offline",
  audience: "Dewasa & Lansia",
  duration: "60 menit",
  packId: "family",
  participants: 24,
  teamArus: "Tim Arus",
  teamHadang: "Tim Hadang",
  round: 1,
  scores: { arus: 0, hadang: 0 },
  phase: 0,
  lineIndex: 0,
  lineResults: [],
  selectedAnswer: null,
  lineResolved: false,
  timerRemaining: 30,
  timerRunning: false,
  pressureUsed: false,
  revealedTactic: "",
  prepChecks: [],
  votes: { initial: [0, 0, 0, 0], final: [0, 0, 0, 0] },
  finalBonusApplied: false,
  completedLines: [],
  visionUsed: false,
};

let communityTimerId = 0;

function stopCommunityTimer() {
  clearInterval(communityTimerId);
  communityTimerId = 0;
  communityState.timerRunning = false;
}

function activeCommunityPack() {
  return communityPacks.find((pack) => pack.id === communityState.packId) || communityPacks[0];
}

function communityPage() {
  return `<section class="page-hero community-hero"><div class="page-shell"><p class="eyebrow">HADANGIN &middot; Arena Komunitas</p><h1>Satu Tim Meloloskan. Satu Tim Menghadang.</h1><p>Website menjadi game master untuk permainan fisik Gobak Sodor literasi digital. Tim Arus membawa informasi menuju tindakan, sementara Tim Hadang menjaga empat garis J.E.D.A.</p></div></section>
    ${communityState.mode === "setup" ? communitySetup() : communityState.mode === "prepare" ? communityPrepare() : communityState.mode === "vision" ? communityVisionSession() : communitySession()}`;
}

function communitySetup() {
  const pack = activeCommunityPack();
  const visionMode = communityState.playMode === "vision";
  return `<section class="section community-workspace"><div class="page-shell community-setup-layout">
    <section class="community-builder" aria-labelledby="community-builder-title">
      <header><p class="section-kicker">Arena Komunitas</p><h2 id="community-builder-title">Pilih cara bermain</h2><p>Arena Offline memakai dua tim dan perlengkapan fisik. Arena Kamera AI memakai gerakan tubuh satu penjaga aktif.</p></header>
      <div class="community-field"><span class="community-field-label">Kelompok peserta</span><div class="community-choice-row">${communityAudiences.map((item) => `<button type="button" class="${communityState.audience === item ? "active" : ""}" data-community-audience="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div></div>
      <div class="community-field"><span class="community-field-label">Durasi sesi</span><div class="community-segmented">${communityDurations.map((item) => `<button type="button" class="${communityState.duration === item ? "active" : ""}" data-community-duration="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div></div>
      <div class="community-field"><span class="community-field-label">Paket kasus</span><div class="community-pack-grid">${communityPacks.map((item) => `<button type="button" class="community-pack ${communityState.packId === item.id ? "active" : ""}" data-community-pack="${item.id}"><span>${escapeHtml(item.format)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.note)}</small></button>`).join("")}</div></div>
      <div class="community-field"><span class="community-field-label">Mode permainan</span><div class="community-mode-grid">
        <button type="button" class="community-mode-card ${visionMode ? "" : "active"}" data-community-mode="offline"><span class="community-mode-icon manual" aria-hidden="true">J</span><span><b>Arena Offline</b><small>Dua tim bergerak di lapangan fisik. Website mengatur kasus, timer, pertanyaan, dan skor.</small></span><i>Mode utama</i></button>
        <button type="button" class="community-mode-card ${visionMode ? "active" : ""}" data-community-mode="vision"><span class="community-mode-icon" aria-hidden="true">CV</span><span><b>Arena Kamera AI</b><small>Satu penjaga aktif melakukan pose Hadang. Computer Vision membaca gerakan langsung di perangkat.</small></span><i>Beta</i></button>
      </div></div>
      ${visionMode ? `<div class="community-vision-setup-note"><span>CV</span><p><b>Posisi bermain</b>Satu peserta berdiri sekitar 2 meter dari kamera. Peserta lain mendiskusikan pertanyaan J.E.D.A. dan bergantian menjadi penjaga.</p></div>` : `<div class="community-team-fields"><label><span>Nama tim pembawa informasi</span><input id="community-team-arus" maxlength="24" value="${escapeHtml(communityState.teamArus)}" /></label><label><span>Nama tim penjaga nalar</span><input id="community-team-hadang" maxlength="24" value="${escapeHtml(communityState.teamHadang)}" /></label></div>`}
      <label class="community-number-field" for="community-participants"><span>Perkiraan peserta</span><input id="community-participants" type="number" min="4" max="120" value="${communityState.participants}" inputmode="numeric" /><small>4-120 orang</small></label>
      <button class="button community-start-button" type="button" data-action="start-community">${visionMode ? "Buka Arena Kamera AI" : "Siapkan Arena Offline"} <span aria-hidden="true">&#8594;</span></button>
    </section>
    <aside class="community-session-preview" aria-label="Ringkasan sesi yang akan dibuat">
      <div class="community-preview-head"><span>Pratinjau ${visionMode ? "Arena Kamera" : "pertandingan"}</span><i>${visionMode ? "AI lokal &middot; Tanpa rekaman" : "1 layar &middot; Tanpa login"}</i></div>
      <div class="community-preview-case"><small>Kasus pembuka</small><strong>${escapeHtml(pack.caseTitle)}</strong><blockquote>${escapeHtml(pack.content)}</blockquote></div>
      <dl><div><dt>Peserta</dt><dd>${escapeHtml(communityState.audience)}</dd></div><div><dt>Durasi</dt><dd>${escapeHtml(communityState.duration)}</dd></div><div><dt>Format</dt><dd>${escapeHtml(pack.format)}</dd></div><div><dt>Peralatan</dt><dd>${visionMode ? "Laptop, webcam, ruang gerak 2 meter" : "Laptop, proyektor, kartu, selotip"}</dd></div></dl>
      <div class="community-preview-path"><span>Vote</span><i></i><span>${visionMode ? "Pose J.E.D.A." : "Arena"}</span><i></i><span>${visionMode ? "Vote Ulang" : "Reveal"}</span><i></i><span>Debrief</span></div>
      <p>${visionMode ? "Video diproses lokal di browser untuk membaca pose. Tidak direkam atau dikirim ke server." : "Tim Arus memakai skenario yang sudah disediakan. Peserta tidak diminta membuat hoaks baru."}</p>
    </aside>
  </div></section>`;
}

function communityPrepare() {
  const checks = ["Empat garis sudah dibuat", "Kartu permainan sudah dipotong", "Peran kedua tim sudah dibagi", "Layar dapat dilihat semua peserta"];
  const ready = communityState.prepChecks.length === checks.length;
  return `<section class="section community-workspace"><div class="page-shell offline-prep">
    <header class="offline-prep-head"><div><p class="section-kicker">Persiapan &middot; sekitar 5 menit</p><h2>Bangun lapangan J.E.D.A.</h2><p>Buat empat garis dengan selotip. Tim Arus mulai dari sisi MASUK dan membawa Token Informasi menuju Zona Tindakan.</p></div><div class="offline-prep-actions"><button class="button button-secondary" data-action="print-community-kit">Cetak Kartu &amp; Penanda</button><button class="button button-ghost" data-action="download-community-kit">Unduh Panduan</button><button class="button button-ghost" data-action="reset-community">Ubah Pengaturan</button></div></header>
    <div class="offline-prep-grid"><figure class="offline-kit-visual"><img src="${OFFLINE_KIT_URL}" alt="Perlengkapan Arena Hadang berupa kartu J.E.D.A., token Informasi, kartu keputusan, selotip, dan papan skor" /><figcaption><strong>Kit Arena Hadang</strong><span>Kartu J.E.D.A., kartu keputusan, kartu taktik, Token Informasi, dan penanda garis.</span></figcaption></figure>
      <section class="offline-court-plan"><div class="offline-court-title"><span>Denah ruangan</span><b>Minimal 3 x 6 meter</b></div><div class="offline-court-track"><span>MASUK</span>${["J", "E", "D", "A"].map((letter) => `<i><b>${letter}</b></i>`).join("")}<span>TINDAKAN</span><em>Token Informasi bergerak ke arah ini &#8594;</em></div><div class="offline-role-grid"><div><span>1</span><p><b>Tim Arus</b>Runner membawa token; Strategist memainkan Kartu Taktik.</p></div><div><span>4</span><p><b>Tim Hadang</b>Satu penjaga untuk setiap garis J.E.D.A.</p></div><div><span>1</span><p><b>Warga</b>Mengambil keputusan akhir di Zona Tindakan.</p></div></div></section>
    </div>
    <section class="offline-ready-check"><div><p class="section-kicker">Checklist fasilitator</p><h3>Pastikan arena siap sebelum ditampilkan ke peserta.</h3></div><div class="offline-check-list">${checks.map((item, index) => `<button type="button" class="${communityState.prepChecks.includes(index) ? "complete" : ""}" data-community-prep="${index}"><span>${communityState.prepChecks.includes(index) ? "&#10003;" : index + 1}</span>${item}</button>`).join("")}</div><button class="button" type="button" data-action="community-next" ${ready ? "" : "disabled"}>Mulai Voting Awal &#8594;</button></section>
  </div></section>`;
}

function communitySession() {
  const phases = ["Voting Awal", "Arena Hadang", "Reveal", "Voting Akhir", "Debrief"];
  const pack = activeCommunityPack();
  return `<section class="community-live"><div class="page-shell">
    <div class="community-live-topbar"><div><span>Ronde</span><strong>0${communityState.round}</strong><small>Arena offline &middot; Host lokal</small></div><div class="community-phase-track">${phases.map((item, index) => `<span class="${index < communityState.phase ? "done" : index === communityState.phase ? "active" : ""}">${index < communityState.phase ? "&#10003;" : index + 1}<small>${item}</small></span>`).join("")}</div><button class="button button-ghost button-small" type="button" data-action="reset-community">Akhiri Sesi</button></div>
    <div class="offline-scoreboard"><div class="arus"><span>PEMBAWA INFORMASI</span><strong>${escapeHtml(communityState.teamArus)}</strong><b>${communityState.scores.arus}</b></div><i>VS</i><div class="hadang"><span>PENJAGA NALAR</span><strong>${escapeHtml(communityState.teamHadang)}</strong><b>${communityState.scores.hadang}</b></div></div>
    ${communityPhase(pack)}
  </div></section>`;
}

function communityVoteBoard(type) {
  const values = communityState.votes[type];
  const total = values.reduce((sum, value) => sum + value, 0);
  return `<div class="offline-vote-board">${communityVoteLabels.map((label, index) => `<div><span>${escapeHtml(label)}</span><button type="button" data-community-vote="${type}:${index}:-1" aria-label="Kurangi ${escapeHtml(label)}">&minus;</button><strong>${values[index]}</strong><button type="button" data-community-vote="${type}:${index}:1" aria-label="Tambah ${escapeHtml(label)}">+</button></div>`).join("")}<p><b>${total}</b> suara tercatat &middot; Hitung kartu yang diangkat peserta, lalu masukkan jumlahnya.</p></div>`;
}

function communityVisionSession() {
  const phases = ["Voting Awal", "Arena Kamera", "Voting Akhir", "Debrief"];
  const pack = activeCommunityPack();
  return `<section class="community-live"><div class="page-shell">
    <div class="community-live-topbar vision-community-topbar"><div><span>Mode beta</span><strong>CV-204</strong><small>Arena Kamera AI &middot; Proses lokal</small></div><div class="community-phase-track">${phases.map((item, index) => `<span class="${index < communityState.phase ? "done" : index === communityState.phase ? "active" : ""}">${index < communityState.phase ? "&#10003;" : index + 1}<small>${item}</small></span>`).join("")}</div><button class="button button-ghost button-small" type="button" data-action="reset-community">Akhiri Sesi</button></div>
    ${communityVisionPhase(pack)}
  </div></section>`;
}

function communityVisionPhase(pack) {
  if (communityState.phase === 0) {
    return `<div class="community-stage-layout"><section class="community-projection"><div class="projection-label"><span>Kasus untuk peserta</span><b>${escapeHtml(pack.format)}</b></div><p class="projection-source">${escapeHtml(pack.caseTitle)}</p><blockquote>${escapeHtml(pack.content)}</blockquote><div class="projection-question">Apa respons pertamamu sebelum mendapat petunjuk?</div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting tanpa petunjuk</p><h2>Catat respons awal</h2><p>Peserta mengangkat kartu keputusan. Kamera belum digunakan pada tahap ini.</p>${communityVoteBoard("initial")}<button class="button" type="button" data-action="community-vision-next">Masuk Arena Kamera &#8594;</button></aside></div>`;
  }
  if (communityState.phase === 1) {
    const lines = communityChallenges[communityState.packId].map(({ letter, title, prompt }) => [letter, title, prompt]);
    return communityVisionStage(lines);
  }
  if (communityState.phase === 2) {
    return `<div class="community-stage-layout"><section class="community-projection final"><div class="projection-label"><span>Human Final</span><b>Setelah empat pose</b></div><h2>Apakah keputusan kelompok berubah?</h2><p>Computer Vision hanya memastikan pose tubuh. Alasan, bukti, dan keputusan tetap berasal dari diskusi peserta.</p><div class="offline-decision-zones"><span>Lanjut</span><span>Verifikasi</span><span>Berhenti</span><span>Belum Yakin</span></div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting akhir</p><h2>Hitung kartu peserta</h2>${communityVoteBoard("final")}<button class="button button-teal" type="button" data-action="community-vision-next">Lihat Debrief &#8594;</button></aside></div>`;
  }
  const initialTotal = communityState.votes.initial.reduce((sum, value) => sum + value, 0);
  const finalTotal = communityState.votes.final.reduce((sum, value) => sum + value, 0);
  const initialRisk = initialTotal ? Math.round(communityState.votes.initial[0] / initialTotal * 100) : 0;
  const finalSafe = finalTotal ? Math.round((communityState.votes.final[1] + communityState.votes.final[2]) / finalTotal * 100) : 0;
  return `<section class="community-debrief"><header><p class="section-kicker">Ringkasan Arena Kamera AI</p><h2>Gerak tubuh membuka ruang untuk berpikir bersama.</h2><p>Pose mengaktifkan setiap garis, tetapi peserta tetap harus menjelaskan tekanan, emosi, bukti, dan tindakan aman sesuai kasus.</p></header><div class="community-impact-grid"><article><span>Pose Hadang</span><strong>${communityState.completedLines.length}/4</strong><p>Empat garis J.E.D.A. diselesaikan bergantian.</p></article><article><span>Risiko awal</span><strong>${initialRisk}%</strong><p>Peserta yang semula memilih langsung lanjut.</p></article><article><span>Keputusan aman</span><strong>${finalSafe}%</strong><p>Peserta memilih verifikasi atau berhenti pada voting akhir.</p></article></div><div class="community-learning"><div><strong>Apa yang dibaca AI?</strong><p>Posisi titik tubuh untuk mengenali pose kedua tangan terangkat. Video diproses lokal dan tidak disimpan.</p></div><div><strong>Apa yang dinilai manusia?</strong><p>Kualitas alasan, bukti independen, dan keputusan aman. AI tidak menentukan benar atau salahnya peserta.</p></div></div><div class="community-stage-actions"><button class="button button-secondary" type="button" data-action="download-community-kit">Unduh Panduan</button><button class="button" type="button" data-action="reset-community">Buat Sesi Baru</button></div></section>`;
}

function communityVisionStage(lines) {
  const nextIndex = lines.findIndex(([letter]) => !communityState.completedLines.includes(letter));
  const activeIndex = nextIndex === -1 ? lines.length : nextIndex;
  const activeLine = lines[activeIndex] || ["", "Arena selesai", "Semua garis nalar berhasil dihadang."];
  const complete = activeIndex === lines.length;
  return `<section class="community-vision-stage" data-current-vision-line="${activeLine[0]}">
    <header class="community-vision-heading"><div><p class="section-kicker">Virtual Gobak Sodor &middot; AI Computer Vision</p><h2>Hadang informasi dengan gerakan tubuh.</h2><p>Satu penjaga berdiri di depan kamera. Kelompok membahas pertanyaan kasus, lalu penjaga mengangkat kedua tangan untuk mengunci garis.</p></div><span class="vision-privacy-badge">Diproses lokal &middot; Tidak direkam</span></header>
    <div class="community-vision-layout">
      <div class="vision-game-board">
        <video id="community-vision-video" muted playsinline aria-label="Preview kamera pemain"></video>
        <canvas id="community-vision-canvas" aria-hidden="true"></canvas>
        <div class="vision-camera-empty"><span>CV</span><strong>Kamera belum aktif</strong><small>Aktifkan saat penjaga sudah siap di depan layar.</small></div>
        <div class="vision-court" aria-hidden="true">${lines.map(([letter, title], index) => `<div class="vision-court-line ${index < activeIndex ? "complete" : index === activeIndex ? "active" : ""}"><i></i><span>${letter}<small>${title}</small></span></div>`).join("")}</div>
        <div class="vision-player-marker" id="vision-player-marker" aria-hidden="true"><i></i><span>PENJAGA</span></div>
        <div class="vision-hud"><span class="vision-status-dot" data-vision-status="idle"></span><strong id="vision-status-text">Kamera tidak aktif</strong></div>
        <div class="vision-motion-meter"><i id="vision-hold-meter"></i><span id="vision-motion-label">Angkat kedua tangan untuk Hadang</span></div>
      </div>
      <aside class="vision-coach-panel">
        <div class="vision-coach-top"><span>GARIS AKTIF</span><b>${complete ? "SELESAI" : `0${activeIndex + 1} / 04`}</b></div>
        <div class="vision-current-prompt"><span>${activeLine[0] || "&#10003;"}</span><div><small>${escapeHtml(activeLine[1])}</small><h3>${escapeHtml(activeLine[2])}</h3></div></div>
        <ol class="vision-station-list">${lines.map(([letter, title], index) => `<li class="${communityState.completedLines.includes(letter) ? "complete" : index === activeIndex ? "active" : ""}"><span>${letter}</span><b>${title}</b><i>${communityState.completedLines.includes(letter) ? "Selesai" : index === activeIndex ? "Giliran ini" : "Menunggu"}</i></li>`).join("")}</ol>
        <div class="vision-instructions"><strong>Cara bermain</strong><p>1. Berdiri hingga skeleton muncul.<br>2. Bahas pertanyaan garis aktif.<br>3. Angkat kedua tangan selama 1 detik.</p></div>
        <button class="button vision-camera-button" type="button" data-action="toggle-community-camera">${isCommunityVisionActive() ? "Matikan Kamera" : "Aktifkan Kamera AI"}</button>
        ${!complete ? `<button class="vision-manual-fallback" type="button" data-community-line="${activeLine[0]}">Tandai manual</button>` : ""}
      </aside>
    </div>
    <div class="community-stage-actions"><span>${communityState.completedLines.length} dari 4 garis berhasil dihadang</span><button class="button" type="button" data-action="community-vision-next" ${complete ? "" : "disabled"}>Buka Voting Akhir &#8594;</button></div>
  </section>`;
}

function communityPhase(pack) {
  if (communityState.phase === 0) {
    return `<div class="community-stage-layout"><section class="community-projection"><div class="projection-label"><span>Kasus untuk Warga</span><b>${escapeHtml(pack.format)}</b></div><p class="projection-source">${escapeHtml(pack.caseTitle)}</p><blockquote>${escapeHtml(pack.content)}</blockquote><div class="projection-question">Angkat Kartu Keputusan: apa respons pertamamu?</div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting tanpa petunjuk</p><h2>Hitung kartu peserta</h2><p>Jangan bahas jawabannya dulu. Catat respons spontan kelompok sebelum Tim Arus mulai bergerak.</p>${communityVoteBoard("initial")}<button class="button" type="button" data-action="community-next">Lepaskan Tim Arus &#8594;</button></aside></div>`;
  }
  if (communityState.phase === 1) {
    return communityOfflineArena(pack);
  }
  if (communityState.phase === 2) {
    const tactic = communityTactics.find(([id]) => id === communityState.revealedTactic);
    return `<section class="offline-reveal"><header><p class="section-kicker">Buka kartu &middot; AI Lens sebagai wasit penjelas</p><h2>Taktik apa yang dipakai Tim Arus?</h2><p>Tim Arus membuka kartu fisiknya. Fasilitator memilih kartu yang sama agar website menampilkan penjelasan.</p></header><div class="offline-tactic-grid">${communityTactics.map(([id, title, note]) => `<button type="button" class="${communityState.revealedTactic === id ? "active" : ""}" data-community-tactic="${id}"><span>${title}</span><p>${note}</p></button>`).join("")}</div>${tactic ? `<div class="offline-ai-reveal"><span>AI LENS</span><div><strong>${tactic[1]} terdeteksi sebagai pola manipulasi</strong><p>${tactic[2]} AI hanya membuka pola setelah manusia bermain; keputusan dan skor tetap berasal dari peserta.</p></div></div>` : `<div class="offline-reveal-placeholder">Pilih kartu yang digunakan untuk membuka penjelasan AI.</div>`}<div class="offline-round-recap">${communityState.lineResults.map((result, index) => `<div class="${result.outcome}"><span>${result.letter}</span><b>${result.outcome === "blocked" ? "DIHADANG" : "LOLOS"}</b><p>${escapeHtml(result.insight)}</p></div>`).join("")}</div><div class="community-stage-actions"><button class="button" data-action="community-next" ${tactic ? "" : "disabled"}>Lanjut Voting Akhir &#8594;</button></div></section>`;
  }
  if (communityState.phase === 3) {
    return `<div class="community-stage-layout"><section class="community-projection final"><div class="projection-label"><span>Human Final</span><b>Angkat kartu sekali lagi</b></div><h2>Setelah empat garis, apakah keputusanmu berubah?</h2><p>Warga dan seluruh peserta memilih ulang tanpa mengikuti keputusan tim lain.</p><div class="offline-decision-zones"><span>Lanjut</span><span>Verifikasi</span><span>Berhenti</span><span>Belum Yakin</span></div></section><aside class="community-facilitator-panel"><p class="section-kicker">Voting setelah permainan</p><h2>Hitung kartu peserta</h2>${communityVoteBoard("final")}<button class="button button-teal" type="button" data-action="community-next">Lihat Debrief &#8594;</button></aside></div>`;
  }
  const initialTotal = communityState.votes.initial.reduce((sum, value) => sum + value, 0);
  const finalTotal = communityState.votes.final.reduce((sum, value) => sum + value, 0);
  const initialRisk = initialTotal ? Math.round(communityState.votes.initial[0] / initialTotal * 100) : 0;
  const finalSafe = finalTotal ? Math.round((communityState.votes.final[1] + communityState.votes.final[2]) / finalTotal * 100) : 0;
  return `<section class="community-debrief"><header><p class="section-kicker">Ringkasan ronde 0${communityState.round}</p><h2>${communityState.scores.hadang >= communityState.scores.arus ? `${escapeHtml(communityState.teamHadang)} menjaga nalar lebih kuat.` : `${escapeHtml(communityState.teamArus)} berhasil memberi tekanan.`}</h2><p>Skor membuat permainan kompetitif; debrief memastikan setiap taktik berubah menjadi pelajaran yang dapat dipakai di dunia nyata.</p></header><div class="community-impact-grid"><article><span>Risiko awal</span><strong>${initialRisk}%</strong><p>Peserta memilih langsung lanjut sebelum melewati J.E.D.A.</p></article><article><span>Keputusan aman</span><strong>${finalSafe}%</strong><p>Peserta memilih verifikasi atau berhenti setelah bermain.</p></article><article><span>Skor ronde</span><strong>${communityState.scores.arus}:${communityState.scores.hadang}</strong><p>${escapeHtml(communityState.teamArus)} vs ${escapeHtml(communityState.teamHadang)}</p></article></div><div class="community-learning"><div><strong>Debrief Tim Arus</strong><p>Taktik mana yang paling mudah membuat orang bereaksi? Mengapa tekanan itu terasa meyakinkan?</p></div><div><strong>Debrief Tim Hadang</strong><p>Garis mana yang paling sulit dijaga? Bukti apa yang benar-benar mengubah keputusan Warga?</p></div></div><div class="community-stage-actions"><button class="button button-secondary" type="button" data-action="print-community-kit">Cetak Kit Permainan</button><button class="button" type="button" data-action="community-swap-round">Tukar Peran &amp; Ronde Baru</button></div></section>`;
}

function communityOfflineArena() {
  const lines = communityChallenges[communityState.packId];
  const challenge = lines[communityState.lineIndex];
  const currentResult = communityState.lineResults[communityState.lineIndex];
  return `<section class="offline-arena-stage"><div class="offline-arena-board"><div class="offline-arena-hud"><span>RONDE 0${communityState.round}</span><strong>GARIS ${challenge.letter} &middot; ${challenge.title.toUpperCase()}</strong><b id="community-timer">00:${String(communityState.timerRemaining).padStart(2, "0")}</b></div><div class="offline-digital-court"><span class="court-start">MASUK</span>${lines.map((line, index) => `<div class="offline-line ${index < communityState.lineIndex || communityState.lineResults[index] ? communityState.lineResults[index]?.outcome || "complete" : index === communityState.lineIndex ? "active" : ""}"><i></i><b>${line.letter}</b><small>${line.title}</small></div>`).join("")}<span class="court-action">TINDAKAN</span><div class="offline-info-token" style="--position:${12 + communityState.lineIndex * 21}%"><b>INFO</b><small>${currentResult?.outcome === "blocked" ? "TERHADANG" : "BERGERAK"}</small></div></div><div class="offline-arena-message"><span>AKSI FISIK</span><p>${escapeHtml(challenge.instruction)}</p></div></div>
    <aside class="offline-facilitator-console"><div class="offline-console-head"><span>Kontrol fasilitator</span><b>0${communityState.lineIndex + 1}/04</b></div><h2>${escapeHtml(challenge.prompt)}</h2><div class="offline-answer-options">${challenge.options.map((option, index) => `<button type="button" class="${communityState.selectedAnswer === index ? "selected" : ""} ${communityState.lineResolved ? index === challenge.correct ? "correct" : communityState.selectedAnswer === index ? "wrong" : "" : ""}" data-community-answer="${index}" ${communityState.lineResolved ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option)}</button>`).join("")}</div>${communityState.lineResolved ? `<div class="offline-answer-feedback ${currentResult.outcome}"><strong>${currentResult.outcome === "blocked" ? "Berhasil dihadang" : "Informasi lolos"}</strong><p>${escapeHtml(challenge.insight)}</p></div>` : `<div class="offline-arena-controls"><button class="button button-secondary" type="button" data-action="community-timer">${communityState.timerRunning ? "Jeda Timer" : communityState.timerRemaining < 30 ? "Lanjut Timer" : "Mulai Timer"}</button><button class="button pressure-button" type="button" data-action="community-pressure" ${communityState.pressureUsed ? "disabled" : ""}>Tim Arus: -5 detik</button><button class="button" type="button" data-action="community-lock-answer" ${communityState.selectedAnswer === null ? "disabled" : ""}>Kunci Jawaban</button></div>`}${communityState.lineResolved ? `<button class="button offline-next-line" type="button" data-action="community-next-line">${communityState.lineIndex === 3 ? "Buka Taktik & AI Lens" : "Lanjut ke Garis Berikutnya"} &#8594;</button>` : ""}<p class="offline-console-note">Peserta bergerak dan memilih kartu fisik. Fasilitator mencatat pilihan yang sama di layar.</p></aside>
  </section>`;
}

function downloadCommunityKit() {
  const pack = activeCommunityPack();
  const visionGuide = `PANDUAN ARENA KAMERA AI (BETA)\n\nAudiens: ${communityState.audience}\nDurasi: ${communityState.duration}\nPeserta: ${communityState.participants}\nPaket: ${pack.title}\nKasus: ${pack.caseTitle}\n\nPERALATAN\nLaptop dengan webcam, layar yang dapat dilihat kelompok, dan ruang gerak sekitar 2 meter.\n\nALUR\n1. Lakukan voting awal tanpa petunjuk.\n2. Pilih satu penjaga untuk berdiri di depan kamera.\n3. Kelompok membahas pertanyaan pada garis Jeda, Emosi, Data, dan Aksi.\n4. Penjaga mengangkat kedua tangan selama satu detik untuk mengunci garis.\n5. Ganti penjaga pada garis berikutnya agar peserta bergiliran.\n6. Lakukan voting akhir dan debrief.\n\nPRIVASI DAN AKSESIBILITAS\nPose diproses lokal di browser; video tidak direkam atau dikirim ke server. Gunakan tombol Tandai manual bagi peserta yang tidak dapat atau tidak ingin melakukan pose. AI hanya membaca pose dan tidak menilai kualitas jawaban.\n`;
  const offlineGuide = `PANDUAN ARENA HADANG OFFLINE\n\nAudiens: ${communityState.audience}\nDurasi: ${communityState.duration}\nPeserta: ${communityState.participants}\nPaket: ${pack.title}\nKasus: ${pack.caseTitle}\n\nPERALATAN\nLaptop dan proyektor, selotip lantai, Token Informasi, kartu J.E.D.A., kartu keputusan, kartu taktik, dan kartu bukti.\n\nALUR\n1. Bagi peserta menjadi Tim Arus dan Tim Hadang.\n2. Buat empat garis fisik: Jeda, Emosi, Data, dan Aksi.\n3. Lakukan voting awal dengan Kartu Keputusan.\n4. Tim Arus membawa Token Informasi; Tim Hadang menyelesaikan tantangan setiap garis.\n5. Fasilitator mengatur timer, pilihan, dan skor melalui website.\n6. Buka Kartu Taktik dan AI Lens setelah semua garis dimainkan.\n7. Lakukan voting akhir, debrief, lalu tukar peran.\n\nKEAMANAN\nPermainan tanpa kontak fisik. Jangan berlari pada lantai licin. Gunakan hanya skenario yang disediakan dan jangan memakai data pribadi peserta.\n`;
  const guide = communityState.mode === "vision" ? visionGuide : offlineGuide;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([guide], { type: "text/plain;charset=utf-8" }));
  link.download = communityState.mode === "vision" ? "panduan-arena-kamera-hadangin.txt" : "panduan-sesi-hadangin.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  showToast("Panduan sesi berhasil diunduh.");
}

function printCommunityKit() {
  const cards = [
    ["J", "JEDA", "Berhenti sejenak. Temukan tekanan waktu."], ["E", "EMOSI", "Kenali emosi yang sedang dipengaruhi."], ["D", "DATA", "Pilih bukti independen yang paling kuat."], ["A", "AKSI", "Nilai risiko dan pilih tindakan yang aman."],
    ["&#8594;", "LANJUT", "Saya akan melakukan tindakan yang diminta."], ["?", "VERIFIKASI", "Saya akan memeriksa lewat kanal lain."], ["&#9632;", "BERHENTI", "Saya tidak akan melanjutkan tindakan."], ["...", "BELUM YAKIN", "Saya membutuhkan bukti tambahan."],
    ["!", "URGENCY", "Kurangi waktu lawan lima detik."], ["ID", "AUTHORITY", "Gunakan klaim institusi atau jabatan."], ["!", "FEAR", "Tekankan ancaman atau keadaan darurat."], ["+", "SOCIAL PRESSURE", "Gunakan viralitas sebagai tekanan."],
  ];
  const popup = window.open("", "_blank");
  if (!popup) { showToast("Izinkan pop-up untuk mencetak kit permainan."); return; }
  popup.opener = null;
  popup.document.write(`<!doctype html><html lang="id"><head><title>Kit Arena Hadang</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#0b1830}.head{display:flex;justify-content:space-between;align-items:end;margin-bottom:8mm;border-bottom:3px solid #2468ef;padding-bottom:4mm}.head h1{margin:0;font-size:22px}.head p{margin:0;font-size:10px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}.card{height:82mm;display:flex;flex-direction:column;padding:7mm;border:2px solid #10213d;break-inside:avoid}.card:nth-child(4n+2){border-color:#0e9689}.card:nth-child(4n+3){border-color:#dd9217}.card:nth-child(4n){border-color:#d45f42}.symbol{width:18mm;height:18mm;display:grid;place-items:center;color:white;background:#2468ef;font-size:24px;font-weight:800}.card h2{margin:12mm 0 3mm;font-size:16px}.card p{margin:0;font-size:10px;line-height:1.5}.token{grid-column:1/-1;height:55mm;display:grid;place-items:center;color:white;background:#c83f50;border:4px solid #10213d;font-size:34px;font-weight:800;letter-spacing:2px}.line{grid-column:1/-1;height:35mm;display:grid;place-items:center;border:3px dashed #10213d;font-size:25px;font-weight:800}.note{grid-column:1/-1;font-size:9px;line-height:1.5}@media print{button{display:none}}</style></head><body><div class="head"><div><h1>HADANGIN &middot; Arena Hadang</h1><p>Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.</p></div><button onclick="print()">Cetak</button></div><div class="cards">${cards.map(([symbol, title, note]) => `<article class="card"><span class="symbol">${symbol}</span><h2>${title}</h2><p>${note}</p></article>`).join("")}<div class="token">TOKEN INFORMASI</div>${["J &middot; JEDA", "E &middot; EMOSI", "D &middot; DATA", "A &middot; AKSI", "ZONA TINDAKAN"].map((label) => `<div class="line">${label}</div>`).join("")}<p class="note">Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.</p></div></body></html>`);
  popup.document.close();
  popup.focus();
}

function updateCommunityTimerDisplay() {
  const timer = document.querySelector("#community-timer");
  if (timer) timer.textContent = `00:${String(communityState.timerRemaining).padStart(2, "0")}`;
}

function toggleCommunityTimer() {
  if (communityState.timerRunning) {
    stopCommunityTimer();
    const button = document.querySelector('[data-action="community-timer"]');
    if (button) button.textContent = "Lanjut Timer";
    return;
  }
  communityState.timerRunning = true;
  const button = document.querySelector('[data-action="community-timer"]');
  if (button) button.textContent = "Jeda Timer";
  communityTimerId = setInterval(() => {
    communityState.timerRemaining = Math.max(0, communityState.timerRemaining - 1);
    updateCommunityTimerDisplay();
    if (communityState.timerRemaining === 0) resolveCommunityLine(true);
  }, 1000);
}

function resolveCommunityLine(timedOut = false) {
  if (communityState.lineResolved) return;
  stopCommunityTimer();
  const challenge = communityChallenges[communityState.packId][communityState.lineIndex];
  const correct = !timedOut && communityState.selectedAnswer === challenge.correct;
  const outcome = correct ? "blocked" : "passed";
  communityState.lineResults[communityState.lineIndex] = { letter: challenge.letter, outcome, insight: timedOut ? "Timer habis sebelum Tim Hadang mengunci bukti." : challenge.insight };
  communityState.scores[correct ? "hadang" : "arus"] += 1;
  communityState.lineResolved = true;
  render({ preserveScroll: true });
}

function resetCommunityLine() {
  communityState.selectedAnswer = null;
  communityState.lineResolved = false;
  communityState.timerRemaining = 30;
  communityState.pressureUsed = false;
}

function startCommunityRound(swapTeams = false) {
  if (swapTeams) [communityState.teamArus, communityState.teamHadang] = [communityState.teamHadang, communityState.teamArus];
  communityState.mode = "session";
  communityState.phase = 0;
  communityState.lineIndex = 0;
  communityState.lineResults = [];
  communityState.revealedTactic = "";
  communityState.votes = { initial: [0, 0, 0, 0], final: [0, 0, 0, 0] };
  communityState.finalBonusApplied = false;
  resetCommunityLine();
}

const dashboardData = {
  summary: [
    ["Pemeriksaan simulatif", "128", "+24 minggu ini"],
    ["Safer decision shift", "64%", "berubah ke verifikasi/berhenti"],
    ["MIL Habit Score", "78", "rata-rata dari 100"],
    ["Forward risk turun", "34 pts", "sebelum vs sesudah J.E.D.A."],
  ],
  before: [["Lanjut", 42], ["Verifikasi Dulu", 28], ["Berhenti", 12], ["Belum Yakin", 18]],
  after: [["Lanjut", 9], ["Verifikasi Dulu", 57], ["Berhenti", 25], ["Belum Yakin", 9]],
  patterns: [["Urgency", 87], ["Fear", 73], ["Fake Authority", 59], ["Emotional Clickbait", 54], ["Suspicious Link", 41], ["Synthetic Media", 33], ["Financial Request", 28]],
  media: [["Text / WhatsApp", 46], ["Image / Screenshot", 24], ["QR / Link", 18], ["Audio / Voice Note", 12]],
  jeda: [["Jeda", 82, "User mulai mengenali tekanan waktu."], ["Emosi", 76, "Fear dan urgency paling sering memengaruhi respons."], ["Data", 71, "Masih perlu latihan memilih bukti independen."], ["Aksi", 79, "Risiko transfer/klik makin terlihat sebelum bertindak."]],
  explainability: [["Visual highlights dilihat", 89], ["Pertanyaan reflektif dijawab", 76], ["Bukti independen dipilih", 68], ["Tidak mengikuti AI saat bukti lebih kuat", 22]],
  scenarios: [
    ["Pesan Keluarga Darurat", "92%", "+48%", "Percaya nomor baru"],
    ["QR Pembayaran", "81%", "+36%", "Tidak cek penerima"],
    ["Lowongan Kerja", "77%", "+42%", "Percaya logo/testimoni"],
    ["AI Bisa Salah", "69%", "+25%", "Terlalu percaya AI"],
  ],
};

function dashboardBar([label, value], variant = "") {
  return `<div class="dash-bar-row ${variant}"><div><span>${escapeHtml(label)}</span><b>${value}%</b></div><i style="--bar:${value}%"></i></div>`;
}

function dashboardPage() {
  return `<section class="page-hero dashboard-hero"><div class="page-shell"><p class="eyebrow">Prototype analytics simulation</p><h1>HADANGIN Insight Dashboard</h1><p>Dashboard simulatif untuk menunjukkan dampak pembelajaran MIL: bagaimana pengguna pause, verify, reflect, decide, dan mengurangi risiko forward impulsif.</p></div></section>
    <section class="section dashboard-section"><div class="page-shell">
      <div class="dashboard-note"><strong>Catatan demo</strong><span>Angka di halaman ini adalah data simulatif untuk pitch UNESCO. Saat backend ditambahkan, struktur ini dapat diisi dari event pemeriksaan nyata.</span></div>
      <div class="metric-grid">${dashboardData.summary.map(([label, value, note]) => `<article class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><p>${escapeHtml(note)}</p></article>`).join("")}</div>
      <div class="dashboard-grid two">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Before vs after</p><h2>Perubahan keputusan pengguna</h2><p>Dari respons reaktif menuju verifikasi atau berhenti sebelum share.</p></div><div class="judgment-compare"><section><h3>Sebelum J.E.D.A.</h3>${dashboardData.before.map((item) => dashboardBar(item, "before")).join("")}</section><section><h3>Sesudah AI Lens</h3>${dashboardData.after.map((item) => dashboardBar(item, "after")).join("")}</section></div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Pattern map</p><h2>Pola manipulasi dominan</h2><p>Insight untuk educator, komunitas, dan peneliti MIL.</p></div><div class="pattern-list">${dashboardData.patterns.map(([label, value]) => dashboardBar([label, value], "pattern")).join("")}</div></article>
      </div>
      <div class="dashboard-grid two compact">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Multimodal input</p><h2>Jenis konten diperiksa</h2></div><div class="media-donut" aria-label="Distribusi tipe media"><span>46%</span></div><div class="media-list">${dashboardData.media.map(([label, value]) => `<p><i style="--dot:${value}%"></i><span>${escapeHtml(label)}</span><b>${value}%</b></p>`).join("")}</div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">J.E.D.A. growth</p><h2>Skill literasi yang terbentuk</h2></div><div class="skill-list dashboard-skills">${dashboardData.jeda.map(([label, score, note]) => `<div class="skill-row"><span>${escapeHtml(label)}<small>${escapeHtml(note)}</small></span><div class="skill-bar"><i style="width:${score}%"></i></div><b>${score}</b></div>`).join("")}</div></article>
      </div>
      <div class="dashboard-grid two compact">
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Explainability engagement</p><h2>Apakah pengguna belajar dari clue?</h2></div><div class="explain-grid">${dashboardData.explainability.map(([label, value]) => `<div><strong>${value}%</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div></article>
        <article class="dashboard-card"><div class="dash-card-head"><p class="section-kicker">Workshop insight</p><h2>Ringkasan untuk kelas/komunitas</h2><p>Contoh simulasi sesi literasi digital berbasis skenario QR Pembayaran.</p></div><div class="workshop-summary"><span>Peserta 32</span><span>47% langsung scan sebelum latihan</span><span>81% cek kasir/penerima sesudah latihan</span></div></article>
      </div>
      <article class="dashboard-card scenario-dashboard"><div class="dash-card-head"><p class="section-kicker">Scenario performance</p><h2>Skenario yang paling berguna untuk latihan</h2></div><div class="scenario-table"><div class="table-head"><span>Skenario</span><span>Completion</span><span>Risk shift</span><span>Common mistake</span></div>${dashboardData.scenarios.map(([name, completion, shift, mistake]) => `<div><span>${escapeHtml(name)}</span><b>${escapeHtml(completion)}</b><b>${escapeHtml(shift)}</b><span>${escapeHtml(mistake)}</span></div>`).join("")}</div></article>
    </div></section>`;
}

function trainingPage() {
  return `<section class="page-hero training-hero">
      <div class="training-3d-stage" id="training-3d-stage" role="img" aria-label="Arena Gobak Sodor 3D interaktif dengan empat penjaga J.E.D.A."><div class="training-3d-loading"><span></span><strong>Menyiapkan arena 3D</strong></div></div>
      <div class="training-3d-toolbar" aria-label="Kontrol arena 3D"><button type="button" data-3d-action="reset" aria-label="Atur ulang kamera" title="Atur ulang kamera">&#8635;</button><button type="button" data-3d-action="pause" aria-label="Jeda animasi" title="Jeda animasi">&#10074;&#10074;</button></div>
      <div class="training-3d-inspector" aria-live="polite"><span>Penjaga J.E.D.A.</span><strong>Pilih penjaga di arena</strong><p>Klik karakter untuk melihat tugasnya menghadang informasi.</p><button class="button button-small" type="button" data-scenario="family-emergency" disabled>Mulai Latihan</button></div>
      <div class="page-shell training-hero-inner"><div class="training-hero-copy"><p class="eyebrow">Latihan Hadang &middot; Arena 3D</p><h1>Latih Nalar Sebelum Situasi Nyata Datang.</h1><p>Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.</p><div class="training-hero-actions"><button class="button" type="button" data-scroll-to="training-arenas">Pilih Skenario <span aria-hidden="true">&#8595;</span></button><div class="training-hero-status"><span>8 arena</span><span>4 garis J.E.D.A.</span><span>Human First</span></div></div></div></div>
      <span class="training-hero-caption">Geser kamera &middot; Klik penjaga</span>
    </section>
    <section class="section training-arena-section" id="training-arenas"><div class="page-shell">
      <div class="section-header"><p class="section-kicker">8 skenario multimodal</p><h2>Pilih arena latihan</h2><p>Setiap arena membawa bentuk informasi yang berbeda. Tipe data, preview, pertanyaan J.E.D.A., dan hasil XAI akan mengikuti kasus yang dipilih.</p></div>
      <div class="scenario-grid">${scenarios.map((scenario) => `<article class="scenario-card ${scenario.featured ? "featured" : ""}" data-scenario-card="${scenario.id}"><div class="scenario-card-top"><span class="scenario-no">${scenario.no}</span><span class="scenario-format scenario-format-${scenario.inputType}">${escapeHtml(scenario.format)}</span></div><h3>${scenario.title}</h3><p>${scenario.description}</p><div class="scenario-source"><span>Sumber kasus</span><strong>${escapeHtml(scenario.source)}</strong></div><div class="scenario-mission"><span>Misi latihan</span><p>${escapeHtml(scenario.mission)}</p></div><div class="chip-row">${scenario.triggers.map((trigger) => `<span class="chip ${scenario.featured ? "chip-terra" : ""}">${trigger}</span>`).join("")}</div><button class="button ${scenario.featured ? "" : "button-secondary"}" data-scenario="${scenario.id}">Buka Arena ${escapeHtml(scenario.format)}</button></article>`).join("")}</div>
    </div></section>`;
}

function howPage() {
  const steps = [
    ["Masukkan Informasi", "Screenshot, teks, audio, QR, atau tautan menjadi konteks awal pemeriksaan."],
    ["Human First", "Buat keputusan dan ukur keyakinan sebelum melihat analisis otomatis."],
    ["Hadang dengan J.E.D.A.", "Periksa jeda, emosi, data, dan aksi yang diminta informasi."],
    ["AI Lens", "AI membantu membaca sinyal, konteks, pola forensik, dan ketidakpastian."],
    ["Human Final", "Bandingkan penalaranmu, sinyal AI, dan bukti yang independen."],
    ["Reflect & Learn", "Lihat perubahan keputusan dan pola berpikir yang telah dilatih."],
  ];
  return `<section class="page-hero"><div class="page-shell"><p class="eyebrow">Cara Kerja</p><h1>Bagaimana HADANGIN Bekerja?</h1><p>HADANGIN adalah Indonesian-localized prototype dari AI Context Guard Web: menggabungkan psikologi, Media and Information Literacy, AI forensics, dan human judgment dalam satu alur reflektif.</p></div></section>
    <section class="section section-white"><div class="page-shell"><div class="context-bridge"><span>Proposal concept</span><strong>AI Context Guard Web</strong><i aria-hidden="true">&#8594;</i><span>Local experience</span><strong>HADANGIN + J.E.D.A.</strong></div><div class="steps-grid">${steps.map(([title, text]) => `<article class="step-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>
    <section class="section"><div class="page-shell"><div class="dark-band"><div class="section-header"><p class="section-kicker">Human-centered AI</p><h2>AI adalah Lensa, Bukan Hakim.</h2><p>Label “aman”, “hoaks”, atau “scam” dapat membantu, tetapi tidak otomatis membangun kemampuan menilai ketika teknologi tidak tersedia.</p></div><div class="dark-mini-grid"><article><h3>Detect</h3><p>AI membantu menemukan pola dan sinyal yang mungkin terlewat.</p></article><article><h3>Explain</h3><p>AI menjelaskan mengapa sinyal muncul dan menunjukkan batasnya.</p></article><article><h3>Question</h3><p>AI membantu pengguna tahu bukti apa yang perlu diverifikasi.</p></article></div><p class="dark-footer-line">Keputusan akhir tetap milik manusia.</p></div></div></section>`;
}

function aboutPage() {
  return `<section class="page-hero"><div class="page-shell"><p class="eyebrow">Tentang Inisiatif</p><h1>AI Context Guard Web yang Dilokalkan Menjadi HADANGIN</h1><p>HADANGIN adalah prototipe lokal dari konsep AI Context Guard Web untuk Indonesia: web ringan yang membantu masyarakat berhenti, berpikir, memverifikasi, dan mengambil keputusan dengan lebih sadar.</p></div></section>
    <section class="section section-white"><div class="page-shell"><div class="section-header"><p class="section-kicker">Masalah yang dihadapi</p><h2>Kesenjangan antara Informasi dan Tindakan</h2><p>Manipulasi digital sering berhasil bukan hanya karena terlihat meyakinkan, tetapi karena memanfaatkan urgency, fear, authority, trust, scarcity, atau emotional attachment.</p></div><div class="problem-flow"><div class="problem-node">INFORMASI</div><div class="problem-arrow">&#8594;</div><div class="problem-node pressure">TEKANAN PSIKOLOGIS</div><div class="problem-arrow">&#8594;</div><div class="problem-node risk">TINDAKAN IMPULSIF</div></div><div class="jeda-interrupt"><span class="jeda-badge">J.E.D.A.</span><p><strong>HADANGIN menyisipkan ruang berpikir.</strong><br>J.E.D.A. menerjemahkan prinsip proposal <em>Pause, Question, Check, Decide</em> ke pengalaman budaya hadang/gobak sodor agar informasi tertahan sebelum bergerak menuju tindakan berisiko.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="section-header"><p class="section-kicker">Prinsip produk</p><h2>Dibangun untuk memperkuat agensi manusia</h2></div><div class="principle-grid four"><article class="card principle-card"><h3>Accessible</h3><p>Mobile-first, hemat bandwidth, dan menggunakan bahasa yang sederhana.</p></article><article class="card principle-card"><h3>Reflective, Not Punitive</h3><p>Tidak mempermalukan pengguna ketika penilaian awalnya keliru.</p></article><article class="card principle-card"><h3>Human Agency</h3><p>AI mendukung keputusan, bukan mengambil alih keputusan.</p></article><article class="card principle-card"><h3>Locally Grounded</h3><p>Berangkat dari konteks digital Indonesia dengan prinsip yang dapat digunakan lintas budaya.</p></article></div></div></section>
    <section class="section section-dark"><div class="page-shell"><div class="section-header"><p class="section-kicker">Untuk siapa</p><h2>Literasi yang dekat dengan kehidupan digital sehari-hari</h2><p>Ditujukan bagi pengguna digital, anak muda, keluarga, komunitas, pendidik, organisasi pemuda, advokat MIL, peneliti, dan pemangku kebijakan.</p></div><div class="chip-row"><span class="chip chip-blue">Everyday Digital Users</span><span class="chip chip-blue">Youth &amp; Young Adults</span><span class="chip chip-blue">Family &amp; Community</span><span class="chip chip-terra">Educators</span><span class="chip chip-terra">MIL Advocates</span><span class="chip chip-terra">Researchers</span></div></div></section>`;
}

function startScenario(id) {
  const scenario = scenarios.find((item) => item.id === id) || scenarios[0];
  resetFlow();
  state.content = scenario.payload || scenario.content;
  state.casePrompt = scenario.content;
  state.inputType = scenario.inputType || "text";
  state.qrInputMode = scenario.inputMode || "link";
  state.fileName = "";
  state.imageDataUrl = "";
  state.audioDataUrl = "";
  state.qrImageDataUrl = "";
  state.scenarioId = scenario.id;
  state.aiWrong = Boolean(scenario.aiWrong);
  state.trainingScenario = true;
  state.inFlow = true;
  state.stage = 2;
  location.hash = "#/verify";
  if (routeFromHash() === "verify") render();
}

function updateSelected(key, value) {
  const map = {
    "initial-decision": "initialDecision",
    "neutral-impact": "neutralImpact",
    evidence: "evidence",
    "requested-action": "requestedAction",
    consequence: "consequence",
    "safer-action": "saferAction",
    "final-decision": "finalDecision",
    priority: "priority",
  };
  state[map[key]] = value;
  render({ preserveScroll: true });
}

function updateMulti(key, value) {
  const map = { pressure: "pressure", emotion: "emotion", reflection: "reflection" };
  const stateKey = map[key];
  const values = state[stateKey];
  if (values.includes(value)) state[stateKey] = values.filter((item) => item !== value);
  else if (key !== "reflection" || values.length < 2) state[stateKey] = [...values, value];
  else showToast("Pilih paling banyak dua faktor refleksi.");
  render({ preserveScroll: true });
}

window.addEventListener("hadang:vision-status", (event) => {
  const { kind, message } = event.detail;
  const stage = document.querySelector(".community-vision-stage");
  const dot = document.querySelector("[data-vision-status]");
  const text = document.querySelector("#vision-status-text");
  if (stage) stage.dataset.visionState = kind;
  if (dot) dot.dataset.visionStatus = kind;
  if (text) text.textContent = message;
});

window.addEventListener("hadang:vision-line-complete", (event) => {
  const line = event.detail?.line;
  if (!line || communityState.mode !== "vision" || communityState.completedLines.includes(line)) return;
  communityState.completedLines = [...communityState.completedLines, line];
  setCommunityVisionProgress(communityState.completedLines);
  showToast(`Garis ${line} berhasil dihadang dengan pose tubuh.`);
  render({ preserveScroll: true });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-theme-toggle]")) {
    setTheme(document.documentElement.dataset.theme === "light" ? "blue" : "light");
    return;
  }
  if (target.matches(".menu-toggle")) {
    const nav = document.querySelector(".main-nav");
    const open = nav.classList.toggle("open");
    target.setAttribute("aria-expanded", String(open));
    return;
  }
  if (target.dataset.scrollTo) {
    document.getElementById(target.dataset.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (target.dataset.communityAudience) {
    communityState.audience = target.dataset.communityAudience;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityDuration) {
    communityState.duration = target.dataset.communityDuration;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityPack) {
    communityState.packId = target.dataset.communityPack;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityMode) {
    communityState.playMode = target.dataset.communityMode;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityLine) {
    const line = target.dataset.communityLine;
    if (!communityState.completedLines.includes(line)) {
      communityState.completedLines = [...communityState.completedLines, line];
      setCommunityVisionProgress(communityState.completedLines);
    }
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityPrep !== undefined) {
    const item = Number(target.dataset.communityPrep);
    communityState.prepChecks = communityState.prepChecks.includes(item)
      ? communityState.prepChecks.filter((value) => value !== item)
      : [...communityState.prepChecks, item];
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityVote) {
    const [type, rawIndex, rawDelta] = target.dataset.communityVote.split(":");
    const index = Number(rawIndex);
    const delta = Number(rawDelta);
    communityState.votes[type][index] = Math.max(0, communityState.votes[type][index] + delta);
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityAnswer !== undefined) {
    communityState.selectedAnswer = Number(target.dataset.communityAnswer);
    stopCommunityTimer();
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.communityTactic) {
    communityState.revealedTactic = target.dataset.communityTactic;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.inputType) {
    const textarea = document.querySelector("#content-input");
    if (textarea) state.content = textarea.value.trim();
    const nextType = target.dataset.inputType;
    if (nextType !== state.inputType && ["image", "audio"].includes(nextType)) {
      state.fileName = "";
      state.imageDataUrl = "";
      state.audioDataUrl = "";
      state.content = "";
    }
    if (nextType === "text" && !state.content) state.content = DEFAULT_MESSAGE;
    state.inputType = nextType;
    state.trainingScenario = false;
    state.casePrompt = "";
    if (nextType === "audio") state.scenarioId = "audio-impersonation";
    if (nextType === "qr") state.scenarioId = state.qrInputMode === "image" ? "qr-payment" : "bank-message";
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.xaiMode) {
    state.xaiMode = target.dataset.xaiMode;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.audioXaiMode) {
    state.audioXaiMode = target.dataset.audioXaiMode;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.qrXaiMode) {
    state.qrXaiMode = target.dataset.qrXaiMode;
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.qrInputMode) {
    state.qrInputMode = target.dataset.qrInputMode;
    state.qrXaiMode = "risk";
    state.fileName = "";
    state.qrImageDataUrl = "";
    state.content = "";
    state.scenarioId = state.qrInputMode === "image" ? "qr-payment" : "bank-message";
    state.trainingScenario = false;
    state.casePrompt = "";
    render({ preserveScroll: true });
    return;
  }
  if (target.dataset.select) {
    updateSelected(target.dataset.select, target.dataset.value);
    return;
  }
  if (target.dataset.multi) {
    updateMulti(target.dataset.multi, target.dataset.value);
    return;
  }
  if (target.dataset.gameControl) {
    const control = target.dataset.gameControl;
    if (control === "block") blockInformation();
    else if (arenaRuntime) {
      arenaRuntime.guardY = Math.min(70, Math.max(31, arenaRuntime.guardY + (control === "down" ? 9 : -9)));
      state.guardY = arenaRuntime.guardY;
    }
    return;
  }
  if (target.dataset.scenario) {
    startScenario(target.dataset.scenario);
    return;
  }

  const action = target.dataset.action;
  if (!action) return;
  if (action === "start-community") {
    const participantInput = document.querySelector("#community-participants");
    const teamArusInput = document.querySelector("#community-team-arus");
    const teamHadangInput = document.querySelector("#community-team-hadang");
    const participants = Math.min(120, Math.max(4, Number(participantInput?.value) || 24));
    communityState.participants = participants;
    communityState.teamArus = teamArusInput?.value.trim() || "Tim Arus";
    communityState.teamHadang = teamHadangInput?.value.trim() || "Tim Hadang";
    communityState.mode = communityState.playMode === "vision" ? "vision" : "prepare";
    communityState.phase = 0;
    communityState.prepChecks = [];
    communityState.round = 1;
    communityState.scores = { arus: 0, hadang: 0 };
    communityState.completedLines = [];
    communityState.visionUsed = false;
    communityState.votes = { initial: [0, 0, 0, 0], final: [0, 0, 0, 0] };
    render();
    setTimeout(() => document.querySelector(communityState.mode === "vision" ? ".community-live" : ".offline-prep")?.scrollIntoView(), 0);
  } else if (action === "community-next") {
    if (communityState.mode === "prepare") startCommunityRound(false);
    else if (communityState.phase === 0) {
      communityState.phase = 1;
      resetCommunityLine();
    } else if (communityState.phase === 2) communityState.phase = 3;
    else if (communityState.phase === 3) {
      if (!communityState.finalBonusApplied) {
        const safe = communityState.votes.final[1] + communityState.votes.final[2];
        const risky = communityState.votes.final[0];
        if (safe > risky) communityState.scores.hadang += 2;
        else if (risky > safe) communityState.scores.arus += 2;
        communityState.finalBonusApplied = true;
      }
      communityState.phase = 4;
    }
    render({ preserveScroll: true });
  } else if (action === "reset-community") {
    stopCommunityTimer();
    stopCommunityVision();
    communityState.mode = "setup";
    communityState.playMode = "offline";
    communityState.phase = 0;
    communityState.round = 1;
    communityState.scores = { arus: 0, hadang: 0 };
    communityState.prepChecks = [];
    communityState.completedLines = [];
    render();
  } else if (action === "community-vision-next") {
    if (communityState.phase === 1 && communityState.completedLines.length < 4) return;
    communityState.phase = Math.min(3, communityState.phase + 1);
    render({ preserveScroll: true });
  } else if (action === "toggle-community-camera") {
    if (isCommunityVisionActive()) {
      stopCommunityVision();
      render({ preserveScroll: true });
    } else {
      startCommunityVision(communityState.completedLines).then((started) => {
        if (started) {
          communityState.visionUsed = true;
          const button = document.querySelector('[data-action="toggle-community-camera"]');
          if (button) button.textContent = "Matikan Kamera";
        }
      });
    }
  } else if (action === "download-community-kit") {
    downloadCommunityKit();
  } else if (action === "print-community-kit") {
    printCommunityKit();
  } else if (action === "community-timer") {
    toggleCommunityTimer();
  } else if (action === "community-pressure") {
    communityState.pressureUsed = true;
    communityState.timerRemaining = Math.max(0, communityState.timerRemaining - 5);
    target.disabled = true;
    updateCommunityTimerDisplay();
    showToast("Kartu tekanan dimainkan: waktu Tim Hadang berkurang 5 detik.");
    if (communityState.timerRemaining === 0) resolveCommunityLine(true);
  } else if (action === "community-lock-answer") {
    resolveCommunityLine(false);
  } else if (action === "community-next-line") {
    if (communityState.lineIndex < 3) {
      communityState.lineIndex += 1;
      resetCommunityLine();
    } else {
      communityState.phase = 2;
      stopCommunityTimer();
    }
    render({ preserveScroll: true });
  } else if (action === "community-swap-round") {
    communityState.round += 1;
    startCommunityRound(true);
    render();
  } else if (action === "focus-question") {
    if (!state.gameRoundComplete && state.hadangStep >= 0) {
      blockInformation();
      showToast("Tangkap token informasi terlebih dahulu.");
      return;
    }
    if (!state.questionOpen) {
      state.questionOpen = true;
      render({ preserveScroll: true });
      return;
    }
    const panel = document.querySelector("#game-question-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    panel?.classList.add("panel-attention");
    setTimeout(() => panel?.classList.remove("panel-attention"), 600);
  } else if (action === "hide-question") {
    state.questionOpen = false;
    render({ preserveScroll: true });
  } else if (action === "retry-round") {
    resetArenaRound(true);
    render({ preserveScroll: true });
  } else if (action === "remove-image") {
    state.fileName = "";
    state.imageDataUrl = "";
    state.content = "";
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  } else if (action === "remove-audio") {
    state.fileName = "";
    state.audioDataUrl = "";
    state.content = "";
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  } else if (action === "remove-qr") {
    state.fileName = "";
    state.qrImageDataUrl = "";
    state.content = "";
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  } else if (action === "direct-ai" || action === "start-check") {
    const textarea = document.querySelector("#content-input");
    if (textarea?.value.trim()) state.content = textarea.value.trim();
    if (["image", "audio"].includes(state.inputType) && !state.fileName) return showToast("Pilih file terlebih dahulu.");
    if (state.inputType === "qr" && state.qrInputMode === "image" && !state.fileName) return showToast("Pilih gambar QR terlebih dahulu.");
    if (state.inputType === "qr" && state.qrInputMode === "link" && !state.content.trim().match(/^https?:\/\//i)) return showToast("Masukkan tautan yang valid, diawali http:// atau https://.");
    if (!state.content && !state.fileName) return showToast("Masukkan konten atau pilih file terlebih dahulu.");
    state.directDetection = action === "direct-ai";
    state.inFlow = true;
    state.stage = state.directDetection ? 4 : 2;
    render();
  } else if (action === "back-to-input") {
    state.inFlow = false;
    state.directDetection = false;
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  } else if (action === "switch-to-plus") {
    state.directDetection = false;
    state.inFlow = true;
    state.stage = 2;
    state.initialDecision = "";
    render();
  } else if (action === "cancel-flow") {
    resetFlow(); render();
  } else if (action === "lock-initial") {
    state.stage = 3; state.hadangStep = -1; render();
  } else if (action === "enter-arena") {
    state.hadangStep = 0;
    state.gameScore = 0;
    state.gameLives = 3;
    state.gameCombo = 1;
    state.gameCatches = 0;
    resetArenaRound(false);
    render();
  } else if (action === "hadang-back") {
    if (state.hadangStep > 0) {
      state.hadangStep -= 1;
      resetArenaRound(false);
      state.questionOpen = true;
    }
    else state.hadangStep = -1;
    if (state.hadangStep === -1) state.questionOpen = true;
    render();
  } else if (action === "hadang-next") {
    if (state.hadangStep < 3) {
      state.hadangStep += 1;
      resetArenaRound(false);
    }
    else state.stage = 4;
    if (state.stage !== 4) state.questionOpen = false;
    render();
  } else if (action === "back-to-hadang") {
    state.stage = 3; state.hadangStep = 3; render();
  } else if (action === "compare-judgment") {
    state.stage = 5; render();
  } else if (action === "back-to-ai") {
    state.stage = 4; render();
  } else if (action === "lock-final") {
    state.stage = 6; render();
  } else if (action === "back-to-final") {
    state.stage = 5; render();
  } else if (action === "show-result") {
    state.result = true; render();
  } else if (action === "restart-flow") {
    const content = state.content;
    resetFlow();
    state.content = content;
    render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("#content-input")) {
    state.content = event.target.value;
    state.scenarioId = state.inputType === "qr" ? "bank-message" : "family-emergency";
    state.aiWrong = false;
    state.trainingScenario = false;
    state.casePrompt = "";
  }
  if (event.target.dataset.range === "initial-confidence") {
    state.initialConfidence = Number(event.target.value);
    event.target.closest(".confidence-box").querySelector(".confidence-value").textContent = `${state.initialConfidence}% yakin`;
  }
  if (event.target.dataset.range === "final-confidence") {
    state.finalConfidence = Number(event.target.value);
    event.target.closest(".confidence-box").querySelector(".confidence-value").textContent = `${state.finalConfidence}% yakin`;
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#file-input")) {
    const file = event.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  }
});

function processUploadedFile(file) {
  if (file.size > 10 * 1024 * 1024) return showToast("Ukuran file melebihi batas 10 MB.");
  const expectsImage = state.inputType === "image" || (state.inputType === "qr" && state.qrInputMode === "image");
  const expectsAudio = state.inputType === "audio";
  if (expectsImage && !file.type.startsWith("image/")) return showToast("Pilih file gambar PNG, JPG, atau WEBP.");
  if (expectsAudio && !file.type.startsWith("audio/")) return showToast("Pilih file audio MP3, WAV, atau M4A.");
  state.fileName = file.name;
  state.content = `${expectsAudio ? "Rekaman audio" : state.inputType === "qr" ? "Gambar QR" : "Gambar"}: ${file.name}`;
  state.scenarioId = expectsAudio ? "audio-impersonation" : state.inputType === "qr" ? "qr-payment" : "manipulated-media";
  state.aiWrong = false;
  state.trainingScenario = false;
  state.casePrompt = "";
  state.xaiMode = "bounding";
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (expectsAudio) state.audioDataUrl = String(reader.result);
    else if (state.inputType === "qr") state.qrImageDataUrl = String(reader.result);
    else state.imageDataUrl = String(reader.result);
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  }, { once: true });
  reader.addEventListener("error", () => showToast("File tidak dapat dibaca."), { once: true });
  reader.readAsDataURL(file);
}

document.addEventListener("dragover", (event) => {
  const zone = event.target.closest?.("[data-drop-zone]");
  if (!zone || !["image", "audio", "qr"].includes(state.inputType)) return;
  event.preventDefault();
  zone.classList.add("drag-active");
});

document.addEventListener("dragleave", (event) => {
  const zone = event.target.closest?.("[data-drop-zone]");
  if (!zone || zone.contains(event.relatedTarget)) return;
  zone.classList.remove("drag-active");
});

document.addEventListener("drop", (event) => {
  const zone = event.target.closest?.("[data-drop-zone]");
  if (!zone || !["image", "audio", "qr"].includes(state.inputType)) return;
  event.preventDefault();
  zone.classList.remove("drag-active");
  const file = event.dataTransfer?.files?.[0];
  if (file) processUploadedFile(file);
});

document.addEventListener("pointermove", (event) => {
  const stage = event.target.closest?.(".hadang-game-stage");
  if (!stage || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = stage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * -12;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
  stage.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
  stage.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
});

document.addEventListener("pointerout", (event) => {
  const stage = event.target.closest?.(".hadang-game-stage");
  if (!stage || stage.contains(event.relatedTarget)) return;
  stage.style.setProperty("--scene-x", "0px");
  stage.style.setProperty("--scene-y", "0px");
});

document.addEventListener("keydown", (event) => {
  if (!arenaRuntime || !["ArrowUp", "ArrowDown", "w", "W", "s", "S", " "].includes(event.key)) return;
  event.preventDefault();
  if (event.key === " ") blockInformation();
  else arenaKeys.add(event.key.toLowerCase());
});

document.addEventListener("keyup", (event) => {
  arenaKeys.delete(event.key.toLowerCase());
});

document.addEventListener("pointerdown", (event) => {
  const control = event.target.closest?.("[data-game-control]")?.dataset.gameControl;
  if (!arenaRuntime || !["up", "down"].includes(control)) return;
  event.preventDefault();
  arenaKeys.add(control === "up" ? "arrowup" : "arrowdown");
});

document.addEventListener("pointerup", () => {
  arenaKeys.delete("arrowup");
  arenaKeys.delete("arrowdown");
});

window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#/verify");
render();

// Exposed only for the local browser regression harness.
Object.assign(window, { DEFAULT_MESSAGE, state, render, resetFlow, startScenario, processUploadedFile });
