import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyTopic } from "../scripts/lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = JSON.parse(fs.readFileSync(path.join(root, "tests/eval-cases.json"), "utf8"));

assert.equal(cases.length, 60);

for (const fixture of cases) {
  test(`${fixture.id} routes ${fixture.copy_goal}`, () => {
    const result = classifyTopic(fixture.topic);
    assert.equal(result.primary?.id, fixture.expected_scene);
    assert.notEqual(fixture.copy_goal.trim(), "");
  });
}

test("underspecified topic requests clarification instead of guessing", () => {
  assert.equal(classifyTopic("帮我写一篇小红书").confidence, "missing");
});

test("cross-scene topic exposes ambiguity", () => {
  const result = classifyTopic("AI 工具做会议纪要");
  assert.equal(result.confidence, "ambiguous");
  assert.deepEqual(new Set([result.primary.id, result.secondary.id]), new Set(["ai-tools", "office-productivity"]));
});
