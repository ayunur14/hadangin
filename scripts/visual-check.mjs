import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const workspace = resolve(import.meta.dirname, "..");
const profile = resolve(workspace, ".visual-profile");
const output = resolve(workspace, "visual-checks");
const port = 9333;
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
  const navigation = await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/verify" });
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
  await click(cdp, '[data-multi="emotion"]', "Takut");
  await click(cdp, '[data-select="neutral-impact"]', "Ya");
  await click(cdp, '[data-action="hadang-next"]');
  await click(cdp, '[data-select="evidence"]', "Telepon nomor ibu yang tersimpan");
  await click(cdp, '[data-action="hadang-next"]');
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

  await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/training" });
  await sleep(300);
  await click(cdp, '[data-scenario="qr-payment"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await click(cdp, '[data-multi="pressure"]', "Tekanan sosial");
  await click(cdp, '[data-action="hadang-next"]');
  await click(cdp, '[data-multi="emotion"]', "Percaya");
  await click(cdp, '[data-select="neutral-impact"]', "Sedikit");
  await click(cdp, '[data-action="hadang-next"]');
  const qrMetrics = await evaluate(cdp, `({
    claim: document.querySelector('.split-evidence section p')?.textContent,
    hasCashierEvidence: [...document.querySelectorAll('[data-select="evidence"]')].some((node) => node.textContent.includes('kasir')),
    scrollWidth: document.documentElement.scrollWidth
  })`);

  await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/training" });
  await sleep(300);
  await click(cdp, '[data-scenario="job-offer"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await click(cdp, '[data-multi="pressure"]', "Kesempatan terbatas");
  await click(cdp, '[data-action="hadang-next"]');
  await click(cdp, '[data-multi="emotion"]', "Harapan");
  await click(cdp, '[data-select="neutral-impact"]', "Ya");
  await click(cdp, '[data-action="hadang-next"]');
  const jobMetrics = await evaluate(cdp, `({
    claim: document.querySelector('.split-evidence section p')?.textContent,
    hasOfficialHrEvidence: [...document.querySelectorAll('[data-select="evidence"]')].some((node) => node.textContent.includes('situs resmi perusahaan')),
    scrollWidth: document.documentElement.scrollWidth
  })`);

  await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/training" });
  await sleep(300);
  await click(cdp, '[data-scenario="ai-can-be-wrong"]');
  await click(cdp, '[data-select="initial-decision"]', "Verifikasi Dulu");
  await click(cdp, '[data-action="lock-initial"]');
  await click(cdp, '[data-action="enter-arena"]');
  await click(cdp, '[data-multi="pressure"]', "Tidak ada tekanan");
  await click(cdp, '[data-action="hadang-next"]');
  await click(cdp, '[data-multi="emotion"]', "Tidak yakin");
  await click(cdp, '[data-select="neutral-impact"]', "Tidak");
  await click(cdp, '[data-action="hadang-next"]');
  await click(cdp, '[data-select="evidence"]', "Pembaruan yang sama di aplikasi resmi");
  await click(cdp, '[data-action="hadang-next"]');
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

  console.log(JSON.stringify({ homeMetrics, popupMetrics, finalMetrics, qrMetrics, jobMetrics, aiWrongLens, aiWrongResult }, null, 2));
  cdp.close();
}

try {
  await main();
} finally {
  chrome.kill();
}
