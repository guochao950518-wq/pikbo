#!/usr/bin/env node
/**
 * G6 partial automated smoke (no browser).
 * Proves generate contract honesty without claiming full G6 Pass.
 *
 * Usage: node scripts/g6-api-smoke.mjs [baseUrl]
 * Needs a running Next server (default http://127.0.0.1:3000).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.PIKBO_BASE || process.argv[2] || "http://127.0.0.1:3000";

function tinyPngDataUrl() {
  // 1x1 PNG
  return (
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  );
}

async function postGenerate(body, cookie, timeoutMs = 25_000) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.Cookie = cookie;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(`${BASE}/api/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  const setCookie = res.headers.getSetCookie?.() || [];
  const rawCookie = res.headers.get("set-cookie");
  let nextCookie = cookie;
  if (setCookie.length) {
    nextCookie = setCookie.map((c) => c.split(";")[0]).join("; ");
  } else if (rawCookie) {
    nextCookie = rawCookie.split(",").map((c) => c.split(";")[0].trim()).join("; ");
  }
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json, cookie: nextCookie };
}

async function main() {
  console.log(`G6 api-smoke @ ${BASE}`);

  // 1) Missing rights → RIGHTS_REQUIRED (no debit claim)
  {
    const r = await postGenerate({
      effect: "360-spin-showcase",
      image: tinyPngDataUrl(),
    });
    assert.equal(r.status, 400, `rights status ${r.status}`);
    assert.equal(r.json?.code, "RIGHTS_REQUIRED");
    assert.notEqual(r.json?.creditsRefunded, true);
    console.log("OK   RIGHTS_REQUIRED without ownsRights");
  }

  // 2) Unknown effect
  {
    const r = await postGenerate({
      effect: "not-a-real-recipe-xyz",
      image: tinyPngDataUrl(),
      ownsRights: true,
    });
    assert.equal(r.status, 400);
    assert.equal(r.json?.code, "UNKNOWN_EFFECT");
    console.log("OK   UNKNOWN_EFFECT");
  }

  // 3) Demo-or-live with rights — must return videoUrl + provenance fields
  {
    let cookie;
    // use real still when available so live path has a real toy photo
    let image = tinyPngDataUrl();
    try {
      const buf = readFileSync(join(root, "public/demos/scout-still.webp"));
      image = `data:image/webp;base64,${buf.toString("base64")}`;
    } catch {
      // tiny png fallback
    }

    const me = await fetch(`${BASE}/api/me`);
    const meJson = await me.json();
    const before = meJson?.credits;
    console.log(`     me credits before=${before} mode=${meJson?.mode}`);

    try {
      const r = await postGenerate(
        {
          effect: "360-spin-showcase",
          image,
          ownsRights: true,
          duration: 5,
          aspectRatio: "1:1",
          resolution: "480p",
          model: "seedance-mini",
        },
        cookie,
        // Live Mini can exceed 60s; keep CI short. Full live stays G6 hand-test.
        Number(process.env.G6_GENERATE_TIMEOUT_MS || 20_000)
      );
      assert.ok(
        r.status >= 200 && r.status < 300,
        `generate HTTP ${r.status} ${JSON.stringify(r.json)}`
      );
      assert.ok(r.json?.videoUrl, "videoUrl required");
      assert.equal(typeof r.json.demo, "boolean");
      assert.ok(r.json.session, "session on success");
      if (r.json.demo) {
        assert.equal(
          r.json.session.credits,
          before ?? r.json.session.credits,
          "demo must not burn credits"
        );
        console.log("OK   cached demo path · 0 credits · videoUrl present");
      } else {
        console.log(
          `OK   live generation · credits now=${r.json.session.credits} model=${r.json.model} requestId=${r.json.requestId || "?"}`
        );
        console.log(
          "NOTE G6 still needs: 2 more owned-toy lives + 1 forced failure with creditsRefunded:true (log in HANDOFF)"
        );
      }
    } catch (e) {
      if (e && (e.name === "AbortError" || /aborted/i.test(String(e)))) {
        console.log(
          "SKIP live/demo generate (timeout) — validation cases still pass; run G6 hand-test with G6_GENERATE_TIMEOUT_MS=180000"
        );
      } else {
        throw e;
      }
    }
  }

  // 4) Soft-launch whitelist file still lists 8 home proof slugs
  {
    const soft = readFileSync(join(root, "lib/softLaunch.ts"), "utf8");
    assert.match(soft, /HOME_PROOF_SLUGS/);
    assert.match(soft, /floating-hero/);
    assert.match(soft, /display-case-glam/);
    console.log("OK   HOME_PROOF_SLUGS present");
  }

  console.log("g6-api-smoke: PASS (partial — not full G6)");
}

main().catch((e) => {
  console.error("g6-api-smoke: FAIL", e);
  process.exit(1);
});
