#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { parseArgs, skillRoot } from "./lib.mjs";

const require = createRequire(import.meta.url);
const args = parseArgs(process.argv.slice(2));
const root = skillRoot();
const externalSkill = path.resolve(
  args.guizang ?? path.join(os.homedir(), ".agents/skills/guizang-social-card-skill"),
);
const templatePath = path.join(externalSkill, "assets/template-swiss-card.html");

if (!fs.existsSync(templatePath)) {
  console.error(`Guizang template not found: ${templatePath}`);
  process.exit(2);
}

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const bundled = path.join(
      os.homedir(),
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js",
    );
    if (fs.existsSync(bundled)) return require(bundled);
    throw new Error("Playwright is missing. Install it locally or provide the Codex workspace runtime.");
  }
}

const { chromium } = loadPlaywright();
const slugs = args.deck
  ? [args.deck]
  : ["ai-tools", "office-productivity", "travel-guides", "lifestyle", "product-reviews"];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const lines = (value) => value.map(escapeHtml).join("<br>");

function chrome(deck, index) {
  return `<div class="chrome-min"><span>${escapeHtml(deck.label)}</span><span>${String(index).padStart(2, "0")} / 05</span></div>`;
}

function cover(deck, page, index) {
  return `<section class="poster xhs demo-cover" id="${deck.slug}-${index}">
    <div class="content stack gap-9">
      ${chrome(deck, index)}
      <p class="t-cat">${escapeHtml(page.kicker)}</p>
      <h1 class="h-statement">${lines(page.title)}</h1>
      <div class="demo-cover-route">${page.tags.map((tag, tagIndex) => `<div><span class="t-meta">0${tagIndex + 1}</span><p>${escapeHtml(tag)}</p></div>`).join("")}</div>
      <div class="demo-cover-band">
        <p class="lead">${escapeHtml(page.lead)}</p>
      </div>
    </div>
  </section>`;
}

function matrix(deck, page, index) {
  return `<section class="poster xhs" id="${deck.slug}-${index}">
    <div class="content stack gap-7">
      ${chrome(deck, index)}
      <p class="t-cat">${escapeHtml(page.kicker)}</p>
      <h2 class="h-xl">${lines(page.title)}</h2>
      <div class="matrix-fill">${page.cells.map((cell, cellIndex) => `<div class="matrix-cell${cellIndex === page.accent ? " is-accent" : ""}"><p class="cell-nb">${String(cellIndex + 1).padStart(2, "0")}</p><p class="cell-title">${escapeHtml(cell)}</p></div>`).join("")}</div>
      <div class="hero-stat-bottom"><div><p class="t-cat">${escapeHtml(page.bottom_label)}</p><p class="lead">${escapeHtml(page.bottom_text)}</p></div><p class="num-mega">${page.cells.length}</p></div>
    </div>
  </section>`;
}

function compare(deck, page, index) {
  return `<section class="poster xhs" id="${deck.slug}-${index}">
    <div class="content stack gap-7">
      ${chrome(deck, index)}
      <p class="t-cat">${escapeHtml(page.kicker)}</p>
      <h2 class="h-xl">${lines(page.title)}</h2>
      <div class="demo-compare">${page.columns.map((column, columnIndex) => `<div class="card-fill demo-compare-card"><p class="t-meta">0${columnIndex + 1} · ${escapeHtml(column.label)}</p><h3 class="h-md">${escapeHtml(column.heading)}</h3><p class="body">${escapeHtml(column.body)}</p></div>`).join("")}</div>
      <div class="demo-decision"><span class="t-cat">${escapeHtml(page.decision_label)}</span><p class="lead">${escapeHtml(page.decision)}</p></div>
    </div>
  </section>`;
}

function ledger(deck, page, index) {
  return `<section class="poster xhs" id="${deck.slug}-${index}">
    <div class="content stack gap-7">
      ${chrome(deck, index)}
      <p class="t-cat">${escapeHtml(page.kicker)}</p>
      <h2 class="h-xl">${lines(page.title)}</h2>
      <div class="stacked-ledger">${page.rows.map((row) => `<div class="ledger-row"><p class="ledger-num">${escapeHtml(row.number)}</p><div class="ledger-lbl">${escapeHtml(row.label)}<span class="sub">${escapeHtml(row.sub)}</span></div><div class="demo-ledger-mark"></div></div>`).join("")}</div>
    </div>
  </section>`;
}

function close(deck, page, index) {
  return `<section class="poster xhs demo-close" id="${deck.slug}-${index}">
    <div class="content stack gap-9">
      ${chrome(deck, index)}
      <p class="t-cat">${escapeHtml(page.kicker)}</p>
      <h2 class="h-statement">${lines(page.title)}</h2>
      <p class="lead demo-close-lead">${escapeHtml(page.lead)}</p>
      <div class="demo-close-list">${page.points.map((point, pointIndex) => `<div><span class="t-meta">0${pointIndex + 1}</span><p class="body">${escapeHtml(point)}</p></div>`).join("")}</div>
    </div>
  </section>`;
}

const renderers = { cover, matrix, compare, ledger, close };
const customCss = `
    .poster *{letter-spacing:0}
    .demo-cover{background:var(--accent);color:var(--accent-on)}
    .demo-cover .h-statement,.demo-cover .lead,.demo-cover .t-cat,.demo-cover .t-meta,.demo-cover .chrome-min{color:var(--accent-on)}
    .demo-cover .chrome-min{border-bottom-color:currentColor}
    .demo-cover-route{display:grid;grid-template-columns:repeat(3,1fr);min-height:190px;border:1px solid currentColor}
    .demo-cover-route>div{background:rgba(0,0,0,.08);padding:28px 24px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid currentColor}
    .demo-cover-route>div:last-child{border-right:0}
    .demo-cover-route .t-meta{color:currentColor}
    .demo-cover-route p{font:500 24px/1.35 var(--sans-zh);margin:0;color:currentColor}
    .demo-cover-band{flex:1;min-height:190px;background:rgba(0,0,0,.08);border-top:3px solid currentColor;padding:32px;display:flex;align-items:flex-end}
    .demo-compare{display:grid;grid-template-columns:1fr 1fr;gap:32px;min-height:520px;flex:1}
    .demo-compare-card{display:flex;flex-direction:column;gap:32px;justify-content:flex-start;border-top:6px solid var(--accent)}
    .demo-decision{margin-top:auto;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);padding:28px 0;display:grid;grid-template-columns:220px 1fr;gap:32px;align-items:start}
    .poster.xhs .matrix-fill{flex:1;grid-auto-rows:1fr}
    .poster.xhs .stacked-ledger{flex:1}
    .poster.xhs .stacked-ledger .ledger-row{flex:1;align-items:center;background:var(--grey-1);border-bottom:0;padding-left:24px;padding-right:24px;margin-bottom:12px}
    .poster.xhs .stacked-ledger .ledger-row:last-child{margin-bottom:0}
    .demo-ledger-mark{width:44px;height:44px;background:var(--accent)}
    .demo-close{background:var(--ink)}
    .demo-close .h-statement,.demo-close .lead,.demo-close .body,.demo-close .t-meta,.demo-close .chrome-min{color:var(--paper)}
    .demo-close .t-cat{color:var(--accent)}
    .demo-close .chrome-min{border-bottom-color:var(--grey-3)}
    .demo-close-lead{max-width:760px}
    .demo-close-list{border-top:1px solid var(--grey-3);display:flex;flex:1;flex-direction:column;gap:12px}
    .demo-close-list>div{flex:1;min-height:112px;background:rgba(255,255,255,.05);border-bottom:1px solid var(--grey-3);padding:0 24px;display:grid;grid-template-columns:120px 1fr;align-items:center;gap:32px}
  `;

const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({
  ...(fs.existsSync(systemChrome) ? { executablePath: systemChrome } : {}),
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({ viewport: { width: 1400, height: 1700 }, deviceScaleFactor: 1 });
const page = await context.newPage();

for (const slug of slugs) {
  const deckPath = path.join(root, "examples", slug, "deck.json");
  const deck = JSON.parse(fs.readFileSync(deckPath, "utf8"));
  const posters = deck.pages.map((item, index) => renderers[item.type](deck, item, index + 1)).join("\n");
  let html = fs.readFileSync(templatePath, "utf8");
  html = html.replace(/<html lang="zh-CN" data-accent="[^"]+">/u, `<html lang="zh-CN" data-accent="${deck.accent}">`);
  html = html.replace("  </style>", `${customCss}\n  </style>`);
  const placeholderStart = html.indexOf("    <!-- ============================================================\n         Placeholder:");
  const mainEnd = html.indexOf("\n  </main>", placeholderStart);
  if (placeholderStart < 0 || mainEnd < 0) throw new Error("Guizang template placeholder changed");
  html = `${html.slice(0, placeholderStart)}${posters}${html.slice(mainEnd)}`;

  const taskDir = path.join(os.tmpdir(), "xhs-hot-skill-guizang", slug);
  const outputDir = path.join(root, "examples", slug, "output");
  fs.mkdirSync(taskDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(taskDir, "index.html"), html);

  await page.goto(pathToFileURL(path.join(taskDir, "index.html")).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (let index = 0; index < deck.pages.length; index += 1) {
    const target = page.locator(`#${deck.slug}-${index + 1}`);
    await target.screenshot({ path: path.join(outputDir, `page-${String(index + 1).padStart(2, "0")}.png`) });
  }
  console.log(`Rendered ${slug}: ${deck.pages.length} pages -> ${outputDir}`);
}

await browser.close();
