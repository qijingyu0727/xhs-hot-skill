#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, skillRoot } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.root ?? skillRoot());
const readmes = ["README.md", "README.en.md"];
const errors = [];
const markdownLink = /!?\[[^\]]*\]\(([^)]+)\)/gu;

for (const filename of readmes) {
  const fullPath = path.join(root, filename);
  if (!fs.existsSync(fullPath)) {
    errors.push(`missing ${filename}`);
    continue;
  }
  const markdown = fs.readFileSync(fullPath, "utf8");
  for (const match of markdown.matchAll(markdownLink)) {
    const target = match[1].trim().replace(/^<|>$/gu, "").split(/\s+["']/u, 1)[0];
    if (target.startsWith("#")) continue;
    if (/^file:/iu.test(target)) {
      errors.push(`${filename}: file URI is not portable (${target})`);
      continue;
    }
    if (/^http:/iu.test(target)) errors.push(`${filename}: external link must use HTTPS (${target})`);
    if (/^https:/iu.test(target) || /^mailto:/iu.test(target)) continue;
    const localPath = decodeURIComponent(target.split("#", 1)[0]);
    if (localPath && !fs.existsSync(path.resolve(path.dirname(fullPath), localPath))) {
      errors.push(`${filename}: missing local target ${target}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`FAIL README links (${errors.length} issues)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`PASS README links: ${readmes.join(", ")}`);
