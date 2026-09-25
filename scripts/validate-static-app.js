const fs = require("node:fs");

const requiredFiles = ["index.html", "styles.css", "app.js"];

for (const file of requiredFiles) {
  const stats = fs.statSync(file, { throwIfNoEntry: false });

  if (!stats?.isFile() || stats.size === 0) {
    throw new Error(`Missing or empty file: ${file}`);
  }
}

const html = fs.readFileSync("index.html", "utf8");

const stylePattern = /<link\b[^>]*href=["'](?:\.\/)?(?:[^"'?#]+\/)*styles\.css(?:[?#][^"']*)?["'][^>]*>/i;
const scriptPattern = /<script\b[^>]*src=["'](?:\.\/)?(?:[^"'?#]+\/)*app\.js(?:[?#][^"']*)?["'][^>]*>\s*<\/script\s*>/i;

if (!stylePattern.test(html)) {
  throw new Error("Missing styles.css link");
}

if (!scriptPattern.test(html)) {
  throw new Error("Missing app.js script");
}
