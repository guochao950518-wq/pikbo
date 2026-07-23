#!/usr/bin/env node
/**
 * G6 launch pass — 2 owned-toy live Mini + optional refund leg.
 *
 * Prerequisites:
 * - Next dev with FAL_KEY + SESSION_SECRET (live-generate mode)
 * - Dev topup allowed (NODE_ENV=development)
 *
 * Usage:
 *   node scripts/g6-launch-pass.mjs
 *   G6_REFUND=1  → also expects server with PIKBO_FORCE_GENERATE_FAIL=1
 *                  (run refund on a second process after lives)
 *
 * Cap: stops after 2 live successes or hard errors. Do not loop.
 */
import assert from "node:assert/strict";
import { readFileSync, appendFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.PIKBO_BASE || "http://127.0.0.1:3000";
const TIMEOUT = Number(process.env.G6_GENERATE_TIMEOUT_MS || 180_000);
const LOG = join(root, "docs/evidence/G6_LAUNCH_LOG.md");

function still(name) {
  const buf = readFileSync(join(root, "public/demos", name));
  const mime = name.endsWith(".png")
    ? "image/png"
    : name.endsWith(".jpg") || name.endsWith(".jpeg")
      ? "image/jpeg"
      : "image/webp";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function log(line) {
  console.log(line);
  try {
    appendFileSync(LOG, line + "\n");
  } catch {
    // ignore
  }
}

async function postJson(path, body, cookie) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.Cookie = cookie;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const setCookie = res.headers.getSetCookie?.() || [];
    let next = cookie;
    if (setCookie.length) {
      next = setCookie.map((c) => c.split(";")[0]).join("; ");
    } else {
      const raw = res.headers.get("set-cookie");
      if (raw) {
        next = raw
          .split(",")
          .map((c) => c.split(";")[0].trim())
          .join("; ");
      }
    }
    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, json, cookie: next };
  } finally {
    clearTimeout(t);
  }
}

async function topup(cookie) {
  return postJson("/api/dev/topup", {}, cookie);
}

async function liveJob(cookie, { effect, stillName, label }) {
  const image = still(stillName);
  const r = await postJson(
    "/api/generate",
    {
      effect,
      image,
      ownsRights: true,
      duration: 5,
      aspectRatio: "9:16",
      resolution: "480p",
      model: "seedance-mini",
    },
    cookie
  );
  return { ...r, label, effect, stillName };
}

async function main() {
  writeFileSync(
    LOG,
    `# G6 launch evidence log\n\nStarted: ${new Date().toISOString()}\nBase: ${BASE}\n\n`
  );
  log(`G6 launch pass @ ${BASE} timeout=${TIMEOUT}ms`);

  const health = await (await fetch(`${BASE}/api/health`)).json();
  log(
    `health fal=${health.fal} softLive=${health.ready?.softLive} mode=${health.mode}`
  );
  assert.equal(health.fal, true, "FAL_KEY required for live G6");
  assert.ok(health.ready?.softLive, "softLive must be true");

  let cookie;
  // seed session
  {
    const me = await fetch(`${BASE}/api/me`);
    const set = me.headers.getSetCookie?.() || [];
    if (set.length) cookie = set.map((c) => c.split(";")[0]).join("; ");
  }

  const lives = [];
  const jobs = [
    {
      effect: "360-spin-showcase",
      stillName: "scout-still.webp",
      label: "live-2 scout spin",
    },
    {
      effect: "blind-box-unboxing",
      stillName: "moon-float.webp",
      label: "live-3 moon unbox",
    },
  ];

  for (const job of jobs) {
    const tu = await topup(cookie);
    cookie = tu.cookie || cookie;
    assert.ok(tu.status < 400, `topup failed ${tu.status}`);
    log(`topup → credits=${tu.json?.session?.credits}`);

    log(`START ${job.label} effect=${job.effect} still=${job.stillName}`);
    const r = await liveJob(cookie, job);
    cookie = r.cookie || cookie;
    if (r.status < 200 || r.status >= 300) {
      log(
        `FAIL ${job.label} HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 400)}`
      );
      throw new Error(`${job.label} failed HTTP ${r.status}`);
    }
    if (r.json?.demo) {
      log(`FAIL ${job.label} returned demo=true — not a live job`);
      throw new Error("expected live, got demo");
    }
    assert.ok(r.json?.videoUrl, "videoUrl");
    lives.push({
      label: job.label,
      effect: job.effect,
      still: job.stillName,
      requestId: r.json.requestId || null,
      model: r.json.model,
      creditsAfter: r.json.session?.credits,
      demo: r.json.demo,
      at: new Date().toISOString(),
    });
    log(
      `OK ${job.label} requestId=${r.json.requestId || "n/a"} creditsAfter=${r.json.session?.credits}`
    );
  }

  // Refund leg only when server has force-fail
  if (process.env.G6_REFUND === "1") {
    const tu = await topup(cookie);
    cookie = tu.cookie || cookie;
    const before = tu.json?.session?.credits;
    const r = await postJson(
      "/api/generate",
      {
        effect: "360-spin-showcase",
        image: still("scout-still.webp"),
        ownsRights: true,
      },
      cookie
    );
    cookie = r.cookie || cookie;
    assert.equal(r.status, 500, `refund status ${r.status}`);
    assert.equal(r.json?.creditsRefunded, true);
    assert.equal(r.json?.session?.credits, before);
    log(
      `OK refund leg credits ${before}→${r.json.session.credits} code=${r.json.code}`
    );
  } else {
    log(
      "SKIP refund (run separate server: PIKBO_FORCE_GENERATE_FAIL=1 npm run dev then G6_REFUND=1 node scripts/g6-launch-pass.mjs — or use g6-api-smoke G6_TEST_REFUND=1)"
    );
  }

  log(`\n## Summary\n`);
  log(`Live successes this run: ${lives.length}`);
  for (const L of lives) {
    log(
      `- ${L.label}: effect=${L.effect} still=${L.still} requestId=${L.requestId} model=${L.model}`
    );
  }
  log(`\nEnded: ${new Date().toISOString()}`);
  console.log("g6-launch-pass: PASS");
}

main().catch((e) => {
  console.error("g6-launch-pass: FAIL", e);
  process.exit(1);
});
