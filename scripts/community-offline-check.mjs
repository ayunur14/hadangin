import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:3000/";
const profile = mkdtempSync(resolve(tmpdir(), "hadang-offline-"));
const port = 12000 + Math.floor(Math.random() * 10000);
const chrome = spawn(chromePath, ["--headless=new", "--no-sandbox", "--disable-gpu-sandbox", "--disable-crash-reporter", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    if (this.socket.readyState !== WebSocket.OPEN) await new Promise((done, fail) => { this.socket.addEventListener("open", done, { once: true }); this.socket.addEventListener("error", fail, { once: true }); });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id); this.pending.delete(message.id);
      if (message.error) pending.fail(new Error(message.error.message)); else pending.done(message.result);
    });
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((done, fail) => { this.pending.set(id, { done, fail }); this.socket.send(JSON.stringify({ id, method, params })); }); }
  close() { this.socket.close(); }
}

async function browserTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json()); const page = targets.find((item) => item.type === "page"); if (page) return page; } catch {}
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint unavailable.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(resolve("visual-checks", name), Buffer.from(result.data, "base64"));
}

async function main() {
  const target = await browserTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: `${appUrl}#/community` });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) { ready = await evaluate(cdp, "Boolean(document.querySelector('[data-action=\"start-community\"]'))"); if (ready) break; await sleep(250); }
  if (!ready) throw new Error(`Community setup unavailable at ${await evaluate(cdp, "location.href")}`);

  await evaluate(cdp, "document.querySelector('[data-action=\"start-community\"]').click()");
  await sleep(250);
  await screenshot(cdp, "desktop-community-offline-prep.png");
  await evaluate(cdp, "for (const item of [0,1,2,3]) document.querySelector('[data-community-prep=\"' + item + '\"]').click(); document.querySelector('[data-action=\"community-next\"]').click(); document.querySelector('[data-community-vote=\"initial:1:1\"]').click(); document.querySelector('[data-action=\"community-next\"]').click();");
  await sleep(250);
  await screenshot(cdp, "desktop-community-offline-arena.png");
  await evaluate(cdp, "document.querySelector('[data-action=\"community-timer\"]').click(); document.querySelector('[data-action=\"community-pressure\"]').click();");
  await sleep(1200);
  const timerAfterPressure = await evaluate(cdp, "Number(document.querySelector('#community-timer').textContent.split(':')[1])");
  await evaluate(cdp, "document.querySelector('[data-action=\"community-timer\"]').click()");

  await evaluate(cdp, `for (const answer of [0,0,1,1]) { document.querySelector('[data-community-answer="' + answer + '"]').click(); document.querySelector('[data-action="community-lock-answer"]').click(); document.querySelector('[data-action="community-next-line"]').click(); } document.querySelector('[data-community-tactic="urgency"]').click();`);
  await sleep(200);
  await screenshot(cdp, "desktop-community-offline-reveal.png");

  const metrics = await evaluate(cdp, `({
    phase: document.querySelector('.community-phase-track .active small')?.textContent,
    scoreHadang: document.querySelector('.offline-scoreboard .hadang b')?.textContent,
    recaps: document.querySelectorAll('.offline-round-recap > div').length,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  })`);
  metrics.timerAfterPressure = timerAfterPressure;
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(250);
  await screenshot(cdp, "mobile-community-offline-reveal.png");
  console.log(JSON.stringify(metrics, null, 2));
  if (metrics.phase !== "Reveal" || Number(metrics.scoreHadang) !== 4 || metrics.recaps !== 4 || metrics.timerAfterPressure > 24 || metrics.horizontalOverflow) process.exitCode = 1;
  cdp.close();
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => setTimeout(() => chrome.kill(), 100));
