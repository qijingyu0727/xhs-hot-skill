#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadCategories, parseArgs, skillRoot } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.root ?? skillRoot());
const categories = JSON.parse(fs.readFileSync(path.join(root, "data/categories.json"), "utf8"));
const errors = [];
const requiredFiles = [
  "SKILL.md", "agents/openai.yaml", "data/sample.schema.json", "data/categories.json",
  "references/category-router.md", "references/copy-constitution.md",
  "references/visual-constitution.md", "references/safety-copyright.md",
  "references/output-contract.md", "references/research-protocol.md",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);
}

const skillPath = path.join(root, "SKILL.md");
if (fs.existsSync(skillPath)) {
  const skill = fs.readFileSync(skillPath, "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? "";
  const keys = frontmatter.split("\n").filter(Boolean).map((line) => line.split(":", 1)[0]);
  if (keys.join(",") !== "name,description") errors.push("SKILL.md frontmatter must contain only name and description");
  if (!/2-3 distinct|2-3 个|2-3 direction/iu.test(skill)) errors.push("SKILL.md missing 2-3 direction contract");
  if (!/300-500/iu.test(skill)) errors.push("SKILL.md missing body length contract");
  if (!/更新样本库/u.test(skill) || !/do not browse/iu.test(skill)) errors.push("SKILL.md missing local-first research gate");
  if (!/guizang-social-card-skill/u.test(skill)) errors.push("SKILL.md missing Guizang orchestration");
  if (/\bTODO\b/u.test(skill)) errors.push("SKILL.md contains TODO");
  if (skill.split(/\r?\n/u).length > 500) errors.push("SKILL.md exceeds 500 lines");
}

const headingContracts = [
  [/audience|读者|受众|人群|适合谁|使用场景/iu, "audience"],
  [/title formulas?|标题公式/iu, "title formulas"],
  [/direction archetypes?|方向原型|内容方向/iu, "direction archetypes"],
  [/page structures?|页面结构|轮播结构|页结构/iu, "page structures"],
  [/copy rhythm|文案节奏/iu, "copy rhythm"],
  [/image strategy|图片策略|素材策略/iu, "image strategy"],
  [/guizang|editorial|swiss/iu, "Guizang route"],
  [/positive samples?|正向样本|优质样本|正例|样本锚点/iu, "positive samples"],
  [/counterexamples?|反例|反向样本/iu, "counterexamples"],
  [/safety|copyright|安全|版权/iu, "safety and copyright"],
  [/checklist|检查清单|发布前检查/iu, "checklist"],
];

if (categories.length !== 20) errors.push(`expected 20 categories; found ${categories.length}`);
for (const category of categories) {
  const recipePath = path.join(root, "references/scenes", category.recipe);
  if (!fs.existsSync(recipePath)) {
    errors.push(`missing recipe references/scenes/${category.recipe}`);
    continue;
  }
  const recipe = fs.readFileSync(recipePath, "utf8");
  for (const [pattern, name] of headingContracts) {
    if (!pattern.test(recipe)) errors.push(`${category.id}: missing ${name}`);
  }
  if (/\bTODO\b/u.test(recipe)) errors.push(`${category.id}: recipe contains TODO`);
}

const forbiddenCopies = ["validate-social-deck.mjs", "render-social", "guizang-ppt-skill/assets"];
for (const marker of forbiddenCopies) {
  const files = fs.readdirSync(root, { recursive: true }).map(String);
  if (files.some((file) => file.includes(marker))) errors.push(`copied Guizang implementation detected: ${marker}`);
}

if (errors.length > 0) {
  console.error(`FAIL skill validation (${errors.length} issue${errors.length === 1 ? "" : "s"})`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS skill: core contract plus ${categories.length} complete scene recipes`);
