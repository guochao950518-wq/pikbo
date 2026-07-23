#!/usr/bin/env node
/**
 * G6 refund leg only.
 * Start server with: PIKBO_FORCE_GENERATE_FAIL=1 npm run dev
 * Then: node scripts/g6-refund-leg.mjs
 */
import assert from "node:assert/strict";
import { appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.PIKBO_BASE || "http://127.0.0.1:3000";
const LOG = join(root, "docs/evidence/G6_LAUNCH_LOG.md");

const tiny =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function main() {
  const health = await (await fetch(`${BASE}/api/health`)).json();
  console.log("forceGenerateFail", health.forceGenerateFail);
  assert.equal(
    health.forceGenerateFail,
    true,
    "Start Next with PIKBO_FORCE_GENERATE_FAIL=1 (non-production)"
  );

  await fetch(`${BASE}/api/dev/topup`, { method: "POST" });
  const me = await (await fetch(`${BASE}/api/me`)).json();
  const before = me.credits;

  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      effect: "360-spin-showcase",
      image: tiny,
      ownsRights: true,
    }),
  });
  const json = await res.json();
  assert.equal(res.status, 500);
  assert.equal(json.creditsRefunded, true);
  assert.equal(json.session.credits, before);
  const line = `\nOK refund leg ${new Date().toISOString()} credits ${before}→${json.session.credits} code=${json.code}\n`;
  console.log(line.trim());
  try {
    appendFileSync(LOG, line);
  } catch {
    /* ignore */
  }
  console.log("g6-refund-leg: PASS");
}

main().catch((e) => {
  console.error("g6-refund-leg: FAIL", e);
  process.exit(1);
});
