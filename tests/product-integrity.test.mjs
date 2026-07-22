import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("validation previews are explicitly free and happen before credit checks", async () => {
  for (const path of ["app/api/generate/route.ts", "app/api/image/route.ts"]) {
    const text = await source(path);
    const demoGuard = text.indexOf("if (!process.env.FAL_KEY)");
    const creditBoundaries = [
      text.indexOf("checkCredits(session)"),
      text.indexOf("deductCredits(session"),
    ].filter((index) => index >= 0);
    const creditBoundary = Math.min(...creditBoundaries);
    assert.ok(demoGuard >= 0, `${path} must have a no-key validation branch`);
    assert.ok(creditBoundaries.length > 0, `${path} must enforce credits live`);
    assert.ok(
      demoGuard < creditBoundary,
      `${path} must return the validation preview before checking or charging credits`
    );
    assert.match(text, /chargedCredits:\s*0/);
  }
});

test("lab pages do not impersonate public community posts", async () => {
  const home = await source("app/page.tsx");
  const lab = await source("app/community/page.tsx");
  assert.doesNotMatch(home, /@user\d+/);
  assert.match(home, /Pikbo Lab/);
  assert.match(lab, /not a public user post/i);
  assert.match(lab, /do not claim provider provenance/i);
});

test("every registered demo asset exists and is non-empty", async () => {
  const registry = await source("lib/demoVideos.ts");
  const paths = [
    ...registry.matchAll(/"(\/demos\/[^"]+\.(?:mp4|webm|webp))"/g),
  ].map((match) => match[1]);
  assert.ok(paths.length >= 18, "expected posters plus MP4/WebM demo variants");
  for (const path of paths) {
    const info = await stat(new URL(`public${path}`, root));
    assert.ok(info.size > 1_000, `${path} should not be an empty placeholder`);
  }
});

test("sitemap timestamps are stable and private surfaces are not crawlable", async () => {
  const sitemap = await source("app/sitemap.ts");
  const robots = await source("app/robots.ts");
  assert.doesNotMatch(sitemap, /const now = new Date\(\)/);
  assert.match(sitemap, /lastReviewed/);
  assert.match(robots, /"\/api\/"/);
  assert.match(robots, /"\/library"/);
});

test("billing UI and webhooks fail closed", async () => {
  const pricing = await source("components/PricingPlanCards.tsx");
  const webhook = await source("app/api/webhooks/stripe/route.ts");
  const session = await source("lib/session.ts");
  const checkout = await source("app/api/checkout/route.ts");
  const confirm = await source("app/api/checkout/confirm/route.ts");
  const entitlements = await source("lib/entitlements.ts");
  assert.match(pricing, /annualEnabled/);
  assert.match(pricing, /Annual checkout appears only after its Stripe prices are verified/);
  assert.match(webhook, /claimWebhookEvent\("stripe", event\.id\)/);
  assert.match(webhook, /duplicate: true/);
  assert.match(session, /SESSION_SECRET is required in production/);
  assert.doesNotMatch(checkout, /body\.dev === true/);
  assert.match(confirm, /localId !== session\.id/);
  assert.match(entitlements, /rpc\/pikbo_upsert_subscription_entitlement/);
});

test("async toy jobs, cloud identity, and durable ledgers are registered", async () => {
  const generationRoute = await source("app/api/generations/route.ts");
  const retryRoute = await source("app/api/generations/[id]/retry/route.ts");
  const auth = await source("lib/supabaseAuth.ts");
  const migration = await source(
    "supabase/migrations/202607220001_product_foundation.sql"
  );
  assert.match(generationRoute, /export async function GET/);
  assert.match(generationRoute, /export async function POST/);
  assert.match(retryRoute, /retryOfJobId: current\.id/);
  assert.match(auth, /pikbo_sb_refresh/);
  assert.match(migration, /create table if not exists public\.pikbo_generation_jobs/);
  assert.match(migration, /create table if not exists public\.pikbo_credit_ledger/);
  assert.match(migration, /pikbo_claim_webhook_event/);
  assert.match(migration, /pikbo_upsert_subscription_entitlement/);
});

test("mobile navigation fits narrow viewports", async () => {
  const shell = await source("components/AppShell.tsx");
  assert.doesNotMatch(shell, /min-w-\[4\.2rem\]/);
  assert.match(shell, /min-w-0 flex-1 flex-col/);
});
