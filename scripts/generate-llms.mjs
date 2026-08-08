import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public");
const bundle = path.join(root, "node_modules/.cache/lessons-llms.mjs");
fs.mkdirSync(path.dirname(bundle), { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

execSync(
  `npx esbuild ${path.join(root, "src/data/lessons.ts")} --bundle --format=esm --platform=node --outfile=${bundle}`,
  { stdio: "inherit", cwd: root },
);

const { LESSONS } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`);
const SITE = "https://xiaoqianran.github.io/learning-d3";

function blockMd(b) {
  if (b.type === "text") {
    const head = b.title ? `### ${b.title}\n\n` : "";
    return `${head}${b.body || ""}\n`;
  }
  if (b.type === "tip") return `> **提示：** ${b.body || ""}\n`;
  if (b.type === "code") {
    const head = b.title ? `### ${b.title}\n\n` : "";
    return `${head}\`\`\`${b.lang || "js"}\n${b.code || ""}\n\`\`\`\n`;
  }
  if (b.type === "demo") {
    const h = b.hint ? ` — ${b.hint}` : "";
    return `**交互 Demo：** ${b.title || ""}${h}（kind: \`${b.kind}\`）\n`;
  }
  if (b.type === "quiz") {
    const lines = ["**测验：**"];
    for (const q of b.questions || []) {
      lines.push(`- Q: ${q.question}`);
      (q.options || []).forEach((o, i) => {
        lines.push(`  - [${i === q.answer ? "✓" : " "}] ${o}`);
      });
      lines.push(`  - 解析: ${q.explain}`);
    }
    return lines.join("\n") + "\n";
  }
  return "";
}

const byTrack = new Map();
for (const l of LESSONS) {
  const t = l.track || "其他";
  if (!byTrack.has(t)) byTrack.set(t, []);
  byTrack.get(t).push(l);
}
const order = ["基础", "图表", "布局", "交互进阶", "工程化"];
const tracks = [
  ...order.filter((t) => byTrack.has(t)),
  ...[...byTrack.keys()].filter((t) => !order.includes(t)),
];

const index = [
  "# learning-d3",
  "",
  "> 交互式中文 D3.js 教程：讲解 + 源码 + Live Demo + 测验 + Playground + 图表工坊。",
  "> API 权威以 [d3js.org](https://d3js.org) 为准（站点暂无官方 llms.txt）。",
  "",
  `完整上下文（全文）：[${SITE}/llms-full.txt](${SITE}/llms-full.txt)`,
  "",
  "## 官方权威（务必优先）",
  "",
  "- [d3js.org](https://d3js.org) — 文档首页",
  "- [What is D3?](https://d3js.org/what-is-d3)",
  "- [Getting started](https://d3js.org/getting-started)",
  "- [API index](https://d3js.org/api)",
  "- [Gallery (Observable)](https://observablehq.com/@d3/gallery)",
  "",
  "## 站点入口",
  "",
  `- [首页大纲](${SITE}/)`,
  `- [文档地图](${SITE}/docs)`,
  `- [Playground](${SITE}/playground)`,
  `- [图表工坊](${SITE}/studio)`,
  `- [速查表](${SITE}/cheatsheet)`,
  `- [学习中心](${SITE}/hub)`,
  `- [练习场](${SITE}/lab)`,
  `- [结业证明](${SITE}/certificate)`,
  "",
];

for (const tr of tracks) {
  index.push(`## 课程 · ${tr}`, "");
  for (const l of byTrack.get(tr)) {
    index.push(
      `- [${l.title}](${SITE}/lesson/${l.slug}): ${l.summary}（${l.level} · ${l.minutes} 分钟）`,
    );
  }
  index.push("");
}

const full = [
  "# learning-d3 — full curriculum",
  "",
  `生成自本站 ${LESSONS.length} 课。权威 API 语义以 d3js.org 为准。`,
  "",
];

for (const l of LESSONS) {
  full.push(
    `---`,
    "",
    `# ${l.title}`,
    "",
    `- slug: \`${l.slug}\``,
    `- track: ${l.track}`,
    `- level: ${l.level}`,
    `- minutes: ${l.minutes}`,
    "",
  );
  for (const b of l.blocks || []) full.push(blockMd(b), "");
}

fs.writeFileSync(path.join(outDir, "llms.txt"), index.join("\n"));
fs.writeFileSync(path.join(outDir, "llms-full.txt"), full.join("\n"));
console.log("llms.txt", fs.statSync(path.join(outDir, "llms.txt")).size);
console.log("llms-full.txt", fs.statSync(path.join(outDir, "llms-full.txt")).size);
