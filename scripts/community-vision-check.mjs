import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:3000/";
const profile = mkdtempSync(resolve(tmpdir(), "hadang-vision-"));
const port = 22000 + Math.floor(Math.random() * 8000);
const consoleMessages = [];
const chrome = spawn(chromePath, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu-sandbox",
  "--disable-crash-reporter",
  "--use-fake-ui-for-media-stream",
  "--use-fake-device-for-media-stream",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }
  async open() {
    if (this.socket.readyState !== WebSocket.OPEN) {
      await new Promise((done, fail) => {
        this.socket.addEventListener("open", done, { once: true });
        this.socket.addEventListener("error", fail, { once: true });
      });
    }
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.method === "Runtime.consoleAPICalled") {
        consoleMessages.push(message.params.args.map((arg) => arg.value || arg.description || "").join(" "));
      }
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.fail(new Error(message.error.message));
      else pending.done(message.result);
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
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint unavailable.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

async function main() {
  const page = await target();
  const cdp = new Cdp(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: `${appUrl}#/community` });
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    ready = await evaluate(cdp, "Boolean(document.querySelector('[data-action=\"start-community\"]'))");
    if (ready) break;
    await sleep(250);
  }
  if (!ready) {
    const pageState = await evaluate(cdp, "({ url: location.href, title: document.title, text: document.body.innerText.slice(0, 300) })");
    throw new Error(`Community setup did not render: ${JSON.stringify(pageState)}`);
  }
  const cameraProbe = await evaluate(cdp, `(async () => {
    try {
      const probe = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const result = { ok: true, tracks: probe.getVideoTracks().length };
      probe.getTracks().forEach((track) => track.stop());
      return result;
    } catch (error) {
      return { ok: false, name: error?.name || '', message: error?.message || String(error) };
    }
  })()`);
  const filesetProbe = await evaluate(cdp, `(async () => {
    const module = await import('/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs');
    return module.FilesetResolver.forVisionTasks('/mediapipe');
  })()`);
  await evaluate(cdp, `(() => {
    document.querySelector('[data-community-mode="vision"]').click();
    document.querySelector('[data-action="start-community"]').click();
    document.querySelector('[data-action="community-vision-next"]').click();
    document.querySelector('[data-action="toggle-community-camera"]').click();
  })()`);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const status = await evaluate(cdp, "document.querySelector('.community-vision-stage')?.dataset.visionState || ''");
    if (["searching", "ready", "tracking", "calibrating", "error"].includes(status)) break;
    await sleep(500);
  }
  await sleep(1200);

  const metrics = await evaluate(cdp, `(() => {
    const video = document.querySelector('#community-vision-video');
    const stage = document.querySelector('.community-vision-stage');
    return {
      status: stage?.dataset.visionState || '',
      videoReadyState: video?.readyState || 0,
      videoWidth: video?.videoWidth || 0,
      liveTracks: video?.srcObject?.getVideoTracks().filter((track) => track.readyState === 'live').length || 0,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    };
  })()`);
  metrics.consoleMessages = consoleMessages;
  metrics.cameraProbe = cameraProbe;
  metrics.filesetProbe = filesetProbe;
  const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(resolve("visual-checks", "desktop-community-vision.png"), Buffer.from(screenshot.data, "base64"));
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(300);
  const mobileScreenshot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(resolve("visual-checks", "mobile-community-vision.png"), Buffer.from(mobileScreenshot.data, "base64"));
  console.log(JSON.stringify(metrics, null, 2));
  if (metrics.status === "error" || metrics.liveTracks !== 1 || metrics.videoReadyState < 2 || metrics.horizontalOverflow) process.exitCode = 1;
  cdp.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => setTimeout(() => chrome.kill(), 100));
