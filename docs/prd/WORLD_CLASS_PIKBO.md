# WORLD CLASS PIKBO — Product Contract

**Status:** v1 product specification
**Product owner:** GPT
**Engineering owner:** Claude
**Growth owner:** Grok
**Last reviewed:** 2026-07-23
**North star:** one owned toy SKU → a reviewed, channel-ready content pack in under 10 minutes.

## 1. Product decision

PIKBO is the commerce video operating system for designer toys and collectibles. It does not compete on the number of models or generic effects. It wins one job:

> Turn product photos a seller or collector already owns into short videos they can review, list, post, and reuse.

The product must be strongest at toy identity preservation, marketplace outputs, repeatable SKU projects, and honest proof. A cached example, concept recipe, and live customer result are separate states everywhere.

### Product success

- A first-time mobile user can reach a valid generation quote in three decisions after selecting a photo.
- The user always knows whether the result is cached or live, what it cost, and whether the uploaded photo was used.
- A seller can return to one SKU and create another channel variant without rebuilding the project.
- Generated product details are presented as drafts requiring review, never as product documentation.

## 2. ICP and primary stories

| ICP | Trigger | Primary story | Successful outcome |
|---|---|---|---|
| Collector | New pull, shelf update, grail post | “I upload one figure photo, choose a character-motion recipe, and get a short social draft without learning video editing.” | One reviewed vertical clip saved or downloaded |
| Etsy seller | New listing or catalog refresh | “I import or upload one owned product photo, choose Listing Pack, and get a square product view plus a vertical social hook.” | Listing draft and social draft attached to one SKU project |
| Whatnot seller | Upcoming live show or drop | “I pick the products I will feature, generate reveal/promotional hooks, and retry only failed clips before showtime.” | Promo pack exported before the scheduled show |
| Toy shop / brand | Launch, restock, or colorway campaign | “My team creates a reusable brand profile, generates multiple ratios and hooks for a SKU, compares versions, and approves the final set.” | Approved channel pack with cost and provenance report |

Collectors are the acquisition edge. Sellers and shops are the revenue core. Features that do not improve one of these four paths are outside v1.

## 3. World-class Create information architecture

Create has one canonical flow. Model selection and low-level parameters are advanced controls, not navigation.

### Step 1 — Add the product

The user chooses exactly one entry:

- Upload a front photo.
- Import an authorized product URL.
- Reopen a Library SKU.

Front photo is required. Optional assets are side, back, packaging, material/detail, and brand reference.

The screen must show:

- Image preview and replace/remove.
- Ownership and commercial-rights confirmation.
- Input-quality warnings.
- A plain-language statement of which assets the selected provider will actually use.

Blocking errors: unsupported file, oversized file, missing front photo, failed URL import, rights confirmation absent.

### Step 2 — Choose the job

The user chooses one outcome, not a model:

- Product listing
- Launch or restock
- Social hook
- Character story
- Seller Pack

The job preselects a recipe, ratio, duration, channel, and output count. The user may change the recipe before generation. Advanced controls stay collapsed.

### Step 3 — Review quote and generate

The fixed preflight shows:

- Cached demo or live generation.
- Product/SKU name.
- Selected recipe or content pack.
- Number of outputs and channels.
- Actual model, duration, ratio, resolution, and audio state.
- Exact current credit quote and balance after completion.
- Product-accuracy warning.
- Storage state: local or cloud.
- Refund behavior.

The primary action is either `Generate 1 clip · 10 credits`, `Generate 3 clips · 30 credits`, or `Preview cached examples · 0 credits`. It must never say only `Generate`.

### Result workspace

Results appear beside the source assets:

- A/B comparison between input and each version.
- Provenance: official cached example or live generation.
- Identity Score and review warnings.
- Download, retry, make variant, approve, and open project.
- Successful siblings remain available when one pack item fails.

### Mobile acceptance

- At 390px, upload, job selection, preflight, and final action are reachable with one vertical flow.
- One sticky primary action; no competing floating CTA.
- Advanced controls never appear before the quote unless deliberately expanded.
- A failed result exposes retry/refund state without forcing the user back to the start.

## 4. Toy Identity Engine v1

Identity Engine is a quality and review layer around generation. It must not be marketed as perfect identity preservation.

### Asset roles

```ts
type ToyAssetRole =
  | "front"
  | "side"
  | "back"
  | "packaging"
  | "material_detail"
  | "brand_reference";
```

`front` is required. The other roles are optional and may only be described as consumed when the provider request actually includes them.

### Identity review

```ts
type IdentityAssessment = {
  overallScore: number; // 0–100
  status: "pass" | "review" | "fail";
  checks: Array<{
    dimension:
      | "silhouette"
      | "face"
      | "colorway"
      | "material"
      | "markings"
      | "packaging_text";
    score: number;
    evidence: string;
  }>;
};
```

Pass thresholds:

- `pass`: overall ≥85 and no dimension below 75.
- `review`: overall 65–84 or any dimension 50–74.
- `fail`: overall <65 or face/markings/packaging text below 50.

V1 may use automated visual comparison plus human review. It must show `Not scored` when the comparison service is unavailable; it must not invent a score.

### Quality behavior

- `pass`: enable approve/export.
- `review`: enable export with visible warning.
- `fail`: recommend retry with a targeted reason; export remains available only behind explicit acknowledgment during private validation.
- A targeted retry creates a new version and quote. It does not silently reuse or recharge successful sibling outputs.

## 5. SKU Project and Seller OS

One SKU owns all source assets, recipes, jobs, versions, reviews, and exports.

```ts
type SkuProject = {
  id: string;
  organizationId: string;
  productId: string;
  name: string;
  status: "draft" | "ready" | "generating" | "needs_review" | "approved" | "archived";
  brandKitId?: string;
  channelTargets: Array<"etsy" | "whatnot" | "tiktok" | "reels" | "shorts" | "product_page">;
};
```

### Content packs

| Pack | Outputs | Current flat quote | Launch position |
|---|---:|---:|---|
| Starter | 3 | 30 credits | Seller Pack MVP |
| Launch | 12 | 120 credits | Private beta after durable reservations |
| Campaign | 50 | 500 credits | Agency/enterprise only after queue and unit-economics validation |

The current Shop plan has 150 credits. Therefore Campaign Pack is not included in the existing Shop allowance and must not be advertised as included.

### Starter Pack

Uses the frozen contract in `SELLER_PACK.md`:

1. Listing Spin — `360-spin-showcase` — 1:1.
2. Blind-box Reveal — `blind-box-unboxing` — 9:16.
3. Social Flash — `paparazzi-flash` — 9:16.

### Launch Pack

Twelve outputs:

- Three recipes: product spin, reveal, social hook.
- Two ratios per recipe where supported.
- Two hook/copy variants per ratio group.

The server returns an itemized quote. A client may not derive 120 credits without a server quote after weighted metering ships.

### Campaign Pack

Fifty outputs are created as a persistent campaign with:

- Queue, concurrency limit, ETA, and provider status.
- Partial retry and cancellation of queued items.
- CSV manifest and ZIP export after all terminal states.
- Per-output settled credits and cost.
- Approval state and channel metadata.

Campaign Pack cannot use the synchronous `/api/generate` loop in production.

## 6. State and failure contracts

### Generation job

```ts
type GenerationJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled"
  | "unknown";
```

### Pack run

```ts
type PackRunStatus =
  | "draft"
  | "blocked"
  | "ready"
  | "running"
  | "partially_complete"
  | "complete"
  | "failed"
  | "canceled";
```

Rules:

- The full live quote is atomically reserved before a durable pack starts.
- Success settles only that item.
- Known provider failure releases only that item.
- Queued cancellation releases the queued item.
- Ambiguous network/provider state becomes `unknown`; do not release and resubmit until reconciled.
- A duplicate webhook or retry idempotency key cannot create another ledger mutation.
- Provider success consumes credits even when the user dislikes the creative result; goodwill credits are an operations decision.

## 7. Recipe quality standard

A recipe is `live` only when it has a validated input specification, prompt, output, and review record.

### Pass criteria

- The subject remains recognizably the same toy across the clip.
- Motion is visibly generated; no CSS pan/zoom is labeled video output.
- Packaging text, logos, and unseen angles are reviewed and disclosed.
- Video decodes correctly, matches duration/ratio, and has a poster.
- Recipe has at least three approved examples across at least two original toy characters.
- No example reuses the same output under a different recipe name.
- Prompt, negative constraints, channel, and limitations are stored.

### Launch 12

| Slug | Buyer job | Required input | Default | Primary channel | Quality focus |
|---|---|---|---|---|---|
| `360-spin-showcase` | Listing view | Front; side/back recommended | 5s · 1:1 | Etsy/product page | Silhouette, unseen angles |
| `blind-box-unboxing` | Reveal hook | Front; packaging recommended | 5s · 9:16 | TikTok/Reels | Box art, reveal timing |
| `floating-hero` | Product hero | Front | 5s · 1:1 | Listing/ad | Shadow, colorway |
| `display-case-glam` | Premium showcase | Front | 5s · 16:9 | Product page | Material and lighting |
| `paparazzi-flash` | Social opener | Front | 5s · 9:16 | Reels/Shorts | First-second readability |
| `make-figure-dance` | Character hook | Front; full body | 5s · 9:16 | TikTok/Reels | Face and limb stability |
| `make-figure-walk` | Character motion | Front; full body | 5s · 9:16 | Shorts | Feet, weight, identity |
| `miniature-scene` | Story/world | Front | 5s · 16:9 | Launch/social | Subject/background separation |
| `mystery-box-reveal` | Giveaway/drop | Front; packaging optional | 5s · 9:16 | Social | Product reveal fidelity |
| `stop-motion-style` | Handmade brand look | Front | 5s · 1:1 | Etsy/Reels | Controlled temporal motion |
| `assemble-reveal` | Product construction | Front; detail optional | 5s · 9:16 | Launch | Part count and final identity |
| `neon-city-night` | Stylized campaign | Front | 5s · 9:16 | Social/ad | Color contamination, readability |

Other recipes stay `concept` until they meet the same bar.

## 8. Pricing direction

The live source of truth remains `lib/pricing.ts`: Free `$0/10`, Creator `$19/50`, Shop `$49/150`. This section is research direction only and must not change checkout copy or entitlements.

High-ARPU hypothesis for unit-economics review:

| Tier | Target | Candidate price | Product promise |
|---|---|---:|---|
| Creator | Collector/occasional seller | `$29–49/mo` | Individual clips and small projects |
| Growth | Active marketplace seller | `$149–299/mo` | Launch packs, SKU Library, faster queue |
| Agency | MCN/creative team | `$799–1,499/mo` | Shared workspace, campaign queue, approvals, API |
| Enterprise | Brand/platform | `$5,000+/mo` | Contracted volume, SSO/security later, support, white-label/API |

Before a pricing migration:

- Reconcile real provider invoice by model/duration/resolution.
- Enforce weighted quotes and durable credits.
- Model gross margin at 50%, 65%, and 75% utilization.
- Test willingness to pay with at least ten seller interviews and three paid pilots.
- Define migration treatment for existing subscribers.

## 9. Measurement and release gates

Product events:

- `asset_added`
- `job_selected`
- `quote_viewed`
- `generation_started`
- `generation_terminal`
- `identity_reviewed`
- `output_approved`
- `output_exported`
- `pack_started`
- `pack_partially_complete`
- `project_reopened`

Private beta targets:

- ≥70% of invited users reach first generation.
- ≥40% export one reviewed result.
- ≥25% reopen within seven days.
- ≥90% known terminal job success excluding user/input rejection.
- Zero duplicate debit on duplicate webhooks/retries.
- At least 12 launch recipes each have three approved, traceable examples.

Public launch remains blocked until `GO_NO_GO.md` is green. Stripe remains blocked until durable identity, transactional credits, idempotent billing, and server-enforced media access are verified.

## 10. Explicit non-goals

- A generic AI video model marketplace.
- Fake community activity or fabricated engagement.
- Guaranteed sales, conversion, views, identity preservation, or completion time.
- Public Campaign Pack on the synchronous Generate endpoint.
- Automatic marketplace publishing before each platform integration and permissions model is reviewed.
- Generating or copying characters and media the user does not have rights to use.
