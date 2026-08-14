import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const workspace = resolve(import.meta.dirname, "..");
const output = resolve(workspace, "visual-checks");
const profile = mkdtempSync(resolve(tmpdir(), "hadang-three-"));
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:5173/";
const port = 9444;
mkdirSync(output, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new", "--disable-gpu-sandbox", "--no-sandbox", "--disable-crash-reporter",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    if (this.socket.readyState !== WebSocket.OPEN) await new Promise((done, fail) => {
      this.socket.addEventListener("open", done, { once: true });
      this.socket.addEventListener("error", fail, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.fail(new Error(message.error.message)); else pending.done(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((done, fail) => {
      this.pending.set(id, { done, fail });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.socket.close(); }
}

async function target() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = list.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome tidak siap.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve(output, name), Buffer.from(result.data, "base64"));
}

try {
  const page = await target();
  const cdp = new Cdp(page.webSocketDebuggerUrl);
  await cdp.open();
  const browserErrors = [];
  cdp.socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") browserErrors.push(message.params.args.map((item) => item.description || item.value).join(" "));
  });
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: `${appUrl}#/training` });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(cdp, `Boolean(document.querySelector('.training-3d-canvas, .training-3d-fallback'))`);
    if (ready) break;
    await sleep(250);
  }
  await sleep(500);

  const desktop = await evaluate(cdp, `(() => {
    const canvas = document.querySelector('.training-3d-canvas');
    const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
    const pixels = gl ? new Uint8Array(4 * 36) : null;
    if (gl) gl.readPixels(Math.floor(canvas.width / 2) - 3, Math.floor(canvas.height / 2) - 3, 6, 6, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const nonBlankPixels = pixels ? [...pixels].filter((value, index) => index % 4 !== 3 && value > 4).length : 0;
    return { href: location.href, readyState: document.readyState, canvas: Boolean(canvas), width: canvas?.width, height: canvas?.height, webgl2: Boolean(gl), nonBlankPixels, ready: document.querySelector('.training-hero')?.classList.contains('scene-ready'), fallback: document.querySelector('.training-3d-fallback')?.textContent || null, loadingGone: !document.querySelector('.training-3d-loading'), cards: document.querySelectorAll('.scenario-card').length, appLength: document.querySelector('#app')?.innerHTML.length, scrollWidth: document.documentElement.scrollWidth };
  })()`);
  await screenshot(cdp, "desktop-training-3d.png");

  const clickResult = await evaluate(cdp, `(() => {
    const canvas = document.querySelector('.training-3d-canvas');
    if (!canvas) return { selected: null, enabled: false, fallback: document.querySelector('.training-3d-fallback')?.textContent || null, body: document.querySelector('#app')?.textContent?.slice(0, 120) };
    const rect = canvas.getBoundingClientRect();
    const points = [[.58,.49],[.66,.48],[.74,.5],[.82,.49],[.55,.58],[.68,.58]];
    for (const [x,y] of points) {
      canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + rect.width*x, clientY: rect.top + rect.height*y, bubbles: true }));
      canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + rect.width*x, clientY: rect.top + rect.height*y, bubbles: true }));
      if (document.querySelector('.training-3d-inspector.active')) break;
    }
    return { selected: document.querySelector('.training-3d-inspector.active strong')?.textContent || null, enabled: !document.querySelector('.training-3d-inspector button')?.disabled };
  })()`);

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(450);
  const mobile = await evaluate(cdp, `({ innerWidth, scrollWidth: document.documentElement.scrollWidth, canvasWidth: document.querySelector('.training-3d-canvas')?.clientWidth, canvasHeight: document.querySelector('.training-3d-canvas')?.clientHeight, titleBottom: document.querySelector('.training-hero h1')?.getBoundingClientRect().bottom, heroHeight: document.querySelector('.training-hero')?.getBoundingClientRect().height })`);
  await screenshot(cdp, "mobile-training-3d.png");

  console.log(JSON.stringify({ desktop, clickResult, mobile, browserErrors }, null, 2));
  cdp.close();
} finally {
  chrome.kill();
}
