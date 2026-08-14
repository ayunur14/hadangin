import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const workspace = resolve(import.meta.dirname, "..");
const profile = mkdtempSync(resolve(tmpdir(), "hadang-visual-"));
const output = resolve(workspace, "visual-checks");
const port = 9333;
const appUrl = process.env.HADANG_APP_URL || "file:///D:/Ayu%20Nur/unesco/index.html";
mkdirSync(output, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-crash-reporter",
  "--disable-breakpad",
  "--allow-file-access-from-files",
  "--autoplay-policy=no-user-gesture-required",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

async function browserTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((target) => target.type === "page" && target.url === "about:blank")
        || targets.find((target) => target.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint did not become available.");
}

class Cdp {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolvePromise, reject) => {
      this.socket.addEventListener("open", resolvePromise, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve: done, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else done(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolvePromise, reject) => {
      this.pending.set(id, { resolve: resolvePromise, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() { this.socket.close(); }
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) {
    const detail = response.exceptionDetails.exception?.description || response.exceptionDetails.text;
    throw new Error(detail);
  }
  return response.result.value;
}

async function click(cdp, selector, value) {
  const expression = value
    ? `(() => { const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((node) => node.dataset.value === ${JSON.stringify(value)}); if (!el) throw new Error(${JSON.stringify(`${selector} ${value}`)}); el.click(); return true; })()`
    : `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error(${JSON.stringify(selector)}); el.click(); return true; })()`;
  await evaluate(cdp, expression);
  await sleep(80);
}

async function openGameQuestion(cdp) {
  await evaluate(cdp, "state.gameRoundComplete = true; state.questionOpen = true; render();");
  await sleep(80);
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(resolve(output, name), Buffer.from(result.data, "base64"));
}

async function main() {
  const target = await browserTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const navigation = await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  if (navigation.errorText) throw new Error(navigation.errorText);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await evaluate(cdp, "Boolean(document.querySelector('.hero-copy'))")) break;
    await sleep(200);
  }
  await sleep(1800);

  const homeMetrics = await evaluate(cdp, `({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    menuDisplay: getComputedStyle(document.querySelector('.menu-toggle')).display,
    heroWidth: document.querySelector('.hero-copy').getBoundingClientRect().width,
    video: (() => {
      const media = document.querySelector('.hero-video');
      return { paused: media.paused, currentTime: media.currentTime, readyState: media.readyState, networkState: media.networkState, error: media.error?.code || null, width: media.videoWidth, height: media.videoHeight };
    })()
  })`);
  await screenshot(cdp, "mobile-home.png");

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await sleep(250);
  await screenshot(cdp, "desktop-home.png");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(150);

  await click(cdp, '[data-action="start-check"]');
  await screenshot(cdp, "mobile-human-first.png");
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await screenshot(cdp, "mobile-game-transition.png");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await sleep(180);
  await screenshot(cdp, "desktop-game-transition.png");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(120);
  await click(cdp, '[data-action="enter-arena"]');
  await openGameQuestion(cdp);
  await sleep(220);
  await click(cdp, '[data-multi="pressure"]', "Darurat");
  await screenshot(cdp, "mobile-hadang.png");
  await click(cdp, '[data-action="hide-question"]');
  const popupMetrics = await evaluate(cdp, `({
    modalClosed: !document.querySelector('.game-question-modal'),
    reopenVisible: Boolean(document.querySelector('.question-reopen'))
  })`);
  await screenshot(cdp, "mobile-game-field.png");
  await click(cdp, '[data-action="focus-question"]');
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await sleep(180);
  await screenshot(cdp, "desktop-hadang.png");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(120);
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await sleep(220);
  await click(cdp, '[data-multi="emotion"]', "Takut");
  await click(cdp, '[data-select="neutral-impact"]', "Ya");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await sleep(220);
  await click(cdp, '[data-select="evidence"]', "Telepon nomor ibu yang tersimpan");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await sleep(220);
  await click(cdp, '[data-select="requested-action"]', "Transfer");
  await click(cdp, '[data-select="consequence"]', "Kehilangan uang");
  await click(cdp, '[data-select="safer-action"]', "Telepon nomor tersimpan");
  await click(cdp, '[data-action="hadang-next"]');
  await screenshot(cdp, "mobile-ai-lens.png");
  await click(cdp, '[data-action="compare-judgment"]');
  await click(cdp, '[data-select="final-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-final"]');
  await click(cdp, '[data-multi="reflection"]', "Bukti / sumber");
  await click(cdp, '[data-select="priority"]', "Bukti independen");
  await click(cdp, '[data-action="show-result"]');
  await screenshot(cdp, "mobile-result.png");

  const finalMetrics = await evaluate(cdp, `({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    stage: document.querySelector('.mobile-progress-head span:last-child')?.textContent,
    title: document.querySelector('.flow-card h2')?.textContent
  })`);

  await cdp.send("Page.navigate", { url: `${appUrl}#/training` });
  await sleep(300);
  await click(cdp, '[data-scenario="qr-payment"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="pressure"]', "Tekanan sosial");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="emotion"]', "Percaya");
  await click(cdp, '[data-select="neutral-impact"]', "Sedikit");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  const qrMetrics = await evaluate(cdp, `({
    claim: document.querySelector('.split-evidence section p')?.textContent,
    hasCashierEvidence: [...document.querySelectorAll('[data-select="evidence"]')].some((node) => node.textContent.includes('kasir')),
    scrollWidth: document.documentElement.scrollWidth
  })`);

  await cdp.send("Page.navigate", { url: `${appUrl}#/training` });
  await sleep(300);
  await click(cdp, '[data-scenario="job-offer"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="pressure"]', "Kesempatan terbatas");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="emotion"]', "Harapan");
  await click(cdp, '[data-select="neutral-impact"]', "Ya");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  const jobMetrics = await evaluate(cdp, `({
    claim: document.querySelector('.split-evidence section p')?.textContent,
    hasOfficialHrEvidence: [...document.querySelectorAll('[data-select="evidence"]')].some((node) => node.textContent.includes('situs resmi perusahaan')),
    scrollWidth: document.documentElement.scrollWidth
  })`);

  await cdp.send("Page.navigate", { url: `${appUrl}#/training` });
  await sleep(300);
  await click(cdp, '[data-scenario="ai-can-be-wrong"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="pressure"]', "Tidak ada tekanan");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="emotion"]', "Tidak yakin");
  await click(cdp, '[data-select="neutral-impact"]', "Tidak");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-select="evidence"]', "Pembaruan yang sama di aplikasi resmi");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-select="requested-action"]', "Buka aplikasi resmi");
  await click(cdp, '[data-select="consequence"]', "Mengabaikan pengumuman sah");
  await click(cdp, '[data-select="safer-action"]', "Cocokkan dengan aplikasi resmi");
  await click(cdp, '[data-action="hadang-next"]');
  const aiWrongLens = await evaluate(cdp, `({
    meter: document.querySelector('.forensic-meter-head span')?.textContent,
    explainsFalsePositive: document.querySelector('.info-panel.unknown')?.textContent.includes('false positive')
  })`);
  await click(cdp, '[data-action="compare-judgment"]');
  await click(cdp, '[data-select="final-decision"]', "Saya tidak setuju dengan AI");
  await click(cdp, '[data-action="lock-final"]');
  await click(cdp, '[data-multi="reflection"]', "Verifikasi independen");
  await click(cdp, '[data-select="priority"]', "Bukti independen");
  await click(cdp, '[data-action="show-result"]');
  const aiWrongResult = await evaluate(cdp, `({
    title: document.querySelector('.flow-card h2')?.textContent,
    evidenceScore: [...document.querySelectorAll('.skill-row')].find((row) => row.textContent.includes('Pemeriksaan bukti'))?.querySelector('b')?.textContent,
    scrollWidth: document.documentElement.scrollWidth
  })`);

  await cdp.send("Page.navigate", { url: "about:blank" });
  await sleep(120);
  await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  await sleep(350);
  await click(cdp, '[data-scroll-to="verify-tool"]');
  await click(cdp, '[data-input-type="image"]');
  const imageInput = await cdp.send("DOM.getDocument", { depth: -1 });
  const inputNode = await cdp.send("DOM.querySelector", { nodeId: imageInput.root.nodeId, selector: "#file-input" });
  await cdp.send("DOM.setFileInputFiles", { nodeId: inputNode.nodeId, files: [resolve(workspace, "assets", "hadang-court-2d.png")] });
  await sleep(450);
  const uploadMetrics = await evaluate(cdp, `({
    previewVisible: Boolean(document.querySelector('.uploaded-image-frame img')),
    fileName: document.querySelector('.uploaded-file-meta strong')?.textContent,
    imageLoaded: document.querySelector('.uploaded-image-frame img')?.naturalWidth > 0
  })`);
  await click(cdp, '[data-action="start-check"]');
  const imageHumanFirst = await evaluate(cdp, `({ hasImage: Boolean(document.querySelector('.human-image-context img')), title: document.querySelector('.human-image-context strong')?.textContent })`);
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="pressure"]', "Kesempatan terbatas");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-multi="emotion"]', "Percaya");
  await click(cdp, '[data-select="neutral-impact"]', "Ya");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-select="evidence"]', "Pernyataan pada kanal resmi tokoh");
  await click(cdp, '[data-action="hadang-next"]');
  await openGameQuestion(cdp);
  await click(cdp, '[data-select="requested-action"]', "Investasi / pembelian");
  await click(cdp, '[data-select="consequence"]', "Kehilangan uang");
  await click(cdp, '[data-select="safer-action"]', "Periksa kanal resmi tokoh");
  await click(cdp, '[data-action="hadang-next"]');
  await sleep(300);
  const boundingMetrics = await evaluate(cdp, `({
    sourceIsUpload: document.querySelector('.xai-source-image')?.src.startsWith('data:image'),
    boundingBoxes: document.querySelectorAll('.uploaded-xai .red-box').length,
    mode: document.querySelector('[data-xai-mode].active')?.dataset.xaiMode
  })`);
  await screenshot(cdp, "mobile-image-xai-bounding.png");
  await click(cdp, '[data-xai-mode="heatmap"]');
  const heatmapMetrics = await evaluate(cdp, `({ mode: document.querySelector('[data-xai-mode].active')?.dataset.xaiMode, spots: document.querySelectorAll('.xai-heatmap span').length })`);
  await screenshot(cdp, "mobile-image-xai-heatmap.png");

  await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  await sleep(350);
  await evaluate(cdp, `resetFlow(); state.inputType = 'text'; state.content = DEFAULT_MESSAGE; render()`);
  await click(cdp, '[data-input-type="audio"]');
  await evaluate(cdp, `(() => {
    const fakeWav = new File([new Uint8Array(256)], 'voice-note-keluarga.wav', { type: 'audio/wav' });
    processUploadedFile(fakeWav);
    return true;
  })()`);
  await sleep(250);
  const audioUploadMetrics = await evaluate(cdp, `({ preview: Boolean(document.querySelector('.audio-upload-preview')), waveformBars: document.querySelectorAll('.input-wave i').length, hasPlayer: Boolean(document.querySelector('.audio-upload-preview audio')) })`);
  await click(cdp, '[data-action="start-check"]');
  const audioHumanMetrics = await evaluate(cdp, `({ player: Boolean(document.querySelector('.human-audio-context audio')), transcript: document.querySelector('.transcript-preview')?.textContent.includes('Transkrip simulasi') })`);
  await evaluate(cdp, `state.stage = 4; render()`);
  await sleep(180);
  const audioLensMetrics = await evaluate(cdp, `({ dataset: document.querySelector('.dataset-card strong')?.textContent, markers: document.querySelectorAll('.audio-marker').length, mode: document.querySelector('[data-audio-xai-mode].active')?.dataset.audioXaiMode, scrollWidth: document.documentElement.scrollWidth })`);
  await click(cdp, '[data-audio-xai-mode="spectrogram"]');
  const audioSpectrogramMetrics = await evaluate(cdp, `({ mode: document.querySelector('[data-audio-xai-mode].active')?.dataset.audioXaiMode, panel: Boolean(document.querySelector('.spectrogram-panel')) })`);
  await screenshot(cdp, "mobile-audio-xai.png");

  await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  await sleep(300);
  await evaluate(cdp, `resetFlow(); state.inputType = 'text'; state.content = DEFAULT_MESSAGE; render()`);
  await click(cdp, '[data-input-type="qr"]');
  await evaluate(cdp, `(() => { const input = document.querySelector('#content-input'); input.value = 'https://secure-verifikasi.example/login?session=urgent'; input.dispatchEvent(new Event('input', { bubbles: true })); return input.value; })()`);
  await click(cdp, '[data-action="start-check"]');
  const linkHumanMetrics = await evaluate(cdp, `({ host: document.querySelector('.human-link-context strong')?.textContent, safePreview: Boolean(document.querySelector('.human-link-context')) })`);
  await evaluate(cdp, `state.stage = 4; render()`);
  await sleep(150);
  const linkLensMetrics = await evaluate(cdp, `({ flaggedTokens: document.querySelectorAll('.url-token-map .flagged').length, dataset: document.querySelector('.dataset-card strong')?.textContent, scrollWidth: document.documentElement.scrollWidth })`);
  await click(cdp, '[data-qr-xai-mode="redirect"]');
  const redirectMetrics = await evaluate(cdp, `({ steps: document.querySelectorAll('.redirect-chain > div').length, mode: document.querySelector('[data-qr-xai-mode].active')?.dataset.qrXaiMode })`);
  await screenshot(cdp, "mobile-link-xai.png");

  await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  await sleep(300);
  await evaluate(cdp, `resetFlow(); state.inputType = 'text'; state.content = DEFAULT_MESSAGE; render()`);
  await click(cdp, '[data-input-type="qr"]');
  await click(cdp, '[data-qr-input-mode="image"]');
  const qrDocument = await cdp.send("DOM.getDocument", { depth: -1 });
  const qrInputNode = await cdp.send("DOM.querySelector", { nodeId: qrDocument.root.nodeId, selector: "#file-input" });
  await cdp.send("DOM.setFileInputFiles", { nodeId: qrInputNode.nodeId, files: [resolve(workspace, "assets", "hadangin-logo.png")] });
  await sleep(300);
  await click(cdp, '[data-action="start-check"]');
  await evaluate(cdp, `state.stage = 4; render()`);
  await sleep(150);
  const qrUploadLensMetrics = await evaluate(cdp, `({ sourceIsUpload: document.querySelector('.qr-image-analysis img')?.src.startsWith('data:image'), scanLine: Boolean(document.querySelector('.qr-scan-line')), dataset: document.querySelector('.dataset-card strong')?.textContent, scrollWidth: document.documentElement.scrollWidth })`);
  await screenshot(cdp, "mobile-qr-xai.png");

  await cdp.send("Page.navigate", { url: `${appUrl}#/training` });
  await sleep(700);
  const trainingVideoMetrics = await evaluate(cdp, `(() => {
    const video = document.querySelector('.training-hero-video');
    return { exists: Boolean(video), paused: video?.paused, currentTime: video?.currentTime, readyState: video?.readyState, width: video?.videoWidth, height: video?.videoHeight, scrollWidth: document.documentElement.scrollWidth, arenaCount: document.querySelectorAll('.scenario-card').length };
  })()`);
  await screenshot(cdp, "mobile-training-video.png");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(250);
  await screenshot(cdp, "desktop-training-video.png");

  console.log(JSON.stringify({ homeMetrics, popupMetrics, finalMetrics, qrMetrics, jobMetrics, aiWrongLens, aiWrongResult, uploadMetrics, imageHumanFirst, boundingMetrics, heatmapMetrics, audioUploadMetrics, audioHumanMetrics, audioLensMetrics, audioSpectrogramMetrics, linkHumanMetrics, linkLensMetrics, redirectMetrics, qrUploadLensMetrics, trainingVideoMetrics }, null, 2));
  cdp.close();
}

try {
  await main();
} finally {
  chrome.kill();
}
