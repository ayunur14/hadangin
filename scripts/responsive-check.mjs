import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:5173/";
const profile = mkdtempSync(resolve(tmpdir(), "hadang-responsive-"));
const port = 9555;
const chrome = spawn(chromePath, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu-sandbox",
  "--disable-crash-reporter",
  "--autoplay-policy=no-user-gesture-required",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const viewports = [
  [280, 653],
  [320, 568],
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1920, 1080],
];

const cases = [
  { name: "verify-home", route: "verify" },
  { name: "training", route: "training" },
  { name: "community-setup", route: "community", setup: "document.querySelector('[data-action=\"reset-community\"]')?.click();" },
  { name: "community-session", route: "community", setup: "document.querySelector('[data-action=\"reset-community\"]')?.click(); document.querySelector('[data-action=\"start-community\"]').click();" },
  { name: "community-jeda", route: "community", setup: "document.querySelector('[data-action=\"reset-community\"]')?.click(); document.querySelector('[data-action=\"start-community\"]').click(); document.querySelector('[data-action=\"community-next\"]').click();" },
  { name: "community-final-vote", route: "community", setup: "document.querySelector('[data-action=\"reset-community\"]')?.click(); document.querySelector('[data-action=\"start-community\"]').click(); document.querySelector('[data-action=\"community-next\"]').click(); for (const line of ['J','E','D','A']) document.querySelector('[data-community-line=\"' + line + '\"]').click(); document.querySelector('[data-action=\"community-next\"]').click();" },
  { name: "community-debrief", route: "community", setup: "document.querySelector('[data-action=\"reset-community\"]')?.click(); document.querySelector('[data-action=\"start-community\"]').click(); document.querySelector('[data-action=\"community-next\"]').click(); for (const line of ['J','E','D','A']) document.querySelector('[data-community-line=\"' + line + '\"]').click(); document.querySelector('[data-action=\"community-next\"]').click(); document.querySelector('[data-action=\"community-next\"]').click();" },
  { name: "theme-light-verify", route: "verify", setup: "document.documentElement.dataset.theme = 'light';" },
  { name: "theme-light-training", route: "training", setup: "document.documentElement.dataset.theme = 'light';" },
  { name: "dashboard", route: "dashboard" },
  { name: "how-it-works", route: "how-it-works" },
  { name: "about", route: "about" },
  { name: "input-image", route: "verify", setup: "resetFlow(); state.inputType = 'image'; render();" },
  { name: "input-audio", route: "verify", setup: "resetFlow(); state.inputType = 'audio'; render();" },
  { name: "input-link", route: "verify", setup: "resetFlow(); state.inputType = 'qr'; state.qrInputMode = 'link'; render();" },
  { name: "human-first", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 2; render();" },
  { name: "game-intro", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 3; state.hadangStep = -1; render();" },
  { name: "game-question", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 3; state.hadangStep = 0; state.questionOpen = true; render();" },
  { name: "ai-lens", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 4; render();" },
  { name: "final-decision", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 5; render();" },
  { name: "reflection", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.stage = 6; render();" },
  { name: "direct-text", route: "verify", setup: "resetFlow(); state.content = DEFAULT_MESSAGE; state.inFlow = true; state.directDetection = true; state.stage = 4; render();" },
  { name: "direct-image", route: "verify", setup: "resetFlow(); state.inputType = 'image'; state.content = 'Unggahan promosi investasi'; state.inFlow = true; state.directDetection = true; state.stage = 4; render();" },
  { name: "direct-audio", route: "verify", setup: "resetFlow(); state.inputType = 'audio'; state.content = 'Pesan suara mendesak'; state.inFlow = true; state.directDetection = true; state.stage = 4; render();" },
  { name: "direct-link", route: "verify", setup: "resetFlow(); state.inputType = 'qr'; state.qrInputMode = 'link'; state.content = 'https://secure-verifikasi.example/login?session=urgent'; state.inFlow = true; state.directDetection = true; state.stage = 4; render();" },
  { name: "scenario-qr", route: "verify", setup: "startScenario('qr-payment');" },
  { name: "scenario-link", route: "verify", setup: "startScenario('bank-message');" },
  { name: "scenario-image", route: "verify", setup: "startScenario('manipulated-media');" },
  { name: "scenario-audio", route: "verify", setup: "startScenario('audio-impersonation');" },
];

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

async function browserTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome tidak siap.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

const auditExpression = `(() => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 1 && rect.height > 1;
  };
  const label = (element) => {
    const id = element.id ? '#' + element.id : '';
    const classes = [...element.classList].slice(0, 3).map((name) => '.' + name).join('');
    return (element.tagName.toLowerCase() + id + classes).slice(0, 120);
  };
  const all = [...document.querySelectorAll('body *')].filter(visible);
  const outside = all.filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (style.position === 'fixed' && rect.bottom < 0) return false;
    return rect.left < -1 || rect.right > innerWidth + 1;
  }).slice(0, 12).map((element) => {
    const rect = element.getBoundingClientRect();
    return { element: label(element), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
  });
  const clippedText = all.filter((element) => {
    if (!element.textContent.trim() || element.children.length > 0) return false;
    const style = getComputedStyle(element);
    if (style.textOverflow === 'ellipsis') return false;
    return element.scrollWidth > element.clientWidth + 2 && ['hidden', 'clip'].includes(style.overflowX);
  }).slice(0, 12).map((element) => ({ element: label(element), text: element.textContent.trim().slice(0, 80) }));
  const controlsOutside = [...document.querySelectorAll('button, a, input, textarea, select')].filter(visible).filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left < -1 || rect.right > innerWidth + 1;
  }).slice(0, 12).map(label);
  return {
    viewport: [innerWidth, innerHeight],
    documentWidth: document.documentElement.scrollWidth,
    overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    outside,
    clippedText,
    controlsOutside,
  };
})()`;

try {
  const target = await browserTarget();
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const results = [];

  for (const [width, height] of viewports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
    for (const testCase of cases) {
      await cdp.send("Page.navigate", { url: `${appUrl}#/${testCase.route}` });
      for (let attempt = 0; attempt < 40; attempt += 1) {
        if (await evaluate(cdp, "document.readyState === 'complete' && typeof window.render === 'function'")) break;
        await sleep(100);
      }
      await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
      if (testCase.setup) await evaluate(cdp, testCase.setup);
      await sleep(testCase.name === "training" ? 350 : 80);
      results.push({ name: testCase.name, width, height, ...(await evaluate(cdp, auditExpression)) });
    }
  }

  const failures = results.filter((result) => result.overflow > 1 || result.controlsOutside.length || result.clippedText.length);
  console.log(JSON.stringify({ tested: results.length, failures }, null, 2));
  cdp.close();
  if (failures.length) process.exitCode = 1;
} finally {
  chrome.kill();
}
