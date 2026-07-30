import test from "node:test";
import assert from "node:assert/strict";
import { validateDirectionSet, validateOutputPackage } from "../scripts/lib.mjs";

const directions = [
  { angle: "按任务链筛选", title_promise: "从发现到核验", page_order: ["误区", "地图", "工具", "组合", "清单"], visual_system: "Swiss light-dark grid", image_strategy: "界面与流程图" },
  { angle: "从一次失败复盘", title_promise: "少装工具也能跑通", page_order: ["结果", "失败", "判断", "替换", "边界"], visual_system: "Editorial full-bleed", image_strategy: "人物工作场景与标注" },
  { angle: "高低成本对照", title_promise: "三档选择不踩坑", page_order: ["问题", "三档", "对照", "适合谁", "决策"], visual_system: "Swiss comparison matrix", image_strategy: "产品对象与对比表" }
];

test("2-3 directions must differ on all five dimensions", () => {
  assert.deepEqual(validateDirectionSet(directions), []);
});

test("cosmetic direction duplicates fail", () => {
  const duplicate = structuredClone(directions);
  duplicate[1].visual_system = duplicate[0].visual_system;
  assert.match(validateDirectionSet(duplicate).join("\n"), /visual_system/u);
});

function bodyOfLength(length) {
  const source = "我先把真实问题写清楚，再按使用频率筛选工具。每个选择都对应一个具体任务，也保留不适用的情况。";
  return Array.from(source.repeat(Math.ceil(length / Array.from(source).length))).slice(0, length).join("");
}

const validOutput = {
  scene: "ai-tools",
  titles: ["标题一", "标题二", "标题三", "标题四"],
  pages: ["封面", "误区", "方法", "示例", "清单"],
  body: bodyOfLength(360),
  tags: ["AI工具", "效率", "技能分享", "工作流"],
  interaction_question: "你下一篇想看哪类工具？",
  sources: [],
  risks: []
};

test("complete output package passes", () => {
  assert.deepEqual(validateOutputPackage(validOutput), []);
});

test("body over 500 characters fails", () => {
  assert.match(validateOutputPackage({ ...validOutput, body: bodyOfLength(501) }).join("\n"), /300-500/u);
});

for (const [scene, claim] of [
  ["health-wellness", "这个方法可以根治失眠"],
  ["beauty-skincare", "这款产品百分百不过敏"],
  ["parenting", "这个动作对宝宝绝对安全"],
  ["personal-finance", "这个方案稳赚而且零风险"]
]) {
  test(`${scene} unsafe claim fails`, () => {
    const errors = validateOutputPackage({ ...validOutput, scene, body: `${claim}${bodyOfLength(350)}` });
    assert.match(errors.join("\n"), /unsafe claim/u);
  });
}
