#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, validateDirectionSet, validateOutputPackage } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.input) {
  console.error("Usage: node scripts/validate-output.mjs --input <package.json>");
  process.exit(2);
}

const input = JSON.parse(fs.readFileSync(path.resolve(args.input), "utf8"));
const errors = [
  ...validateDirectionSet(input.directions),
  ...(input.output ? validateOutputPackage(input.output) : []),
];

if (errors.length > 0) {
  console.error(`FAIL output validation (${errors.length} issues)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("PASS output: directions and final package satisfy the contract");
