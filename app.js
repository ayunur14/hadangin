import {
  isCommunityVisionActive,
  mountCommunityVision,
  setCommunityVisionProgress,
  startCommunityVision,
  stopCommunityVision,
  suspendCommunityVision,
} from "./community-vision.js";
import GENERATED_ENGLISH from "./translations-en.json";
import CURATED_ENGLISH from "./translations-curated-en.json";

const DEFAULT_MESSAGE = "Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!";
const OFFLINE_KIT_URL = new URL("./assets/hadangin-offline-kit.png", import.meta.url).href;
const COMMUNITY_TUTORIAL_SCENES = [
  { src: new URL("./assets/community-tutorial/01-prepare-arena.png", import.meta.url).href, title: "Siapkan arena", description: "Fasilitator membuat lapangan enam petak, menata empat checkpoint J.E.D.A., lalu memastikan kartu, token, timer, dan papan skor siap." },
  { src: new URL("./assets/community-tutorial/02-brief-teams.png", import.meta.url).href, title: "Bagi peran", description: "Tim Hadang menjaga garis. Tim Arus menunggu di area masuk sambil menerima kartu informasi yang harus dibawa menuju tindakan." },
  { src: new URL("./assets/community-tutorial/03-carry-information.png", import.meta.url).href, title: "Mulai bergerak", description: "Satu pembawa informasi mencoba melewati setiap batas. Penjaga bergerak hanya di garisnya dan menghadang tanpa kontak fisik." },
  { src: new URL("./assets/community-tutorial/04-pause-checkpoint.png", import.meta.url).href, title: "Hadang dan jeda", description: "Saat tertahan, semua gerak berhenti. Fasilitator membuka kartu J.E.D.A. dan pemain menjawab tantangan sebelum boleh melanjutkan." },
  { src: new URL("./assets/community-tutorial/05-check-evidence.png", import.meta.url).href, title: "Periksa bukti", description: "Pemain membandingkan sumber, mencari bukti independen, dan menjelaskan alasan mereka. Informasi tidak lolos hanya karena terdengar meyakinkan." },
  { src: new URL("./assets/community-tutorial/06-reflect-switch.png", import.meta.url).href, title: "Putuskan dan refleksikan", description: "Kelompok menempatkan informasi pada keputusan akhir, membahas perubahan penilaian, lalu bertukar peran untuk ronde berikutnya." },
];
const HERO_VIDEO_URL = new URL("./assets/tolong_buatkan_video_songnya.mp4", import.meta.url).href;
const HADANGIN_MARK_URL = new URL("./guidance/Logo_only_vector.svg", import.meta.url).href;
const HADANGIN_WORDMARK_URL = new URL("./guidance/HADANGIN_CAPT_HORIZONTAL.svg", import.meta.url).href;
const GOBAK_SODOR_IDENTITY_URL = new URL("./assets/gobak-sodor-identity.png", import.meta.url).href;

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
  return state.trainingScenario ? activeProfile() : adaptiveProfile();
}

function analysisDetection() {
  return state.trainingScenario ? activeDetection() : adaptiveDetection();
}

function safeHostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "domain-belum-terbaca";
  }
}

const adaptiveSignalRules = [
  { key: "urgency", label: "Tekanan waktu", pattern: /\b(sekarang|segera|cepat|hari ini|30 menit|terakhir|urgent|now|immediately|today|limited time)\b/i },
  { key: "money", label: "Permintaan finansial", pattern: /\b(transfer|rekening|bayar|pembayaran|deposit|investasi|rp\s?\d+|uang|payment|pay|bank|investment)\b/i },
  { key: "credential", label: "Data sensitif", pattern: /\b(otp|pin|password|kata sandi|verifikasi identitas|login|kode keamanan|credential)\b/i },
  { key: "link", label: "Tautan eksternal", pattern: /(https?:\/\/|www\.|bit\.ly|tinyurl|klik tautan|click link)/i },
  { key: "identity", label: "Klaim identitas", pattern: /\b(mama|ayah|keluarga|bank|polisi|admin|hrd?|perusahaan|kasir|tokoh publik|official|customer service)\b/i },
  { key: "secrecy", label: "Menghambat verifikasi", pattern: /\b(jangan telepon|jangan bilang|rahasia|jangan cek|jangan tanya|do not call|keep this secret)\b/i },
  { key: "viral", label: "Tekanan membagikan", pattern: /\b(sebarkan|bagikan|viral|share|forward|sebelum dihapus|mereka menutupi)\b/i },
  { key: "scarcity", label: "Kelangkaan", pattern: /\b(terbatas|slot terakhir|kesempatan terakhir|hanya hari ini|limited|last chance)\b/i },
  { key: "emotion", label: "Pemicu emosi", pattern: /\b(kecelakaan|darurat|ancaman|takut|panik|hadiah|menang|gratis|emergency|fear|prize|winner)\b/i },
];

function clampNumber(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function stableHash(value) {
  return [...String(value)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
}

function adaptiveSourceText() {
  return [state.content, state.fileName, state.mediaContext].filter(Boolean).join(" ").trim();
}

function adaptiveSignals() {
  const source = adaptiveSourceText();
  return adaptiveSignalRules.flatMap((rule) => {
    const match = source.match(rule.pattern);
    return match ? [{ ...rule, token: match[0] }] : [];
  });
}

function inferAnalysisPreset() {
  if (state.trainingScenario) return state.scenarioId;
  const source = adaptiveSourceText().toLowerCase();
  const matches = (pattern) => pattern.test(source);

  if (state.inputType === "qr" && state.qrInputMode === "image") return "qr-payment";
  if (state.inputType === "audio") {
    if (matches(/mama|ayah|keluarga|kecelakaan|transfer|voice.?clone|penyamaran/)) return "audio-impersonation";
    if (matches(/bank|rekening|otp|login/)) return "bank-message";
    if (matches(/kerja|lowongan|rekrut|hrd?|deposit/)) return "job-offer";
    return "generic-audio";
  }
  if (state.inputType === "image") {
    if (matches(/qr|qris|payment|pembayaran|bayar/)) return "qr-payment";
    if (matches(/bank|rekening|otp|login|verifikasi/)) return "bank-message";
    if (matches(/kerja|lowongan|rekrut|hrd?|deposit/)) return "job-offer";
    if (matches(/viral|berita|news|share|forward|unggahan/)) return "viral-info";
    if (matches(/deepfake|investasi|tokoh|video|wajah|synthetic|manipul/)) return "manipulated-media";
    if (matches(/mama|ayah|keluarga|kecelakaan|darurat/)) return "family-emergency";
    return "generic-image";
  }
  if (state.inputType === "qr") {
    if (matches(/career|job|kerja|lowongan|rekrut/)) return "job-offer";
    if (matches(/news|viral|share|article/)) return "viral-info";
    return matches(/bank|secure|login|verify|otp|account|rekening/) ? "bank-message" : "generic-link";
  }
  if (matches(/pemberitahuan resmi|aplikasi resmi|official notice/)) return "ai-can-be-wrong";
  if (matches(/bank|rekening|otp|login|diblokir|verifikasi identitas/)) return "bank-message";
  if (matches(/lowongan|kerja|rekrut|hrd?|gaji|deposit|administrasi/)) return "job-offer";
  if (matches(/viral|sebarkan|bagikan|share|forward|sebelum dihapus|menutupi fakta/)) return "viral-info";
  if (matches(/mama|ayah|keluarga|kecelakaan|darurat|transfer/)) return "family-emergency";
  return "generic-text";
}

function presetBaseId(preset) {
  if (preset === "generic-image") return "manipulated-media";
  if (preset === "generic-audio") return "audio-impersonation";
  if (preset === "generic-link") return "bank-message";
  if (preset === "generic-text") return "viral-info";
  return preset;
}

function adaptiveInputDescription() {
  const meta = state.fileMeta || {};
  if (state.inputType === "image" || (state.inputType === "qr" && state.qrInputMode === "image")) {
    const dimensions = meta.width ? `${meta.width} x ${meta.height} px` : "dimensi sedang dibaca";
    return `${state.fileName || "gambar upload"} - ${dimensions}${meta.orientation ? `, ${meta.orientation}` : ""}`;
  }
  if (state.inputType === "audio") {
    const duration = Number.isFinite(meta.duration) ? `${Math.round(meta.duration)} detik` : "durasi belum terbaca";
    return `${state.fileName || "audio upload"} - ${duration}`;
  }
  if (state.inputType === "qr") return safeHostname(state.content);
  return (state.content || DEFAULT_MESSAGE).slice(0, 120);
}

function adaptiveTranscript(preset) {
  if (state.mediaContext) return state.mediaContext;
  if (preset === "audio-impersonation") return "Nak, ini keluarga. Ada keadaan darurat. Tolong transfer sekarang dan jangan telepon dulu.";
  if (preset === "bank-message") return "Akun Anda bermasalah. Lakukan verifikasi melalui tautan dan masukkan kode keamanan.";
  if (preset === "job-offer") return "Lamaran Anda diterima. Bayar biaya administrasi hari ini untuk mengamankan posisi.";
  return "Isi ucapan belum dapat ditranskripsi tanpa model speech-to-text. Simulasi memakai metadata file dan konteks yang diberikan pengguna.";
}

function adaptiveProfile() {
  const preset = inferAnalysisPreset();
  const base = scenarioProfiles[presetBaseId(preset)] || scenarioProfiles["family-emergency"];
  const signals = adaptiveSignals();
  const source = adaptiveSourceText() || DEFAULT_MESSAGE;
  const seed = stableHash(source);
  const generic = preset.startsWith("generic-");
  const heuristicScore = 54 + signals.reduce((score, signal) => score + ({ credential: 12, money: 10, secrecy: 10, urgency: 8, link: 8, identity: 6, viral: 7, scarcity: 6, emotion: 6 }[signal.key] || 4), 0) + (seed % 4);
  const score = clampNumber(generic ? heuristicScore : Math.round((base.aiScore + heuristicScore) / 2), 52, 95);
  const fallbackNotices = state.inputType === "image"
    ? [["File", state.fileName || "Gambar upload"], ["Visual", `${state.fileMeta?.hotspots?.length || 0} area kontras dipetakan lokal`], ["Source", "Asal dan konteks gambar belum dikonfirmasi"], ["Action", "Ajakan perlu dibaca dari konteks lengkap"]]
    : state.inputType === "audio"
      ? [["File", state.fileName || "Audio upload"], ["Duration", Number.isFinite(state.fileMeta?.duration) ? `${Math.round(state.fileMeta.duration)} detik` : "Belum terbaca"], ["Identity", "Kemiripan suara bukan bukti identitas"], ["Context", "Transkrip aktual memerlukan speech-to-text"]]
      : state.inputType === "qr"
        ? [["Host", safeHostname(state.content)], ["Protocol", state.content.startsWith("https://") ? "HTTPS terdeteksi" : "Koneksi tidak terenkripsi"], ["Identity", "Pemilik tujuan belum dikonfirmasi"], ["Action", "Jangan membuka tautan dari pesan"]]
        : [["Language", "Klaim memerlukan konteks"], ["Source", "Sumber primer belum terlihat"], ["Identity", "Identitas pengirim perlu dikonfirmasi"], ["Action", "Tentukan tindakan yang sebenarnya diminta"]];
  const signalNotices = signals.map((signal) => [signal.label, `Kata/frasa terdeteksi: "${signal.token}"`]);
  const aiNotices = [...signalNotices, ...fallbackNotices].filter((item, index, list) => list.findIndex(([label]) => label === item[0]) === index).slice(0, 4);
  const excerpt = source.replace(/\s+/g, " ").trim().slice(0, 150);
  const neutralVersion = preset === "generic-image"
    ? "Sebuah gambar memuat informasi yang sumber, konteks, dan ajakannya masih perlu diperiksa."
    : preset === "generic-audio"
      ? "Sebuah rekaman audio memuat klaim atau permintaan yang belum memiliki konteks lengkap."
      : preset === "generic-link"
        ? `Sebuah tautan mengarah ke ${safeHostname(state.content)} dan belum diverifikasi kepemilikannya.`
        : preset === "generic-text"
          ? "Sebuah pesan menyampaikan klaim yang belum disertai sumber independen."
          : base.neutralVersion;

  return {
    ...base,
    neutralOriginal: excerpt.toUpperCase(),
    neutralVersion,
    claim: generic ? `Konten "${adaptiveInputDescription()}" menyampaikan informasi yang konteks dan sumbernya belum lengkap.` : base.claim,
    aiNotices,
    aiLevel: score >= 80 ? "High" : score >= 66 ? "Medium" : "Context Needed",
    aiScore: score,
    unknowns: generic ? ["Makna penuh konten tanpa OCR, speech-to-text, atau akses halaman tujuan.", "Identitas pembuat dan sumber asli.", "Konteks sebelum dan sesudah konten.", "Apakah pola visual atau bahasa memiliki penjelasan yang wajar."] : base.unknowns,
    verification: generic ? ["Cari sumber asli melalui kanal terpisah.", "Periksa identitas pengirim atau penerbit.", "Baca konteks lengkap sebelum bertindak.", "Jangan gunakan skor simulasi sebagai bukti final."] : base.verification,
  };
}

function adaptiveHighlightPositions(count, seed) {
  return Array.from({ length: count }, (_, index) => ({
    x: 10 + ((seed + index * 29) % 48),
    y: 15 + ((Math.floor(seed / 7) + index * 23) % 55),
    w: 28 + ((seed + index * 11) % 20),
    h: 13 + ((seed + index * 7) % 9),
  }));
}

function adaptiveDetection() {
  const preset = inferAnalysisPreset();
  const base = detectionProfiles[presetBaseId(preset)] || detectionProfiles["family-emergency"];
  const profile = adaptiveProfile();
  const signals = adaptiveSignals();
  const source = adaptiveSourceText() || DEFAULT_MESSAGE;
  const meta = state.fileMeta || {};
  const inputName = adaptiveInputDescription();
  const generic = preset.startsWith("generic-");
  const signalDetails = signals.length
    ? signals.slice(0, 3).map((signal) => ({ label: signal.label, detail: `Sinyal berasal dari kata atau konteks "${signal.token}" pada input.` }))
    : [
        { label: "Konteks", detail: "Sumber dan konteks lengkap belum tersedia pada input." },
        { label: "Identitas", detail: "Pembuat atau pengirim belum dapat dikonfirmasi secara independen." },
        { label: "Aksi", detail: "Periksa tindakan yang diminta sebelum klik, transfer, scan, atau membagikan." },
      ];
  const positions = state.inputType === "image" && meta.hotspots?.length
    ? meta.hotspots
    : adaptiveHighlightPositions(signalDetails.length, stableHash(source));
  const highlights = signalDetails.map((item, index) => ({ ...item, ...(positions[index] || positions[0]) }));
  const typeLabel = state.inputType === "image" ? "gambar" : state.inputType === "audio" ? "audio" : state.inputType === "qr" ? (state.qrInputMode === "image" ? "QR" : "tautan") : "teks";
  const signalSummary = profile.aiNotices.map(([label]) => label.toLowerCase()).slice(0, 3).join(", ");
  let summary = `Pemindaian heuristik lokal menyesuaikan hasil terhadap ${typeLabel} "${inputName}" dan menemukan sinyal ${signalSummary}.`;
  if (state.inputType === "image" && meta.width) summary += ` Gambar berorientasi ${meta.orientation} dengan ${meta.hotspots?.length || 0} area kontras utama.`;
  if (state.inputType === "audio" && Number.isFinite(meta.duration)) summary += ` Durasi metadata terbaca ${Math.round(meta.duration)} detik.`;
  if (generic) summary += " Makna semantik tetap perlu diverifikasi karena backend model belum terhubung.";

  return {
    ...base,
    mode: state.inputType === "image" ? "media" : state.inputType === "audio" ? "audio" : state.inputType === "qr" ? (state.qrInputMode === "image" ? "qr" : "link") : base.mode,
    title: state.inputType === "qr" && state.qrInputMode === "link" ? `Pemetaan risiko ${safeHostname(state.content)}` : `Analisis adaptif: ${state.fileName || typeLabel}`,
    subtitle: "Simulasi heuristik frontend yang mengikuti input",
    summary,
    confidenceLabel: "Adaptive risk signal",
    highlights,
    clues: profile.aiNotices.map(([label, value]) => `${label}: ${value}`),
    reflectiveQuestions: [
      `Apa sumber independen untuk memeriksa ${state.fileName || safeHostname(state.content) || "konten ini"}?`,
      "Apakah sinyal yang terlihat cukup untuk membenarkan tindakan yang diminta?",
      "Apa penjelasan alternatif jika prediksi simulasi ini salah?",
    ],
    transcript: adaptiveTranscript(preset),
    patternLabel: signals.length ? signals.slice(0, 2).map((signal) => signal.label).join(" + ") : "Konteks + identitas",
  };
}

function currentScenario() {
  return scenarios.find((item) => item.id === state.scenarioId) || scenarios[0];
}

const state = {
  route: "verify",
  inputType: "text",
  content: DEFAULT_MESSAGE,
  fileName: "",
  fileMeta: null,
  mediaContext: "",
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

const LANGUAGE_STORAGE_KEY = "hadangin-language";
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
let applyingLanguage = false;

const ENGLISH_PHRASES = new Map([
  ["Lewati ke konten", "Skip to content"], ["Verifikasi", "Verify"], ["Latihan Hadang", "Hadang Training"],
  ["Komunitas", "Community"], ["Cara Kerja", "How It Works"], ["Tentang", "About"], ["Mulai Verifikasi", "Start Verification"],
  ["Hadang Sebelum Terjebak", "Intercept Before You Get Trapped"], ["Mulai Pemeriksaan", "Start Checking"], ["Coba Latihan", "Try Training"],
  ["Gulir untuk memahami alur", "Scroll to understand the flow"], ["Sebelum mulai", "Before you begin"],
  ["Periksa Informasi Mencurigakan", "Check Suspicious Information"], ["Pilih jenis konten", "Choose content type"],
  ["Pilih cara pemeriksaan", "Choose a checking method"], ["Pemrosesan lokal", "Local processing"],
  ["Deteksi AI", "AI Detection"], ["Prediksi + XAI langsung", "Instant prediction + XAI"],
  ["Bentuk penilaian awal", "Form an initial judgment"], ["Question & check", "Question & Check"],
  ["Bandingkan, lalu putuskan", "Compare, then decide"], ["Tempel Tautan", "Paste Link"], ["Upload QR", "Upload QR"],
  ["QR siap diperiksa", "QR ready to check"], ["Ganti QR", "Replace QR"], ["Upload gambar QR", "Upload QR image"],
  ["Pilih Gambar QR", "Choose QR Image"], ["Alamat tujuan yang ingin diperiksa", "Destination address to check"],
  ["Pratinjau aman: tanpa membuka situs tujuan", "Safe preview: destination site is not opened"],
  ["Rekaman siap diperiksa", "Recording ready to check"], ["Ganti Audio", "Replace Audio"],
  ["Gambar siap diperiksa", "Image ready to check"], ["Ganti Gambar", "Replace Image"], ["Pilih File", "Choose File"],
  ["Human First", "Human First"], ["AI Second", "AI Second"], ["Human Final", "Human Final"],
  ["Sebelum AI Membantu", "Before AI Helps"], ["Apa respons pertamamu jika ini terjadi di dunia nyata?", "What would your first response be if this happened in real life?"],
  ["Seberapa yakin kamu dengan keputusan itu?", "How confident are you in that decision?"], ["Kembali", "Back"],
  ["Kunci Penilaian Awal", "Lock Initial Judgment"], ["Gambar yang diperiksa", "Image Being Checked"],
  ["Rekaman yang diperiksa", "Recording Being Checked"], ["Transkrip simulasi", "Simulated transcript"],
  ["QR yang diperiksa", "QR Being Checked"], ["Tautan yang diperiksa", "Link Being Checked"],
  ["Informasi yang diperiksa", "Information Being Checked"], ["Bagikan", "Share"], ["belum yakin", "not confident yet"],
  ["STATUS ARENA", "ARENA STATUS"], ["SKOR", "SCORE"], ["NYAWA", "LIVES"], ["POS PENJAGA", "GUARD POST"],
  ["Buka Pertanyaan", "Open Question"], ["MISI HADANGIN", "HADANGIN MISSION"], ["Mulai Permainan", "Start Game"],
  ["Jangan biarkan lolos", "Do not let it pass"], ["MISI GAGAL", "MISSION FAILED"], ["Ulangi Ronde", "Retry Round"],
  ["Garis 01 - Jeda", "Line 01 - Pause"], ["Garis 02 - Emosi", "Line 02 - Emotion"], ["Garis 03 - Data", "Line 03 - Data"],
  ["Garis 04 - Aksi", "Line 04 - Action"], ["Berhenti sejenak dari dorongan bertindak", "Pause the urge to act"],
  ["Kenali emosi yang sedang dipancing", "Recognize the emotion being triggered"], ["Pisahkan klaim dari buktinya", "Separate claims from evidence"],
  ["Lihat tindakan dan konsekuensinya", "Consider the action and its consequences"], ["Tanpa tekanan emosi", "Without emotional pressure"],
  ["Klaim", "Claim"], ["Bukti independen", "Independent evidence"], ["Pertanyaan reflektif", "Reflective questions"],
  ["Visual Penjelasan XAI", "XAI Explanation Visual"], ["Penjelasan Pola Audio", "Audio Pattern Explanation"],
  ["Penjelasan Risiko Tujuan", "Destination Risk Explanation"], ["Input pengguna", "User input"],
  ["Form kredensial", "Credential form"], ["Tujuan terbaca / simulasi", "Detected destination / simulation"],
  ["Host terbaca", "Detected host"], ["Pola terdeteksi", "Detected pattern"], ["Status", "Status"],
  ["Perlu verifikasi", "Needs verification"], ["Ganti Konten", "Change Content"], ["Hasil prediksi langsung", "Instant prediction result"],
  ["Keputusan akhir", "Final decision"], ["Keputusan final", "Final decision"], ["Lanjut Latihan", "Continue Training"],
  ["Periksa Lagi", "Check Again"], ["Tentang Inisiatif", "About the Initiative"], ["Untuk siapa", "Who It Is For"],
  ["Pilih Skenario", "Choose a Scenario"], ["Mulai Latihan", "Start Training"], ["Pilih penjaga di arena", "Choose a guard in the arena"],
  ["Mode permainan", "Game mode"], ["Arena Offline", "Offline Arena"], ["Arena Kamera AI", "AI Camera Arena"],
  ["Perkiraan peserta", "Estimated participants"], ["orang", "people"], ["Mode utama", "Main mode"],
  ["Persiapan", "Preparation"], ["Mulai Sesi", "Start Session"], ["Unduh Panduan", "Download Guide"],
  ["Tim", "Team"], ["Babak", "Round"], ["Pertanyaan", "Question"], ["Jawaban", "Answer"],
  ["Benar", "Correct"], ["Salah", "Incorrect"], ["Selanjutnya", "Next"], ["Selesai", "Finish"],
  ["Jeda", "Pause"], ["Emosi", "Emotion"], ["Data", "Evidence"], ["Aksi", "Action"],
  ["Darurat", "Emergency"], ["Ancaman", "Threat"], ["Hadiah", "Reward"],
  ["Kesempatan terbatas", "Limited opportunity"], ["Tekanan sosial", "Social pressure"], ["Tidak ada tekanan", "No pressure"],
  ["Takut", "Fear"], ["Panik", "Panic"], ["Kasihan", "Sympathy"], ["Percaya", "Trust"], ["Marah", "Anger"],
  ["Harapan", "Hope"], ["Penasaran", "Curiosity"], ["Kedekatan emosional", "Emotional attachment"], ["Tidak yakin", "Unsure"],
  ["Ya", "Yes"], ["Sedikit", "Slightly"], ["Tidak", "No"], ["Belum dipilih", "Not selected yet"],
  ["Transfer", "Transfer"], ["Klik", "Click"], ["Berikan OTP", "Provide OTP"], ["Share", "Share"], ["Scan", "Scan"],
  ["Download", "Download"], ["Kirim data pribadi", "Send personal data"], ["Investasi / pembelian", "Investment / purchase"],
  ["Kirim voice note balasan", "Send a voice-note reply"], ["Teruskan rekaman", "Forward the recording"],
  ["Kehilangan uang", "Losing money"], ["Akun diambil alih", "Account takeover"], ["Data pribadi bocor", "Personal data leak"],
  ["Misinformasi menyebar", "Misinformation spreading"], ["Pembayaran masuk ke pihak salah", "Payment sent to the wrong party"],
  ["Perangkat terinfeksi", "Device infection"], ["Saldo tertahan", "Funds being held"],
  ["Identitas disalahgunakan", "Identity misuse"], ["Reputasi pihak dirugikan", "Damage to someone's reputation"],
  ["Konflik meningkat", "Escalating conflict"], ["Mengabaikan pengumuman sah", "Ignoring a legitimate announcement"],
  ["Tidak ada risiko besar", "No major risk"], ["Kepanikan menyebar", "Panic spreading"],
  ["Telepon nomor tersimpan", "Call the saved number"], ["Buka aplikasi resmi sendiri", "Open the official app yourself"],
  ["Cari sumber independen", "Find an independent source"], ["Tunggu dan cek ulang", "Wait and check again"],
  ["Konfirmasi QR kepada kasir", "Confirm the QR with the cashier"], ["Batalkan dan cek ulang", "Cancel and check again"],
  ["Tolak biaya di muka", "Refuse upfront fees"], ["Tunda membagikan", "Delay sharing"], ["Tunda transfer", "Delay the transfer"],
  ["Hadang Garis 1", "Intercept Line 1"], ["Hadang Garis 2", "Intercept Line 2"], ["Hadang Garis 3", "Intercept Line 3"],
  ["Hadang Sebelum Bertindak", "Intercept Before Acting"],
  ["Bayangkan ada pesan yang membuatmu ingin langsung bertindak.", "Imagine receiving a message that makes you want to act immediately."],
  ["Metode J.E.D.A. menerjemahkan prinsip MIL menjadi pengalaman interaktif berbasis budaya hadang/gobak sodor.", "The J.E.D.A. method turns MIL principles into an interactive experience inspired by the Indonesian game hadang/gobak sodor."],
  ["Tujuannya bukan sekadar menemukan “hoaks” atau “bukan hoaks”, tetapi membangun kebiasaan berpikir: berhenti dulu, periksa konteks, gunakan AI sebagai lensa, lalu ambil keputusan sendiri.", "The goal is not simply to label something as a hoax or not, but to build a thinking habit: pause, check the context, use AI as a lens, and make your own decision."],
  ["Masukkan konten yang ingin kamu evaluasi. Pilih Deteksi AI untuk hasil langsung, atau AI Plus untuk alur Human First dan latihan J.E.D.A.", "Enter the content you want to evaluate. Choose AI Detection for an instant result, or AI Plus for the Human First flow and J.E.D.A. training."],
  ["Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.", "Content is processed only on this device for the simulation and is not sent to a server."],
  ["Keduanya menggunakan Explainable AI. AI Plus menambahkan latihan penalaran dan permainan J.E.D.A.", "Both use Explainable AI. AI Plus also includes reasoning exercises and the J.E.D.A. game."],
  ["Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.", "Your response and confidence are recorded before AI signals are shown."],
  ["Metode lokal untuk mengenali tekanan, emosi, data, dan risiko aksi.", "A localized method for recognizing pressure, emotion, evidence, and action risks."],
  ["AI memberi second opinion. Keputusan final tetap berada padamu.", "AI provides a second opinion. The final decision remains yours."],
  ["Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.", "We want to understand how you interpret this situation first."],
  ["AI belum akan ditampilkan sampai kamu menyelesaikan tahap berpikir awal.", "AI will not be shown until you complete the initial thinking stage."],
  ["Jangan biarkan informasi lolos menuju tindakan.", "Do not let information pass straight into action."],
  ["Gerakkan penjaga aktif di garisnya, tangkap token informasi, lalu jawab pertanyaan J.E.D.A. Jangan biarkan tiga token lolos menuju tindakan.", "Move the active guard along the line, catch information tokens, then answer the J.E.D.A. question. Do not let three tokens reach the action zone."],
  ["Tekanan waktu dapat mengurangi ruang untuk mengevaluasi informasi.", "Time pressure can reduce your ability to evaluate information."],
  ["Emosi bukan kesalahan. Mengenalinya membantu kamu menjaga jarak dari tekanan.", "Emotions are not a mistake. Recognizing them helps you step back from pressure."],
  ["Bukti yang baik tidak hanya berasal dari pihak yang membuat klaim.", "Good evidence does not come only from the party making the claim."],
  ["Pesan manipulatif sering dibuat untuk mempercepat aksi yang sulit dibatalkan.", "Manipulative messages often push people toward actions that are difficult to reverse."],
  ["Highlight menunjukkan area yang memengaruhi hasil analisis dan bukan merupakan bukti final.", "Highlights show areas that influence the analysis and are not final evidence."],
  ["Statistik dibuat untuk demonstrasi UI dan bukan hasil model produksi.", "These statistics are for UI demonstration and are not produced by a production model."],
  ["Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.", "This result skips the Human First exercise and game. Use the XAI explanation to decide what still needs verification."],
  ["AI adalah Lensa, Bukan Hakim.", "AI Is a Lens, Not a Judge."],
  ["Keputusan akhir tetap milik manusia.", "The final decision always belongs to people."],
  ["Latih Nalar Sebelum Situasi Nyata Datang.", "Train Your Judgment Before a Real Situation Arises."],
  ["Literasi yang dekat dengan kehidupan digital sehari-hari", "Literacy Grounded in Everyday Digital Life"],
  ["AI Context Guard Web yang Dilokalkan Menjadi HADANGIN", "AI Context Guard Web Localized as HADANGIN"],
  ["HADANGIN adalah prototipe lokal dari konsep AI Context Guard Web untuk Indonesia: web ringan yang membantu masyarakat berhenti, berpikir, memverifikasi, dan mengambil keputusan dengan lebih sadar.", "HADANGIN is an Indonesian prototype of the AI Context Guard Web concept: a lightweight website that helps people pause, think, verify, and make more informed decisions."],
  ["Identitas HADANGIN", "HADANGIN Identity"], ["Hadang Informasi. Jaga Keputusan.", "Intercept Information. Protect Decisions."],
  ["HADANGIN membantu masyarakat membangun refleks untuk berhenti, membaca konteks, memeriksa bukti, dan memilih tindakan yang lebih aman di tengah arus informasi digital.", "HADANGIN helps people build the reflex to pause, read the context, check evidence, and choose safer actions amid the flow of digital information."],
  ["Makna nama", "The Meaning Behind the Name"], ["HADANGIN adalah ajakan untuk berhenti sebelum bertindak.", "HADANGIN Is a Call to Pause Before Acting."],
  ["Nama HADANGIN berasal dari kata hadang: menahan sesuatu agar tidak langsung melewati batas. Akhiran percakapan -in membuatnya terdengar dekat, aktif, dan mudah diingat sebagai ajakan sehari-hari.", "The name HADANGIN comes from hadang: stopping something before it crosses a boundary. The conversational ending -in makes it feel approachable, active, and memorable as an everyday call to action."],
  ["Akar budaya Indonesia", "Indonesian Cultural Foundation"],
  ["HADANGIN terinspirasi oleh Gobak Sodor, permainan tradisional Indonesia tentang menghadang pergerakan melintasi batas. Prinsip itu kami terjemahkan menjadi intervensi perilaku digital: menghentikan reaksi impulsif sebelum manipulasi berubah menjadi tindakan.", "HADANGIN is inspired by Gobak Sodor, an Indonesian traditional game about intercepting movement across boundaries. We translate that into a behavioral digital intervention: stopping impulsive reactions before manipulation becomes action."],
  ["Gerak", "Movement"], ["Batas", "Boundary"], ["Hadang", "Intercept"], ["Perilaku digital", "Digital Behavior"], ["Informasi", "Information"], ["Tindakan aman", "Safe Action"],
  ["perlindungan yang menjadi tindakan", "protection put into action"],
  ["Menahan laju informasi manipulatif sebelum menjadi tindakan impulsif.", "Stopping manipulative information before it turns into impulsive action."],
  ["Membawa semangat permainan hadang atau gobak sodor ke dalam latihan literasi digital.", "Bringing the spirit of hadang or gobak sodor into digital literacy training."],
  ["Mengajak pengguna terlibat aktif, bukan sekadar menerima penilaian AI.", "Inviting users to participate actively instead of merely accepting an AI judgment."],
  ["Sistem identitas", "Identity System"], ["Simbol utama", "Primary Mark"], ["Logo horizontal", "Horizontal Logo"],
  ["Simbol perisai H HADANGIN", "HADANGIN H-shaped shield symbol"], ["Logo horizontal HADANGIN", "HADANGIN horizontal logo"],
  ["Perisai berbentuk H mewakili perlindungan, batas, dan ruang aman untuk berpikir. Huruf H adalah abstraksi visual dari garis batas dan garis penghubung lapangan Gobak Sodor, bukan salinan bentuk lapangannya.", "The H-shaped shield represents protection, boundaries, and a safe space to think. The letter H is a visual abstraction of the boundary and connecting lines in a Gobak Sodor court, not a literal copy of the court."],
  ["Wordmark memadukan simbol penjaga dengan nama yang tegas dan mudah dikenali.", "The wordmark combines the guard symbol with a clear and recognizable name."],
  ["Bahasa visual", "Visual Language"], ["Garis permainan menjadi sistem identitas.", "The Lines of Play Become an Identity System."],
  ["Elemen budaya diterjemahkan secara konsisten ke dalam bentuk, huruf, dan warna.", "One cultural idea, translated consistently through shape, type, and color."],
  ["Akar budaya", "Cultural Foundation"], ["Dari garis lapangan ke simbol H", "From Court Lines to the H Symbol"],
  ["Lapangan Gobak Sodor umumnya berbentuk persegi panjang yang dibagi menjadi enam petak, dengan garis horizontal yang dijaga dan satu garis vertikal tengah untuk penjaga sodor. Identitas HADANGIN tidak menyalin bentuk lapangan secara harfiah. Garis batas dan penghubungnya diabstraksikan menjadi huruf H: simbol untuk menghadang, memberi jeda, lalu menilai sebelum melintas.", "A Gobak Sodor court is typically a rectangle divided into six cells, with guarded horizontal lines and one central vertical line for the sodor guard. HADANGIN does not copy the court literally. Its boundary and connecting lines are abstracted into the letter H: a symbol for intercepting, pausing, and assessing before crossing."],
  ["Dua tim memainkan Gobak Sodor pada lapangan enam petak dengan garis horizontal dan garis vertikal tengah", "Two teams playing Gobak Sodor on a six-cell court with horizontal lines and one central vertical line"],
  ["Tim biru · Pembawa informasi", "Blue Team · Information Carriers"], ["Hoaks, scam, QR, audio, dan gambar manipulatif", "Hoaxes, scams, QR codes, audio, and manipulated images"],
  ["Tim hijau · Penjaga literasi", "Green Team · Literacy Guards"], ["Jeda, bertanya, periksa bukti, dan putuskan dengan aman", "Pause, question, check evidence, and decide safely"],
  ["Tipografi", "Typography"], ["Antarmuka digital", "Digital Interface"],
  ["Tipografi utama untuk judul, navigasi, dan teks antarmuka. Geometris, tegas, dan tetap mudah dibaca pada layar kecil.", "The primary typeface for headings, navigation, and interface text. Geometric, confident, and highly readable on small screens."],
  ["Palet warna", "Color Palette"], ["Navy Penjaga", "Guard Navy"], ["stabilitas & kepercayaan", "stability & trust"],
  ["Biru Aksi", "Action Blue"], ["kejelasan & aksi", "clarity & action"], ["Teal Jeda", "Pause Teal"], ["keseimbangan & rasa aman", "balance & safety"],
  ["Terakota Manusia", "Human Terracotta"], ["energi & kedekatan manusia", "energy & human warmth"], ["Putih Kanvas", "Canvas White"], ["keterbukaan & ruang bernapas", "openness & breathing room"],
  ["Teori warna lintas budaya", "Cross-cultural Color Theory"],
  ["Dalam desain digital global, navy dan biru sering dikaitkan dengan kepercayaan dan kejelasan; teal dengan keseimbangan dan rasa aman; terakota dengan energi serta kedekatan manusia; putih dengan keterbukaan.", "In global digital design, navy and blue are often associated with trust and clarity; teal with balance and safety; terracotta with energy and human warmth; and white with openness."],
  ["Makna warna dapat berbeda antarbudaya. Karena itu HADANGIN selalu memasangkan warna dengan label, ikon, dan kontras yang jelas.", "Color meanings can vary across cultures. HADANGIN therefore always pairs color with clear labels, icons, and contrast."],
  ["Warna + label + ikon", "Color + label + icon"],
  ["Dua mode, satu metode", "Two Modes, One Method"], ["Berlatih sendiri atau bergerak bersama.", "Practice Independently or Move Together."],
  ["Pilihan mode mengubah cara bermain, bukan prinsipnya. Keduanya melatih kebiasaan berhenti, memeriksa bukti, menggunakan AI sebagai lensa, lalu mengambil keputusan sendiri.", "The mode changes how people play, not the principle. Both build the habit of pausing, checking evidence, using AI as a lens, and making the final decision yourself."],
  ["Mode individu · 1 pemain", "Individual Mode · 1 Player"], ["Periksa dan latih keputusanmu sendiri.", "Check Information and Practice Your Own Decisions."],
  ["Gunakan ponsel atau laptop untuk memeriksa konten nyata maupun skenario latihan secara mandiri.", "Use a phone or laptop to check real content or work through a practice scenario independently."],
  ["Yang kamu lakukan", "What You Do"], ["Unggah konten", "Add Content"], ["Nilai sendiri", "Judge First"], ["Main J.E.D.A.", "Play J.E.D.A."], ["Bandingkan AI", "Compare AI"], ["Refleksi", "Reflect"],
  ["Format", "Format"], ["Deteksi AI cepat atau AI Plus dengan permainan J.E.D.A.", "Quick AI Detection or AI Plus with the J.E.D.A. game."],
  ["Cocok untuk", "Best For"], ["Keputusan sehari-hari, belajar mandiri, dan latihan singkat.", "Everyday decisions, independent learning, and short practice sessions."],
  ["Mulai mode individu", "Start Individual Mode"],
  ["Mode komunitas · 4–120 peserta", "Community Mode · 4–120 Participants"], ["Hadang informasi sebagai permainan tim.", "Intercept Information Through Team Play."],
  ["Fasilitator membagi peserta menjadi tim pembawa informasi dan tim penjaga literasi. Satu tim mencoba meloloskan skenario; tim lain menghadangnya dengan pertanyaan, bukti, dan tindakan aman.", "A facilitator divides participants into information carriers and literacy guards. One team tries to move a scenario through the arena; the other intercepts it with questions, evidence, and safer actions."],
  ["Yang kelompok lakukan", "What the Group Does"], ["Buat ruang", "Create Room"], ["Bagi tim", "Form Teams"], ["Mainkan arena", "Play the Arena"], ["Voting", "Vote"], ["Debrief", "Debrief"],
  ["Offline, hybrid, atau Arena Kamera berbasis computer vision.", "Offline, hybrid, or the computer-vision Camera Arena."],
  ["Keluarga, sekolah, organisasi pemuda, dan komunitas.", "Families, schools, youth organizations, and communities."], ["Siapkan mode komunitas", "Set Up Community Mode"],
  ["Metode yang sama pada kedua mode", "The Same Method in Both Modes"], ["Yang berubah hanya skala dan cara interaksi; keputusan tetap berada pada manusia.", "Only the scale and interaction change; the final decision always remains with people."],
  ["Arah gerak", "Our Direction"], ["Visi", "Vision"],
  ["Mewujudkan masyarakat digital yang tangguh, kritis, dan tetap memegang kendali atas keputusannya di tengah perkembangan AI dan manipulasi informasi.", "To foster a resilient and critical digital society that remains in control of its decisions amid advances in AI and information manipulation."],
  ["Misi", "Mission"], ["Bangun kebiasaan jeda", "Build the Habit of Pausing"],
  ["Menjadikan berhenti sejenak sebagai respons pertama sebelum klik, transfer, scan, atau membagikan.", "Make a brief pause the first response before clicking, transferring, scanning, or sharing."],
  ["Jelaskan, jangan menghakimi", "Explain, Do Not Judge"], ["Menyajikan sinyal AI dan XAI dengan bahasa yang mudah dipahami tanpa mengambil alih keputusan.", "Present AI and XAI signals in accessible language without taking over the decision."],
  ["Bawa literasi ke ruang bersama", "Bring Literacy Into Shared Spaces"], ["Mengubah latihan berpikir kritis menjadi pengalaman bermain yang relevan bagi keluarga, sekolah, dan komunitas.", "Turn critical-thinking practice into a playful experience relevant to families, schools, and communities."],
  ["Jaga pilihan manusia dan privasi", "Protect Human Choice and Privacy"], ["Memprioritaskan perlindungan data, aksesibilitas, dan kendali manusia, termasuk kebebasan untuk mempertanyakan atau menolak rekomendasi AI.", "Prioritize data protection, accessibility, and human control, including the freedom to question or reject AI recommendations."],
  ["HADANGIN menyisipkan ruang berpikir.", "HADANGIN creates space to think."],
  ["Dalam bahasa Indonesia, jeda berarti berhenti atau mengambil jarak sejenak sebelum bereaksi. J.E.D.A. menerjemahkan Pause, Question, Check, Decide ke dalam logika budaya Gobak Sodor: menahan informasi di batas sebelum berubah menjadi tindakan berisiko.", "Jeda is an Indonesian word for a pause: taking a brief step back before reacting. J.E.D.A. translates Pause, Question, Check, Decide into the cultural logic of Gobak Sodor, holding information at the boundary before it can become a risky action."],
]);

const ENGLISH_WORDS = {
  "dan":"and", "atau":"or", "untuk":"for", "dengan":"with", "tanpa":"without", "dari":"from", "ke":"to", "di":"in",
  "yang":"that", "ini":"this", "itu":"that", "adalah":"is", "akan":"will", "belum":"not yet", "tidak":"not", "bukan":"not",
  "kamu":"you", "pengguna":"user", "informasi":"information", "pesan":"message", "konten":"content", "hasil":"result", "model":"model",
  "bukti":"evidence", "keputusan":"decision", "tindakan":"action", "risiko":"risk", "sinyal":"signal", "konteks":"context", "sumber":"source",
  "periksa":"check", "pilih":"choose", "mulai":"start", "lanjut":"continue", "lihat":"view", "gunakan":"use", "masukkan":"enter",
  "tampilkan":"show", "buka":"open", "tutup":"close", "hapus":"remove", "ganti":"replace", "kembali":"back", "ulangi":"retry",
  "membantu":"helps", "mengenali":"recognize", "menentukan":"determine", "menampilkan":"display", "memengaruhi":"influence",
  "membagikan":"share", "memverifikasi":"verify", "diperiksa":"checked", "terdeteksi":"detected", "tersedia":"available",
  "sebelum":"before", "setelah":"after", "sekarang":"now", "langsung":"immediately", "terlebih":"first", "hanya":"only",
  "aman":"safe", "resmi":"official", "mencurigakan":"suspicious", "aktif":"active", "lokal":"local", "akhir":"final", "awal":"initial",
  "tinggi":"high", "rendah":"low", "baru":"new", "utama":"main", "sebenarnya":"actually", "sendiri":"yourself",
  "gambar":"image", "audio":"audio", "rekaman":"recording", "tautan":"link", "alamat":"address", "situs":"site", "file":"file",
  "tekanan":"pressure", "emosi":"emotion", "data":"data", "aksi":"action", "klaim":"claim", "pertanyaan":"question", "jawaban":"answer",
  "latihan":"training", "permainan":"game", "arena":"arena", "garis":"line", "penjaga":"guard", "ronde":"round", "skor":"score",
  "waktu":"time", "tujuan":"destination", "area":"area", "nama":"name", "penerima":"recipient", "contoh":"example", "simulasi":"simulation",
  "berhasil":"successfully", "gagal":"failed", "yakin":"confident", "pilihan":"choice", "langkah":"step", "kasus":"case", "metode":"method",
  "ada":"there is", "agar":"so", "akhirnya":"finally", "akun":"account", "alasan":"reason", "ambil":"take", "anggota":"member",
  "apakah":"whether", "apa":"what", "bagaimana":"how", "bagian":"part", "bagi":"for", "bahasa":"language", "bantuan":"help",
  "bantu":"help", "banyak":"many", "baru":"new", "berada":"remains", "berasal":"comes", "berbeda":"different", "berdiri":"stand",
  "bergerak":"move", "berhenti":"stop", "berikutnya":"next", "bermain":"play", "berpikir":"think", "bertindak":"act", "berubah":"change",
  "bisa":"can", "buat":"create", "cukup":"enough", "dalam":"within", "dampak":"impact", "dapat":"can", "darurat":"emergency",
  "datang":"arrives", "dekat":"close", "depan":"front", "diberikan":"provided", "dibagikan":"shared", "dibatalkan":"reversed",
  "dibaca":"read", "dibangun":"built", "dibantu":"assisted", "dibawa":"carried", "dibuat":"created", "dihapus":"deleted",
  "dikirim":"sent", "dilakukan":"performed", "dilihat":"viewed", "dilokalkan":"localized", "dimanfaatkan":"exploited",
  "diminta":"requested", "dipengaruhi":"influenced", "dipilih":"selected", "dipindai":"scanned", "dipotong":"cut", "diproses":"processed",
  "disimpan":"stored", "disediakan":"provided", "ditampilkan":"displayed", "diterapkan":"applied", "ditindaklanjuti":"acted upon",
  "dunia":"world", "empat":"four", "fakta":"facts", "hal":"things", "harus":"must", "hari":"day", "hubungi":"contact",
  "identitas":"identity", "independen":"independent", "ingin":"want", "isi":"contents", "jadi":"become", "jadwal":"schedule",
  "jaga":"guard", "jika":"if", "jumlah":"number", "kanal":"channel", "karena":"because", "kartu":"card", "keadaan":"situation",
  "keamanan":"safety", "keaslian":"authenticity", "kebenaran":"truth", "kebiasaan":"habit", "kebutuhan":"needs", "kedua":"both",
  "keliru":"wrong", "kelompok":"group", "keluarga":"family", "kemungkinan":"possibility", "kerja":"work", "kerugian":"loss",
  "kesadaran":"awareness", "kesempatan":"opportunity", "ketika":"when", "ketidakpastian":"uncertainty", "klik":"click", "kuat":"strong",
  "kualitas":"quality", "lain":"other", "langsung":"directly", "layanan":"service", "lebih":"more", "lewat":"through", "lengkap":"complete",
  "lolos":"pass", "mampu":"able", "mana":"which", "masih":"still", "masyarakat":"people", "membaca":"read", "membantah":"disprove",
  "membayar":"pay", "membutuhkan":"need", "memastikan":"ensure", "membentuk":"form", "memberi":"provide", "membuka":"reveal",
  "membuat":"make", "memicu":"trigger", "memindai":"scan", "meminta":"request", "memilih":"choose", "memperkuat":"strengthen",
  "mencatat":"record", "mencetak":"print", "mendapat":"receive", "mendorong":"push", "menemukan":"find", "mengaku":"claim",
  "mengangkat":"raise", "mengambil":"take", "mengapa":"why", "mengarah":"lead", "mengatasi":"address", "mengecek":"check",
  "menghindari":"avoid", "mengikuti":"follow", "mengirim":"send", "mengubah":"change", "menilai":"assess", "menjadi":"become",
  "menjaga":"protect", "menunjukkan":"show", "menuju":"toward", "menyebarkan":"spread", "menyelesaikan":"complete",
  "menyerupai":"resemble", "menyatakan":"state", "mereka":"they", "milik":"belongs to", "mirip":"similar", "muncul":"appears",
  "nyata":"real", "oleh":"by", "orang":"people", "pada":"on", "paling":"most", "palsu":"fake", "pembayaran":"payment",
  "pembanding":"comparison", "pembicara":"speaker", "pembaruan":"update", "pembuat":"creator", "pemilik":"owner", "penalaran":"reasoning",
  "penerima":"recipient", "pengalaman":"experience", "pengirim":"sender", "pengumuman":"announcement", "penipuan":"scam",
  "penjelasan":"explanation", "penilaian":"judgment", "penyebar":"distributor", "perangkat":"device", "percaya":"trust",
  "permintaan":"request", "pernah":"ever", "perusahaan":"company", "pihak":"party", "pikir":"think", "potongan":"clip",
  "prioritaskan":"prioritize", "produk":"product", "ruang":"space", "saat":"when", "sama":"same", "scan":"scan", "sebagai":"as",
  "sebuah":"a", "segera":"immediately", "sejenak":"briefly", "selalu":"always", "selama":"during", "semua":"all", "sendiri":"independently",
  "sering":"often", "sesuai":"appropriate", "sesudah":"after", "setuju":"agree", "siapa":"who", "situasi":"situation", "sudah":"already",
  "supaya":"so", "tahap":"stage", "tahu":"know", "tampak":"appears", "terasa":"feels", "terbatas":"limited", "terbentuk":"formed",
  "terjadi":"happened", "terjebak":"trapped", "terkait":"relevant", "terlihat":"visible", "terlebih":"first", "tersebut":"that",
  "tetap":"remains", "tiga":"three", "tokoh":"figure", "transfer":"transfer", "ubah":"change", "ukuran":"size", "unggahan":"post",
  "viral":"viral", "warga":"participants", "waspada":"alert", "wajah":"face", "waktu":"time", "warna":"color",
};

function currentLanguage() {
  return document.documentElement.dataset.language === "en" ? "en" : "id";
}

function updateLanguageToggle(language) {
  const toggle = document.querySelector("[data-language-toggle]");
  if (!toggle) return;
  const isEnglish = language === "en";
  toggle.querySelector(".language-flag").className = `language-flag ${isEnglish ? "flag-id" : "flag-us"}`;
  toggle.querySelector(".language-code").textContent = isEnglish ? "ID" : "EN";
  toggle.setAttribute("aria-pressed", String(isEnglish));
  toggle.setAttribute("aria-label", isEnglish ? "Switch to Indonesian" : "Translate website to English");
  toggle.title = isEnglish ? "Switch to Indonesian" : "Translate website to English";
}

function protectHadangin(root = document.body) {
  return root;
}

function preserveCase(source, translated) {
  if (source === source.toUpperCase() && /[A-Z]/i.test(source)) return translated.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) return translated[0]?.toUpperCase() + translated.slice(1);
  return translated;
}

function translateToEnglish(value) {
  let result = String(value);
  const exact = CURATED_ENGLISH[result.trim()] || ENGLISH_PHRASES.get(result.trim()) || GENERATED_ENGLISH[result.trim()];
  if (exact) return result.replace(result.trim(), exact);
  const phrases = [...Object.entries(CURATED_ENGLISH), ...ENGLISH_PHRASES].sort((a, b) => b[0].length - a[0].length);
  phrases.forEach(([source, translated]) => {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefix = /^[\p{L}\p{N}]/u.test(source) ? "(?<![\\p{L}\\p{N}])" : "";
    const suffix = /[\p{L}\p{N}]$/u.test(source) ? "(?![\\p{L}\\p{N}])" : "";
    result = result.replace(new RegExp(`${prefix}${escaped}${suffix}`, "giu"), (match) => preserveCase(match, translated));
  });
  result = result.replace(/\b[\p{L}]+\b/gu, (word) => {
    if (/^hadangin$/i.test(word)) return word;
    const translated = ENGLISH_WORDS[word.toLocaleLowerCase("id")];
    return translated ? preserveCase(word, translated) : word;
  });
  return result;
}

function applyLanguage(root = document.body) {
  if (!root || applyingLanguage) return;
  applyingLanguage = true;
  const language = currentLanguage();
  const textNodes = [];
  if (root.nodeType === Node.TEXT_NODE) textNodes.push(root);
  else {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);
  }
  textNodes.forEach((node) => {
    if (!node.nodeValue.trim() || node.parentElement?.closest("script, style, .notranslate, [translate='no']")) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    node.nodeValue = language === "en" ? translateToEnglish(source) : source;
  });
  const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("[aria-label], [title], [placeholder], [alt]")] : [];
  elements.forEach((element) => {
    if (element.closest(".notranslate, [translate='no']")) return;
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const originals = originalAttributes.get(element);
    ["aria-label", "title", "placeholder", "alt"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, language === "en" ? translateToEnglish(originals[attribute]) : originals[attribute]);
    });
  });
  const defaultTeamNames = [
    ["#community-team-arus", "Tim Arus", "Flow Team"],
    ["#community-team-hadang", "Tim Hadang", "Guard Team"],
  ];
  defaultTeamNames.forEach(([selector, indonesian, english]) => {
    const input = document.querySelector(selector);
    if (!input) return;
    if (language === "en" && input.value === indonesian) input.value = english;
    if (language === "id" && input.value === english) input.value = indonesian;
  });
  applyingLanguage = false;
  document.title = language === "en" ? "HADANGIN - Indonesian AI Context Guard Web" : "HADANGIN - AI Context Guard Web Indonesia";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = language === "en"
    ? "HADANGIN, a localized AI Context Guard Web prototype that helps users pause, verify, reflect, and evaluate before trusting or sharing digital information."
    : "HADANGIN, prototipe lokal AI Context Guard Web untuk membantu pengguna pause, verify, reflect, dan evaluate sebelum mempercayai atau membagikan informasi digital.";
}

function setLanguage(language, persist = true) {
  const nextLanguage = language === "en" ? "en" : "id";
  protectHadangin();
  document.documentElement.dataset.language = nextLanguage;
  document.documentElement.lang = nextLanguage;
  updateLanguageToggle(nextLanguage);
  if (persist) {
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage); } catch {}
  }
  if (state.inFlow && state.route === "verify") render({ preserveScroll: true });
  applyLanguage();
  setTheme(document.documentElement.dataset.theme, false);
  window.dispatchEvent(new CustomEvent("hadang:language-change", { detail: { language: nextLanguage } }));
}

let savedLanguage = "id";
try { savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "id"; } catch {}
if (new URLSearchParams(location.search).get("lang") === "en") savedLanguage = "en";
document.documentElement.dataset.language = savedLanguage;
document.documentElement.lang = savedLanguage;
updateLanguageToggle(savedLanguage);

const brandProtectionObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
    if (currentLanguage() === "en") applyLanguage(node.nodeType === Node.TEXT_NODE ? node.parentElement : node);
  }));
});
brandProtectionObserver.observe(document.body, { childList: true, subtree: true });
protectHadangin();

function setTheme(theme, persist = true) {
  const nextTheme = theme === "light" ? "light" : "blue";
  document.documentElement.dataset.theme = nextTheme;
  const toggle = document.querySelector("[data-theme-toggle]");
  const isLight = nextTheme === "light";
  if (toggle) {
    const label = currentLanguage() === "en"
      ? (isLight ? "Use dark blue theme" : "Use white and blue theme")
      : (isLight ? "Gunakan tema biru gelap" : "Gunakan tema putih biru");
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
  if (path === "enterprise") return "enterprise";
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
  const hashes = { verify: "#/verify", training: "#/training", community: "#/community", dashboard: "#/dashboard", how: "#/how-it-works", about: "#/about", enterprise: "#/enterprise" };
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
  else if (state.route === "enterprise") app.innerHTML = enterprisePage();
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
          <div class="hero-behavioral-premise"><span>BEHAVIORAL PREMISE</span><p>Tekanan psikologis dapat membuat manusia bereaksi sebelum sempat menilai. HADANGIN menyisipkan jeda antara pemicu dan tindakan.</p></div>
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

function mediaContextField(example) {
  return `<label class="media-context-field" for="media-context-input"><span>Konteks tambahan <i>opsional</i></span><input id="media-context-input" type="text" maxlength="180" value="${escapeHtml(state.mediaContext)}" placeholder="${escapeHtml(example)}" /><small>Membantu simulasi menyesuaikan istilah XAI tanpa mengirim file ke server.</small></label>`;
}

function inputPane() {
  if (state.inputType === "text") {
    return `<div class="input-zone"><textarea id="content-input" aria-label="Teks atau pesan mencurigakan" placeholder="Tempel pesan atau klaim di sini...">${escapeHtml(state.content)}</textarea></div>`;
  }
  if (state.inputType === "qr") {
    const modeSwitch = `<div class="media-input-modes" role="group" aria-label="Cara memasukkan QR atau tautan"><button type="button" class="${state.qrInputMode === "link" ? "active" : ""}" data-qr-input-mode="link">Tempel Tautan</button><button type="button" class="${state.qrInputMode === "image" ? "active" : ""}" data-qr-input-mode="image">Upload QR</button></div>`;
    if (state.qrInputMode === "image") {
      if (state.qrImageDataUrl) {
        return `${modeSwitch}<div class="image-upload-preview qr-upload-preview" data-drop-zone><div class="uploaded-image-frame"><img src="${state.qrImageDataUrl}" alt="Preview QR ${escapeHtml(state.fileName)}" /></div><div class="uploaded-file-meta"><div><span>QR siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>AI simulasi akan memetakan struktur QR dan tujuan yang terbaca.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti QR</label><button class="icon-remove" type="button" data-action="remove-qr" aria-label="Hapus QR" title="Hapus QR">&times;</button></div></div>${mediaContextField("Contoh: QR ditempel di atas kode pembayaran merchant")}<input class="file-input" id="file-input" type="file" accept="image/*" /></div>`;
      }
      return `${modeSwitch}<div class="input-zone" data-drop-zone><div class="upload-content"><div class="upload-symbol" aria-hidden="true">#</div><strong>Upload gambar QR</strong><p>Tarik screenshot atau foto QR ke sini. PNG, JPG, dan WEBP hingga 10 MB.</p><label class="button button-secondary" for="file-input">Pilih Gambar QR</label><input class="file-input" id="file-input" type="file" accept="image/*" /></div></div>`;
    }
    return `${modeSwitch}<div class="link-input-zone"><div class="link-input-icon" aria-hidden="true">//</div><div><strong>Alamat tujuan yang ingin diperiksa</strong><p>Tautan tidak akan dibuka. Simulasi hanya membaca struktur alamatnya.</p></div><input id="content-input" type="url" aria-label="Tautan mencurigakan" placeholder="https://contoh-tautan.com/verifikasi" value="${state.content.startsWith("http") ? escapeHtml(state.content) : ""}" /><div class="link-safety-note"><span></span>Pratinjau aman: tanpa membuka situs tujuan</div></div>`;
  }
  const isAudio = state.inputType === "audio";
  if (isAudio && state.audioDataUrl) {
    return `<div class="audio-upload-preview" data-drop-zone><div class="audio-file-head"><div class="audio-file-icon" aria-hidden="true">~</div><div><span>Rekaman siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>Putar dan dengarkan konteks sebelum memulai.</small></div><button class="icon-remove" type="button" data-action="remove-audio" aria-label="Hapus audio" title="Hapus audio">&times;</button></div>${waveformBars(42, "input-wave")}<audio controls preload="metadata" src="${state.audioDataUrl}">Browser tidak mendukung pemutar audio.</audio>${mediaContextField("Contoh: voice note mengaku keluarga dan meminta transfer")}<label class="button button-secondary button-small" for="file-input">Ganti Audio</label><input class="file-input" id="file-input" type="file" accept="audio/*" /></div>`;
  }
  if (!isAudio && state.imageDataUrl) {
    return `<div class="image-upload-preview" data-drop-zone>
      <div class="uploaded-image-frame"><img src="${state.imageDataUrl}" alt="Preview ${escapeHtml(state.fileName)}" /></div>
      <div class="uploaded-file-meta"><div><span>Gambar siap diperiksa</span><strong>${escapeHtml(state.fileName)}</strong><small>Gambar akan tetap terlihat sampai tahap Explainable AI.</small></div><div class="button-row"><label class="button button-secondary button-small" for="file-input">Ganti Gambar</label><button class="icon-remove" type="button" data-action="remove-image" aria-label="Hapus gambar" title="Hapus gambar">&times;</button></div></div>
      ${mediaContextField("Contoh: screenshot pesan bank meminta OTP melalui tautan")}
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
    const detection = analysisDetection();
    return `<div class="human-audio-context"><div><span class="label">Rekaman yang diperiksa</span><strong>${escapeHtml(state.fileName)}</strong>${waveformBars(38, "human-wave")}<audio controls preload="metadata" src="${state.audioDataUrl}"></audio></div><div class="transcript-preview"><span>Transkrip simulasi adaptif</span><p>"${escapeHtml(detection.transcript)}"</p><small>Disusun dari nama file dan konteks opsional, bukan hasil speech-to-text aktual.</small></div></div>`;
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
      <div class="game-control-hint desktop-game-control-hint"><span><kbd>W</kbd><kbd>&uarr;</kbd> Naik</span><span><kbd>S</kbd><kbd>&darr;</kbd> Turun</span><span><kbd>Spasi</kbd> Hadang</span></div>
      <div class="touch-game-control-hint"><strong>Kontrol HP</strong><span>Ketuk posisi di lapangan atau tahan tombol arah, lalu tekan HADANG.</span></div>
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
    <div class="info-runner ${intro ? "is-running" : "game-token"}" data-game-token><span class="runner-avatar" aria-hidden="true"><span class="runner-person"><i class="runner-head"></i><i class="runner-body"></i><i class="runner-arm left"></i><i class="runner-arm right"></i><i class="runner-leg left"></i><i class="runner-leg right"></i></span><span class="runner-card"><i></i><i></i><i></i></span></span><strong>INFO</strong><small data-token-kind>${intro ? "mencurigakan" : "pesan mendesak"}</small></div>
    <div class="action-gate"><span>TINDAKAN</span><small>Jangan biarkan lolos</small></div>
    ${intro ? "" : `<div class="arena-controls" aria-label="Kontrol permainan">
      <button class="arena-control-move" type="button" data-game-control="up" aria-label="Gerakkan penjaga ke atas"><span aria-hidden="true">&#9650;</span><small>NAIK</small></button>
      <button class="arena-control-block" type="button" data-game-control="block" aria-label="Hadang token informasi"><span aria-hidden="true">H</span><strong>HADANG</strong></button>
      <button class="arena-control-move" type="button" data-game-control="down" aria-label="Gerakkan penjaga ke bawah"><span aria-hidden="true">&#9660;</span><small>TURUN</small></button>
    </div>`}
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
  const compactArena = matchMedia("(max-width: 680px)").matches;
  const yMin = compactArena ? 18 : 31;
  const yMax = compactArena ? 34 : 70;
  const tokenY = (compactArena ? [21, 32, 25, 30, 19, 28] : [36, 66, 43, 62, 32, 57])[spawnIndex % 6];
  const runtime = {
    stage,
    token: stage.querySelector("[data-game-token]"),
    guard: stage.querySelector(".player-guard"),
    x: Math.max(6, guardLeft - 17),
    y: tokenY,
    guardY: Math.min(yMax, Math.max(yMin, state.guardY)),
    yMin,
    yMax,
    nudge: compactArena ? 4 : 9,
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
    runtime.guardY = Math.min(runtime.yMax, Math.max(runtime.yMin, runtime.guardY + direction * 38 * delta));
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

function moveArenaGuardTo(clientY) {
  if (!arenaRuntime) return;
  const rect = arenaRuntime.stage.getBoundingClientRect();
  if (!rect.height) return;
  const targetY = ((clientY - rect.top) / rect.height) * 100;
  arenaRuntime.guardY = Math.min(arenaRuntime.yMax, Math.max(arenaRuntime.yMin, targetY));
  state.guardY = arenaRuntime.guardY;
  if (arenaRuntime.guard) arenaRuntime.guard.style.top = `${arenaRuntime.guardY}%`;
}

function releaseArenaDirection() {
  arenaKeys.delete("arrowup");
  arenaKeys.delete("arrowdown");
  document.querySelectorAll("[data-game-control].is-pressed").forEach((button) => button.classList.remove("is-pressed"));
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
  const profile = analysisProfile();
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
  if (isAudioAnalysis) previewContent = audioAnalysisPreview(detection);
  if (isQrAnalysis) previewContent = qrAnalysisPreview(detection);
  const adaptiveNote = !state.trainingScenario ? `<div class="adaptive-analysis-note"><span>ADAPTIVE FRONTEND</span><div><strong>Penjelasan mengikuti input yang kamu berikan.</strong><p>Istilah XAI disusun dari jenis input, kata kunci, domain, dan metadata file. Ini simulasi heuristik lokal, bukan hasil model AI produksi.</p><small>${escapeHtml(adaptiveInputDescription())}</small></div></div>` : "";
  return `<section class="detection-panel" aria-label="Explainable AI detection simulation">
    <div class="detection-header">
      <div><p class="section-kicker">Explainable detection</p><h3>${escapeHtml(detection.title)}</h3><p>${escapeHtml(detection.subtitle)}</p></div>
      <div class="confidence-badge"><span>${escapeHtml(detection.confidenceLabel)}</span><strong>${profile.aiScore}%</strong></div>
    </div>
    ${analysisModeBar(isImageAnalysis, isAudioAnalysis, isQrAnalysis)}
    ${adaptiveNote}
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

function formatMediaTime(seconds) {
  const value = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function audioAnalysisPreview(detection) {
  const duration = Number.isFinite(state.fileMeta?.duration) ? Math.max(1, state.fileMeta.duration) : 18;
  const ticks = [0, duration / 3, duration * 2 / 3, duration];
  return `<div class="audio-analysis-stage"><div class="audio-analysis-meta"><span>VOICE SAMPLE / ${formatMediaTime(duration)}</span><b>${state.audioXaiMode === "voice" ? "Pola suara" : "Spektrum frekuensi"}</b></div><div class="${state.audioXaiMode === "spectrogram" ? "spectrogram-panel" : "voice-pattern-panel"}">${waveformBars(58, "analysis-wave")}<span class="audio-marker marker-one">1</span><span class="audio-marker marker-two">2</span><span class="audio-marker marker-three">3</span></div><div class="audio-time-axis">${ticks.map((tick) => `<span>${formatMediaTime(tick)}</span>`).join("")}</div>${state.audioDataUrl ? `<audio controls preload="metadata" src="${state.audioDataUrl}"></audio>` : `<div class="audio-simulation-status"><i></i>Sampel audio skenario aktif</div>`}<div class="ai-transcript"><span>Transkrip simulasi adaptif</span><p>${escapeHtml(detection.transcript)}</p><small>Bukan transkripsi otomatis. Tambahkan konteks pada layar sebelumnya agar simulasi lebih spesifik.</small></div></div>`;
}

function qrAnalysisPreview(detection) {
  const isImage = state.qrInputMode === "image" && (state.qrImageDataUrl || state.trainingScenario);
  const hostname = isImage ? "tujuan-belum-terbaca" : safeHostname(state.content);
  if (state.qrXaiMode === "redirect") {
    return `<div class="redirect-analysis"><span class="analysis-label">SIMULATED REDIRECT TRACE</span><div class="redirect-chain"><div><i>1</i><span>Input pengguna<small>${isImage ? escapeHtml(state.fileName || "QR image") : escapeHtml(hostname)}</small></span></div><b></b><div class="warn"><i>2</i><span>Pemeriksaan tujuan<small>Pemilik domain perlu dikonfirmasi</small></span></div><b></b><div class="danger"><i>3</i><span>Pola permintaan<small>${escapeHtml(detection.patternLabel)}</small></span></div></div><p>Rantai ini adalah visualisasi heuristik simulasi. HADANGIN tidak membuka alamat tersebut.</p></div>`;
  }
  if (isImage) {
    const destination = state.mediaContext || "Penerima belum terkonfirmasi";
    return `<div class="qr-image-analysis">${state.qrImageDataUrl ? `<img src="${state.qrImageDataUrl}" alt="QR upload dalam pemetaan risiko" />` : `<div class="qr-case-scan"><div class="qr-pattern" aria-label="QR skenario latihan"><span></span><span></span><span></span></div><small>STIKER TERDETEKSI</small></div>`}<span class="qr-scan-line"></span><span class="qr-focus focus-a">1</span><span class="qr-focus focus-b">2</span></div><div class="qr-destination"><span>Konteks tujuan / simulasi</span><strong>${escapeHtml(destination)}</strong><small>${escapeHtml(state.fileName || "Tujuan QR belum didekode")}</small></div>`;
  }
  const parts = state.content.replace(/^https?:\/\//i, "").split(/([./?=&-])/).filter(Boolean);
  return `<div class="url-risk-analysis"><span class="analysis-label">URL TOKEN RISK MAP</span><div class="url-token-map">${parts.slice(0, 18).map((part, index) => `<span class="${index === 0 || /login|verify|secure|otp/i.test(part) ? "flagged" : ""}">${escapeHtml(part)}</span>`).join("")}</div><div class="domain-facts"><div><span>Host terbaca</span><strong>${escapeHtml(hostname)}</strong></div><div><span>Pola terdeteksi</span><strong>${escapeHtml(detection.patternLabel)}</strong></div><div><span>Status</span><strong>Perlu verifikasi</strong></div></div></div>`;
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
    <div class="direct-result-topbar"><span>Mode Deteksi AI &middot; Explainable AI</span></div>
    <header class="direct-result-header"><div><p class="section-kicker">Hasil prediksi langsung</p><h1>AI menghadang empat sinyal sebelum tindakan.</h1><p>Hasil ini melewati latihan Human First dan game. Gunakan penjelasan XAI untuk menentukan apa yang masih perlu diverifikasi.</p></div><div class="direct-verdict"><span>${escapeHtml(detection.confidenceLabel)}</span><strong>${profile.aiScore}%</strong><p>${escapeHtml(verdict)}</p></div></header>
    <section class="ai-court-board" aria-label="Papan sinyal J.E.D.A. hasil prediksi AI"><div class="court-entry"><span>INPUT</span><i></i></div><div class="court-track">${arenaSignals.map(([letter, name, detail, score, tone], index) => `<article class="court-signal ${tone}"><div class="court-line"></div><span class="court-letter">${letter}</span><div><small>GARIS 0${index + 1}</small><strong>${name}</strong><p>${escapeHtml(detail)}</p><div class="court-score"><i style="--score:${score}%"></i><b>${score}</b></div></div></article>`).join("")}</div><div class="court-gate"><span>AKSI</span><strong>${profile.aiScore >= 80 ? "TAHAN" : "CEK"}</strong></div></section>
    ${detectionPanel(profile, detection)}
    <div class="ai-notice-grid">${profile.aiNotices.map(([label, value]) => `<div class="signal-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <div class="ai-columns direct-ai-columns"><section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${profile.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><section class="info-panel verify"><h3>Langkah verifikasi berikutnya</h3><ul>${profile.verification.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section></div>
    <div class="direct-result-footer"><div><strong>Butuh penilaian yang lebih lengkap?</strong><p>Masuk ke AI Plus untuk membentuk penilaian awal, memainkan J.E.D.A., lalu membandingkannya dengan AI.</p></div><div class="direct-result-footer-actions"><button class="button button-secondary" type="button" data-action="back-to-input">&#8592; Ganti Konten</button><button class="button" type="button" data-action="switch-to-plus">Mulai AI Plus &#8594;</button></div></div>
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
  return `<section class="page-hero community-hero"><div class="page-shell"><p class="eyebrow">HADANGIN &middot; Arena Komunitas</p><h1>Satu Tim Meloloskan. Satu Tim Menghadang.</h1><p>Website menjadi game master untuk permainan fisik Gobak Sodor literasi digital. Tim Arus membawa informasi menuju tindakan, sementara Tim Hadang menjaga empat garis J.E.D.A.</p><div class="community-hero-benefits"><div><i>01</i><span><strong>Latihan bersama membangun refleks mandiri.</strong><small>Dalam setiap ronde, peserta belajar mengenali bagaimana desakan, rasa takut, otoritas, dan tekanan sosial dapat mendorong reaksi impulsif. Pengulangan J.E.D.A. membiasakan peserta untuk berhenti, bertanya, memeriksa bukti, dan memutuskan dengan sadar sebelum mengeklik, mentransfer, atau membagikan informasi.</small></span></div><div><i>02</i><span><strong>Bergerak, bernostalgia, dan menambah literasi.</strong><small>Gobak Sodor mengubah literasi menjadi pengalaman bersama yang aktif: peserta bergerak, menyusun strategi, dan berhadapan antartim. Setiap garis menjadi checkpoint penalaran, tempat mereka menjelaskan mengapa sebuah informasi harus dihadang atau aman diloloskan menuju tindakan.</small></span></div></div></div></section>
    ${communityState.mode === "setup" ? `${communitySetup()}${communityTutorial()}` : communityState.mode === "prepare" ? communityPrepare() : communityState.mode === "vision" ? communityVisionSession() : communitySession()}`;
}

function communityTutorial() {
  return `<section class="section community-tutorial" aria-labelledby="community-tutorial-title"><div class="page-shell"><header class="community-tutorial-head"><div><p class="section-kicker">Simulasi Arena Offline</p><h2 id="community-tutorial-title">Lihat satu ronde sebelum mulai bermain.</h2></div><p>Enam adegan ini memperlihatkan bagaimana gerak Gobak Sodor, kartu fisik, dan pertanyaan J.E.D.A. bekerja sebagai satu pengalaman literasi.</p></header><div class="community-storyboard" role="list" aria-label="Urutan simulasi Arena Offline">${COMMUNITY_TUTORIAL_SCENES.map((scene, index) => `<figure role="listitem"><div><img src="${scene.src}" alt="Adegan ${index + 1}: ${escapeHtml(scene.title)}" loading="lazy" /><span>0${index + 1}</span></div><figcaption><strong>${escapeHtml(scene.title)}</strong><p>${escapeHtml(scene.description)}</p></figcaption></figure>`).join("")}</div><p class="community-storyboard-hint">Geser untuk mengikuti urutan adegan &#8594;</p></div></section>`;
}

function communityHowToPlay(open = false) {
  return `<details class="community-play-guide" ${open ? "open" : ""}>
    <summary><span><small>Panduan fasilitator</small><strong>Cara memainkan Arena Offline</strong></span><i>${open ? "Baca sebelum mulai" : "Lihat alur, fungsi kartu, dan skor"}</i></summary>
    <div class="community-play-guide-body">
      <section class="community-guide-flow" aria-labelledby="community-guide-flow-title">
        <div class="community-guide-heading"><span>01</span><div><h3 id="community-guide-flow-title">Alur satu ronde</h3><p>Website dipegang fasilitator. Peserta bergerak, berdiskusi, dan mengangkat kartu fisik.</p></div></div>
        <ol>
          <li><span>1</span><div><strong>Siapkan arena dan peran</strong><p>Tempel penanda J, E, D, A berurutan. Bagi peserta menjadi Tim Arus, Tim Hadang, dan Warga.</p></div></li>
          <li><span>2</span><div><strong>Voting awal</strong><p>Fasilitator menampilkan kasus. Semua Warga mengangkat Kartu Keputusan tanpa berdiskusi; jumlahnya dicatat di website.</p></div></li>
          <li><span>3</span><div><strong>Tim Arus mulai bergerak</strong><p>Strategist mengambil satu Kartu Taktik secara rahasia. Runner membawa Token Informasi dari MASUK menuju TINDAKAN.</p></div></li>
          <li><span>4</span><div><strong>Hadang di empat garis</strong><p>Di setiap garis, Tim Hadang punya 30 detik untuk membahas pertanyaan dan memilih jawaban. Tim Arus boleh memakai tekanan -5 detik satu kali, lalu fasilitator mengunci jawaban.</p></div></li>
          <li><span>5</span><div><strong>Buka taktik dan AI Lens</strong><p>Setelah garis A, Tim Arus membuka Kartu Taktik. Fasilitator memilih kartu yang sama agar pola manipulasi dijelaskan.</p></div></li>
          <li><span>6</span><div><strong>Voting akhir dan tukar peran</strong><p>Warga memilih ulang, lalu kelompok membahas perubahan keputusan. Tukar Tim Arus dan Tim Hadang sebelum ronde berikutnya.</p></div></li>
        </ol>
      </section>
      <section class="community-guide-cards" aria-labelledby="community-guide-cards-title">
        <div class="community-guide-heading"><span>02</span><div><h3 id="community-guide-cards-title">Fungsi kit cetak</h3><p>Potong kartu sebelum sesi dan bagikan sesuai peran berikut.</p></div></div>
        <dl>
          <div><dt>Token Informasi</dt><dd>Dibawa Runner dan dipindahkan satu garis setelah setiap tantangan selesai.</dd></div>
          <div><dt>Kartu J.E.D.A.</dt><dd>Diletakkan di garis Jeda, Emosi, Data, dan Aksi sebagai pengingat pertanyaan.</dd></div>
          <div><dt>Kartu Taktik</dt><dd>Dipegang Strategist Tim Arus secara rahasia dan dibuka setelah empat garis.</dd></div>
          <div><dt>Kartu Keputusan</dt><dd>Satu set untuk setiap Warga: Lanjut, Verifikasi, Berhenti, atau Belum Yakin.</dd></div>
          <div><dt>Penanda garis</dt><dd>Ditempel di lantai dengan selotip untuk membentuk jalur MASUK sampai TINDAKAN.</dd></div>
        </dl>
      </section>
      <aside class="community-guide-rules">
        <div><span>SKOR</span><p><b>Tim Hadang +1</b> jika jawaban benar. <b>Tim Arus +1</b> jika jawaban salah atau waktu habis. Keputusan aman terbanyak pada voting akhir memberi Tim Hadang <b>bonus +2</b>.</p></div>
        <div><span>BEST PRACTICE</span><p>Untuk 8-24 peserta: tempatkan 2-4 orang di Tim Arus, 4 penjaga di Tim Hadang, dan peserta lain sebagai Warga. Mainkan dua ronde agar tim bertukar peran. Gunakan kasus yang tersedia, tanpa data pribadi dan tanpa kontak fisik.</p></div>
      </aside>
    </div>
  </details>`;
}

function communitySetup() {
  const pack = activeCommunityPack();
  const visionMode = communityState.playMode === "vision";
  return `<section class="section community-workspace"><div class="page-shell community-setup-layout">
    <section class="community-builder" aria-labelledby="community-builder-title">
      <header><p class="section-kicker">Arena Komunitas</p><h2 id="community-builder-title">Pilih cara bermain</h2><p>Arena Offline memakai dua tim dan perlengkapan fisik. Arena Kamera AI memakai gerakan tubuh satu penjaga aktif.</p></header>
      ${communityHowToPlay(false)}
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
    ${communityHowToPlay(true)}
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
  const english = currentLanguage() === "en";
  const localize = (value) => english ? translateToEnglish(value) : value;
  const visionGuide = `PANDUAN ARENA KAMERA AI (BETA)\n\nAudiens: ${communityState.audience}\nDurasi: ${communityState.duration}\nPeserta: ${communityState.participants}\nPaket: ${pack.title}\nKasus: ${pack.caseTitle}\n\nPERALATAN\nLaptop dengan webcam, layar yang dapat dilihat kelompok, dan ruang gerak sekitar 2 meter.\n\nALUR\n1. Lakukan voting awal tanpa petunjuk.\n2. Pilih satu penjaga untuk berdiri di depan kamera.\n3. Kelompok membahas pertanyaan pada garis Jeda, Emosi, Data, dan Aksi.\n4. Penjaga mengangkat kedua tangan selama satu detik untuk mengunci garis.\n5. Ganti penjaga pada garis berikutnya agar peserta bergiliran.\n6. Lakukan voting akhir dan debrief.\n\nPRIVASI DAN AKSESIBILITAS\nPose diproses lokal di browser; video tidak direkam atau dikirim ke server. Gunakan tombol Tandai manual bagi peserta yang tidak dapat atau tidak ingin melakukan pose. AI hanya membaca pose dan tidak menilai kualitas jawaban.\n`;
  const offlineGuide = `PANDUAN ARENA HADANG OFFLINE\n\nAudiens: ${communityState.audience}\nDurasi: ${communityState.duration}\nPeserta: ${communityState.participants}\nPaket: ${pack.title}\nKasus: ${pack.caseTitle}\n\nPERALATAN\nLaptop dan proyektor, selotip lantai, Token Informasi, kartu J.E.D.A., kartu keputusan, kartu taktik, dan kartu bukti.\n\nALUR\n1. Bagi peserta menjadi Tim Arus dan Tim Hadang.\n2. Buat empat garis fisik: Jeda, Emosi, Data, dan Aksi.\n3. Lakukan voting awal dengan Kartu Keputusan.\n4. Tim Arus membawa Token Informasi; Tim Hadang menyelesaikan tantangan setiap garis.\n5. Fasilitator mengatur timer, pilihan, dan skor melalui website.\n6. Buka Kartu Taktik dan AI Lens setelah semua garis dimainkan.\n7. Lakukan voting akhir, debrief, lalu tukar peran.\n\nKEAMANAN\nPermainan tanpa kontak fisik. Jangan berlari pada lantai licin. Gunakan hanya skenario yang disediakan dan jangan memakai data pribadi peserta.\n`;
  const visionGuideEn = `AI CAMERA ARENA GUIDE (BETA)\n\nAudience: ${localize(communityState.audience)}\nDuration: ${localize(communityState.duration)}\nParticipants: ${communityState.participants}\nPack: ${localize(pack.title)}\nCase: ${localize(pack.caseTitle)}\n\nEQUIPMENT\nA laptop with a webcam, a screen visible to the group, and approximately two meters of movement space.\n\nFLOW\n1. Run the initial vote without clues.\n2. Choose one guard to stand in front of the camera.\n3. Discuss the questions for Pause, Emotion, Evidence, and Action.\n4. The guard raises both hands for one second to lock the line.\n5. Rotate guards at each line so participants take turns.\n6. Run the final vote and debrief.\n\nPRIVACY AND ACCESSIBILITY\nPoses are processed on the device in the browser; video is not recorded or sent to a server. Use Mark Manually for participants who cannot or prefer not to perform the pose. AI only reads the pose and does not evaluate answer quality.\n`;
  const offlineGuideEn = `OFFLINE BLOCKING ARENA GUIDE\n\nAudience: ${localize(communityState.audience)}\nDuration: ${localize(communityState.duration)}\nParticipants: ${communityState.participants}\nPack: ${localize(pack.title)}\nCase: ${localize(pack.caseTitle)}\n\nEQUIPMENT\nA laptop and projector, floor tape, an Information Token, J.E.D.A. cards, decision cards, tactic cards, and evidence cards.\n\nFLOW\n1. Divide participants into the Flow Team and Guard Team.\n2. Create four physical lines: Pause, Emotion, Evidence, and Action.\n3. Run the initial vote with Decision Cards.\n4. The Flow Team carries the Information Token; the Guard Team completes each line challenge.\n5. The facilitator manages the timer, choices, and score on the website.\n6. Reveal the Tactic Card and AI Lens after all lines have been played.\n7. Run the final vote and debrief, then swap roles.\n\nSAFETY\nThis is a non-contact game. Do not run on slippery floors. Use only the provided scenarios and never use participants' personal data.\n`;
  const offlineGuideDetails = `\nFUNGSI KIT\n- Token Informasi: dibawa Runner dari MASUK menuju TINDAKAN.\n- Kartu J.E.D.A.: diletakkan pada empat garis sebagai pengingat pertanyaan.\n- Kartu Taktik: dipegang rahasia oleh Strategist Tim Arus sampai tahap reveal.\n- Kartu Keputusan: diangkat setiap Warga saat voting awal dan akhir.\n- Penanda garis: ditempel di lantai untuk membentuk jalur permainan.\n\nSKOR\n- Tim Hadang +1 untuk jawaban benar.\n- Tim Arus +1 untuk jawaban salah atau ketika waktu habis.\n- Mayoritas keputusan aman pada voting akhir memberi Tim Hadang bonus +2.\n\nPRAKTIK TERBAIK\nUntuk 8-24 peserta, tempatkan 2-4 orang di Tim Arus, 4 penjaga di Tim Hadang, dan peserta lain sebagai Warga. Mainkan dua ronde agar kedua tim bertukar peran. Untuk kelompok besar, buat beberapa arena kecil. Tunjuk satu fasilitator khusus untuk mengoperasikan website dan menjaga tempo permainan.\n`;
  const offlineGuideDetailsEn = `\nKIT ROLES\n- Information Token: carried by the Runner from ENTRY toward ACTION.\n- J.E.D.A. Cards: placed at the four lines as question prompts.\n- Tactic Card: kept secret by the Flow Team Strategist until the reveal.\n- Decision Cards: raised by every Decision Maker during the initial and final votes.\n- Line markers: taped to the floor to form the game path.\n\nSCORING\n- Guard Team +1 for a correct answer.\n- Flow Team +1 for an incorrect answer or when time runs out.\n- A majority of safer final votes gives the Guard Team a +2 bonus.\n\nBEST PRACTICES\nFor 8-24 participants, assign 2-4 people to the Flow Team, four guards to the Guard Team, and everyone else as Decision Makers. Play two rounds so the teams swap roles. For larger groups, create several smaller arenas. Assign one facilitator to operate the website and maintain the pace of play.\n`;
  const offlineGuideEnLocalized = offlineGuideEn.replace("OFFLINE BLOCKING ARENA GUIDE", "OFFLINE INTERCEPT ARENA GUIDE");
  const guide = english
    ? (communityState.mode === "vision" ? visionGuideEn : `${offlineGuideEnLocalized}${offlineGuideDetailsEn}`)
    : (communityState.mode === "vision" ? visionGuide : `${offlineGuide}${offlineGuideDetails}`);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([guide], { type: "text/plain;charset=utf-8" }));
  link.download = english
    ? (communityState.mode === "vision" ? "hadangin-ai-camera-arena-guide.txt" : "hadangin-community-session-guide.txt")
    : (communityState.mode === "vision" ? "panduan-arena-kamera-hadangin.txt" : "panduan-sesi-hadangin.txt");
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  showToast(english ? "Session guide downloaded." : "Panduan sesi berhasil diunduh.");
}

function printCommunityKit() {
  const english = currentLanguage() === "en";
  const cards = english ? [
    ["J", "PAUSE", "Pause briefly and identify the time pressure."], ["E", "EMOTION", "Recognize the emotion being influenced."], ["D", "EVIDENCE", "Choose the strongest independent evidence."], ["A", "ACTION", "Assess the risk and choose a safer action."],
    ["&#8594;", "PROCEED", "I will take the requested action."], ["?", "VERIFY", "I will check through another channel."], ["&#9632;", "STOP", "I will not continue the action."], ["...", "NOT SURE", "I need more evidence."],
    ["!", "URGENCY", "Reduce the other team's time by five seconds."], ["ID", "AUTHORITY", "Use a claim tied to an institution or position."], ["!", "FEAR", "Emphasize a threat or emergency."], ["+", "SOCIAL PRESSURE", "Use virality as pressure."],
  ] : [
    ["J", "JEDA", "Berhenti sejenak. Temukan tekanan waktu."], ["E", "EMOSI", "Kenali emosi yang sedang dipengaruhi."], ["D", "DATA", "Pilih bukti independen yang paling kuat."], ["A", "AKSI", "Nilai risiko dan pilih tindakan yang aman."],
    ["&#8594;", "LANJUT", "Saya akan melakukan tindakan yang diminta."], ["?", "VERIFIKASI", "Saya akan memeriksa lewat kanal lain."], ["&#9632;", "BERHENTI", "Saya tidak akan melanjutkan tindakan."], ["...", "BELUM YAKIN", "Saya membutuhkan bukti tambahan."],
    ["!", "URGENCY", "Kurangi waktu lawan lima detik."], ["ID", "AUTHORITY", "Gunakan klaim institusi atau jabatan."], ["!", "FEAR", "Tekankan ancaman atau keadaan darurat."], ["+", "SOCIAL PRESSURE", "Gunakan viralitas sebagai tekanan."],
  ];
  const printCopy = english ? {
    title: "HADANGIN · Blocking Arena Kit",
    instruction: "Cut along the card borders. Laminate the cards for repeated use.",
    print: "Print",
    token: "INFORMATION TOKEN",
    lines: ["J · PAUSE", "E · EMOTION", "D · EVIDENCE", "A · ACTION", "ACTION ZONE"],
    safety: "Safety: use without physical contact, avoid slippery floors, and adapt movement distances to participants' needs.",
  } : {
    title: "HADANGIN · Arena Hadang",
    instruction: "Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.",
    print: "Cetak",
    token: "TOKEN INFORMASI",
    lines: ["J · JEDA", "E · EMOSI", "D · DATA", "A · AKSI", "ZONA TINDAKAN"],
    safety: "Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.",
  };
  if (english) printCopy.title = "HADANGIN · Intercept Arena Kit";
  const printGuide = english ? `
    <section class="quick"><p class="quick-kicker">FACILITATOR QUICK START</p><h2>Run one round in six steps</h2>
      <ol><li>Build the four-line court and divide participants into the Flow Team, Guard Team, and Decision Makers.</li><li>Show the case and record an initial vote with Decision Cards before any discussion.</li><li>The Flow Team secretly draws a Tactic Card. Its Runner carries the Information Token from ENTRY.</li><li>At every J.E.D.A. line, give the Guard Team 30 seconds to answer. The Flow Team may apply the five-second pressure once.</li><li>After line A, reveal the Tactic Card and select the same tactic in AI Lens.</li><li>Record the final vote, debrief the decision shift, then swap roles for round two.</li></ol>
      <div class="quick-grid"><div><b>CARD ROLES</b><p><strong>Information Token:</strong> carried by the Runner.<br><strong>J.E.D.A. Cards:</strong> placed at each line.<br><strong>Tactic Card:</strong> kept secret by the Flow Team.<br><strong>Decision Cards:</strong> raised by every Decision Maker.</p></div><div><b>SCORING</b><p>Guard Team +1 for a correct answer. Flow Team +1 for an incorrect answer or timeout. A majority of safer final votes gives the Guard Team a +2 bonus.</p></div></div>
      <p class="quick-safety">For 8-24 players: assign 2-4 to the Flow Team, four to the Guard Team, and everyone else as Decision Makers. Play two non-contact rounds and never use participants' personal data.</p>
    </section>` : `
    <section class="quick"><p class="quick-kicker">PANDUAN CEPAT FASILITATOR</p><h2>Mainkan satu ronde dalam enam langkah</h2>
      <ol><li>Buat lapangan empat garis dan bagi peserta menjadi Tim Arus, Tim Hadang, dan Warga.</li><li>Tampilkan kasus dan catat voting awal dengan Kartu Keputusan sebelum berdiskusi.</li><li>Tim Arus mengambil Kartu Taktik secara rahasia. Runner membawa Token Informasi dari MASUK.</li><li>Di setiap garis J.E.D.A., beri Tim Hadang 30 detik untuk menjawab. Tim Arus boleh memakai tekanan -5 detik satu kali.</li><li>Setelah garis A, buka Kartu Taktik dan pilih taktik yang sama pada AI Lens.</li><li>Catat voting akhir, bahas perubahan keputusan, lalu tukar peran untuk ronde kedua.</li></ol>
      <div class="quick-grid"><div><b>FUNGSI KARTU</b><p><strong>Token Informasi:</strong> dibawa Runner.<br><strong>Kartu J.E.D.A.:</strong> diletakkan di setiap garis.<br><strong>Kartu Taktik:</strong> dirahasiakan Tim Arus.<br><strong>Kartu Keputusan:</strong> diangkat oleh setiap Warga.</p></div><div><b>SKOR</b><p>Tim Hadang +1 untuk jawaban benar. Tim Arus +1 untuk jawaban salah atau waktu habis. Mayoritas keputusan aman pada voting akhir memberi Tim Hadang bonus +2.</p></div></div>
      <p class="quick-safety">Untuk 8-24 pemain: 2-4 orang menjadi Tim Arus, 4 orang menjadi Tim Hadang, dan peserta lain menjadi Warga. Mainkan dua ronde, tanpa kontak fisik dan tanpa data pribadi peserta.</p>
    </section>`;
  const popup = window.open("", "_blank");
  if (!popup) { showToast(english ? "Allow pop-ups to print the game kit." : "Izinkan pop-up untuk mencetak kit permainan."); return; }
  popup.opener = null;
  popup.document.write(`<!doctype html><html lang="id"><head><title>Kit Arena Hadang</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#0b1830}.head{display:flex;justify-content:space-between;align-items:end;margin-bottom:8mm;border-bottom:3px solid #2468ef;padding-bottom:4mm}.head h1{margin:0;font-size:22px}.head p{margin:0;font-size:10px}.quick{min-height:245mm;break-after:page}.quick-kicker{margin:18mm 0 3mm;color:#c65038;font-size:10px;font-weight:800}.quick h2{margin:0 0 9mm;font-size:28px}.quick ol{display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm;margin:0;padding:0;list-style:none;counter-reset:step}.quick li{min-height:28mm;padding:5mm;border-top:2px solid #2468ef;font-size:11px;line-height:1.55;counter-increment:step}.quick li:before{content:counter(step,decimal-leading-zero);display:block;margin-bottom:3mm;color:#2468ef;font-size:10px;font-weight:800}.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:8mm}.quick-grid>div{padding:6mm;color:white;background:#10213d}.quick-grid b{color:#6dddd0;font-size:10px}.quick-grid p{margin:4mm 0 0;font-size:10px;line-height:1.6}.quick-safety{padding:4mm;border-left:3px solid #c65038;background:#edf3fa;font-size:10px;line-height:1.5}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}.card{height:82mm;display:flex;flex-direction:column;padding:7mm;border:2px solid #10213d;break-inside:avoid}.card:nth-child(4n+2){border-color:#0e9689}.card:nth-child(4n+3){border-color:#dd9217}.card:nth-child(4n){border-color:#d45f42}.symbol{width:18mm;height:18mm;display:grid;place-items:center;color:white;background:#2468ef;font-size:24px;font-weight:800}.card h2{margin:12mm 0 3mm;font-size:16px}.card p{margin:0;font-size:10px;line-height:1.5}.token{grid-column:1/-1;height:55mm;display:grid;place-items:center;color:white;background:#c83f50;border:4px solid #10213d;font-size:34px;font-weight:800;letter-spacing:2px}.line{grid-column:1/-1;height:35mm;display:grid;place-items:center;border:3px dashed #10213d;font-size:25px;font-weight:800}.note{grid-column:1/-1;font-size:9px;line-height:1.5}@media print{button{display:none}}</style></head><body><div class="head"><div><h1>HADANGIN &middot; Arena Hadang</h1><p>Potong kartu mengikuti batas. Laminasi bila akan digunakan berulang.</p></div><button onclick="print()">Cetak</button></div>${printGuide}<div class="cards">${cards.map(([symbol, title, note]) => `<article class="card"><span class="symbol">${symbol}</span><h2>${title}</h2><p>${note}</p></article>`).join("")}<div class="token">TOKEN INFORMASI</div>${["J &middot; JEDA", "E &middot; EMOSI", "D &middot; DATA", "A &middot; AKSI", "ZONA TINDAKAN"].map((label) => `<div class="line">${label}</div>`).join("")}<p class="note">Keamanan: gunakan tanpa kontak fisik, hindari lantai licin, dan sesuaikan jarak gerak dengan kebutuhan peserta.</p></div></body></html>`);
  popup.document.close();
  if (english) {
    popup.document.documentElement.lang = "en";
    popup.document.title = "HADANGIN Intercept Arena Kit";
    popup.document.querySelector(".head h1").textContent = printCopy.title;
    popup.document.querySelector(".head p").textContent = printCopy.instruction;
    popup.document.querySelector(".head button").textContent = printCopy.print;
    popup.document.querySelector(".token").textContent = printCopy.token;
    popup.document.querySelectorAll(".line").forEach((line, index) => { line.textContent = printCopy.lines[index]; });
    popup.document.querySelector(".note").textContent = printCopy.safety;
  }
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
      <div class="page-shell training-hero-inner"><div class="training-hero-copy"><p class="eyebrow">Latihan Hadang &middot; Arena 3D</p><h1>Latih Nalar Sebelum Situasi Nyata Datang.</h1><p>Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.</p><p class="training-habit-copy"><strong>Latihan membangun refleks.</strong> Dengan berlatih berulang, kamu belajar mengenali dan mengelola tekanan psikologis secara mandiri, sehingga respons pertama bukan langsung bertindak, tetapi berhenti dan menilai.</p><div class="training-hero-actions"><button class="button" type="button" data-scroll-to="training-arenas">Pilih Skenario <span aria-hidden="true">&#8595;</span></button><div class="training-hero-status"><span>8 arena</span><span>4 garis J.E.D.A.</span><span>Human First</span></div></div></div></div>
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
    <section class="section section-white"><div class="page-shell"><div class="context-bridge"><span>Proposal concept</span><strong>AI Context Guard Web</strong><i aria-hidden="true">&#8594;</i><span>Local experience</span><strong>HADANGIN + J.E.D.A.</strong></div><div class="behavior-interruption"><div class="behavior-interruption-copy"><p class="section-kicker">Intervensi perilaku</p><h2>Hadang reaksi sebelum menjadi tindakan.</h2><p>Informasi manipulatif sering mempersempit waktu berpikir melalui tekanan psikologis. HADANGIN tidak menghilangkan emosi; HADANGIN mengembalikan ruang untuk menilai.</p></div><div class="behavior-path" aria-label="Alur intervensi perilaku HADANGIN"><article><span>01 / PEMICU</span><strong>Tekanan psikologis</strong><small>Urgency, fear, authority, scarcity</small></article><i>&#8594;</i><article class="reactive"><span>02 / REAKSI</span><strong>Impulsif dan reaktif</strong><small>Klik, transfer, scan, atau share</small></article><i>&#8594;</i><article class="jeda"><span>03 / J.E.D.A.</span><strong>Ruang untuk berpikir</strong><small>Pause, Question, Check, Decide</small></article><i>&#8594;</i><article class="deliberate"><span>04 / KEPUTUSAN</span><strong>Tindakan yang disengaja</strong><small>Konteks, bukti, dan kendali manusia</small></article></div><p class="behavior-boundary">HADANGIN dirancang untuk membantu mengurangi keputusan digital yang impulsif dan reaktif; dampaknya perlu dibuktikan melalui evaluasi pengguna.</p></div><div class="steps-grid">${steps.map(([title, text]) => `<article class="step-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>
    <section class="section how-modes"><div class="page-shell"><div class="how-modes-head"><div><p class="section-kicker">Dua mode, satu metode</p><h2>Berlatih sendiri atau bergerak bersama.</h2></div><p>Pilihan mode mengubah cara bermain, bukan prinsipnya. Keduanya melatih kebiasaan berhenti, memeriksa bukti, menggunakan AI sebagai lensa, lalu mengambil keputusan sendiri.</p></div><div class="how-mode-grid">
      <article class="how-mode-card individual"><div class="how-mode-top"><span>Mode individu · 1 pemain</span><b aria-hidden="true">1P</b></div><h3>Periksa dan latih keputusanmu sendiri.</h3><p>Gunakan ponsel atau laptop untuk memeriksa konten nyata maupun skenario latihan secara mandiri.</p><div class="how-mode-flow"><strong>Yang kamu lakukan</strong><div><span>Unggah konten</span><i>&#8594;</i><span>Nilai sendiri</span><i>&#8594;</i><span>Main J.E.D.A.</span><i>&#8594;</i><span>Bandingkan AI</span><i>&#8594;</i><span>Refleksi</span></div></div><dl><div><dt>Format</dt><dd>Deteksi AI cepat atau AI Plus dengan permainan J.E.D.A.</dd></div><div><dt>Cocok untuk</dt><dd>Keputusan sehari-hari, belajar mandiri, dan latihan singkat.</dd></div></dl><a class="button" href="#/verify">Mulai mode individu <span aria-hidden="true">&#8594;</span></a></article>
      <article class="how-mode-card community"><div class="how-mode-top"><span>Mode komunitas · 4–120 peserta</span><b aria-hidden="true">24P</b></div><h3>Hadang informasi sebagai permainan tim.</h3><p>Fasilitator membagi peserta menjadi tim pembawa informasi dan tim penjaga literasi. Satu tim mencoba meloloskan skenario; tim lain menghadangnya dengan pertanyaan, bukti, dan tindakan aman.</p><div class="how-mode-flow"><strong>Yang kelompok lakukan</strong><div><span>Buat ruang</span><i>&#8594;</i><span>Bagi tim</span><i>&#8594;</i><span>Mainkan arena</span><i>&#8594;</i><span>Voting</span><i>&#8594;</i><span>Debrief</span></div></div><dl><div><dt>Format</dt><dd>Offline, hybrid, atau Arena Kamera berbasis computer vision.</dd></div><div><dt>Cocok untuk</dt><dd>Keluarga, sekolah, organisasi pemuda, dan komunitas.</dd></div></dl><a class="button button-teal" href="#/community">Siapkan mode komunitas <span aria-hidden="true">&#8594;</span></a></article>
    </div><div class="how-shared-method"><span>Metode yang sama pada kedua mode</span><div><b>Human First</b><i>&#8594;</i><b>J.E.D.A.</b><i>&#8594;</i><b>AI Lens</b><i>&#8594;</i><b>Human Final</b></div><p>Yang berubah hanya skala dan cara interaksi; keputusan tetap berada pada manusia.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="dark-band"><div class="section-header"><p class="section-kicker">Human-centered AI</p><h2>AI adalah Lensa, Bukan Hakim.</h2><p>Label “aman”, “hoaks”, atau “scam” dapat membantu, tetapi tidak otomatis membangun kemampuan menilai ketika teknologi tidak tersedia.</p></div><div class="dark-mini-grid"><article><h3>Detect</h3><p>AI membantu menemukan pola dan sinyal yang mungkin terlewat.</p></article><article><h3>Explain</h3><p>AI menjelaskan mengapa sinyal muncul dan menunjukkan batasnya.</p></article><article><h3>Question</h3><p>AI membantu pengguna tahu bukti apa yang perlu diverifikasi.</p></article></div><p class="dark-footer-line">Keputusan akhir tetap milik manusia.</p></div></div></section>`;
}

function aboutPage() {
  return `<section class="page-hero about-hero"><img class="about-hero-mark" src="${HADANGIN_MARK_URL}" alt="" aria-hidden="true" /><div class="page-shell about-hero-inner"><div class="about-wordmark-shell"><img src="${HADANGIN_WORDMARK_URL}" alt="HADANGIN" /></div><p class="eyebrow">Identitas HADANGIN</p><h1>Hadang Informasi. Jaga Keputusan.</h1><p>HADANGIN membantu orang melatih jeda yang dapat diulang antara tekanan psikologis dan tindakan digital. Saat desakan, rasa takut, otoritas, atau ancaman memicu kepanikan, J.E.D.A. memandu pengguna memperlambat respons, memeriksa konteks dan bukti, lalu memilih secara sadar alih-alih bereaksi impulsif.</p><div class="about-behavioral-scope"><span>PEMBENTUKAN KEBIASAAN PERILAKU</span><p><strong>Lebih dari sekadar edukasi.</strong> HADANGIN melatih rutinitas pengambilan keputusan yang lebih aman melalui praktik berulang. Dengan membiasakan jeda, pemeriksaan bukti, dan pilihan yang sadar, pengguna membangun pola respons yang dapat mereka bawa ke berbagai situasi digital sehari-hari.</p></div><div class="about-hero-principles"><span>Human First</span><i></i><span>AI Second</span><i></i><span>Human Final</span></div></div></section>
    <section class="section section-white about-identity"><div class="page-shell about-identity-grid"><div class="about-name-story"><p class="section-kicker">Makna nama</p><h2>HADANGIN adalah ajakan untuk berhenti sebelum bertindak.</h2><p>Nama HADANGIN berasal dari kata hadang: menahan sesuatu agar tidak langsung melewati batas. Akhiran percakapan -in membuatnya terdengar dekat, aktif, dan mudah diingat sebagai ajakan sehari-hari.</p><div class="about-name-formula"><strong class="notranslate" translate="no">HADANG</strong><span>+</span><strong class="notranslate" translate="no">IN</strong><i>perlindungan yang menjadi tindakan</i></div><div class="about-cultural-origin"><div class="about-cultural-copy"><span>Akar budaya Indonesia</span><p>HADANGIN terinspirasi oleh Gobak Sodor, permainan tradisional Indonesia tentang menghadang pergerakan melintasi batas. Prinsip itu kami terjemahkan menjadi intervensi perilaku digital: menghentikan reaksi impulsif sebelum manipulasi berubah menjadi tindakan.</p></div><div class="about-cultural-translation" aria-label="Transformasi filosofi Gobak Sodor menjadi intervensi digital"><div><small>GOBAK SODOR</small><p><b>Gerak</b><i>&#8594;</i><b>Batas</b><i>&#8594;</i><b>Hadang</b></p></div><span>&#8595;</span><div><small>PERILAKU DIGITAL</small><p><b>Informasi</b><i>&#8594;</i><b>J.E.D.A.</b><i>&#8594;</i><b>Tindakan aman</b></p></div></div></div><div class="about-meaning-list"><div><span>01</span><p>Menahan laju informasi manipulatif sebelum menjadi tindakan impulsif.</p></div><div><span>02</span><p>Membawa semangat permainan hadang atau gobak sodor ke dalam latihan literasi digital.</p></div><div><span>03</span><p>Mengajak pengguna terlibat aktif, bukan sekadar menerima penilaian AI.</p></div></div></div>
      <aside class="about-logo-system" aria-label="Sistem identitas HADANGIN"><div class="about-logo-head"><p class="section-kicker">Sistem identitas</p><span>01 / LOGO</span></div><figure class="about-logo-mark"><img src="${HADANGIN_MARK_URL}" alt="Simbol perisai H HADANGIN" /><figcaption><strong>Simbol utama</strong><p>Perisai berbentuk H mewakili perlindungan, batas, dan ruang aman untuk berpikir. Huruf H adalah abstraksi visual dari garis batas dan garis penghubung lapangan Gobak Sodor, bukan salinan bentuk lapangannya.</p></figcaption></figure><figure class="about-logo-wordmark"><div><img src="${HADANGIN_WORDMARK_URL}" alt="Logo horizontal HADANGIN" /></div><figcaption><strong>Logo horizontal</strong><p>Wordmark memadukan simbol penjaga dengan nama yang tegas dan mudah dikenali.</p></figcaption></figure></aside>
    </div></section>
    <section class="section about-visual-language"><div class="page-shell"><div class="about-visual-head"><div><p class="section-kicker">Bahasa visual</p><h2>Garis permainan menjadi sistem identitas.</h2></div><p>Elemen budaya diterjemahkan secara konsisten ke dalam bentuk, huruf, dan warna.</p></div><div class="about-visual-grid">
      <figure class="about-court-figure"><div class="about-court-image"><img src="${GOBAK_SODOR_IDENTITY_URL}" alt="Dua tim memainkan Gobak Sodor pada lapangan enam petak dengan garis horizontal dan garis vertikal tengah" /><span>02 / AKAR BUDAYA</span></div><figcaption><h3>Dari garis lapangan ke simbol H</h3><div class="about-team-legend"><div class="carrier"><i></i><span><strong>Tim biru · Pembawa informasi</strong><small>Hoaks, scam, QR, audio, dan gambar manipulatif</small></span></div><div class="guardian"><i></i><span><strong>Tim hijau · Penjaga literasi</strong><small>Jeda, bertanya, periksa bukti, dan putuskan dengan aman</small></span></div></div><p>Lapangan Gobak Sodor umumnya berbentuk persegi panjang yang dibagi menjadi enam petak, dengan garis horizontal yang dijaga dan satu garis vertikal tengah untuk penjaga sodor. Identitas HADANGIN tidak menyalin bentuk lapangan secara harfiah. Garis batas dan penghubungnya diabstraksikan menjadi huruf H: simbol untuk menghadang, memberi jeda, lalu menilai sebelum melintas.</p></figcaption></figure>
      <div class="about-brand-specs"><section class="about-type-spec"><div class="about-spec-head"><span>03 / TIPOGRAFI</span><small>Antarmuka digital</small></div><div class="about-type-sample"><b>Aa</b><div><h3>Plus Jakarta Sans</h3><p>Tipografi utama untuk judul, navigasi, dan teks antarmuka. Geometris, tegas, dan tetap mudah dibaca pada layar kecil.</p></div></div><div class="about-type-weights"><span><b>400</b> Regular</span><span><b>600</b> Semibold</span><span><b>700</b> Bold</span></div></section>
      <section class="about-color-spec"><div class="about-spec-head"><span>04 / PALET WARNA</span><small>Brand &amp; interface</small></div><div class="about-color-list"><div><i style="--swatch:#0f172a"></i><p><strong>Navy Penjaga</strong><span>#0F172A · stabilitas &amp; kepercayaan</span></p></div><div><i style="--swatch:#2563eb"></i><p><strong>Biru Aksi</strong><span>#2563EB · kejelasan &amp; aksi</span></p></div><div><i style="--swatch:#0f8f80"></i><p><strong>Teal Jeda</strong><span>#0F8F80 · keseimbangan &amp; rasa aman</span></p></div><div><i style="--swatch:#c66a49"></i><p><strong>Terakota Manusia</strong><span>#C66A49 · energi &amp; kedekatan manusia</span></p></div><div><i style="--swatch:#f8fafc"></i><p><strong>Putih Kanvas</strong><span>#F8FAFC · keterbukaan &amp; ruang bernapas</span></p></div></div><div class="about-color-theory"><div><strong>Teori warna lintas budaya</strong><span>Warna + label + ikon</span></div><p>Dalam desain digital global, navy dan biru sering dikaitkan dengan kepercayaan dan kejelasan; teal dengan keseimbangan dan rasa aman; terakota dengan energi serta kedekatan manusia; putih dengan keterbukaan.</p><small>Makna warna dapat berbeda antarbudaya. Karena itu HADANGIN selalu memasangkan warna dengan label, ikon, dan kontras yang jelas.</small></div></section></div>
    </div></div></section>
    <section class="section about-direction"><div class="page-shell"><div class="about-direction-head"><p class="section-kicker">Arah gerak</p><span>HADANGIN &middot; AI Context Guard Web Indonesia</span></div><div class="about-vision-mission"><article class="about-vision"><span>VISI</span><h2>Mewujudkan masyarakat digital yang tangguh, kritis, dan tetap memegang kendali atas keputusannya di tengah perkembangan AI dan manipulasi informasi.</h2></article><div class="about-missions"><div><span>01</span><div><strong>Bangun kebiasaan jeda</strong><p>Menjadikan berhenti sejenak sebagai respons pertama sebelum klik, transfer, scan, atau membagikan.</p></div></div><div><span>02</span><div><strong>Jelaskan, jangan menghakimi</strong><p>Menyajikan sinyal AI dan XAI dengan bahasa yang mudah dipahami tanpa mengambil alih keputusan.</p></div></div><div><span>03</span><div><strong>Bawa literasi ke ruang bersama</strong><p>Mengubah latihan berpikir kritis menjadi pengalaman bermain yang relevan bagi keluarga, sekolah, dan komunitas.</p></div></div><div><span>04</span><div><strong>Jaga pilihan manusia dan privasi</strong><p>Memprioritaskan perlindungan data, aksesibilitas, dan kendali manusia, termasuk kebebasan untuk mempertanyakan atau menolak rekomendasi AI.</p></div></div></div></div></div></section>
    <section class="section section-white"><div class="page-shell"><div class="section-header"><p class="section-kicker">Masalah yang dihadapi</p><h2>Kesenjangan antara Informasi dan Tindakan</h2><p>Manipulasi digital sering berhasil bukan hanya karena terlihat meyakinkan, tetapi karena memanfaatkan urgency, fear, authority, trust, scarcity, atau emotional attachment. Tekanan ini dapat membuat manusia bereaksi sebelum sempat memeriksa konteks dan bukti.</p></div><div class="problem-flow"><div class="problem-node">INFORMASI</div><div class="problem-arrow">&#8594;</div><div class="problem-node pressure">TEKANAN PSIKOLOGIS</div><div class="problem-arrow">&#8594;</div><div class="problem-node risk">TINDAKAN IMPULSIF</div></div><div class="jeda-interrupt"><span class="jeda-badge">J.E.D.A.</span><p><strong>HADANGIN menyisipkan ruang berpikir.</strong><br>Dalam bahasa Indonesia, jeda berarti berhenti atau mengambil jarak sejenak sebelum bereaksi. J.E.D.A. menerjemahkan Pause, Question, Check, Decide ke dalam logika budaya Gobak Sodor: menahan informasi di batas sebelum berubah menjadi tindakan berisiko.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="section-header"><p class="section-kicker">Prinsip produk</p><h2>Dibangun untuk memperkuat agensi manusia</h2></div><div class="principle-grid four"><article class="card principle-card"><h3>Accessible</h3><p>Mobile-first, hemat bandwidth, dan menggunakan bahasa yang sederhana.</p></article><article class="card principle-card"><h3>Reflective, Not Punitive</h3><p>Tidak mempermalukan pengguna ketika penilaian awalnya keliru.</p></article><article class="card principle-card"><h3>Human Agency</h3><p>AI mendukung keputusan, bukan mengambil alih keputusan.</p></article><article class="card principle-card"><h3>Locally Grounded</h3><p>Berangkat dari konteks digital Indonesia dengan prinsip yang dapat digunakan lintas budaya.</p></article></div></div></section>
    <section class="section section-dark"><div class="page-shell"><div class="section-header"><p class="section-kicker">Untuk siapa</p><h2>Literasi yang dekat dengan kehidupan digital sehari-hari</h2><p>Ditujukan bagi pengguna digital, anak muda, keluarga, komunitas, pendidik, organisasi pemuda, advokat MIL, peneliti, dan pemangku kebijakan.</p></div><div class="chip-row"><span class="chip chip-blue">Everyday Digital Users</span><span class="chip chip-blue">Youth &amp; Young Adults</span><span class="chip chip-blue">Family &amp; Community</span><span class="chip chip-terra">Educators</span><span class="chip chip-terra">MIL Advocates</span><span class="chip chip-terra">Researchers</span></div></div></section>`;
}

function enterprisePage() {
  const expansions = [
    {
      code: "EDU",
      title: "HADANGIN untuk Pendidikan",
      audience: "Sekolah dan universitas",
      description: "Pembelajaran MIL berbasis permainan untuk melatih siswa berhenti, memeriksa bukti, dan merefleksikan keputusan sebelum bereaksi terhadap informasi.",
      features: ["Modul skenario sesuai tingkat belajar", "Mode kelas dan kit fasilitator", "Insight pembelajaran tingkat kelompok"],
      outcome: "Kebiasaan literasi yang dapat dipraktikkan dan diukur",
      subscription: "Lisensi pembelajaran per institusi",
      delivery: "Akses tahunan untuk modul kelas, kit fasilitator, dan dashboard kelompok. Pilot disesuaikan dengan jumlah kelas dan dukungan implementasi.",
    },
    {
      code: "ORG",
      title: "HADANGIN untuk Organisasi",
      audience: "Tim, perusahaan, dan institusi",
      description: "Membantu pegawai mengambil jeda sebelum menanggapi phishing, impersonation, permintaan transfer, dan tindakan social engineering.",
      features: ["Simulasi berbasis risiko organisasi", "Latihan phishing dan impersonation", "Dashboard perubahan keputusan"],
      outcome: "Lebih sedikit tindakan impulsif pada momen berisiko",
      subscription: "Langganan ketahanan tenaga kerja",
      delivery: "Akses tahunan berbasis pengguna aktif, paket simulasi risiko, serta insight agregat untuk tim keamanan dan pembelajaran.",
    },
    {
      code: "NEWS",
      title: "HADANGIN untuk Newsroom",
      audience: "Jurnalis dan tim editorial",
      description: "Mendukung jurnalis menilai sumber mencurigakan, petunjuk manipulasi, dan risiko informasi sebelum engagement atau publikasi.",
      features: ["Intake sumber multimodal", "XAI untuk petunjuk manipulasi", "Checkpoint verifikasi editorial"],
      outcome: "Keputusan publikasi yang lebih transparan dan terlacak",
      subscription: "Lisensi workspace editorial",
      delivery: "Akses tahunan per newsroom untuk intake sumber, checkpoint editorial, dan riwayat keputusan yang dapat ditinjau.",
    },
  ];
  return `<section class="enterprise-hero"><img src="${HADANGIN_MARK_URL}" alt="" aria-hidden="true" /><div class="page-shell enterprise-hero-grid"><div><p class="eyebrow">Future Expansion &middot; Enterprise</p><h1>Dari kebiasaan individu menuju ketahanan informasi institusi.</h1><p>HADANGIN dirancang berkembang dari prototipe literasi menjadi lapisan intervensi perilaku untuk membantu institusi mengurangi tindakan digital impulsif dan reaktif akibat tekanan psikologis, dengan manusia tetap memegang keputusan akhir.</p><div class="enterprise-hero-actions"><a class="button" href="#/verify">Jelajahi Prototipe <span aria-hidden="true">&#8594;</span></a><a class="button button-secondary" href="#/community">Lihat Mode Komunitas</a></div></div><aside class="enterprise-positioning"><span>ARAH PRODUK</span><strong>Satu metode, tiga konteks institusional.</strong><div><p><b>01</b> Human First</p><p><b>02</b> AI + XAI</p><p><b>03</b> Human Final</p></div><small>Konsep roadmap untuk kemitraan dan pilot.</small></aside></div></section>
    <section class="section enterprise-expansion"><div class="page-shell"><div class="enterprise-section-head"><div><p class="section-kicker">Ekspansi masa depan</p><h2>Tiga jalur produk dengan fondasi MIL yang sama.</h2></div><p>Setiap versi menyesuaikan skenario, bahasa risiko, alur kerja, dan ukuran dampak tanpa mengubah prinsip HADANGIN: jeda sebelum tindakan.</p></div><div class="enterprise-offer-grid">${expansions.map((item, index) => `<article class="enterprise-offer"><div class="enterprise-offer-top"><span>${item.code}</span><small>0${index + 1} / MODUL MASA DEPAN</small></div><p class="enterprise-audience">${item.audience}</p><h3>${item.title}</h3><p>${item.description}</p><ul>${item.features.map((feature) => `<li>${feature}</li>`).join("")}</ul><div class="enterprise-outcome"><span>Hasil yang dituju</span><strong>${item.outcome}</strong></div><details class="enterprise-subscription"><summary>Subscription <span aria-hidden="true">+</span></summary><div><span class="enterprise-future-status">Konsep &middot; Belum tersedia</span><small>MODEL BISNIS MASA DEPAN</small><strong>${item.subscription}</strong><p>${item.delivery}</p><button class="button button-small" type="button" data-scroll-to="enterprise-partnership">Jelajahi Konsep Pilot <span aria-hidden="true">&#8594;</span></button></div></details></article>`).join("")}</div></div></section>
    <section class="section enterprise-platform"><div class="page-shell"><div class="enterprise-platform-head"><div><p class="section-kicker">Platform yang dapat berkembang</p><h2>Satu mesin intervensi, disesuaikan untuk setiap institusi.</h2></div><p>Arsitektur masa depan menghubungkan pemeriksaan multimodal, latihan J.E.D.A., penjelasan XAI, dan insight agregat dalam alur yang dapat dikonfigurasi.</p></div><div class="enterprise-stack" aria-label="Lapisan platform enterprise HADANGIN"><article><span>01</span><strong>Input Multimodal</strong><p>Teks, gambar, audio, QR, dan tautan.</p></article><i>&#8594;</i><article><span>02</span><strong>Behavioral Guardrail</strong><p>Human First dan checkpoint J.E.D.A.</p></article><i>&#8594;</i><article><span>03</span><strong>Explainable AI</strong><p>Sinyal, bukti, ketidakpastian, dan langkah verifikasi.</p></article><i>&#8594;</i><article><span>04</span><strong>Institution Insight</strong><p>Pola risiko dan perubahan keputusan secara agregat.</p></article></div><div class="enterprise-principles"><div><strong>Privacy by design</strong><p>Pemrosesan dan retensi data dapat disesuaikan dengan kebijakan institusi.</p></div><div><strong>Human accountability</strong><p>AI mendukung keputusan; pengguna dan organisasi tetap menentukan tindakan.</p></div><div><strong>Measurable MIL</strong><p>Dampak dilihat dari perubahan kebiasaan, bukan hanya jumlah deteksi.</p></div></div></div></section>
    <section class="section enterprise-roadmap"><div class="page-shell"><div class="enterprise-roadmap-grid"><div><p class="section-kicker">Roadmap kemitraan</p><h2>Mulai dari pilot kecil, lalu buktikan dampaknya.</h2><p>Ekspansi dirancang bertahap agar setiap fitur dibangun bersama pengguna nyata dan dapat dievaluasi secara bertanggung jawab.</p></div><ol><li><span>SEKARANG</span><strong>Prototype</strong><p>Validasi alur individu, game J.E.D.A., dan mode komunitas.</p></li><li><span>BERIKUTNYA</span><strong>Pilot</strong><p>Uji modul dengan sekolah, organisasi, atau newsroom mitra.</p></li><li><span>MASA DEPAN</span><strong>Enterprise Platform</strong><p>Integrasi, kebijakan khusus, dan insight agregat berbasis kebutuhan.</p></li></ol></div><div class="enterprise-cta" id="enterprise-partnership"><div><span>HADANGIN FOR INSTITUTIONS</span><h2>Bangun refleks sebelum risiko berubah menjadi tindakan.</h2><p>Mulai dengan pilot terbatas untuk memvalidasi skenario, kebutuhan integrasi, dan ukuran dampak yang paling relevan.</p></div><a class="button" href="#/community">Mulai dari Mode Komunitas <span aria-hidden="true">&#8594;</span></a></div></div></section>`;
}

function startScenario(id) {
  const scenario = scenarios.find((item) => item.id === id) || scenarios[0];
  resetFlow();
  state.content = scenario.payload || scenario.content;
  state.casePrompt = scenario.content;
  state.inputType = scenario.inputType || "text";
  state.qrInputMode = scenario.inputMode || "link";
  state.fileName = "";
  state.fileMeta = null;
  state.mediaContext = "";
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
  } else if (target.matches("[data-language-toggle]")) {
    setLanguage(currentLanguage() === "en" ? "id" : "en");
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
    if (nextType !== state.inputType && ["image", "audio", "qr"].includes(nextType)) {
      state.fileName = "";
      state.fileMeta = null;
      state.mediaContext = "";
      state.imageDataUrl = "";
      state.audioDataUrl = "";
      state.qrImageDataUrl = "";
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
    state.fileMeta = null;
    state.mediaContext = "";
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
      arenaRuntime.guardY = Math.min(arenaRuntime.yMax, Math.max(arenaRuntime.yMin, arenaRuntime.guardY + (control === "down" ? arenaRuntime.nudge : -arenaRuntime.nudge)));
      state.guardY = arenaRuntime.guardY;
      if (arenaRuntime.guard) arenaRuntime.guard.style.top = `${arenaRuntime.guardY}%`;
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
    state.fileMeta = null;
    state.mediaContext = "";
    state.imageDataUrl = "";
    state.content = "";
    render({ preserveScroll: true });
  } else if (action === "remove-audio") {
    state.fileName = "";
    state.fileMeta = null;
    state.mediaContext = "";
    state.audioDataUrl = "";
    state.content = "";
    render({ preserveScroll: true });
  } else if (action === "remove-qr") {
    state.fileName = "";
    state.fileMeta = null;
    state.mediaContext = "";
    state.qrImageDataUrl = "";
    state.content = "";
    render({ preserveScroll: true });
  } else if (action === "direct-ai" || action === "start-check") {
    const textarea = document.querySelector("#content-input");
    if (textarea?.value.trim()) state.content = textarea.value.trim();
    if (["image", "audio"].includes(state.inputType) && !state.fileName) return showToast("Pilih file terlebih dahulu.");
    if (state.inputType === "qr" && state.qrInputMode === "image" && !state.fileName) return showToast("Pilih gambar QR terlebih dahulu.");
    if (state.inputType === "qr" && state.qrInputMode === "link" && !state.content.trim().match(/^https?:\/\//i)) return showToast("Masukkan tautan yang valid, diawali http:// atau https://.");
    if (!state.content && !state.fileName) return showToast("Masukkan konten atau pilih file terlebih dahulu.");
    state.scenarioId = inferAnalysisPreset();
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
    state.scenarioId = inferAnalysisPreset();
    state.aiWrong = false;
    state.trainingScenario = false;
    state.casePrompt = "";
  }
  if (event.target.matches("#media-context-input")) {
    state.mediaContext = event.target.value;
    state.scenarioId = inferAnalysisPreset();
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

function inspectImageFile(dataUrl, file) {
  return new Promise((resolve) => {
    const image = new Image();
    const basicMeta = { size: file.size, type: file.type };
    image.addEventListener("load", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 96;
        canvas.height = Math.max(48, Math.min(96, Math.round(96 * image.naturalHeight / image.naturalWidth)));
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(basicMeta);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const cellsX = 4;
        const cellsY = 3;
        const cellWidth = Math.floor(canvas.width / cellsX);
        const cellHeight = Math.floor(canvas.height / cellsY);
        const cells = [];
        let totalLuma = 0;
        let totalPixels = 0;
        for (let row = 0; row < cellsY; row += 1) {
          for (let column = 0; column < cellsX; column += 1) {
            const pixels = context.getImageData(column * cellWidth, row * cellHeight, cellWidth, cellHeight).data;
            let sum = 0;
            let sumSquared = 0;
            for (let index = 0; index < pixels.length; index += 4) {
              const luma = (pixels[index] * .2126) + (pixels[index + 1] * .7152) + (pixels[index + 2] * .0722);
              sum += luma;
              sumSquared += luma * luma;
            }
            const count = pixels.length / 4;
            const mean = sum / count;
            cells.push({
              x: (column * 25) + 2,
              y: (row * (100 / cellsY)) + 2,
              w: 21,
              h: 28,
              variance: (sumSquared / count) - (mean * mean),
            });
            totalLuma += sum;
            totalPixels += count;
          }
        }
        const hotspots = cells.sort((left, right) => right.variance - left.variance).slice(0, 3).map(({ variance, ...cell }) => cell);
        resolve({
          ...basicMeta,
          width: image.naturalWidth,
          height: image.naturalHeight,
          orientation: image.naturalWidth > image.naturalHeight ? "lanskap" : image.naturalWidth < image.naturalHeight ? "potret" : "persegi",
          averageLuma: Math.round(totalLuma / totalPixels),
          hotspots,
        });
      } catch {
        resolve(basicMeta);
      }
    }, { once: true });
    image.addEventListener("error", () => resolve(basicMeta), { once: true });
    image.src = dataUrl;
  });
}

function inspectAudioFile(dataUrl, file) {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    let settled = false;
    const finish = (duration = null) => {
      if (settled) return;
      settled = true;
      resolve({ size: file.size, type: file.type, duration: Number.isFinite(duration) ? duration : null });
    };
    audio.addEventListener("loadedmetadata", () => finish(audio.duration), { once: true });
    audio.addEventListener("error", () => finish(), { once: true });
    window.setTimeout(() => finish(), 3000);
    audio.preload = "metadata";
    audio.src = dataUrl;
  });
}

function processUploadedFile(file) {
  if (file.size > 10 * 1024 * 1024) return showToast("Ukuran file melebihi batas 10 MB.");
  const expectsImage = state.inputType === "image" || (state.inputType === "qr" && state.qrInputMode === "image");
  const expectsAudio = state.inputType === "audio";
  if (expectsImage && !file.type.startsWith("image/")) return showToast("Pilih file gambar PNG, JPG, atau WEBP.");
  if (expectsAudio && !file.type.startsWith("audio/")) return showToast("Pilih file audio MP3, WAV, atau M4A.");
  state.fileName = file.name;
  state.fileMeta = { size: file.size, type: file.type };
  state.mediaContext = "";
  state.content = `${expectsAudio ? "Rekaman audio" : state.inputType === "qr" ? "Gambar QR" : "Gambar"}: ${file.name}`;
  state.scenarioId = expectsAudio ? "audio-impersonation" : state.inputType === "qr" ? "qr-payment" : "manipulated-media";
  state.aiWrong = false;
  state.trainingScenario = false;
  state.casePrompt = "";
  state.xaiMode = "bounding";
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    const dataUrl = String(reader.result);
    const uploadedName = file.name;
    if (expectsAudio) state.audioDataUrl = dataUrl;
    else if (state.inputType === "qr") state.qrImageDataUrl = dataUrl;
    else state.imageDataUrl = dataUrl;
    render({ preserveScroll: true });
    const metadata = expectsAudio ? await inspectAudioFile(dataUrl, file) : await inspectImageFile(dataUrl, file);
    if (state.fileName !== uploadedName) return;
    state.fileMeta = metadata;
    state.scenarioId = inferAnalysisPreset();
    render({ preserveScroll: true });
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
  if (!stage || event.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = stage.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
  const pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  const x = pointerX * -18;
  const y = pointerY * -12;
  stage.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
  stage.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
  stage.style.setProperty("--scene-tilt-x", `${(pointerY * -3.2).toFixed(2)}deg`);
  stage.style.setProperty("--scene-tilt-y", `${(pointerX * 4.2).toFixed(2)}deg`);
  stage.style.setProperty("--modal-tilt-x", `${(pointerY * 1.1).toFixed(2)}deg`);
  stage.style.setProperty("--modal-tilt-y", `${(pointerX * -1.5).toFixed(2)}deg`);
  stage.style.setProperty("--ui-x", `${(pointerX * 8).toFixed(2)}px`);
  stage.style.setProperty("--ui-y", `${(pointerY * 6).toFixed(2)}px`);
  stage.style.setProperty("--light-x", `${Math.round(50 + pointerX * 70)}%`);
  stage.style.setProperty("--light-y", `${Math.round(38 + pointerY * 48)}%`);
});

document.addEventListener("pointerout", (event) => {
  const stage = event.target.closest?.(".hadang-game-stage");
  if (!stage || stage.contains(event.relatedTarget)) return;
  stage.style.setProperty("--scene-x", "0px");
  stage.style.setProperty("--scene-y", "0px");
  stage.style.setProperty("--scene-tilt-x", "0deg");
  stage.style.setProperty("--scene-tilt-y", "0deg");
  stage.style.setProperty("--modal-tilt-x", "0deg");
  stage.style.setProperty("--modal-tilt-y", "0deg");
  stage.style.setProperty("--ui-x", "0px");
  stage.style.setProperty("--ui-y", "0px");
  stage.style.setProperty("--light-x", "50%");
  stage.style.setProperty("--light-y", "38%");
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
  const controlButton = event.target.closest?.("[data-game-control]");
  const control = controlButton?.dataset.gameControl;
  if (arenaRuntime && ["up", "down"].includes(control)) {
    event.preventDefault();
    controlButton.classList.add("is-pressed");
    controlButton.setPointerCapture?.(event.pointerId);
    arenaKeys.add(control === "up" ? "arrowup" : "arrowdown");
    return;
  }

  const stage = event.target.closest?.(".arena-stage.interactive-arena");
  if (!arenaRuntime || !stage || event.target.closest?.("button, .arena-controls")) return;
  event.preventDefault();
  moveArenaGuardTo(event.clientY);
});

document.addEventListener("pointerup", (event) => {
  event.target.closest?.("[data-game-control]")?.classList.remove("is-pressed");
  releaseArenaDirection();
});

document.addEventListener("pointercancel", releaseArenaDirection);
window.addEventListener("blur", releaseArenaDirection);

window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#/verify");
render();
if (savedLanguage === "en") setLanguage("en", false);

// Exposed only for the local browser regression harness.
Object.assign(window, { DEFAULT_MESSAGE, state, render, resetFlow, startScenario, processUploadedFile, setLanguage, translateToEnglish });
