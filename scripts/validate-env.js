#!/usr/bin/env node

/**
 * Validates required environment variables before production builds.
 * Run via: npm run validate-env
 */

const fs = require("fs");
const path = require("path");

/** Load .env files so validation works outside of Next.js */
function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const required = [
  {
    key: "NEXT_PUBLIC_API_URL",
    validate: (value) => value.startsWith("http"),
    hint: "Must be a full URL (e.g. http://localhost:4000)",
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    validate: (value) => value.startsWith("http"),
    hint: "Must be a full URL (e.g. http://localhost:3000)",
  },
];

let hasError = false;

for (const { key, validate, hint } of required) {
  const value = process.env[key];

  if (!value) {
    console.error(`✗ Missing required env var: ${key}`);
    hasError = true;
    continue;
  }

  if (!validate(value)) {
    console.error(`✗ Invalid ${key}: ${hint}`);
    hasError = true;
    continue;
  }

  console.log(`✓ ${key}`);
}

if (hasError) {
  console.error("\nEnvironment validation failed. See .env.example for reference.");
  process.exit(1);
}

console.log("\nEnvironment validation passed.");
