#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { skillRoot } from "./lib.mjs";

const root = skillRoot();
const shards = ["a", "b", "c"].map((name) => path.join(root, "data/shards", `${name}.jsonl`));
const output = path.join(root, "data/samples.jsonl");

const merged = shards.map((file) => fs.readFileSync(file, "utf8").trim()).join("\n");
fs.writeFileSync(output, `${merged}\n`);
console.log(`Merged ${shards.length} shards into ${path.relative(root, output)}`);
