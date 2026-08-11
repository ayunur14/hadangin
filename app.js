const DEFAULT_MESSAGE = "Nak, Mama kecelakaan. HP Mama rusak. Transfer Rp3 juta sekarang ke rekening ini. Tolong cepat, ya!";

const scenarios = [
  {
    id: "family-emergency",
    no: "01",
    title: "Pesan Keluarga Darurat",
    description: "Nomor baru mengaku sebagai keluarga dan meminta transfer segera.",
    triggers: ["Urgency", "Fear", "Attachment"],
    content: DEFAULT_MESSAGE,
    featured: true,
  },
  {
    id: "qr-payment",
    no: "02",
    title: "QR Pembayaran",
    description: "QR pengganti ditempel di atas kode pembayaran resmi sebuah merchant.",
    triggers: ["Trust", "Habit", "Convenience"],
    content: "QR di meja kasir sedang bermasalah. Scan kode baru ini agar pembayaran langsung diproses.",
  },
  {
    id: "job-offer",
    no: "03",
    title: "Lowongan Kerja",
    description: "Tawaran kerja bergaji tinggi meminta deposit untuk proses administrasi.",
    triggers: ["Hope", "Authority", "Scarcity"],
    content: "Selamat, Anda lolos seleksi awal. Transfer biaya administrasi hari ini untuk mengamankan posisi.",
  },
  {
    id: "bank-message",
    no: "04",
    title: "Pesan Bank",
    description: "Pesan mengancam pemblokiran rekening dan mengarahkan ke sebuah tautan.",
    triggers: ["Fear", "Authority", "Urgency"],
    content: "Rekening Anda akan diblokir dalam 30 menit. Klik tautan ini untuk verifikasi identitas.",
  },
  {
    id: "viral-info",
    no: "05",
    title: "Informasi Viral",
    description: "Unggahan emosional mendorong pengguna menyebarkan klaim tanpa sumber.",
    triggers: ["Anger", "Social Pressure"],
    content: "Mereka tidak ingin kamu tahu fakta ini. Sebarkan sekarang sebelum unggahan dihapus!",
  },
  {
    id: "manipulated-media",
    no: "06",
    title: "Media Manipulatif",
    description: "Video tokoh publik tampak nyata, tetapi konteks dan sumbernya tidak jelas.",
    triggers: ["Realism", "Authority"],
    content: "Video eksklusif tokoh publik membagikan peluang investasi yang hanya tersedia hari ini.",
  },
  {
    id: "ai-can-be-wrong",
    no: "07",
    title: "AI Bisa Salah",
    description: "Bukti resmi dapat lebih kuat daripada sinyal AI. Latih keberanian untuk tidak setuju.",
    triggers: ["Automation Bias"],
    content: "Pemberitahuan resmi: jadwal layanan berubah. Periksa pembaruan pada aplikasi resmi.",
    aiWrong: true,
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

function activeProfile() {
  return scenarioProfiles[state.scenarioId] || scenarioProfiles["family-emergency"];
}

const state = {
  route: "verify",
  inputType: "text",
  content: DEFAULT_MESSAGE,
  fileName: "",
  inFlow: false,
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
  scenarioId: "family-emergency",
  aiWrong: false,
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let toastTimer;

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
    aiWrong: false,
  });
}

function goToRoute(route) {
  const hashes = { verify: "#/verify", training: "#/training", how: "#/how-it-works", about: "#/about" };
  location.hash = hashes[route];
}

function render(options = {}) {
  const previousScroll = window.scrollY;
  const previousPanelScroll = document.querySelector(".game-question-panel")?.scrollTop || 0;
  state.route = routeFromHash();
  setActiveNav();
  if (state.route === "training") app.innerHTML = trainingPage();
  else if (state.route === "how") app.innerHTML = howPage();
  else if (state.route === "about") app.innerHTML = aboutPage();
  else app.innerHTML = state.inFlow ? verificationFlow() : verifyPage();
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
        <source src="assets/hadang-hero-animation.mp4" type="video/mp4" />
      </video>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">UNESCO Media &amp; Information Literacy</p>
          <h1>Hadang Sebelum Terjebak.</h1>
          <p class="lead">Analisis informasi mencurigakan, kenali tekanan psikologisnya, dan gunakan AI sebagai second opinion sebelum kamu klik, transfer, scan, atau membagikannya.</p>
          <div class="hero-actions button-row">
            <button class="button" data-scroll-to="verify-tool">Mulai Pemeriksaan <span aria-hidden="true">&#8594;</span></button>
            <a class="button button-secondary" href="#/training">Coba Latihan</a>
          </div>
          <div class="hero-principle"><span>Human First</span><i></i><span>AI Second</span><i></i><span>Human Final</span></div>
        </div>
      </div>
      <span class="hero-scroll">Gulir untuk memeriksa</span>
    </section>`;
}

function verifyPage() {
  return `${hero()}
    <section class="section" id="verify-tool">
      <div class="page-shell">
        <div class="section-header center">
          <p class="section-kicker">Mulai dari penilaianmu</p>
          <h2>Periksa Informasi Mencurigakan</h2>
          <p>Masukkan konten yang ingin kamu evaluasi. AI belum akan memberikan keputusan sampai kamu membentuk penilaian awal.</p>
        </div>
        <div class="card tool-card">
          <div class="card-header">
            <div><h3>Pilih jenis konten</h3><p>Gunakan contoh yang tersedia atau masukkan kontenmu sendiri.</p></div>
            <span class="status-pill">Simulasi frontend</span>
          </div>
          <div class="tabs" role="tablist" aria-label="Jenis konten">
            ${tabButton("image", "Gambar / Screenshot")}
            ${tabButton("text", "Teks / Pesan")}
            ${tabButton("audio", "Audio")}
            ${tabButton("qr", "QR / Link")}
          </div>
          ${inputPane()}
          <div class="privacy-note">Konten hanya diproses di perangkat ini untuk kebutuhan simulasi dan tidak dikirim ke server.</div>
          <div class="card-footer-action"><button class="button" data-action="start-check">Mulai Pemeriksaan <span aria-hidden="true">&#8594;</span></button></div>
        </div>
      </div>
    </section>
    <div class="feature-strip" aria-label="Prinsip pemeriksaan">
      <article><span class="feature-number">01 / MANUSIA</span><h3>Bentuk penilaian awal</h3><p>Respons dan keyakinanmu dicatat sebelum sinyal AI ditampilkan.</p></article>
      <article><span class="feature-number">02 / J.E.D.A.</span><h3>Hadang di empat garis nalar</h3><p>Kenali tekanan, emosi, data, dan risiko aksi yang diminta.</p></article>
      <article><span class="feature-number">03 / KEPUTUSAN</span><h3>Bandingkan, lalu putuskan</h3><p>AI memberi second opinion. Keputusan final tetap berada padamu.</p></article>
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
    return `<div class="input-zone"><div class="upload-content"><div class="upload-symbol" aria-hidden="true">#</div><strong>Masukkan QR atau tautan</strong><p>Tempel alamat tujuan yang ingin dievaluasi. Tautan tidak akan dibuka.</p><textarea id="content-input" aria-label="QR atau tautan mencurigakan" placeholder="https://contoh-tautan.com">${state.content.startsWith("http") ? escapeHtml(state.content) : ""}</textarea></div></div>`;
  }
  const isAudio = state.inputType === "audio";
  return `<div class="input-zone"><div class="upload-content"><div class="upload-symbol" aria-hidden="true">${isAudio ? "~" : "+"}</div><strong>${state.fileName ? escapeHtml(state.fileName) : `Pilih ${isAudio ? "rekaman audio" : "gambar atau screenshot"}`}</strong><p>${isAudio ? "MP3, WAV, atau M4A hingga 10 MB" : "PNG, JPG, atau WEBP hingga 10 MB"}</p><label class="button button-secondary" for="file-input">Pilih File</label><input class="file-input" id="file-input" type="file" accept="${isAudio ? "audio/*" : "image/*"}" /></div></div>`;
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
  return `<div class="flow-card">
    <header><p class="section-kicker">Human First</p><h2>Sebelum AI Membantu...</h2><p>Kami ingin tahu bagaimana kamu membaca situasi ini terlebih dahulu.</p></header>
    <div class="message-panel"><span class="label">Informasi yang diperiksa</span><blockquote>${escapeHtml(state.content || DEFAULT_MESSAGE)}</blockquote></div>
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
      <div class="live-readout"><span class="live-dot"></span><div><small>STATUS ARENA</small><strong>Informasi tertahan di garis ${guardNames[state.hadangStep]}</strong></div><span class="risk-meter"><i></i><i></i><i></i></span></div>
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
      <p>Gerakkan empat penjaga J.E.D.A. dengan menjawab pertanyaan. Setiap jawaban menghentikan informasi di satu garis nalar.</p>
      <div class="start-rules"><span><b>J</b> Jeda</span><span><b>E</b> Emosi</span><span><b>D</b> Data</span><span><b>A</b> Aksi</span></div>
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
  return `<div class="hadang-game-stage ${intro ? "intro-stage" : "arena-stage"}" style="--token-left:${tokenLeft}%" aria-label="Arena Gobak Sodor Hadang Nalar, garis aktif ${guards[activeStep][1]}">
    <div class="game-stage-art" aria-hidden="true"></div>
    <div class="game-stage-shade" aria-hidden="true"></div>
    <div class="game-hud"><span class="hud-badge">LEVEL 01</span><span class="hud-status"><i></i>${intro ? "4 garis nalar" : `Garis ${activeStep + 1} dari 4`}</span></div>
    <div class="incoming-zone"><span>MASUK</span></div>
    ${guards.map(([letter, name, left], index) => {
      const status = index < activeStep && !intro ? "done" : index === activeStep ? "active" : "locked";
      return `<span class="checkpoint-line ${status}" style="--guard-left:${left}%" aria-hidden="true"></span><button class="guard-marker ${status}" style="--guard-left:${left}%" type="button" ${status === "active" ? 'data-action="focus-question"' : 'tabindex="-1"'} aria-label="Penjaga ${name}, ${status === "done" ? "selesai" : status === "active" ? "aktif" : "terkunci"}"><b>${letter}</b><span>${name}</span>${status === "done" ? "<i>&#10003;</i>" : ""}</button>`;
    }).join("")}
    <div class="info-runner ${intro ? "is-running" : ""}"><span class="runner-card"><i></i><i></i><i></i></span><strong>INFO</strong><small>mencurigakan</small></div>
    <div class="action-gate"><span>TINDAKAN</span><small>Jangan biarkan lolos</small></div>
    <div class="game-mission-bar"><span>${intro ? "Informasi bergerak menuju aksi" : stageMessages[activeStep]}</span><div class="mission-pips">${guards.map((_, index) => `<i class="${index < activeStep && !intro ? "done" : index === activeStep ? "active" : ""}"></i>`).join("")}</div></div>
  </div>`;
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

function aiLens() {
  const profile = activeProfile();
  return `<div class="flow-card">
    <header class="ai-header"><span class="ai-scan-icon" aria-hidden="true"></span><div><p class="section-kicker">AI Second</p><h2>AI Lens</h2><p>Second opinion - bukan keputusan akhir.</p></div></header>
    <div class="ai-notice-grid">${profile.aiNotices.map(([label, value]) => `<div class="signal-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <div class="forensic-meter"><div class="forensic-meter-head"><strong>${state.aiWrong ? "Suspicious Signals" : "Manipulation Signals"}: ${profile.aiLevel}</strong><span>${profile.aiScore}% indikator model</span></div><div class="meter"><span style="width:${profile.aiScore}%"></span></div><p>Nilai ini menunjukkan sinyal model, bukan kebenaran final.</p></div>
    <div class="ai-columns">
      <section class="info-panel unknown"><h3>Yang belum dapat dipastikan AI</h3><ul>${profile.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section class="info-panel verify"><h3>Yang dapat kamu verifikasi</h3><ul>${profile.verification.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    </div>
    <div class="flow-actions"><button class="button button-ghost" data-action="back-to-hadang">Kembali ke J.E.D.A.</button><button class="button" data-action="compare-judgment">Bandingkan dengan Penilaian Saya</button></div>
  </div>`;
}

function humanFinal() {
  const profile = activeProfile();
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
  const profile = activeProfile();
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

function trainingPage() {
  return `<section class="page-hero"><div class="page-shell"><p class="eyebrow">Latihan Hadang</p><h1>Latih Nalar Sebelum Situasi Nyata Datang.</h1><p>Hadapi simulasi manipulasi digital yang dekat dengan kehidupan sehari-hari. Setiap skenario berlangsung sekitar dua menit.</p></div></section>
    <section class="section"><div class="page-shell">
      <div class="section-header"><p class="section-kicker">7 skenario interaktif</p><h2>Pilih arena latihan</h2><p>Mulai dari pesan keluarga untuk melihat seluruh alur, atau uji automation bias pada skenario khusus.</p></div>
      <div class="scenario-grid">${scenarios.map((scenario) => `<article class="scenario-card ${scenario.featured ? "featured" : ""}"><span class="scenario-no">${scenario.no}</span><h3>${scenario.title}</h3><p>${scenario.description}</p><div class="chip-row">${scenario.triggers.map((trigger) => `<span class="chip ${scenario.featured ? "chip-terra" : ""}">${trigger}</span>`).join("")}</div><button class="button ${scenario.featured ? "" : "button-secondary"}" data-scenario="${scenario.id}">Mulai Skenario</button></article>`).join("")}</div>
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
  return `<section class="page-hero"><div class="page-shell"><p class="eyebrow">Cara Kerja</p><h1>Bagaimana HADANGIN Bekerja?</h1><p>Menggabungkan psikologi, Media and Information Literacy, AI forensics, dan human judgment dalam satu alur reflektif.</p></div></section>
    <section class="section section-white"><div class="page-shell"><div class="steps-grid">${steps.map(([title, text]) => `<article class="step-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>
    <section class="section"><div class="page-shell"><div class="dark-band"><div class="section-header"><p class="section-kicker">Human-centered AI</p><h2>AI adalah Lensa, Bukan Hakim.</h2><p>Label “aman”, “hoaks”, atau “scam” dapat membantu, tetapi tidak otomatis membangun kemampuan menilai ketika teknologi tidak tersedia.</p></div><div class="dark-mini-grid"><article><h3>Detect</h3><p>AI membantu menemukan pola dan sinyal yang mungkin terlewat.</p></article><article><h3>Explain</h3><p>AI menjelaskan mengapa sinyal muncul dan menunjukkan batasnya.</p></article><article><h3>Question</h3><p>AI membantu pengguna tahu bukti apa yang perlu diverifikasi.</p></article></div><p class="dark-footer-line">Keputusan akhir tetap milik manusia.</p></div></div></section>`;
}

function aboutPage() {
  return `<section class="page-hero"><div class="page-shell"><p class="eyebrow">Tentang Inisiatif</p><h1>Membangun Ketahanan terhadap Manipulasi Informasi Digital</h1><p>Inisiatif MIL dari Indonesia untuk membantu masyarakat berhenti, berpikir, memverifikasi, dan mengambil keputusan dengan lebih sadar.</p></div></section>
    <section class="section section-white"><div class="page-shell"><div class="section-header"><p class="section-kicker">Masalah yang dihadapi</p><h2>Kesenjangan antara Informasi dan Tindakan</h2><p>Manipulasi digital sering berhasil bukan hanya karena terlihat meyakinkan, tetapi karena memanfaatkan urgency, fear, authority, trust, scarcity, atau emotional attachment.</p></div><div class="problem-flow"><div class="problem-node">INFORMASI</div><div class="problem-arrow">&#8594;</div><div class="problem-node pressure">TEKANAN PSIKOLOGIS</div><div class="problem-arrow">&#8594;</div><div class="problem-node risk">TINDAKAN IMPULSIF</div></div><div class="jeda-interrupt"><span class="jeda-badge">J.E.D.A.</span><p><strong>HADANGIN menyisipkan ruang berpikir.</strong><br>Informasi dihadang sebelum dapat bergerak menuju tindakan berisiko.</p></div></div></section>
    <section class="section"><div class="page-shell"><div class="section-header"><p class="section-kicker">Prinsip produk</p><h2>Dibangun untuk memperkuat agensi manusia</h2></div><div class="principle-grid four"><article class="card principle-card"><h3>Accessible</h3><p>Mobile-first, hemat bandwidth, dan menggunakan bahasa yang sederhana.</p></article><article class="card principle-card"><h3>Reflective, Not Punitive</h3><p>Tidak mempermalukan pengguna ketika penilaian awalnya keliru.</p></article><article class="card principle-card"><h3>Human Agency</h3><p>AI mendukung keputusan, bukan mengambil alih keputusan.</p></article><article class="card principle-card"><h3>Locally Grounded</h3><p>Berangkat dari konteks digital Indonesia dengan prinsip yang dapat digunakan lintas budaya.</p></article></div></div></section>
    <section class="section section-dark"><div class="page-shell"><div class="section-header"><p class="section-kicker">Untuk siapa</p><h2>Literasi yang dekat dengan kehidupan digital sehari-hari</h2><p>Ditujukan bagi pengguna digital, anak muda, keluarga, komunitas, pendidik, organisasi pemuda, advokat MIL, peneliti, dan pemangku kebijakan.</p></div><div class="chip-row"><span class="chip chip-blue">Everyday Digital Users</span><span class="chip chip-blue">Youth &amp; Young Adults</span><span class="chip chip-blue">Family &amp; Community</span><span class="chip chip-terra">Educators</span><span class="chip chip-terra">MIL Advocates</span><span class="chip chip-terra">Researchers</span></div></div></section>`;
}

function startScenario(id) {
  const scenario = scenarios.find((item) => item.id === id) || scenarios[0];
  resetFlow();
  state.content = scenario.content;
  state.inputType = "text";
  state.scenarioId = scenario.id;
  state.aiWrong = Boolean(scenario.aiWrong);
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

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

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
  if (target.dataset.inputType) {
    const textarea = document.querySelector("#content-input");
    if (textarea) state.content = textarea.value.trim();
    state.inputType = target.dataset.inputType;
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
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
  if (target.dataset.scenario) {
    startScenario(target.dataset.scenario);
    return;
  }

  const action = target.dataset.action;
  if (!action) return;
  if (action === "focus-question") {
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
  } else if (action === "start-check") {
    const textarea = document.querySelector("#content-input");
    if (textarea?.value.trim()) state.content = textarea.value.trim();
    if (["image", "audio"].includes(state.inputType) && !state.fileName) return showToast("Pilih file terlebih dahulu.");
    if (state.inputType === "qr" && !state.content.trim().match(/^https?:\/\//i)) return showToast("Masukkan tautan yang valid, diawali http:// atau https://.");
    if (!state.content && !state.fileName) return showToast("Masukkan konten atau pilih file terlebih dahulu.");
    state.inFlow = true;
    state.stage = 2;
    render();
  } else if (action === "cancel-flow") {
    resetFlow(); render();
  } else if (action === "lock-initial") {
    state.stage = 3; state.hadangStep = -1; render();
  } else if (action === "enter-arena") {
    state.hadangStep = 0; state.questionOpen = true; render();
  } else if (action === "hadang-back") {
    if (state.hadangStep > 0) state.hadangStep -= 1;
    else state.hadangStep = -1;
    state.questionOpen = true;
    render();
  } else if (action === "hadang-next") {
    if (state.hadangStep < 3) state.hadangStep += 1;
    else state.stage = 4;
    state.questionOpen = true;
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
    state.scenarioId = "family-emergency";
    state.aiWrong = false;
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
    if (file.size > 10 * 1024 * 1024) return showToast("Ukuran file melebihi batas 10 MB.");
    state.fileName = file.name;
    state.content = `${state.inputType === "audio" ? "Rekaman audio" : "Gambar"}: ${file.name}`;
    state.scenarioId = "family-emergency";
    state.aiWrong = false;
    render();
    setTimeout(() => document.getElementById("verify-tool")?.scrollIntoView(), 0);
  }
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

window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#/verify");
render();
