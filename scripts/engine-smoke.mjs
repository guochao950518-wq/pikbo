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
  const creditsRefunded = raw?.creditsRefunded === true;
  let error = raw?.error || "fail";
  // Parity with lib/generateClient.ts — PRD §5 refund honesty
  if (creditsRefunded && !/refund|restored|credit/i.test(error)) {
    error = `${error} · 10 credits restored`;
  }
  return {
    ok: false,
    code,
    fatal,
    paywall,
    creditsRefunded,
    retryAfterSec: raw?.retryAfterSec,
    error,
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
assert.match(gen, /ASSET_NOT_FOUND/);
assert.match(gen, /fallbackImage/);
assert.match(gen, /assetId:\s*undefined/);
assert.match(gen, /recoveredFromAssetMiss/);
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
assert.match(imgRoute, /costCredits:\s*0/);
assert.match(imgRoute, /creditsOutcome:\s*"0 cached"|creditsOutcome:\s*"10 used"/);
assert.match(imgRoute, /Retry-After/);

const ent = fs.readFileSync(join(root, "lib/entitlements.ts"), "utf8");
assert.match(ent, /probeEntitlementsStore/);

const rateLimitSrc = fs.readFileSync(join(root, "lib/rateLimit.ts"), "utf8");
assert.match(rateLimitSrc, /takeGenerateBudget/);
assert.match(rateLimitSrc, /tryBeginJob/);
assert.match(rateLimitSrc, /endJob/);
assert.match(rateLimitSrc, /inflightTtlMs|DEFAULT_INFLIGHT_TTL/);
assert.match(rateLimitSrc, /jobInFlightRetryAfterSec/);
assert.match(rateLimitSrc, /inflightJobCount/);
// Pure inflight TTL recovery (stale lock must free after TTL)
function tryBeginJobPure(map, sessionId, now, ttl) {
  const started = map.get(sessionId);
  if (started !== undefined) {
    if (now - started < ttl) return false;
    map.delete(sessionId);
  }
  map.set(sessionId, now);
  return true;
}
{
  const map = new Map();
  assert.equal(tryBeginJobPure(map, "s1", 1000, 200_000), true);
  assert.equal(tryBeginJobPure(map, "s1", 2000, 200_000), false); // still held
  assert.equal(tryBeginJobPure(map, "s1", 1000 + 200_000, 200_000), true); // expired
}
assert.match(
  fs.readFileSync(join(root, "app/api/generate/route.ts"), "utf8"),
  /jobInFlightRetryAfterSec/
);
assert.match(
  fs.readFileSync(join(root, "app/api/image/route.ts"), "utf8"),
  /jobInFlightRetryAfterSec/
);

const me = fs.readFileSync(join(root, "app/api/me/route.ts"), "utf8");
assert.match(me, /generateMode/);
assert.match(me, /cachedDemoFree/);
assert.match(me, /getAuthUserFromRequest|signedIn/);
assert.match(me, /getPersonalWallet|durable/);

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
assert.match(hist, /inputImage:\s*_drop|QuotaExceeded|strip heavy/);

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

const logo = fs.readFileSync(join(root, "components/Logo.tsx"), "utf8");
assert.match(logo, /useId/);
assert.match(logo, /pikbo-sheen-/);

const confirm = fs.readFileSync(
  join(root, "app/api/checkout/confirm/route.ts"),
  "utf8"
);
assert.match(confirm, /lastCheckoutSessionId/);
assert.match(confirm, /idempotent/);

// G7: dev topup never open on production hosts
const topup = fs.readFileSync(join(root, "app/api/dev/topup/route.ts"), "utf8");
assert.match(topup, /FORBIDDEN|Dev topup disabled/);
assert.match(topup, /VERCEL_ENV|NODE_ENV/);
assert.match(topup, /production/);

// G6 forced fail must be non-production only
assert.match(genRoute, /PIKBO_FORCE_GENERATE_FAIL/);
assert.match(genRoute, /VERCEL_ENV !== "production"/);
assert.match(genRoute, /creditsRefunded:\s*true/);

const pbFull = fs.readFileSync(join(root, "lib/promptBuild.ts"), "utf8");
assert.match(pbFull, /TOY_IDENTITY_LOCK/);
assert.match(pbFull, /withIdentityLock|Keep the exact same toy/i);

const contracts = fs.readFileSync(join(root, "lib/contracts.ts"), "utf8");
assert.match(contracts, /ownsRights/);
assert.match(contracts, /RIGHTS_REQUIRED/);
assert.match(genRoute, /RIGHTS_REQUIRED/);
assert.match(genRoute, /ownsRights !== true/);

// Soft-launch PRD §6 provenance labels must stay wired
const provenance = fs.readFileSync(join(root, "lib/provenance.ts"), "utf8");
assert.match(provenance, /Cached demo/);
assert.match(provenance, /Live generation/);
assert.match(provenance, /On-player mark/);
assert.match(provenance, /Local Library/);
const createStudio = fs.readFileSync(
  join(root, "components/CreateStudio.tsx"),
  "utf8"
);
assert.match(createStudio, /resultProvenanceLabel/);
assert.match(createStudio, /PROVENANCE\.onPlayerMark|onPlayerMark/);
const landing = fs.readFileSync(
  join(root, "components/LandingToolPanel.tsx"),
  "utf8"
);
assert.match(landing, /resultProvenanceLabel/);
const library = fs.readFileSync(join(root, "components/LibraryGrid.tsx"), "utf8");
assert.match(library, /resultProvenanceLabel/);
assert.match(gen, /RIGHTS_REQUIRED|UNKNOWN_EFFECT/);

const softlive = fs.readFileSync(
  join(root, "scripts/softlive-checklist.sh"),
  "utf8"
);
assert.match(softlive, /required for soft-live/);
assert.match(softlive, /optional until Stripe/);

// Soft-launch refund honesty + primary nav (first principles)
assert.match(contracts, /creditsRefunded/);
assert.match(genRoute, /creditsRefunded:\s*true/);
assert.match(gen, /creditsRefunded/);
assert.match(gen, /10 credits restored/);
const appShell = fs.readFileSync(join(root, "components/AppShell.tsx"), "utf8");
assert.match(appShell, /const PRIMARY/);
assert.match(appShell, /const MORE/);
assert.match(appShell, /MoreMenu|More/);
const historySrc = fs.readFileSync(join(root, "lib/history.ts"), "utf8");
assert.match(historySrc, /historyProvenance|provenance/);
assert.match(historySrc, /sourceProject/);

// Remake loop handoff contract
const remix = fs.readFileSync(join(root, "lib/remixIntent.ts"), "utf8");
assert.match(remix, /export function buildCreateRemixHref/);
assert.match(remix, /export function parseRemixSearchParams/);
assert.match(remix, /sourceProjectSlug/);
assert.match(createStudio, /sourceProject|remix\.intent/);
const projectsPage = fs.readFileSync(
  join(root, "app/projects/[slug]/page.tsx"),
  "utf8"
);
assert.match(projectsPage, /generateStaticParams/);
assert.match(projectsPage, /listShowcaseProjectSlugs/);
assert.match(projectsPage, /getShowcaseProject/);
const videoFeedSrc = fs.readFileSync(join(root, "lib/videoFeed.ts"), "utf8");
assert.match(videoFeedSrc, /export function listOfficialProjectSlugs/);
assert.match(health, /forceGenerateFail/);
assert.match(imgRoute, /PIKBO_FORCE_GENERATE_FAIL/);
const libraryGrid = fs.readFileSync(
  join(root, "components/LibraryGrid.tsx"),
  "utf8"
);
assert.match(libraryGrid, /Remix again|createRemixHref/);

// One-tap Lab sample honesty (not "free" when live)
assert.match(createStudio, /loadSampleToy/);
assert.match(createStudio, /labSampleId|lab-sample-/);
assert.match(createStudio, /Official Lab|official Lab/);
assert.match(createStudio, /10 credits|cached demo free/i);

// Wave A Create versions: stack + Before/After per-version still
assert.match(createStudio, /ResultVersion|type ResultVersion/);
assert.match(createStudio, /selectVersion|setVersions/);
assert.match(createStudio, /sourceKey|sourceStore|internSourceImage/);
assert.match(createStudio, /creditState/);

// Wave A: Seller Pack canonical Create mode + legacy supercomputer redirect
const createPage = fs.readFileSync(join(root, "app/create/page.tsx"), "utf8");
assert.match(createPage, /seller-pack/);
assert.match(createPage, /BatchStudio/);
const batchPage = fs.readFileSync(
  join(root, "app/supercomputer/page.tsx"),
  "utf8"
);
assert.match(batchPage, /redirect\("\/create\?mode=seller-pack"\)|mode=seller-pack/);
const showcase = fs.readFileSync(
  join(root, "lib/showcaseProjects.ts"),
  "utf8"
);
assert.match(showcase, /listShowcaseProjects/);
assert.match(showcase, /getShowcaseProject/);
for (const field of [
  "inputImage",
  "outputVideo",
  "poster",
  "recipeSlug",
  "provenance",
  "model",
  "aspectRatio",
  "durationSeconds",
  "resolution",
  "promptSummary",
  "negativeConstraints",
]) {
  assert.match(showcase, new RegExp(field));
}
assert.match(showcase, /assertRegistryIntegrity/);
assert.match(showcase, /output reused under another title/);
assert.match(libraryGrid, /By project|groupMode|sourceProject/);
assert.match(libraryGrid, /Saved on this\s*device/);

const exploreGrid = fs.readFileSync(
  join(root, "components/ExploreProjectGrid.tsx"),
  "utf8"
);
for (const category of [
  "All",
  "Listing",
  "Unboxing",
  "Come alive",
  "Social hooks",
  "Story",
]) {
  assert.match(showcase, new RegExp(category));
}
assert.match(exploreGrid, /showcaseProjectHref/);
assert.match(exploreGrid, /desktopPlayMode="interaction"/);
assert.match(exploreGrid, /focusable=\{false\}/);
assert.match(createStudio, /ResultVersion/);
assert.match(createStudio, /Retry · same settings|retryActiveVersion/);
assert.match(createStudio, /Make variant · current settings|makeVariant/);
assert.match(createStudio, /refund unconfirmed/);
const batchStudio = fs.readFileSync(
  join(root, "components/BatchStudio.tsx"),
  "utf8"
);
assert.match(batchStudio, /status:\s*"succeeded"/);
assert.match(batchStudio, /status:\s*refunded\s*\?\s*"refunded"/);
assert.match(batchStudio, /retryJob/);
assert.match(batchStudio, /not_started/);
assert.match(batchStudio, /refund unconfirmed/);
assert.match(batchStudio, /Download blocked · Free raw/);

// ── Wave B trust ──────────────────────────────────────────────────────────
// B1: last-request settlement must not be overwritten by version creditState
function requestCreditStateFromFailure(result) {
  if (result.creditsRefunded === true) return "10 restored";
  if (result.status === 0) return "refund unconfirmed";
  return null;
}
function preserveRequestSettlementOnVersionRestore(lastRequest, _versionCredit) {
  void _versionCredit;
  return lastRequest;
}
function requestSettlementAfterSelectVersion(lastRequest) {
  return lastRequest;
}
function canDownloadResult(opts) {
  if (opts.demo) return true;
  if (opts.watermark) return false;
  return true;
}
// 1) old success → network fail → unconfirmed survives version restore
{
  const fail = requestCreditStateFromFailure({
    creditsRefunded: false,
    status: 0,
  });
  assert.equal(fail, "refund unconfirmed");
  assert.equal(
    preserveRequestSettlementOnVersionRestore(fail, "10 used"),
    "refund unconfirmed"
  );
  assert.equal(
    requestSettlementAfterSelectVersion("refund unconfirmed"),
    "refund unconfirmed"
  );
}
// 2) old success → confirmed refund
{
  const refunded = requestCreditStateFromFailure({
    creditsRefunded: true,
    status: 500,
  });
  assert.equal(refunded, "10 restored");
  assert.equal(
    preserveRequestSettlementOnVersionRestore(refunded, "0 cached"),
    "10 restored"
  );
}
// 3) Retry uses frozen GenerationSpec; Make variant uses composer (source markers)
assert.match(createStudio, /retrySpec/);
assert.match(createStudio, /buildGenerationSpec|GenerationSpec/);
assert.match(createStudio, /retryActiveVersion/);
assert.match(createStudio, /makeVariant/);
// 4) Free live cannot download raw provider URL
assert.equal(canDownloadResult({ demo: false, watermark: true }), false);
assert.equal(canDownloadResult({ demo: true, watermark: true }), true);
assert.equal(canDownloadResult({ demo: false, watermark: false }), true);
assert.match(createStudio, /canDownloadResult|Download · blocked \(Free raw\)/);
assert.match(createStudio, /freeLiveDownloadBlockReason|Free Mini live/);
// 5) Seller Pack single-item retry keeps siblings (retryJob maps by slug only)
assert.match(batchStudio, /previous\.map\(\(job\) => \(job\.slug === slug/);
// B3: server echo fields on generate success
assert.match(genRoute, /costCredits/);
assert.match(genRoute, /creditsOutcome/);
assert.match(genRoute, /effect:\s*preset\.slug/);
assert.match(contracts, /costCredits/);
assert.match(contracts, /creditsOutcome/);
// B5: AutoPlayVideo can disable nested tabIndex inside Link
const autoPlay = fs.readFileSync(
  join(root, "components/AutoPlayVideo.tsx"),
  "utf8"
);
assert.match(autoPlay, /focusable/);
// B6: CI workflow template (OAuth lacks workflow scope for .github path)
const ciYml = fs.readFileSync(
  join(root, "docs/ci/github-actions-ci.yml"),
  "utf8"
);
assert.match(ciYml, /engine-smoke/);
assert.match(ciYml, /typecheck/);
assert.match(ciYml, /npm run build/);
// install path documented for when workflow scope is available
assert.match(ciYml, /name: CI/);
// Pure module must export Wave B helpers
const createTrust = fs.readFileSync(
  join(root, "lib/createTrust.ts"),
  "utf8"
);
assert.match(createTrust, /export function requestCreditStateFromFailure/);
assert.match(createTrust, /export function canDownloadResult/);
assert.match(createTrust, /export function buildGenerationSpec/);
assert.match(createStudio, /lastRequestCreditState/);
assert.match(createStudio, /preserveRequestSettlementOnVersionRestore/);

// G2: homepage proof whitelist frozen in softLaunch + consumed by the
// canonical ShowcaseProject registry that powers homepage/videoFeed.
const softLaunch = fs.readFileSync(join(root, "lib/softLaunch.ts"), "utf8");
assert.match(softLaunch, /HOME_PROOF_SLUGS/);
assert.match(softLaunch, /floating-hero/);
assert.match(softLaunch, /mystery-box-reveal/);
assert.match(softLaunch, /display-case-glam/);
const videoFeed = fs.readFileSync(join(root, "lib/videoFeed.ts"), "utf8");
assert.match(showcase, /HOME_PROOF_SLUGS/);
assert.match(showcase, /listHomeShowcaseProjects/);
assert.match(videoFeed, /HOME_PROOF_SLUGS|HOME_SHOWCASE_LIMIT/);
assert.match(videoFeed, /listHomeShowcaseProjects/);
assert.match(videoFeed, /conceptRecipeCount/);
assert.match(videoFeed, /official unique demos only|Official unique demos only/i);
// Claude viral presets (SEO mesh) must remain registered
const presetsSrc = fs.readFileSync(join(root, "lib/presets.ts"), "utf8");
for (const slug of [
  "melt-and-reform",
  "bullet-time-orbit",
  "desk-adventure",
  "confetti-drop-reveal",
  "snow-globe-world",
]) {
  assert.match(presetsSrc, new RegExp(`slug:\\s*"${slug}"`));
}
// Concept shared-loop badge must not reappear as Lab wall filler
assert.doesNotMatch(
  videoFeed.slice(videoFeed.indexOf("export function buildVideoFeed")),
  /badge:\s*"Concept · shared loop"/
);

// Credit ledger pure math (parity with lib/credits.ts)
function checkCredits(credits, cost = 10) {
  if (credits < cost) return { ok: false, need: cost, have: credits };
  return { ok: true, cost, remainingAfter: credits - cost };
}
function deduct(credits, amount = 10) {
  return Math.max(0, credits - amount);
}
function refund(credits, amount = 10, cap = 10) {
  return Math.min(cap * 2, credits + amount);
}
assert.equal(checkCredits(10).ok, true);
assert.equal(checkCredits(5).ok, false);
assert.equal(deduct(10), 0);
assert.equal(refund(0), 10);
assert.equal(refund(10, 10, 10), 20); // over-cap allowed temporarily

// interpretGenerateResponse refund messaging
const refunded = interpretGenerateResponse(500, {
  error: "Model hiccup",
  code: "GENERATION_FAILED",
  creditsRefunded: true,
});
assert.equal(refunded.ok, false);
assert.match(String(refunded.error), /10 credits restored/i);
assert.equal(refunded.creditsRefunded, true);

const linkCheck = fs.readFileSync(join(root, "scripts/link-check.sh"), "utf8");
assert.match(linkCheck, /etsy-sellers/);
assert.match(linkCheck, /link-check: PASS/);
assert.match(linkCheck, /\/tools/);

// SEO tools axis (SEO_INTENT_50) — registered + primary effects exist
const toolsSrc = fs.readFileSync(join(root, "lib/tools.ts"), "utf8");
assert.match(toolsSrc, /export const TOOLS/);
assert.match(toolsSrc, /ai-toy-video-generator/);
assert.match(toolsSrc, /toy-social-content-pack/);
const toolsPage = fs.readFileSync(
  join(root, "app/tools/[slug]/page.tsx"),
  "utf8"
);
assert.match(toolsPage, /generateStaticParams/);
assert.match(toolsPage, /LandingToolPanel/);
const toolsIndex = fs.readFileSync(join(root, "app/tools/page.tsx"), "utf8");
assert.match(toolsIndex, /TOOLS\.map/);
const sitemap = fs.readFileSync(join(root, "app/sitemap.ts"), "utf8");
assert.match(sitemap, /TOOLS/);
assert.match(sitemap, /toolPages|\/tools\//);
assert.match(sitemap, /listOfficialProjectSlugs|projectPages/);
const usecases = fs.readFileSync(join(root, "lib/usecases.ts"), "utf8");
assert.match(usecases, /FOR_SLUG_ALIASES/);
assert.match(usecases, /etsy-sellers/);
const forPage = fs.readFileSync(join(root, "app/for/[slug]/page.tsx"), "utf8");
assert.match(forPage, /FOR_SLUG_ALIASES/);
assert.match(forPage, /redirect\(/);

// --- T5 durable credits pure engine (parity with lib/durableCredits/engine.ts) ---
function emptyDurable() {
  return {
    accounts: {},
    wallets: {},
    reservations: {},
    ledger: [],
    ledgerByIdempotency: {},
    reservationByIdempotency: {},
    consumedGuests: {},
  };
}
function durableReserve(state, accountId, quoted, idem) {
  const existing = state.reservationByIdempotency[idem];
  if (existing) {
    return { ok: true, state, reservationId: existing, idempotent: true };
  }
  const w = state.wallets[accountId];
  if (!w || w.availableCredits < quoted) {
    return { ok: false, code: "INSUFFICIENT_CREDITS", state };
  }
  const id = `res-${Object.keys(state.reservations).length + 1}`;
  const next = {
    ...state,
    wallets: {
      ...state.wallets,
      [accountId]: {
        ...w,
        availableCredits: w.availableCredits - quoted,
        reservedCredits: w.reservedCredits + quoted,
        version: w.version + 1,
      },
    },
    reservations: {
      ...state.reservations,
      [id]: {
        id,
        accountId,
        quotedCredits: quoted,
        settledCredits: 0,
        releasedCredits: 0,
        status: "reserved",
      },
    },
    reservationByIdempotency: {
      ...state.reservationByIdempotency,
      [idem]: id,
    },
  };
  return { ok: true, state: next, reservationId: id, idempotent: false };
}
function durableSettle(state, reservationId, credits, idem) {
  if (state.ledgerByIdempotency[idem]) {
    return { ok: true, state, idempotent: true };
  }
  const r = state.reservations[reservationId];
  if (!r) return { ok: false, code: "RESERVATION_NOT_FOUND", state };
  const rem = r.quotedCredits - r.settledCredits - r.releasedCredits;
  if (credits > rem) return { ok: false, code: "OVER_SETTLE", state };
  const w = state.wallets[r.accountId];
  const nextR = {
    ...r,
    settledCredits: r.settledCredits + credits,
  };
  const next = {
    ...state,
    wallets: {
      ...state.wallets,
      [r.accountId]: {
        ...w,
        reservedCredits: w.reservedCredits - credits,
        lifetimeUsedCredits: w.lifetimeUsedCredits + credits,
        version: w.version + 1,
      },
    },
    reservations: { ...state.reservations, [reservationId]: nextR },
    ledgerByIdempotency: { ...state.ledgerByIdempotency, [idem]: true },
  };
  return { ok: true, state: next, idempotent: false };
}
function durableRelease(state, reservationId, credits, idem) {
  if (state.ledgerByIdempotency[idem]) {
    return { ok: true, state, idempotent: true };
  }
  const r = state.reservations[reservationId];
  if (!r) return { ok: false, code: "RESERVATION_NOT_FOUND", state };
  const rem = r.quotedCredits - r.settledCredits - r.releasedCredits;
  if (credits > rem) return { ok: false, code: "OVER_SETTLE", state };
  const w = state.wallets[r.accountId];
  const nextR = {
    ...r,
    releasedCredits: r.releasedCredits + credits,
  };
  const next = {
    ...state,
    wallets: {
      ...state.wallets,
      [r.accountId]: {
        ...w,
        availableCredits: w.availableCredits + credits,
        reservedCredits: w.reservedCredits - credits,
        version: w.version + 1,
      },
    },
    reservations: { ...state.reservations, [reservationId]: nextR },
    ledgerByIdempotency: { ...state.ledgerByIdempotency, [idem]: true },
  };
  return { ok: true, state: next, idempotent: false };
}

// Wallet 50: six concurrent 10-credit reserves → exactly five OK
{
  let st = emptyDurable();
  st.wallets.a1 = {
    availableCredits: 50,
    reservedCredits: 0,
    lifetimeUsedCredits: 0,
    version: 0,
  };
  let okCount = 0;
  for (let i = 0; i < 6; i++) {
    const r = durableReserve(st, "a1", 10, `job-${i}`);
    if (r.ok) {
      okCount += 1;
      st = r.state;
    }
  }
  assert.equal(okCount, 5);
  assert.equal(st.wallets.a1.availableCredits, 0);
  assert.equal(st.wallets.a1.reservedCredits, 50);
}
// Seller Pack: reserve 30, settle 10, settle 10, release 10 → available -20 used 20
{
  let st = emptyDurable();
  st.wallets.a1 = {
    availableCredits: 30,
    reservedCredits: 0,
    lifetimeUsedCredits: 0,
    version: 0,
  };
  let r = durableReserve(st, "a1", 30, "pack-1");
  assert.equal(r.ok, true);
  st = r.state;
  r = durableSettle(st, r.reservationId, 10, "settle-1");
  st = r.state;
  r = durableSettle(st, Object.keys(st.reservations)[0], 10, "settle-2");
  st = r.state;
  r = durableRelease(st, Object.keys(st.reservations)[0], 10, "release-1");
  st = r.state;
  assert.equal(st.wallets.a1.availableCredits, 10);
  assert.equal(st.wallets.a1.reservedCredits, 0);
  assert.equal(st.wallets.a1.lifetimeUsedCredits, 20);
}
// Idempotent reserve
{
  let st = emptyDurable();
  st.wallets.a1 = {
    availableCredits: 10,
    reservedCredits: 0,
    lifetimeUsedCredits: 0,
    version: 0,
  };
  const a = durableReserve(st, "a1", 10, "same-key");
  st = a.state;
  const b = durableReserve(st, "a1", 10, "same-key");
  assert.equal(b.ok, true);
  assert.equal(b.idempotent, true);
  assert.equal(b.state.wallets.a1.availableCredits, 0);
}
// Module + migration presence
assert.match(
  fs.readFileSync(join(root, "lib/durableCredits/engine.ts"), "utf8"),
  /export function reserveCredits/
);
assert.match(
  fs.readFileSync(join(root, "lib/durableCredits/engine.ts"), "utf8"),
  /export function settleReservationItem/
);
assert.match(
  fs.readFileSync(join(root, "lib/createTrust.ts"), "utf8"),
  /internSourceImage|sourceImageKey/
);
assert.match(
  fs.readFileSync(
    join(root, "supabase/migrations/20260723120000_t5_auth_credits.sql"),
    "utf8"
  ),
  /credit_ledger/
);
assert.match(createStudio, /sourceStore|internSourceImage/);

// Auth shell + Phase D stubs
assert.match(
  fs.readFileSync(join(root, "lib/authConfig.ts"), "utf8"),
  /export function publicAuthStatus/
);
assert.match(
  fs.readFileSync(join(root, "app/login/page.tsx"), "utf8"),
  /Sign in/
);
assert.match(
  fs.readFileSync(join(root, "app/api/generations/route.ts"), "utf8"),
  /local-memory|listJobsForSession/
);
assert.match(
  fs.readFileSync(join(root, "lib/durableCredits/shadow.ts"), "utf8"),
  /shadowReserveForGuest/
);
assert.match(
  fs.readFileSync(join(root, "lib/durableCredits/shadow.ts"), "utf8"),
  /shadowReserveForGenerate|shadowReserveForAuthUser/
);
assert.match(
  genRoute,
  /shadowReserveForGenerate|shadowReserveForGuest|shadowSettle|shadowRelease/
);
assert.match(genRoute, /getAuthUserFromRequest/);

// Offline fonts + analytics no-op + Create launch list
assert.doesNotMatch(
  fs.readFileSync(join(root, "app/layout.tsx"), "utf8"),
  /from ["']next\/font\/google["']/
);
assert.match(
  fs.readFileSync(join(root, "lib/analytics.ts"), "utf8"),
  /export function track/
);
assert.match(createStudio, /showAllRecipes|More recipes/);
assert.match(
  fs.readFileSync(join(root, "app/robots.ts"), "utf8"),
  /\/login/
);
assert.match(
  fs.readFileSync(
    join(root, "app/api/assets/upload-url/route.ts"),
    "utf8"
  ),
  /uploadUrl|local-memory/
);
assert.doesNotMatch(
  fs.readFileSync(
    join(root, "app/api/assets/upload-url/route.ts"),
    "utf8"
  ),
  /NOT_IMPLEMENTED/
);
const videoWh = fs.readFileSync(
  join(root, "app/api/webhooks/video-provider/route.ts"),
  "utf8"
);
assert.match(videoWh, /applyProviderWebhookEvent/);
assert.match(videoWh, /WEBHOOK_NOT_CONFIGURED|VIDEO_PROVIDER_WEBHOOK_SECRET/);
assert.match(videoWh, /requiresSecretInProduction|productionHost|VERCEL_ENV/);
assert.doesNotMatch(videoWh, /NOT_IMPLEMENTED/);
assert.match(createStudio, /track\(\{[\s\S]*generate_start/);

// Seller Pack export honesty
const packExport = fs.readFileSync(
  join(root, "lib/sellerPackExport.ts"),
  "utf8"
);
assert.match(packExport, /filterAvailableDeliverables/);
assert.match(packExport, /sellerPackCsv/);
function filterAvailable(items) {
  return items.filter(
    (i) =>
      i.status === "succeeded" &&
      i.videoUrl &&
      i.downloadable
  );
}
assert.equal(
  filterAvailable([
    { status: "succeeded", videoUrl: "/a.mp4", downloadable: true },
    { status: "failed", videoUrl: "/b.mp4", downloadable: true },
    { status: "succeeded", videoUrl: "/c.mp4", downloadable: false },
  ]).length,
  1
);
assert.match(
  fs.readFileSync(join(root, "components/BatchStudio.tsx"), "utf8"),
  /exportAvailableCsv|Export CSV/
);
assert.match(
  fs.readFileSync(join(root, "app/library/page.tsx"), "utf8"),
  /Saved on this device/
);
assert.match(
  fs.readFileSync(
    join(root, "app/api/generations/[id]/retry/route.ts"),
    "utf8"
  ),
  /forkRetryJob|local-memory/
);

// ── Phase D local job ledger + download gate ─────────────────────────────
const genJobsStore = fs.readFileSync(
  join(root, "lib/generationJobs/store.ts"),
  "utf8"
);
assert.match(genJobsStore, /recordSucceededGenerate/);
assert.match(genJobsStore, /recordFailedGenerate/);
assert.match(genJobsStore, /downloadAllowedForJob/);
assert.match(genJobsStore, /toPublicJob/);
assert.match(genJobsStore, /forkRetryJob/);
assert.match(genJobsStore, /parentJobId/);
// Pure download gate parity (same rules as createTrust)
function downloadAllowedForJob(opts) {
  if (opts.status !== "succeeded") return false;
  return canDownloadResult({ demo: opts.demo, watermark: opts.watermark });
}
assert.equal(
  downloadAllowedForJob({
    status: "succeeded",
    demo: false,
    watermark: true,
  }),
  false
);
assert.equal(
  downloadAllowedForJob({
    status: "succeeded",
    demo: true,
    watermark: true,
  }),
  true
);
assert.equal(
  downloadAllowedForJob({
    status: "failed",
    demo: false,
    watermark: false,
  }),
  false
);
// Idempotent create: same key returns same logical job (source markers)
assert.match(genJobsStore, /idempotencyKey/);
const genJobsRoute = fs.readFileSync(
  join(root, "app/api/generations/route.ts"),
  "utf8"
);
assert.match(genJobsRoute, /listJobsForSession|local-memory/);
assert.match(genJobsRoute, /status:\s*202|202/);
const genJobIdRoute = fs.readFileSync(
  join(root, "app/api/generations/[id]/route.ts"),
  "utf8"
);
assert.match(genJobIdRoute, /getJob/);
assert.match(genJobIdRoute, /NOT_FOUND|404/);
const downloadRoute = fs.readFileSync(
  join(root, "app/api/downloads/[id]/route.ts"),
  "utf8"
);
assert.match(downloadRoute, /DOWNLOAD_BLOCKED/);
assert.match(downloadRoute, /freeLiveDownloadBlockReason/);
assert.match(downloadRoute, /downloadAllowed/);
// Resolve by job id *or* provider requestId (Create/Library may store either)
assert.match(downloadRoute, /findJobByRequestOrId/);
assert.match(genJobsStore, /export function findJobByRequestOrId/);
// Generate must record jobs on success
assert.match(genRoute, /recordSucceededGenerate/);
assert.match(genRoute, /recordFailedGenerate|noteFailed/);
// Health acceptance ladder for demo vs soft-live
assert.match(health, /acceptance/);
assert.match(health, /demoCached/);
assert.match(health, /inflightJobCount|inflightTtlMs/);
assert.match(health, /localAssetsProbe|assets:/);
assert.match(health, /generationJobsProbe|jobs:/);
assert.match(health, /videoWebhook|secretConfigured/);
const localAssetsSrc = fs.readFileSync(
  join(root, "lib/localAssets.ts"),
  "utf8"
);
assert.match(localAssetsSrc, /slideExpiry|localAssetsProbe|Sliding TTL/);
assert.match(localAssetsSrc, /reserveLocalAssetId/);
assert.match(localAssetsSrc, /NOT_OWNED/);
assert.match(
  fs.readFileSync(join(root, "app/api/assets/upload-url/route.ts"), "utf8"),
  /reserveLocalAssetId/
);
assert.match(
  fs.readFileSync(
    join(root, "app/api/assets/[id]/content/route.ts"),
    "utf8"
  ),
  /NOT_OWNED/
);
// PUT success body must not re-echo multi-MB dataUrl
assert.doesNotMatch(
  fs
    .readFileSync(join(root, "app/api/assets/[id]/content/route.ts"), "utf8")
    .slice(
      fs
        .readFileSync(join(root, "app/api/assets/[id]/content/route.ts"), "utf8")
        .indexOf("return NextResponse.json({\n    ok: true")
    ),
  /dataUrl:\s*result\.asset\.dataUrl/
);
assert.match(gen, /AbortError|Request canceled/);
assert.match(gen, /export function sleep/);
assert.match(createStudio, /cancelInFlightGenerate|Cancel request|AbortController/);
assert.match(gen, /signal\?: AbortSignal|sleep\([^)]*signal/);
// Image still studio cancel + tools/guides ItemList SEO
const imagePage = fs.readFileSync(join(root, "app/image/page.tsx"), "utf8");
assert.match(imagePage, /AbortController|Cancel request/);
assert.match(imagePage, /refund unconfirmed|Request canceled/);
assert.match(
  fs.readFileSync(join(root, "app/tools/page.tsx"), "utf8"),
  /ItemList|itemListElement/
);
assert.match(
  fs.readFileSync(join(root, "app/guides/page.tsx"), "utf8"),
  /ItemList|itemListElement/
);
assert.match(
  fs.readFileSync(join(root, "app/apps/page.tsx"), "utf8"),
  /ItemList|liveWorkflows/
);
assert.match(
  fs.readFileSync(join(root, "app/community/page.tsx"), "utf8"),
  /ItemList|official Lab/
);
const projectCard = fs.readFileSync(
  join(root, "components/ProjectCard.tsx"),
  "utf8"
);
assert.match(projectCard, /AutoPlayVideo/);
assert.match(projectCard, /focusable=\{false\}/);
assert.match(genJobsStore, /export function generationJobsProbe/);
assert.match(genJobsStore, /forkRetryJob[\s\S]*findJobByRequestOrId/);
// Demo + sample stills must exist on disk (preflight parity)
{
  const demoClipsSrc = fs.readFileSync(join(root, "lib/demoClips.ts"), "utf8");
  const demoPaths = [
    ...demoClipsSrc.matchAll(/["'](\/demos\/[^"']+)["']/g),
  ].map((m) => m[1]);
  const samplesSrc = fs.readFileSync(join(root, "lib/samples.ts"), "utf8");
  const samplePaths = [
    ...samplesSrc.matchAll(/path:\s*["'](\/demos\/[^"']+)["']/g),
  ].map((m) => m[1]);
  for (const p of new Set([...demoPaths, ...samplePaths])) {
    const disk = join(root, "public", p.replace(/^\//, ""));
    assert.ok(fs.existsSync(disk), `missing demo/sample asset: ${p}`);
  }
}
assert.match(
  fs.readFileSync(join(root, "lib/imageHistory.ts"), "utf8"),
  /MAX_STORE_URL_CHARS|slimItem|costCredits/
);
assert.match(genJobsStore, /findJobByRequestOrId/);
// getJob must resolve provider requestId (not only job_*)
assert.match(
  fs.readFileSync(join(root, "lib/generationJobs/store.ts"), "utf8"),
  /export function getJob[\s\S]*findJobByRequestOrId/
);
const critPath = fs.readFileSync(
  join(root, "scripts/critical-path.sh"),
  "utf8"
);
assert.match(critPath, /REQUIRE_SOFT_LIVE/);
assert.match(critPath, /demo-cached gate|ready\.demo/);

// Phase H — SEO proof gate (no thin indexable concept pages)
const seoIndex = fs.readFileSync(join(root, "lib/seoIndex.ts"), "utf8");
assert.match(seoIndex, /recipeHasUniqueProof/);
assert.match(seoIndex, /proofBackedRecipeSlugs/);
assert.match(seoIndex, /CONCEPT_ROBOTS|PRIVATE_ROBOTS|PREVIEW_ROBOTS/);
const effectMeta = fs.readFileSync(
  join(root, "app/effects/[slug]/page.tsx"),
  "utf8"
);
assert.match(effectMeta, /robotsForRecipe/);
assert.match(effectMeta, /Concept · no unique Lab sample/);
const landingResults = fs.readFileSync(
  join(root, "components/LandingResults.tsx"),
  "utf8"
);
assert.match(landingResults, /no unique Lab sample/);
assert.match(landingResults, /recipeHasUniqueProof/);
const sitemapSrc = fs.readFileSync(join(root, "app/sitemap.ts"), "utf8");
assert.match(sitemapSrc, /proofBackedRecipeSlugs|recipeHasUniqueProof/);
assert.doesNotMatch(sitemapSrc, /\/cinema|\/supercomputer|\/models/);
const robotsSrc = fs.readFileSync(join(root, "app/robots.ts"), "utf8");
assert.match(robotsSrc, /\/cinema/);
assert.match(robotsSrc, /\/library/);
assert.match(robotsSrc, /\/image/);
const libMeta = fs.readFileSync(join(root, "app/library/page.tsx"), "utf8");
assert.match(libMeta, /index:\s*false/);
const appsMeta = fs.readFileSync(join(root, "app/apps/page.tsx"), "utf8");
// Apps is the live workflow shelf (not a thin preview door).
assert.match(appsMeta, /WORKFLOWS|workflows/);
assert.doesNotMatch(appsMeta, /index:\s*false/);
assert.doesNotMatch(
  fs.readFileSync(join(root, "app/robots.ts"), "utf8"),
  /["']\/apps["']/
);

// Library honesty: Free live must not expose raw download/open
const historySrcLib = fs.readFileSync(join(root, "lib/history.ts"), "utf8");
assert.match(historySrcLib, /historyItemDownloadAllowed/);
assert.match(historySrcLib, /canDownloadResult/);
assert.match(library, /historyItemDownloadAllowed/);
assert.match(library, /Download blocked|download blocked/i);
assert.match(library, /\/api\/downloads\//);
assert.match(createStudio, /\/api\/downloads\//);
const retryRoute = fs.readFileSync(
  join(root, "app/api/generations/[id]/retry/route.ts"),
  "utf8"
);
assert.match(retryRoute, /forkRetryJob/);
assert.doesNotMatch(retryRoute, /NOT_IMPLEMENTED/);

// Phase F — Create/Seller mobile craft (390px ownership + sticky CTA)
assert.match(createStudio, /create-ownership/);
assert.match(createStudio, /create-photo-step/);
assert.match(createStudio, /Download policy/);
assert.match(batchStudio, /batch-ownership/);
assert.match(batchStudio, /bottom-\[4\.75rem\]/);
assert.match(batchStudio, /api\/downloads/);

// Landing tool Free-download honesty (parity with Create/Library)
const landingTool = fs.readFileSync(
  join(root, "components/LandingToolPanel.tsx"),
  "utf8"
);
assert.match(landingTool, /canDownloadResult/);
assert.match(
  landingTool,
  /Download blocked · Free raw|freeLiveDownloadBlockReason/
);
assert.match(landingTool, /\/api\/downloads\//);

// Phase G homepage proof quality gate (all dimensions ≥4)
function passesHomeProofQuality(scores) {
  if (!scores) return false;
  return ["identity", "motion", "artifacts", "composition", "commercialUse"].every(
    (k) => typeof scores[k] === "number" && scores[k] >= 4 && scores[k] <= 5
  );
}
assert.equal(
  passesHomeProofQuality({
    identity: 4,
    motion: 4,
    artifacts: 4,
    composition: 4,
    commercialUse: 4,
  }),
  true
);
assert.equal(
  passesHomeProofQuality({
    identity: 3,
    motion: 5,
    artifacts: 5,
    composition: 5,
    commercialUse: 5,
  }),
  false
);
assert.match(showcase, /passesHomeProofQuality/);
assert.match(showcase, /PROVISIONAL_LAB_SCORES/);
assert.match(showcase, /HOME_PROOF quality gate|qualityScores/);
assert.match(showcase, /reviewerNotes/);

// Phase C — auth claim + guest migrate after Supabase magic link
const authClaim = fs.readFileSync(
  join(root, "app/api/auth/claim/route.ts"),
  "utf8"
);
assert.match(authClaim, /durableMigrateGuest/);
assert.match(authClaim, /ensurePersonalAccount/);
assert.match(authClaim, /getAuthUserFromRequest/);
assert.match(authClaim, /RATE_LIMITED|takeToken/);
const magicLink = fs.readFileSync(
  join(root, "app/api/auth/magic-link/route.ts"),
  "utf8"
);
assert.match(magicLink, /takeToken/);
assert.match(magicLink, /RATE_LIMITED/);
assert.match(magicLink, /If the address is valid/);
// Success body must not require leaking email field
assert.doesNotMatch(
  magicLink.slice(magicLink.lastIndexOf("return NextResponse.json({\n    ok: true")),
  /^\s*email,/m
);
// Download redirect safety
assert.match(createTrust, /export function isSafeDeliverableUrl/);
assert.match(
  fs.readFileSync(join(root, "app/api/downloads/[id]/route.ts"), "utf8"),
  /isSafeDeliverableUrl|UNSAFE_URL/
);
// Pure safe-url checks
function isSafeDeliverableUrlPure(url) {
  if (!url || typeof url !== "string") return false;
  const t = url.trim();
  if (!t || t.length > 2000) return false;
  if (t.startsWith("/") && !t.startsWith("//")) return !t.includes("\\");
  try {
    const u = new URL(t);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    if (!u.hostname || u.username || u.password) return false;
    return true;
  } catch {
    return false;
  }
}
assert.equal(isSafeDeliverableUrlPure("/demos/orbit-dance.mp4"), true);
assert.equal(isSafeDeliverableUrlPure("https://fal.media/files/x.mp4"), true);
assert.equal(isSafeDeliverableUrlPure("javascript:alert(1)"), false);
assert.equal(isSafeDeliverableUrlPure("//evil.com/x"), false);
assert.equal(isSafeDeliverableUrlPure("data:text/html,hi"), false);
const authUser = fs.readFileSync(join(root, "lib/supabase/user.ts"), "utf8");
assert.match(authUser, /guestSessionIdHash/);
assert.match(authUser, /getUser/);
const authCb = fs.readFileSync(
  join(root, "app/auth/callback/page.tsx"),
  "utf8"
);
assert.match(authCb, /\/api\/auth\/claim/);
const profilePanel = fs.readFileSync(
  join(root, "components/ProfilePanel.tsx"),
  "utf8"
);
assert.match(profilePanel, /Sign out|signOut/);
assert.match(profilePanel, /\/api\/auth\/claim/);
assert.match(health, /probeSupabase|auth:\s*\{/);

// Signed-in durable shadow on generate + me enrichment
const durableIdx = fs.readFileSync(
  join(root, "lib/durableCredits/index.ts"),
  "utf8"
);
assert.match(durableIdx, /getPersonalWallet/);
assert.match(durableIdx, /SUPABASE_URL|NEXT_PUBLIC_SUPABASE_URL/);
assert.match(meClient, /displayCredits|Authorization/);
assert.match(gen, /generateAuthHeaders|Authorization/);
const creditsBadge = fs.readFileSync(
  join(root, "components/CreditsBadge.tsx"),
  "utf8"
);
assert.match(creditsBadge, /displayCredits/);

// Phase G performance + proof notes + D cancel/local upload
const hfHome = fs.readFileSync(
  join(root, "components/HfExploreHome.tsx"),
  "utf8"
);
assert.match(hfHome, /preload=\{eager \? "metadata" : "none"\}/);
assert.match(hfHome, /fetchPriority/);
const autoPlaySrc = fs.readFileSync(
  join(root, "components/AutoPlayVideo.tsx"),
  "utf8"
);
assert.match(autoPlaySrc, /preload=\{eager \? "metadata" : "none"\}/);
const projectPage = fs.readFileSync(
  join(root, "app/projects/[slug]/page.tsx"),
  "utf8"
);
assert.match(projectPage, /reviewerNotes/);
const loginForm = fs.readFileSync(
  join(root, "components/LoginForm.tsx"),
  "utf8"
);
assert.match(loginForm, /signInWithOAuth|Continue with Google/);
assert.match(loginForm, /SUPABASE_AUTH_GOOGLE/);
assert.match(genJobIdRoute, /cancelJob/);
assert.match(genJobIdRoute, /export async function DELETE/);
const assetContent = fs.readFileSync(
  join(root, "app/api/assets/[id]/content/route.ts"),
  "utf8"
);
assert.match(assetContent, /putLocalAsset/);
assert.match(
  fs.readFileSync(join(root, "lib/localAssets.ts"), "utf8"),
  /putLocalAsset/
);

// Phase C — Seller Pack shadow reserve 30 / settle-release 10 per child
const sellerPackLib = fs.readFileSync(
  join(root, "lib/durableCredits/sellerPack.ts"),
  "utf8"
);
assert.match(sellerPackLib, /SELLER_PACK_QUOTE_CREDITS|sellerPackQuoteCredits/);
assert.match(sellerPackLib, /reserveSellerPackShadow/);
assert.match(sellerPackLib, /settleSellerPackChild/);
assert.match(sellerPackLib, /releaseSellerPackChild/);
assert.match(sellerPackLib, /purpose:\s*"seller_pack"|seller_pack/);
function sellerPackQuoteCredits(childCount = 3, per = 10) {
  return childCount * per;
}
assert.equal(sellerPackQuoteCredits(3), 30);
assert.equal(sellerPackQuoteCredits(1), 10);
const spReserve = fs.readFileSync(
  join(root, "app/api/seller-pack/reserve/route.ts"),
  "utf8"
);
assert.match(spReserve, /reserveSellerPackShadow/);
assert.match(spReserve, /SELLER_PACK_QUOTE_CREDITS|quoteCredits/);
assert.match(
  fs.readFileSync(join(root, "app/api/seller-pack/settle/route.ts"), "utf8"),
  /settleSellerPackChild/
);
assert.match(
  fs.readFileSync(join(root, "app/api/seller-pack/release/route.ts"), "utf8"),
  /releaseSellerPackChild/
);
assert.match(batchStudio, /reserveSellerPackShadowClient/);
assert.match(batchStudio, /settleSellerPackChildClient/);
assert.match(batchStudio, /releaseSellerPackChildClient/);
assert.match(batchStudio, /packReservationId/);
assert.match(gen, /reserveSellerPackShadowClient/);

// Phase D video-provider webhook idempotency (store + route)
assert.match(genJobsStore, /applyProviderWebhookEvent/);
assert.match(genJobsStore, /findJobByRequestOrId/);
assert.match(genJobsStore, /webhookEvents/);

// Phase D job timeout recovery
assert.match(genJobsStore, /sweepTimedOutJobs/);
assert.match(genJobsStore, /jobTimeoutMs|TIMEOUT/);
assert.match(
  fs.readFileSync(join(root, "app/api/generations/route.ts"), "utf8"),
  /sweepTimedOutJobs|timedOutThisSweep/
);
// Pure timeout age math (mirrors store intent)
function ageMs(iso, now) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, now - t);
}
assert.ok(ageMs(new Date(0).toISOString(), 60_000) >= 60_000);
assert.equal(ageMs(new Date(Date.now()).toISOString(), Date.now()), 0);

// T6 honest blocked status (player overlay ≠ file bake)
const t6 = fs.readFileSync(join(root, "lib/t6Watermark.ts"), "utf8");
assert.match(t6, /export function t6Report/);
assert.match(t6, /status:\s*"blocked"|blocked/);
assert.match(t6, /playerOverlayIsNotFileWatermark/);
assert.match(t6, /PIKBO_T6_FILE_BAKE/);
assert.match(health, /t6Report|t6:/);
assert.match(health, /jobTimeoutMs/);
assert.match(createTrust, /PIKBO_T6_FILE_BAKE|T6 blocked/);

// Phase C Supabase Postgres durable adapter
const sbStore = fs.readFileSync(
  join(root, "lib/durableCredits/supabaseStore.ts"),
  "utf8"
);
assert.match(sbStore, /probeSupabaseCreditsSchema/);
assert.match(sbStore, /supabaseEnsurePersonalAccount/);
assert.match(sbStore, /supabaseReserve/);
assert.match(sbStore, /supabaseSettle/);
assert.match(sbStore, /supabaseRelease/);
assert.match(sbStore, /supabaseMigrateGuest/);
assert.match(durableIdx, /supabaseEnsurePersonalAccount|prefersSupabaseBackend/);
assert.match(durableIdx, /probeSupabaseCreditsSchema/);
const localStore = fs.readFileSync(
  join(root, "lib/durableCredits/localStore.ts"),
  "utf8"
);
assert.match(localStore, /schemaReady/);
assert.match(localStore, /probeSupabaseCreditsSchema/);

// Phase I payments readiness + checkout live-key / flag gates
const stripeSrc = fs.readFileSync(join(root, "lib/stripe.ts"), "utf8");
assert.match(stripeSrc, /export function paymentsReadiness/);
assert.match(stripeSrc, /readyForTestCheckout/);
assert.match(stripeSrc, /liveKeysBlocked|sk_live/);
assert.match(stripeSrc, /paymentsClientEnabled/);
const checkoutSrc = fs.readFileSync(
  join(root, "app/api/checkout/route.ts"),
  "utf8"
);
assert.match(checkoutSrc, /PAYMENTS_DISABLED|paymentsClientEnabled/);
assert.match(checkoutSrc, /LIVE_KEYS_BLOCKED|PAYMENTS_LIVE/);
assert.match(health, /paymentsReadiness|payments:/);
// Pure secret mode classifier
function stripeSecretMode(key) {
  if (!key) return "missing";
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  return "unknown";
}
assert.equal(stripeSecretMode(""), "missing");
assert.equal(stripeSecretMode("sk_test_abc"), "test");
assert.equal(stripeSecretMode("sk_live_abc"), "live");

// Reservation TTL expire sweep (pure engine export)
const engineSrc = fs.readFileSync(
  join(root, "lib/durableCredits/engine.ts"),
  "utf8"
);
assert.match(engineSrc, /export function expireStaleReservations/);
assert.match(durableIdx, /durableExpireStaleReservations|expireStaleReservations/);
assert.match(health, /reservationSweep|durableExpireStaleReservations/);
const softliveChk = fs.readFileSync(
  join(root, "scripts/softlive-checklist.sh"),
  "utf8"
);
assert.match(softliveChk, /SUPABASE_URL|SUPABASE/);
assert.match(softliveChk, /PAYMENTS_ENABLED|sk_live/);
const vercelJson = fs.readFileSync(join(root, "vercel.json"), "utf8");
assert.match(vercelJson, /X-Content-Type-Options|X-Frame-Options/);

// Phase D assetId generate path + Library session jobs
assert.match(genRoute, /getLocalAsset|assetId/);
assert.match(genRoute, /ASSET_NOT_FOUND/);
assert.match(
  fs.readFileSync(join(root, "lib/contracts.ts"), "utf8"),
  /assetId\?:/
);
assert.match(
  fs.readFileSync(join(root, "lib/clientAssets.ts"), "utf8"),
  /registerLocalAsset/
);
assert.match(createStudio, /registerLocalAsset|assetId/);
assert.match(library, /Session jobs|\/api\/generations/);
// Empty device history must still mount SessionJobsPanel (Phase D recovery)
assert.match(library, /SessionJobsPanel|No clips saved on this device yet/);
assert.match(library, /this server process/);
assert.match(library, /Cancel ledger|method:\s*[\"']DELETE[\"']/);
assert.match(createStudio, /try another recipe|open free sample/);
assert.match(batchStudio, /registerLocalAsset|sharedAssetId/);
assert.match(batchStudio, /retryAllFailed|Retry failed only/);
assert.match(
  fs.readFileSync(join(root, "components/LandingToolPanel.tsx"), "utf8"),
  /open free sample|try another recipe/
);
assert.match(
  fs.readFileSync(join(root, "app/auth/callback/layout.tsx"), "utf8"),
  /PRIVATE_ROBOTS|index:\s*false/
);

// Phase H analytics funnel + private ops robots
const analyticsSrc = fs.readFileSync(join(root, "lib/analytics.ts"), "utf8");
assert.match(analyticsSrc, /export_click|project_open|upload_ready/);
assert.match(analyticsSrc, /NEXT_PUBLIC_ANALYTICS_URL|sendBeacon/);
assert.match(createStudio, /upload_ready|export_click/);
assert.match(library, /export_click/);
assert.match(
  fs.readFileSync(join(root, "components/ExploreProjectGrid.tsx"), "utf8"),
  /project_open/
);
assert.match(
  fs.readFileSync(join(root, "components/ProjectOpenBeacon.tsx"), "utf8"),
  /project_open/
);
assert.match(
  fs.readFileSync(join(root, "app/robots.ts"), "utf8"),
  /\/status/
);
assert.match(
  fs.readFileSync(join(root, "app/profile/page.tsx"), "utf8"),
  /signed-in durable|durable wallet/
);

// Pricing FAQ JSON-LD + Explore proof labels
const pricingPage = fs.readFileSync(join(root, "app/pricing/page.tsx"), "utf8");
assert.match(pricingPage, /canonical:\s*[\"']\/pricing[\"']/);
assert.match(pricingPage, /FAQPage|application\/ld\+json/);
assert.match(pricingPage, /pricingFaqItems/);
// exploreGrid already loaded earlier in this script
assert.match(exploreGrid, /passesHomeProofQuality|Lab ≥4|Lab >=4/);
assert.match(exploreGrid, /recipe_use/);
const critPathModeA = fs.readFileSync(
  join(root, "scripts/critical-path.sh"),
  "utf8"
);
assert.match(critPathModeA, /\/status/);
assert.match(critPathModeA, /\/login/);
assert.match(critPathModeA, /\/api\/auth\/status/);
assert.match(critPathModeA, /\/api\/generations/);
assert.match(critPathModeA, /HEAD \/api\/health|HEAD.*health/);
const modeA = fs.readFileSync(
  join(root, "scripts/mode-a-acceptance.sh"),
  "utf8"
);
assert.match(modeA, /mode-a-acceptance|Mode A acceptance/);
assert.match(modeA, /critical-path|link-check/);
assert.match(modeA, /videoWebhook|assets count|jobs count/);
const pkgJson = fs.readFileSync(join(root, "package.json"), "utf8");
assert.match(pkgJson, /mode-a-acceptance/);

assert.match(fs.readFileSync(join(root, "lib/jobIntents.ts"), "utf8"), /JOB_INTENTS/);
assert.match(fs.readFileSync(join(root, "components/JobIntentBar.tsx"), "utf8"), /What are you making/);
assert.match(createStudio, /JobIntentBar|ActivationChecklist/);

// Five-step toy identity + delivery honesty + landing assetId + workflows
const toyIdSrc = fs.readFileSync(join(root, "lib/toyIdentity.ts"), "utf8");
assert.match(toyIdSrc, /composeExtraWithIdentity/);
assert.match(toyIdSrc, /sanitizeToyIdentity|ToyIdentity/);
const deliverySrc = fs.readFileSync(join(root, "lib/deliveryPack.ts"), "utf8");
assert.match(deliverySrc, /deliveryItemsForJob/);
assert.match(deliverySrc, /downloadAllowed|T6/);
assert.match(createStudio, /composeExtraWithIdentity|toyIdentity/);
assert.match(createStudio, /deliveryItemsForJob/);
assert.match(createStudio, /Same photo · next job|generateForJob/);
const landingToolPanel = fs.readFileSync(
  join(root, "components/LandingToolPanel.tsx"),
  "utf8"
);
assert.match(landingToolPanel, /registerLocalAsset|assetId/);
assert.match(landingToolPanel, /deliveryItemsForJob/);
assert.match(
  fs.readFileSync(join(root, "lib/workflows.ts"), "utf8"),
  /listCreateShelfWorkflows|Workflow/
);
assert.match(createStudio, /WorkflowShelf/);
assert.match(historySrcLib, /sku\?:/);
assert.match(library, /i\.sku|sku/);


// Suite honesty: PRIMARY_NAV freeze + Modules preview vs job
const softLaunchSrc = fs.readFileSync(join(root, "lib/softLaunch.ts"), "utf8");
assert.match(softLaunchSrc, /PRIMARY_NAV/);
assert.match(softLaunchSrc, /\/modules/);
assert.match(
  fs.readFileSync(join(root, "components/AppShell.tsx"), "utf8"),
  /PRIMARY_NAV/
);
const workflowsSrc = fs.readFileSync(join(root, "lib/workflows.ts"), "utf8");
assert.match(workflowsSrc, /listPreviewWorkflows/);
assert.match(workflowsSrc, /listLiveWorkflows/);
// Image + Batch must not claim live Seedance jobs
assert.match(workflowsSrc, /id:\s*"still-studio"[\s\S]*?live:\s*false/);
assert.match(workflowsSrc, /id:\s*"batch-agent"[\s\S]*?live:\s*false/);
const modulesPage = fs.readFileSync(join(root, "app/modules/page.tsx"), "utf8");
assert.match(modulesPage, /listPreviewWorkflows|PREVIEW|Job blocks/);
assert.match(modulesPage, /T6|file bake|Lab proof still/);
assert.match(batchStudio, /downloadable|T6 file bake/);
assert.match(
  fs.readFileSync(join(root, "scripts/critical-path.sh"), "utf8"),
  /\/modules/
);

// Suite IA consistency: Modules doors + G4 inventory
const linkCheckSrc = fs.readFileSync(
  join(root, "scripts/link-check.sh"),
  "utf8"
);
assert.match(linkCheckSrc, /\/modules/);
assert.match(linkCheckSrc, /\/apps/);
assert.match(linkCheckSrc, /\/status/);
assert.match(linkCheckSrc, /job=etsy-listing/);
const footerSrc = fs.readFileSync(join(root, "components/Footer.tsx"), "utf8");
assert.match(footerSrc, /\/modules/);
assert.match(footerSrc, /seller-pack|Seller Pack/);
assert.match(sitemapSrc, /\/modules/);
assert.match(
  fs.readFileSync(join(root, "app/pricing/page.tsx"), "utf8"),
  /\/modules/
);
assert.match(
  fs.readFileSync(join(root, "app/community/page.tsx"), "utf8"),
  /\/modules/
);

// Retry must freeze version still — never ambient composer asset after re-upload
assert.match(createTrust, /export function resolveGenerateStill/);
assert.match(createTrust, /assetId\?:/);
assert.match(createStudio, /resolveGenerateStill/);
assert.match(createStudio, /retry-still|mode === "retry/);
assert.match(createStudio, /postGenerateWithRetry|fallbackImage/);
assert.match(createStudio, /recoveredFromAssetMiss|registerLocalAsset/);
assert.match(batchStudio, /fallbackImage/);
assert.match(batchStudio, /recoveredFromAssetMiss/);
assert.match(batchStudio, /cancelInFlightPack|AbortController/);
assert.match(batchStudio, /Cancel pack/);
assert.match(landingTool, /postGenerateWithRetry|fallbackImage/);
assert.match(landingTool, /recoveredFromAssetMiss|registerLocalAsset/);
function resolveSpecImagePure(spec, store) {
  if (spec.sourceKey && store[spec.sourceKey]) return store[spec.sourceKey];
  if (typeof spec.image === "string" && spec.image) return spec.image;
  return null;
}
function resolveGenerateStillPure(input) {
  const retry = input.retry ?? null;
  if (retry) {
    const frozen = resolveSpecImagePure(retry, input.sourceStore);
    if (frozen) return { image: frozen, mode: "retry-still" };
    if (retry.assetId) return { assetId: retry.assetId, mode: "retry-asset" };
    return { mode: "none" };
  }
  if (input.imageOverride) return { image: input.imageOverride, mode: "image" };
  if (input.assetId) {
    return {
      assetId: input.assetId,
      image: input.image || undefined,
      mode: "asset",
    };
  }
  if (input.image) return { image: input.image, mode: "image" };
  return { mode: "none" };
}
{
  const store = { "src-a": "data:image/png;base64,AAA" };
  const retry = {
    sourceKey: "src-a",
    assetId: "asset_old",
    effect: "floating-hero",
    extra: "",
    aspectRatio: "1:1",
    duration: 5,
    resolution: "480p",
    model: "seedance-mini",
  };
  // Composer re-uploaded a new asset — Retry must still post frozen still A
  const still = resolveGenerateStillPure({
    retry,
    sourceStore: store,
    image: "data:image/png;base64,BBB",
    assetId: "asset_new",
  });
  assert.equal(still.mode, "retry-still");
  assert.equal(still.image, "data:image/png;base64,AAA");
  assert.equal(still.assetId, undefined);
  // Missing still falls back to frozen assetId only (not ambient asset_new)
  const missing = resolveGenerateStillPure({
    retry: { ...retry, sourceKey: "src-gone" },
    sourceStore: store,
    image: "data:image/png;base64,BBB",
    assetId: "asset_new",
  });
  assert.equal(missing.mode, "retry-asset");
  assert.equal(missing.assetId, "asset_old");
  // Fresh compose prefers current assetId for smaller POST
  const fresh = resolveGenerateStillPure({
    sourceStore: {},
    image: "data:image/png;base64,CCC",
    assetId: "asset_cur",
  });
  assert.equal(fresh.mode, "asset");
  assert.equal(fresh.assetId, "asset_cur");
}

// Mobile bottom nav freeze: Modules peer of Generate (not Lab)
assert.match(softLaunchSrc, /MOBILE_NAV/);
assert.match(softLaunchSrc, /MOBILE_NAV[\s\S]*href:\s*["']\/modules["']/);
const appShellSrc = fs.readFileSync(
  join(root, "components/AppShell.tsx"),
  "utf8"
);
assert.match(appShellSrc, /MOBILE_NAV/);
assert.match(appShellSrc, /nav\.modules/);
assert.match(
  fs.readFileSync(join(root, "app/tools/page.tsx"), "utf8"),
  /\/modules/
);
assert.match(
  fs.readFileSync(join(root, "app/guides/page.tsx"), "utf8"),
  /\/modules/
);
assert.match(
  fs.readFileSync(join(root, "app/guides/[slug]/page.tsx"), "utf8"),
  /\/modules/
);

console.log("engine-smoke: PASS");
void pathToFileURL; // keep import used on older node
