import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = ["index.html", "app.js", "community-vision.js", "training-3d.js"];
const indonesian = /\b(yang|untuk|dengan|dari|tidak|akan|ini|itu|pilih|periksa|pesan|informasi|bukti|tekanan|emosi|tindakan|kamu|kami|dapat|setelah|sebelum|pada|dalam|lebih|menjadi|apakah|jangan|hanya|harus|perlu|sudah|belum|secara|peserta|permainan|garis|kartu|mulai|berhenti|aman|resmi|gambar|tautan|rekaman|keputusan|penilaian|skenario|pengguna|masukkan|lihat|gunakan|buka|ganti|hasil|pertanyaan|jawaban|langkah|kasus|orang|sebuah|sebagai|membantu|membuat|memilih|menunjukkan|terlihat|terjadi)\b/i;
const strings = new Set();
const usable = (text) => text.length > 2 && text.length < 600 && !text.includes("${") && !/[{}]|=>|\b(function|const|document|window)\b/.test(text) && indonesian.test(text);

for (const file of files) {
  const source = readFileSync(resolve(root, file), "utf8");
  for (const match of source.matchAll(/(["'])(.*?)(?<!\\)\1/g)) {
    const text = match[2].replaceAll("\\n", " ").trim();
    if (usable(text)) strings.add(text);
  }
  for (const match of source.matchAll(/>([^<>]+)</g)) {
    const text = match[1].replace(/\$\{[^}]+\}/g, " ").replace(/\s+/g, " ").trim();
    if (usable(text)) strings.add(text);
  }
}

const output = {};
const queue = [...strings];
let completed = 0;
async function worker() {
  while (queue.length) {
    const source = queue.shift();
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.search = new URLSearchParams({ client: "gtx", sl: "id", tl: "en", dt: "t", q: source });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      output[source] = data[0].map((part) => part[0]).join("").replace(/hadangin/gi, (word) => word === word.toUpperCase() ? "HADANGIN" : "Hadangin");
    } catch (error) { console.error(`Failed: ${source.slice(0, 60)} (${error.message})`); }
    completed += 1;
    if (completed % 25 === 0) console.log(`${completed}/${strings.size}`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const sorted = Object.fromEntries(Object.entries(output).sort(([a], [b]) => a.localeCompare(b, "id")));
writeFileSync(resolve(root, "translations-en.json"), `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`Wrote ${Object.keys(sorted).length} translations.`);
