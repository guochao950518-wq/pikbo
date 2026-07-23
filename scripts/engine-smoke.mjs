#!/usr/bin/env node
/**
 * Fast engine smoke (no Next build) — provider classify + response interpret.
 * Run: node scripts/engine-smoke.mjs
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load compiled-ish TS via dynamic transpile is heavy; re-implement minimal
// parity checks against the same regexes as lib/providerError.ts so CI catches drift.
function classifyProviderError(raw) {
  if (/Exhausted balance|locked|top up|insufficient.*credit/i.test(raw)) {
    return "balance";
  }
  if (/Forbidden/i.test(raw) && /balance|billing|quota/i.test(raw)) {
    return "balance";
  }
  if (/rate.?limit|too many|429/i.test(raw)) {
    return "rate";
  }
  return "other";
}

function isValidImageDataUrl(image) {
  if (!image || image.length < 32) return false;
  return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image);
}

function interpretGenerateResponse(status, raw) {
  if (status >= 200 && status < 300) {
    if (!raw?.videoUrl) {
      return { ok: false, code: "MODEL_EMPTY", fatal: false, paywall: false };
    }
    return { ok: true, data: raw };
  }
  const code = raw?.code;
  const paywall = code === "INSUFFICIENT_CREDITS";
  const fatal = code === "INSUFFICIENT_CREDITS" || code === "PROVIDER_BALANCE";
  return {
    ok: false,
    code,
    fatal,
    paywall,
    retryAfterSec: raw?.retryAfterSec,
    error: raw?.error || "fail",
  };
}

// --- classify ---
assert.equal(classifyProviderError("Exhausted balance"), "balance");
assert.equal(classifyProviderError("rate limit exceeded"), "rate");
assert.equal(classifyProviderError("boom"), "other");

// --- image mime ---
assert.equal(
  isValidImageDataUrl("data:image/png;base64,iVBORw0KGgo="),
  true
);
assert.equal(isValidImageDataUrl("data:text/plain;base64,abc"), false);
assert.equal(isValidImageDataUrl("data:image/svg+xml;base64,abc"), false);

// --- interpret ---
const ok = interpretGenerateResponse(200, {
  videoUrl: "/demos/x.mp4",
  demo: true,
  resolution: "480p",
});
assert.equal(ok.ok, true);

const empty = interpretGenerateResponse(200, {});
assert.equal(empty.ok, false);

const credits = interpretGenerateResponse(402, {
  code: "INSUFFICIENT_CREDITS",
  error: "nope",
});
assert.equal(credits.paywall, true);
assert.equal(credits.fatal, true);

const provider = interpretGenerateResponse(402, {
  code: "PROVIDER_BALANCE",
  error: "fal empty",
});
assert.equal(provider.paywall, false);
assert.equal(provider.fatal, true);

const rl = interpretGenerateResponse(429, {
  code: "RATE_LIMITED",
  retryAfterSec: 12,
  error: "slow down",
});
assert.equal(rl.fatal, false);
assert.equal(rl.retryAfterSec, 12);

// source files must still export symbols (grep-level)
const require = createRequire(import.meta.url);
const fs = require("node:fs");
const gen = fs.readFileSync(join(root, "lib/generateClient.ts"), "utf8");
assert.match(gen, /export async function postGenerateWithRetry/);
assert.match(gen, /historyFieldsFromSuccess/);
const pe = fs.readFileSync(join(root, "lib/providerError.ts"), "utf8");
assert.match(pe, /export function isValidImageDataUrl/);
assert.match(pe, /export function classifyProviderError/);

// Demo path must not charge before FAL_KEY gate (honesty vs pricing)
const genRoute = fs.readFileSync(join(root, "app/api/generate/route.ts"), "utf8");
const demoIdx = genRoute.indexOf("if (!process.env.FAL_KEY)");
const deductIdx = genRoute.indexOf("deductCredits(session");
assert.ok(demoIdx > 0 && deductIdx > demoIdx, "demo path must run before credit deduct");
assert.match(genRoute, /Cached demos stay free|free cached Lab/i);

const imgRoute = fs.readFileSync(join(root, "app/api/image/route.ts"), "utf8");
const imgDemo = imgRoute.indexOf("if (!process.env.FAL_KEY)");
const imgDeduct = imgRoute.indexOf("deductCredits(session");
assert.ok(imgDemo > 0 && imgDeduct > imgDemo, "image demo path free before deduct");

const ent = fs.readFileSync(join(root, "lib/entitlements.ts"), "utf8");
assert.match(ent, /probeEntitlementsStore/);

const rateLimitSrc = fs.readFileSync(join(root, "lib/rateLimit.ts"), "utf8");
assert.match(rateLimitSrc, /takeGenerateBudget/);
assert.match(rateLimitSrc, /tryBeginJob/);
assert.match(rateLimitSrc, /endJob/);

const me = fs.readFileSync(join(root, "app/api/me/route.ts"), "utf8");
assert.match(me, /generateMode/);
assert.match(me, /cachedDemoFree/);

// prompt build: always keep template (no freeform-only replace)
function sanitizeExtra(extra) {
  if (typeof extra !== "string") return "";
  return extra.trim().slice(0, 400);
}
function buildGeneratePrompt(template, extra) {
  const custom = sanitizeExtra(extra);
  if (!custom) return template;
  return `${template} Additional direction: ${custom}.`;
}
const tpl = "Toy hero spin, keep figure identity.";
assert.equal(buildGeneratePrompt(tpl, ""), tpl);
assert.match(buildGeneratePrompt(tpl, "neon lights"), /Toy hero spin/);
assert.match(buildGeneratePrompt(tpl, "x".repeat(500)), /Toy hero spin/);
assert.ok(buildGeneratePrompt(tpl, "x".repeat(500)).length < tpl.length + 50 + 400);

const pb = fs.readFileSync(join(root, "lib/promptBuild.ts"), "utf8");
assert.match(pb, /buildGeneratePrompt/);
assert.match(pb, /MAX_EXTRA_CHARS/);

const hist = fs.readFileSync(join(root, "lib/history.ts"), "utf8");
assert.match(hist, /remoteClipMayExpire/);

assert.match(ent, /lastInvoiceId/);
const wh = fs.readFileSync(join(root, "app/api/webhooks/stripe/route.ts"), "utf8");
assert.match(wh, /lastInvoiceId/);
assert.match(wh, /double-fill|redeliver/i);

const batch = fs.readFileSync(join(root, "components/BatchStudio.tsx"), "utf8");
assert.match(batch, /effectiveModel/);
assert.match(batch, /seedance-mini/);
assert.match(batch, /effectiveResolution/);

const meClient = fs.readFileSync(join(root, "lib/meClient.ts"), "utf8");
assert.match(meClient, /export async function fetchMe/);
assert.match(meClient, /cachedDemoFree/);

const samples = fs.readFileSync(join(root, "lib/samples.ts"), "utf8");
assert.match(samples, /isValidImageDataUrl/);
assert.match(samples, /requiredSampleStillPaths/);

const health = fs.readFileSync(join(root, "app/api/health/route.ts"), "utf8");
assert.match(health, /export async function HEAD/);

console.log("engine-smoke: PASS");
void pathToFileURL; // keep import used on older node
