import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function skillRoot() {
  return ROOT;
}

export function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

export function loadCategories() {
  return loadJson("data/categories.json");
}

export function countVisibleCharacters(value) {
  return Array.from(String(value).replace(/\s/gu, "")).length;
}

export function classifyTopic(topic, categories = loadCategories()) {
  const normalized = String(topic).toLocaleLowerCase("zh-CN");
  const ranked = categories
    .map((category, index) => {
      const matches = category.keywords.filter((keyword) =>
        normalized.includes(keyword.toLocaleLowerCase("zh-CN")),
      );
      const score = matches.reduce(
        (total, keyword) => total + Math.max(2, Array.from(keyword).length),
        0,
      );
      return { ...category, index, score, matches };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index);

  const [primary, secondary] = ranked;
  return {
    primary: primary.score > 0 ? primary : null,
    secondary:
      primary.score > 0 && secondary.score > 0 && secondary.score >= primary.score * 0.7
        ? secondary
        : null,
    confidence:
      primary.score === 0 ? "missing" : secondary.score >= primary.score * 0.7 ? "ambiguous" : "clear",
  };
}

export function validateDirectionSet(directions) {
  const errors = [];
  if (!Array.isArray(directions) || directions.length < 2 || directions.length > 3) {
    return ["directions must contain 2-3 items"];
  }

  const required = ["angle", "title_promise", "page_order", "visual_system", "image_strategy"];
  for (const [index, direction] of directions.entries()) {
    for (const field of required) {
      const value = direction?.[field];
      if (value == null || (Array.isArray(value) ? value.length === 0 : String(value).trim() === "")) {
        errors.push(`direction ${index + 1} missing ${field}`);
      }
    }
  }

  for (const field of required) {
    const values = directions.map((direction) =>
      JSON.stringify(direction[field]).replace(/\s/gu, "").toLocaleLowerCase("zh-CN"),
    );
    if (new Set(values).size !== directions.length) {
      errors.push(`directions do not materially differ in ${field}`);
    }
  }
  return errors;
}

const unsafePatterns = {
  "health-wellness": [/(包治|治愈|替代就医|立即停药|根治|百分百有效)/u],
  "beauty-skincare": [/(根治|永久祛|百分百不过敏|所有肤质都适合)/u],
  parenting: [/(保证长高|包治|绝对安全|不用就医|立刻停药)/u],
  "personal-finance": [/(稳赚|保本高收益|零风险|保证收益|必涨)/u],
};

export function validateOutputPackage(output) {
  const errors = [];
  const bodyLength = countVisibleCharacters(output?.body ?? "");
  if (bodyLength < 300 || bodyLength > 500) {
    errors.push(`body must contain 300-500 visible characters; received ${bodyLength}`);
  }
  if (!Array.isArray(output?.titles) || output.titles.length < 4 || output.titles.length > 6) {
    errors.push("titles must contain 4-6 items");
  }
  if (!Array.isArray(output?.pages) || output.pages.length < 5 || output.pages.length > 9) {
    errors.push("pages must contain 5-9 items");
  }
  if (!Array.isArray(output?.tags) || output.tags.length < 4 || output.tags.length > 8) {
    errors.push("tags must contain 4-8 items");
  }
  if (typeof output?.interaction_question !== "string" || !/[?？]$/u.test(output.interaction_question.trim())) {
    errors.push("interaction_question must be one question");
  }
  if (!Array.isArray(output?.sources) || !Array.isArray(output?.risks)) {
    errors.push("sources and risks must be arrays");
  }

  const scenePatterns = unsafePatterns[output?.scene] ?? [];
  const searchable = [output?.body, ...(output?.titles ?? []), ...(output?.pages ?? [])]
    .map((value) => (typeof value === "string" ? value : JSON.stringify(value)))
    .join("\n");
  for (const pattern of scenePatterns) {
    if (pattern.test(searchable)) errors.push(`unsafe claim for ${output.scene}: ${pattern}`);
  }
  return errors;
}

export function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}
