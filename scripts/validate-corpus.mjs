#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadCategories, parseArgs, skillRoot } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const input = path.resolve(skillRoot(), args.input ?? "data/samples.jsonl");
const expectedCount = Number(args.count ?? 400);
const categories = loadCategories();
const sceneIds = new Set(categories.map((category) => category.id));
const requiredFields = [
  "id", "scene", "scene_label", "title", "source_url", "platform", "author",
  "published_at", "collected_at", "engagement", "evidence_grade", "source_access",
  "title_pattern", "opening_pattern", "body_pattern", "visual_pattern", "action_value",
  "risk_notes", "derived_pattern", "rights",
];
const allowedFields = new Set(requiredFields);
const grades = new Set([
  "verified-high-engagement", "quality-reference", "trend-reference", "counterexample",
]);
const accessModes = new Set(["direct", "search-snippet", "metadata-only"]);
const platforms = new Set([
  "xiaohongshu", "wechat", "weibo", "bilibili", "zhihu", "douyin", "toutiao", "web", "other",
]);
const errors = [];
const highEngagementThresholds = {
  likes: 1000,
  collections: 1000,
  comments: 200,
  shares: 100,
};

if (!fs.existsSync(input)) {
  console.error(`FAIL corpus file is missing: ${input}`);
  process.exit(1);
}

const records = fs.readFileSync(input, "utf8").split(/\r?\n/u).filter(Boolean).map((line, index) => {
  try {
    return JSON.parse(line);
  } catch (error) {
    errors.push(`line ${index + 1}: invalid JSON (${error.message})`);
    return null;
  }
}).filter(Boolean);

if (records.length !== expectedCount) errors.push(`expected ${expectedCount} records; found ${records.length}`);

const ids = new Set();
const urls = new Set();
const byScene = new Map(categories.map((category) => [category.id, []]));
const shortFields = {
  scene_label: 20, title: 100, author: 100, title_pattern: 240, opening_pattern: 240,
  body_pattern: 240, visual_pattern: 240, action_value: 240, risk_notes: 240, derived_pattern: 280,
};

for (const [index, record] of records.entries()) {
  const at = `line ${index + 1}`;
  for (const field of requiredFields) {
    if (!(field in record)) errors.push(`${at}: missing ${field}`);
  }
  const unexpectedFields = Object.keys(record).filter((field) => !allowedFields.has(field));
  if (unexpectedFields.length > 0) {
    errors.push(`${at}: unexpected fields ${unexpectedFields.join(", ")}`);
  }
  const serialized = JSON.stringify(record);
  const forbiddenArtifact = [
    /data:(?:image|video|application)\//iu,
    /<(?:img|video|picture|script)\b/iu,
    /\b(?:xsec_token|auth_token|sessionid|authorization|cookie)\s*[=:]/iu,
  ].find((pattern) => pattern.test(serialized));
  if (forbiddenArtifact) errors.push(`${at}: contains a forbidden raw or sensitive artifact`);
  if (!sceneIds.has(record.scene)) errors.push(`${at}: unknown scene ${record.scene}`);
  else byScene.get(record.scene).push(record);
  if (!new RegExp(`^${record.scene}-[0-9]{2}$`, "u").test(record.id ?? "")) {
    errors.push(`${at}: id must match scene-01 format`);
  }
  if (ids.has(record.id)) errors.push(`${at}: duplicate id ${record.id}`);
  ids.add(record.id);

  let parsedUrl;
  try {
    parsedUrl = new URL(record.source_url);
    if (!/^https?:$/u.test(parsedUrl.protocol)) errors.push(`${at}: source_url must be http(s)`);
    const sensitiveKeys = [...parsedUrl.searchParams.keys()].filter((key) =>
      /(token|cookie|auth|session|signature|xsec)/iu.test(key),
    );
    if (sensitiveKeys.length > 0) errors.push(`${at}: source_url contains sensitive query keys`);
  } catch {
    errors.push(`${at}: invalid source_url`);
  }
  const canonicalUrl = parsedUrl
    ? `${parsedUrl.origin}${parsedUrl.pathname}`.replace(/\/$/u, "")
    : record.source_url;
  if (urls.has(canonicalUrl)) errors.push(`${at}: duplicate source_url ${canonicalUrl}`);
  urls.add(canonicalUrl);

  if (!platforms.has(record.platform)) errors.push(`${at}: invalid platform`);
  if (!grades.has(record.evidence_grade)) errors.push(`${at}: invalid evidence_grade`);
  if (!accessModes.has(record.source_access)) errors.push(`${at}: invalid source_access`);
  if (record.collected_at !== "2026-07-30") errors.push(`${at}: collected_at must be 2026-07-30`);
  if (record.rights !== "metadata-and-derived-analysis-only") errors.push(`${at}: invalid rights marker`);
  if (record.published_at !== "unknown" && !/^\d{4}-\d{2}-\d{2}$/u.test(record.published_at ?? "")) {
    errors.push(`${at}: invalid published_at`);
  }

  for (const [field, limit] of Object.entries(shortFields)) {
    const length = Array.from(String(record[field] ?? "")).length;
    if (length === 0 || length > limit) errors.push(`${at}: ${field} length ${length} exceeds 1-${limit}`);
  }
  const engagementKeys = ["likes", "collections", "comments", "shares"];
  if (!record.engagement || typeof record.engagement !== "object") {
    errors.push(`${at}: engagement must be an object`);
  } else {
    for (const key of engagementKeys) {
      const value = record.engagement[key];
      if (!(value === null || (Number.isInteger(value) && value >= 0))) {
        errors.push(`${at}: engagement.${key} must be a non-negative integer or null`);
      }
    }
    if (record.evidence_grade === "verified-high-engagement") {
      const reachesThreshold = engagementKeys.some((key) =>
        Number.isInteger(record.engagement[key]) &&
        record.engagement[key] >= highEngagementThresholds[key],
      );
      if (record.source_access !== "direct" || !reachesThreshold) {
        errors.push(`${at}: verified-high-engagement requires direct access and a threshold metric`);
      }
    }
  }
}

for (const category of categories) {
  const sceneRecords = byScene.get(category.id);
  if (sceneRecords.length !== expectedCount / categories.length) {
    errors.push(`${category.id}: expected ${expectedCount / categories.length}; found ${sceneRecords.length}`);
    continue;
  }
  const counts = Object.fromEntries([...grades].map((grade) => [grade, 0]));
  for (const record of sceneRecords) counts[record.evidence_grade] += 1;
  if (counts["verified-high-engagement"] < 2) errors.push(`${category.id}: needs at least 2 verified-high-engagement samples`);
  if (counts["quality-reference"] < 8) errors.push(`${category.id}: needs at least 8 quality-reference samples`);
  if (counts["trend-reference"] < 1) errors.push(`${category.id}: needs at least 1 trend-reference sample`);
  if (counts.counterexample < 3) errors.push(`${category.id}: needs at least 3 counterexamples`);
}

if (errors.length > 0) {
  console.error(`FAIL corpus validation (${errors.length} issue${errors.length === 1 ? "" : "s"})`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`- ... ${errors.length - 80} more`);
  process.exit(1);
}

console.log(`PASS corpus: ${records.length} records, ${categories.length} scenes, unique IDs and canonical URLs`);
