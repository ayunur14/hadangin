import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = process.env.HADANG_APP_URL || "http://127.0.0.1:3000/";
const profile = mkdtempSync(resolve(tmpdir(), "hadang-about-"));
const port = 18000 + Math.floor(Math.random() * 8000);
const chrome = spawn(chromePath, [
  "--headless=new", "--no-sandbox", "--disable-gpu-sandbox", "--disable-crash-reporter",
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
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
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
      const items = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = items.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome DevTools endpoint unavailable.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

try {
  const page = await target();
  const cdp = new Cdp(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const results = [];
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700 });
    await cdp.send("Page.navigate", { url: `${appUrl}#/about` });
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await evaluate(cdp, "Boolean(document.querySelector('.about-identity'))")) break;
      await sleep(150);
    }
    results.push(await evaluate(cdp, `(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('body *')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { element: element.className || element.tagName, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
      }).filter((item) => item.left < -1 || item.right > innerWidth + 1).slice(0, 12),
      clipped: [...document.querySelectorAll('.about-hero h1, .about-hero p, .about-name-story h2, .about-name-story p, .about-visual-language h2, .about-court-figure h3, .about-court-figure p, .about-team-legend strong, .about-team-legend small, .about-type-spec h3, .about-type-spec p, .about-color-list p, .about-color-theory strong, .about-color-theory p, .about-color-theory small')].map((element) => ({
        element: element.tagName,
        text: element.textContent.slice(0, 45),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      })).filter((item) => item.scrollWidth > item.clientWidth + 1),
    }))()`));
    if (width === 390 || width === 1440) {
      const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      writeFileSync(resolve("visual-checks", `${width === 390 ? "mobile" : "desktop"}-about-identity.png`), Buffer.from(shot.data, "base64"));
      const visual = await evaluate(cdp, `(() => { const rect = document.querySelector('.about-visual-language').getBoundingClientRect(); return { x: 0, y: rect.top + scrollY, width: innerWidth, height: rect.height }; })()`);
      const visualShot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...visual, scale: 1 } });
      writeFileSync(resolve("visual-checks", `${width === 390 ? "mobile" : "desktop"}-about-visual-language.png`), Buffer.from(visualShot.data, "base64"));
    }
  }
  const english = await evaluate(cdp, `(() => {
    setLanguage('en', false);
    return {
      title: document.querySelector('.about-hero h1')?.textContent,
      vision: document.querySelector('.about-vision > span')?.textContent,
      firstMission: document.querySelector('.about-missions strong')?.textContent,
      cultural: document.querySelector('.about-cultural-copy p')?.textContent.trim(),
      jeda: document.querySelector('.jeda-interrupt p')?.textContent.trim(),
      courtTitle: document.querySelector('.about-court-figure h3')?.textContent.trim(),
      symbolMeaning: document.querySelector('.about-logo-mark figcaption p')?.textContent.trim(),
      colorTheory: document.querySelector('.about-color-theory > strong, .about-color-theory > div > strong')?.textContent.trim(),
    };
  })()`);
  await evaluate(cdp, "setLanguage('id', false)");
  const howResults = [];
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700 });
    await cdp.send("Page.navigate", { url: `${appUrl}#/how-it-works` });
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await evaluate(cdp, "Boolean(document.querySelector('.how-modes'))")) break;
      await sleep(150);
    }
    howResults.push(await evaluate(cdp, `(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      clipped: [...document.querySelectorAll('.how-modes h2, .how-modes h3, .how-modes p, .how-mode-flow span, .how-mode-card dt, .how-mode-card dd')].map((element) => ({
        element: element.tagName,
        text: element.textContent.slice(0, 45),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      })).filter((item) => item.scrollWidth > item.clientWidth + 1),
    }))()`));
    if (width === 390 || width === 1440) {
      const modes = await evaluate(cdp, `(() => { const rect = document.querySelector('.how-modes').getBoundingClientRect(); return { x: 0, y: rect.top + scrollY, width: innerWidth, height: rect.height }; })()`);
      const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...modes, scale: 1 } });
      writeFileSync(resolve("visual-checks", `${width === 390 ? "mobile" : "desktop"}-how-modes.png`), Buffer.from(shot.data, "base64"));
    }
  }
  const howEnglish = await evaluate(cdp, `(() => {
    setLanguage('en', false);
    return {
      title: document.querySelector('.how-modes h2')?.textContent.trim(),
      individual: document.querySelector('.how-mode-card.individual h3')?.textContent.trim(),
      community: document.querySelector('.how-mode-card.community h3')?.textContent.trim(),
    };
  })()`);
  console.log(JSON.stringify({ results, english, howResults, howEnglish }, null, 2));
  cdp.close();
  if (results.some((result) => result.documentWidth > result.width + 1)
    || howResults.some((result) => result.documentWidth > result.width + 1 || result.clipped.length)
    || english.title !== "Block Information. Protect Decisions."
    || !english.cultural?.startsWith("HADANGIN is inspired by Gobak Sodor")
    || !english.jeda?.includes("Jeda is an Indonesian word for a pause")
    || english.courtTitle !== "From Court Lines to the H Symbol"
    || !english.symbolMeaning?.includes("Gobak Sodor court")
    || english.colorTheory !== "Cross-cultural Color Theory"
    || howEnglish.title !== "Practice Independently or Move Together."
    || howEnglish.individual !== "Check Information and Practice Your Own Decisions."
    || howEnglish.community !== "Block Information Through Team Play.") process.exitCode = 1;
} finally {
  chrome.kill();
}
