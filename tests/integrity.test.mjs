import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skill = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
const safety = fs.readFileSync(path.join(root, "references/safety-copyright.md"), "utf8");

test("missing Guizang has an explicit honest fallback", () => {
  assert.match(skill, /If it is absent/u);
  assert.match(skill, /do not claim images were rendered/u);
});

test("normal invocation does not require live search", () => {
  assert.match(skill, /do not browse or refresh trends/u);
  assert.match(skill, /Only enter this mode/u);
});

test("copyright boundary keeps Guizang independent", () => {
  assert.match(safety, /separate AGPL-3\.0 dependency/u);
  assert.match(safety, /Do not copy its code, templates, or assets/u);
});

test("sensitive research artifacts are forbidden", () => {
  assert.match(skill, /cookies, tokens, or caches/u);
});
