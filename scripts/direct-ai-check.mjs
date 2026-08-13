import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--no-sandbox", "--disable-gpu-sandbox", "--allow-file-access-from-files",
  "--remote-debugging-port=9666", `--user-data-dir=${mkdtempSync(resolve(tmpdir(), "hadang-direct-"))}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    await new Promise((done, fail) => { this.socket.addEventListener("open", done, { once: true }); this.socket.addEventListener("error", fail, { once: true }); });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const item = this.pending.get(message.id); this.pending.delete(message.id);
      if (message.error) item.fail(new Error(message.error.message)); else item.done(message.result);
    });
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((done, fail) => { this.pending.set(id, { done, fail }); this.socket.send(JSON.stringify({ id, method, params })); }); }
  close() { this.socket.close(); }
}

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await fetch("http://127.0.0.1:9666/json/list").then((response) => response.json());
      const page = list.find((item) => item.type === "page" && item.url === "about:blank");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome tidak siap");
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function click(cdp, selector) {
  return evaluate(cdp, `(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) throw new Error(${JSON.stringify(selector)}); node.click(); return true; })()`);
}

try {
  const page = await target();
  const cdp = new Cdp(page.webSocketDebuggerUrl); await cdp.open();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/verify" });
  for (let i = 0; i < 50; i += 1) { if (await evaluate(cdp, `typeof state !== 'undefined' && Boolean(document.querySelector('[data-action="direct-ai"]'))`)) break; await sleep(150); }
  const picker = await evaluate(cdp, `({ buttons: document.querySelectorAll('.check-mode-actions button').length, labels: [...document.querySelectorAll('.check-mode-actions strong')].map((node) => node.textContent) })`);
  await click(cdp, '[data-action="direct-ai"]');
  await sleep(250);
  const textResult = await evaluate(cdp, `({ direct: state.directDetection, courtSignals: document.querySelectorAll('.court-signal').length, detectionTitle: document.querySelector('.detection-header h3')?.textContent, score: document.querySelector('.direct-verdict strong')?.textContent, xai: Boolean(document.querySelector('.detection-panel')) })`);
  const desktopShot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "desktop-direct-ai.png"), Buffer.from(desktopShot.data, "base64"));
  await click(cdp, '[data-action="switch-to-plus"]');
  const plus = await evaluate(cdp, `({ direct: state.directDetection, humanFirst: document.querySelector('.flow-card h2')?.textContent, contentKept: document.querySelector('.message-panel blockquote')?.textContent.includes('Mama kecelakaan') })`);

  await evaluate(cdp, `(() => { state.directDetection = true; state.inFlow = true; state.inputType = 'image'; state.imageDataUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%23ddd"/><text x="30" y="100">PROMO INVESTASI</text></svg>'); state.fileName = 'promo.png'; state.content = 'Gambar: promo.png'; state.scenarioId = 'manipulated-media'; render(); return true; })()`);
  await sleep(150);
  const imageResult = await evaluate(cdp, `({ source: document.querySelector('.xai-source-image')?.src.startsWith('data:image'), modes: document.querySelectorAll('[data-xai-mode]').length })`);

  await evaluate(cdp, `(() => { state.inputType = 'audio'; state.audioDataUrl = 'data:audio/wav;base64,UklGRg=='; state.fileName = 'suara.wav'; state.content = 'Rekaman audio: suara.wav'; state.scenarioId = 'audio-impersonation'; render(); return true; })()`);
  await sleep(150);
  const audioResult = await evaluate(cdp, `({ waveform: Boolean(document.querySelector('.audio-analysis-stage')), modes: document.querySelectorAll('[data-audio-xai-mode]').length })`);

  await evaluate(cdp, `(() => { state.inputType = 'qr'; state.qrInputMode = 'link'; state.content = 'https://secure-verifikasi.example/login'; state.scenarioId = 'bank-message'; render(); return true; })()`);
  await sleep(150);
  const linkResult = await evaluate(cdp, `({ riskMap: Boolean(document.querySelector('.url-risk-analysis')), modes: document.querySelectorAll('[data-qr-xai-mode]').length })`);

  await evaluate(cdp, `(() => { state.qrInputMode = 'image'; state.qrImageDataUrl = state.imageDataUrl; state.fileName = 'qr.png'; state.content = 'Gambar QR: qr.png'; state.scenarioId = 'qr-payment'; render(); return true; })()`);
  await sleep(150);
  const qrResult = await evaluate(cdp, `({ source: document.querySelector('.qr-image-analysis img')?.src.startsWith('data:image'), scanLine: Boolean(document.querySelector('.qr-scan-line')) })`);

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(250);
  const mobile = await evaluate(cdp, `({ scrollWidth: document.documentElement.scrollWidth, innerWidth, signals: document.querySelectorAll('.court-signal').length })`);
  const mobileShot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "mobile-direct-ai.png"), Buffer.from(mobileShot.data, "base64"));
  console.log(JSON.stringify({ picker, textResult, plus, imageResult, audioResult, linkResult, qrResult, mobile }, null, 2));
  cdp.close();
} finally { chrome.kill(); }
