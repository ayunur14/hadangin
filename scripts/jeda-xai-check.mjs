import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const port = 10000 + Math.floor(Math.random() * 20000);
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:5173/";
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--no-sandbox", "--disable-gpu-sandbox", `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(resolve(tmpdir(), "hadang-jeda-xai-"))}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    await new Promise((done, fail) => { this.socket.addEventListener("open", done, { once: true }); this.socket.addEventListener("error", fail, { once: true }); });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id); this.pending.delete(message.id);
      if (message.error) pending.fail(new Error(message.error.message)); else pending.done(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((done, fail) => { this.pending.set(id, { done, fail }); this.socket.send(JSON.stringify({ id, method, params })); });
  }
  close() { this.socket.close(); }
}

async function target() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(150);
  }
  throw new Error("Chrome tidak siap");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

const readBoard = `(() => ({
  title: document.querySelector('.court-board-header strong')?.textContent,
  evidence: document.querySelector('.court-text-evidence > span')?.textContent,
  axes: [...document.querySelectorAll('.court-signal')].map((node) => ({
    name: node.querySelector('header strong')?.textContent,
    tokens: [...node.querySelectorAll('mark')].map((mark) => mark.textContent),
    finding: node.querySelector('.court-detail')?.textContent,
  })),
  detection: Boolean(document.querySelector('.detection-panel')),
}))()`;

try {
  const page = await target();
  const cdp = new Cdp(page.webSocketDebuggerUrl); await cdp.open();
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Page.navigate", { url: `${appUrl}#/verify` });
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    ready = await evaluate(cdp, "typeof window.render === 'function'");
    if (ready) break;
    await sleep(100);
  }
  if (!ready) throw new Error("Aplikasi tidak selesai dimuat");

  const scenarioIds = ["family-emergency", "qr-payment", "job-offer", "bank-message", "viral-info", "manipulated-media", "ai-can-be-wrong", "audio-impersonation"];
  const scenarios = {};
  for (const id of scenarioIds) {
    await evaluate(cdp, `startScenario(${JSON.stringify(id)}); state.stage = 4; render();`);
    scenarios[id] = await evaluate(cdp, readBoard);
  }

  await evaluate(cdp, `startScenario('job-offer'); state.stage = 4; render(); document.querySelector('.ai-court-board')?.scrollIntoView();`);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await sleep(150);
  const desktopShot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "desktop-training-xai-job.png"), Buffer.from(desktopShot.data, "base64"));
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate(cdp, `document.querySelector('.ai-court-board')?.scrollIntoView();`);
  await sleep(150);
  const mobileShot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "mobile-training-xai-job.png"), Buffer.from(mobileShot.data, "base64"));

  const directSetups = {
    text: `resetFlow(); Object.assign(state, { trainingScenario: false, inputType: 'text', qrInputMode: 'link', content: DEFAULT_MESSAGE, fileName: '', fileMeta: null, mediaContext: '', inFlow: true, directDetection: true, stage: 4 }); render();`,
    image: `resetFlow(); Object.assign(state, { trainingScenario: false, inputType: 'image', fileName: 'promo.png', fileMeta: { width: 1200, height: 800, hotspots: [{}, {}, {}] }, mediaContext: 'Poster investasi hanya hari ini', content: 'Gambar: promo.png', inFlow: true, directDetection: true, stage: 4 }); render();`,
    audio: `resetFlow(); Object.assign(state, { trainingScenario: false, inputType: 'audio', fileName: 'voice-note.wav', fileMeta: { duration: 18 }, mediaContext: 'Tolong transfer sekarang', content: 'Rekaman audio', inFlow: true, directDetection: true, stage: 4 }); render();`,
    link: `resetFlow(); Object.assign(state, { trainingScenario: false, inputType: 'qr', qrInputMode: 'link', fileName: '', fileMeta: null, mediaContext: '', content: 'https://secure-verifikasi.example/login?urgent=true', inFlow: true, directDetection: true, stage: 4 }); render();`,
    qr: `resetFlow(); Object.assign(state, { trainingScenario: false, inputType: 'qr', qrInputMode: 'image', fileName: 'qris.png', fileMeta: { width: 900, height: 900, hotspots: [{}, {}] }, mediaContext: '', content: 'Gambar QR pembayaran', inFlow: true, directDetection: true, stage: 4 }); render();`,
  };
  const direct = {};
  for (const [mode, setup] of Object.entries(directSetups)) {
    await evaluate(cdp, setup);
    direct[mode] = await evaluate(cdp, readBoard);
  }

  const allBoards = [...Object.values(scenarios), ...Object.values(direct)];
  const expectedDirectEvidence = { text: "TEKS TERDETEKSI", image: "VISUAL + KONTEKS INPUT", audio: "TRANSKRIP SIMULASI + AUDIO", link: "STRUKTUR TAUTAN", qr: "VISUAL QR + KONTEKS" };
  const failures = allBoards.filter((board) => board.axes.length !== 4 || board.axes.some((axis) => !axis.finding) || !board.detection)
    .concat(Object.entries(direct).filter(([mode, board]) => board.evidence !== expectedDirectEvidence[mode]).map(([, board]) => board));
  console.log(JSON.stringify({
    scenarioCount: Object.keys(scenarios).length,
    scenarios: Object.fromEntries(Object.entries(scenarios).map(([id, board]) => [id, { evidence: board.evidence, axes: board.axes.length }])),
    direct: Object.fromEntries(Object.entries(direct).map(([mode, board]) => [mode, { evidence: board.evidence, axes: board.axes.length }])),
    failures: failures.length,
  }, null, 2));
  cdp.close();
  if (failures.length) process.exitCode = 1;
} finally {
  chrome.kill();
}
