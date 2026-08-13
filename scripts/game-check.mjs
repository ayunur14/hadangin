import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--no-sandbox", "--disable-gpu-sandbox", "--allow-file-access-from-files",
  "--remote-debugging-port=9555", `--user-data-dir=${mkdtempSync(resolve(tmpdir(), "hadang-game-"))}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    await new Promise((done, fail) => {
      this.socket.addEventListener("open", done, { once: true });
      this.socket.addEventListener("error", fail, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const item = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) item.fail(new Error(message.error.message)); else item.done(message.result);
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

async function getTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await fetch("http://127.0.0.1:9555/json/list").then((response) => response.json());
      const page = list.find((item) => item.type === "page" && item.url === "about:blank")
        || list.find((item) => item.type === "page" && !item.url.startsWith("chrome-extension://"));
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome tidak siap.");
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

try {
  const target = await getTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const browserErrors = [];
  cdp.socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") browserErrors.push(message.params.args.map((item) => item.description || item.value).join(" "));
  });
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: "file:///D:/Ayu%20Nur/unesco/index.html#/verify" });
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await evaluate(cdp, `typeof state !== 'undefined' && Boolean(document.querySelector('#app'))`)) break;
    await sleep(200);
  }
  const loaded = await evaluate(cdp, `typeof state !== 'undefined'`);
  if (!loaded) {
    const debug = await evaluate(cdp, `({ href: location.href, ready: document.readyState, scripts: [...document.scripts].map((item) => ({ src: item.src, type: item.type })), app: document.querySelector('#app')?.innerHTML.slice(0, 100), title: document.title })`);
    throw new Error(`App gagal dimuat: ${JSON.stringify({ browserErrors, debug })}`);
  }
  await evaluate(cdp, `(() => { state.inFlow = true; state.stage = 3; state.hadangStep = 0; state.questionOpen = false; state.gameLives = 3; state.gameScore = 0; state.gameRoundComplete = false; render(); return true; })()`);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await evaluate(cdp, `Boolean(arenaRuntime)`)) break;
    await sleep(100);
  }

  const initial = await evaluate(cdp, `({ player: Boolean(document.querySelector('.player-guard')), token: Boolean(document.querySelector('.game-token')), controls: document.querySelectorAll('[data-game-control]').length, lives: state.gameLives, questionHidden: !document.querySelector('.game-question-modal') })`);

  const beforeX = await evaluate(cdp, `arenaRuntime.x`);
  await sleep(350);
  const movement = await evaluate(cdp, `({ beforeX: ${beforeX}, afterX: arenaRuntime?.x, moving: Boolean(arenaRuntime && arenaRuntime.x > ${beforeX}) })`);

  await evaluate(cdp, `missInformation(arenaRuntime)`);
  await sleep(800);
  const missed = await evaluate(cdp, `({ lives: state.gameLives, status: document.querySelector('[data-game-status]')?.textContent, nextTokenRunning: Boolean(arenaRuntime) })`);

  await evaluate(cdp, `catchInformation(arenaRuntime)`);
  await sleep(800);
  const caught = await evaluate(cdp, `({ score: state.gameScore, catches: state.gameCatches, roundComplete: state.gameRoundComplete, questionVisible: Boolean(document.querySelector('.game-question-modal')), title: document.querySelector('.game-question-modal h2')?.textContent, scrollWidth: document.documentElement.scrollWidth, innerWidth })`);
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "desktop-interactive-game.png"), Buffer.from(shot.data, "base64"));

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(350);
  const mobile = await evaluate(cdp, `({ controls: document.querySelectorAll('[data-game-control]').length, scrollWidth: document.documentElement.scrollWidth, innerWidth, modal: Boolean(document.querySelector('.game-question-modal')) })`);
  const mobileShot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(resolve("visual-checks", "mobile-interactive-game.png"), Buffer.from(mobileShot.data, "base64"));
  console.log(JSON.stringify({ initial, movement, missed, caught, mobile }, null, 2));
  cdp.close();
} finally {
  chrome.kill();
}
