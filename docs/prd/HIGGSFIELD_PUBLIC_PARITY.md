# PIKBO — Higgsfield Public-Surface Parity Contract

**Status:** Product inventory v1 — implementation required
**Owner:** GPT
**Engineering owner:** Claude
**Growth/merge owner:** Grok
**Last reviewed:** 2026-07-23
**Target inspected:** `https://higgsfield.ai/`

## 1. Decision and legal boundary

The user asked for every public Higgsfield surface to be replicated.

PIKBO may reproduce:

- Information architecture.
- Page density and module order.
- Responsive geometry and navigation behavior.
- Interaction patterns and product workflows.
- Equivalent capability surfaces.

PIKBO must not copy:

- Higgsfield trademarks, logos, product names, or proprietary model names as
  PIKBO features.
- Higgsfield text, prompts, source code, customer names, project names, videos,
  images, audio, or Academy lessons.
- Fake customer activity, fake usage counts, or unavailable capabilities.

All public media, copy, recipes, projects, and tutorials must be PIKBO-owned or
licensed. This is a public-surface parity project, not a source-code or content
theft project.

## 2. What the target actually contains

The target homepage is a product operating system, not a conventional landing
page. Its public loop is:

```text
new-feature rail
→ dense product navigation
→ promotional/credit offer
→ project showcase
→ inspect project
→ preset library
→ choose a creation surface
→ generate
→ store in Assets
→ return/remix/share
```

The public target currently exposes at least seventeen top-level destinations:

1. Explore.
2. Image.
3. Video.
4. Audio.
5. Cinema Studio.
6. MCP & CLI.
7. Academy.
8. Supercomputer.
9. Community.
10. Plugins.
11. Marketing Studio.
12. Canvas.
13. Originals.
14. Shorts Studio.
15. Explainer.
16. Pricing.
17. Assets.

Additional first-class surfaces include Viral Presets, model/community feeds,
project detail, Library, Profile, Apps, and product-specific intro pages.

## 3. Complete surface matrix

`State` is one of `live`, `partial`, `missing`, or `blocked`.

| Target surface | PIKBO route | Target job | Current state | Required PIKBO parity | Backend gate |
|---|---|---|---|---|---|
| Explore home | `/` | Discover new features, projects, models, and presets | partial | Feature rail, dense proof grid, category strips, Inside Project, recipe wall, creation entry | Unique owned media |
| Explore feed | `/explore` | Browse mixed public work | partial | Filter tabs, masonry video feed, viewport play, project open, recipe reuse | Showcase registry |
| Image | `/image` | Generate/edit still images | partial | Upload/prompt composer, model/config area, output history, clear preview state | Image provider |
| Video | `/create` | Text/image-to-video generation | partial | Source asset, mode, recipe/model, ratio, duration, quote, generation, comparison, export | Live video provider |
| Audio | `/audio` | Generate audio for creative projects | missing | Prompt/upload, audio mode, duration, preview waveform, result library | Licensed audio provider |
| Cinema Studio | `/cinema` | Shot/camera-directed video generation | partial | Shot builder, start/end frame, camera motion, timeline, variants, export | Provider capability check |
| MCP & CLI | `/developers` | Developer-controlled creative generation | missing | API/MCP setup, scoped keys, examples, limits, logs, revoke | Durable auth/API keys |
| Academy | `/academy` | Learn workflows and reduce time-to-value | missing | Original PIKBO lessons, recipe walkthroughs, progress and linked Create presets | Original curriculum |
| Supercomputer | `/supercomputer` | Batch/agentic creative workflow | partial | Seller Pack, custom batch, queue, ETA, item statuses, retry, export | Durable async jobs |
| Community | `/community` | Browse/remix projects | partial | Official PIKBO Lab now; real public community only after accounts, consent, moderation | Auth + moderation |
| Plugins | `/plugins` | Extend external creative tools | missing | Integration catalog, install/setup docs, honest availability state | Real integrations |
| Marketing Studio | `/marketing-studio/product` | Turn a product into commercial assets | partial via Create | Product import/upload, brand kit, channel, content pack, versions, approvals, export | Product/brand models |
| Canvas | `/canvas` | Arrange assets and chain workflows | missing | Infinite/large canvas, nodes, connections, asset reuse, run state, save/share | Durable projects |
| Originals | `/originals` | Showcase studio-quality series | missing | PIKBO-owned toy films with project breakdown and recipes | Owned films |
| Shorts Studio | `/shorts-studio` | Build multi-scene vertical shorts | missing | Story beats, scene cards, continuity, caption/audio, render/export | Multi-scene jobs |
| Explainer | `/explainer` | Turn content into an explanatory video | missing | Source text/product brief, outline, scene plan, narration, render | Script/audio/video stack |
| Pricing | `/pricing` | Compare plans and convert | partial | Current finite credits, usage estimator, capability table, payment truth | Durable credits before pay |
| Assets | `/library` | Store and reuse inputs/outputs/projects | partial/local | Search, filters, SKU/project grouping, input/result metadata, signed downloads | Auth + object storage |
| Viral Presets | `/effects` | Browse dense effect inventory | partial | Category tabs, search, video hover/play, premium/live/concept states, deep links | Unique verified outputs |
| Preset detail | `/effects/[slug]` | Inspect and immediately use a recipe | partial | Upload-first composer, matching proof, requirements, limits, FAQ, related recipes | Registered recipe |
| Project detail | `/projects/[slug]` | Inspect how a result was made | missing | Input, output, recipe, model, ratio, duration, resolution, prompt summary, Use recipe | Showcase project model |
| Model feeds | `/models/[slug]` or filters | Browse work by generation capability | missing | Only for providers PIKBO actually exposes; never a fake model shelf | Provider/live examples |
| Apps catalog | `/apps` | Discover focused creative mini-apps | partial | Only real PIKBO workflows; no contest/customer apps until submission system exists | App registry |
| App detail | `/apps/[slug]` | Understand and launch one mini-app | partial | Proof, inputs, outputs, permissions, limits, launch deep link | Working workflow |
| Profile | `/profile` | Manage identity and usage | partial/local | Account, plan, credits, jobs, exports; `noindex` | Auth + durable ledger |
| Settings | `/settings` | Manage preferences and safety | partial/local | Language, default channel, privacy, deletion/export | Auth |

## 4. Homepage parity

The PIKBO homepage must use the same retention mechanics without target content:

1. Optional honest promotion strip.
2. Dense but working navigation.
3. Five-card new/recommended feature rail.
4. One clear Create entry above the first fold.
5. One product-value banner.
6. `Explore inside every project` with eight traceable projects.
7. Dense recipe/preset section.
8. One Seller OS feature banner.
9. One workflow/canvas feature banner only after Canvas is real.
10. More feature/community rails backed by distinct PIKBO media.
11. Footer with product, learn, company, legal, and social groups.

The homepage must not:

- Reuse one clip under several recipe names.
- Claim user projects before real submission/consent exists.
- Advertise a missing product as available.
- Download the entire video wall at initial load.
- Lead with model names instead of the toy job.

## 5. Shared shell parity

Desktop can expose the complete suite only when every visible destination is
functional or explicitly marked Preview.

Required shell behavior:

- Sticky dark header.
- Horizontally scrollable navigation at intermediate widths.
- Search/command entry.
- Pricing and Assets utilities.
- Credits/account control.
- Mobile bottom navigation with Generate as the central action.
- Context-preserving transitions between Explore, Create, Effects, and Assets.
- No horizontal overflow at 390, 768, or 1440 px.

Until missing products are real, PIKBO keeps the five-item soft navigation
defined in `SOFT_NAV_AND_PRESETS.md`. Full Higgsfield-density navigation is a
release result, not a decorative first step.

## 6. Create parity

The equivalent video workflow is:

```text
add owned toy asset
→ choose job/recipe
→ choose supported model/camera controls
→ inspect exact quote
→ generate
→ observe queued/running/terminal state
→ compare source and result
→ download, variant, retry, or save
```

Required controls:

- Image-to-video and, only when implemented, text-to-video.
- Start frame and supported reference assets.
- Registered recipe/preset.
- Model capability display.
- Aspect ratio, duration, resolution, seed, prompt, negative prompt.
- Audio mode only when supported.
- Cost and remaining credits before submission.
- Independent result versions.
- Cached/Live/failed/refunded truth.
- Result metadata and provenance.

The Create page cannot claim controls are consumed unless the provider request
actually includes them.

## 7. Explore, project, and preset parity

### Explore

- `All`, `Listing`, `Unboxing`, `Come alive`, `Social hooks`, and `Story`
  categories.
- Masonry/dense grid.
- Poster-first loading.
- Hover/focus/viewport playback.
- One mobile autoplay maximum.
- Open project rather than immediate blind generation.

### Inside Project

Every traceable showcase project stores:

- Project title and PIKBO Lab author/owner.
- Rights/usage approval.
- Input images.
- Output versions.
- Recipe.
- Provider/model.
- Ratio, duration, resolution, audio, and runtime.
- Prompt summary and negative constraints.
- Identity/quality review.
- `Use this recipe` deep link.

### Presets

- Search and category filters.
- Dense unique-video wall.
- `Official example · cached`, `Live result`, and `Concept recipe` are distinct.
- Premium/plan badges reflect real access only.
- Detail pages embed the working upload/composer above informational content.

## 8. Assets and project system

Higgsfield-style retention depends on saved creative state. PIKBO parity
requires:

- Durable account.
- Product/SKU projects.
- Source assets and generated versions.
- Search, type, status, recipe, and date filters.
- Version comparison.
- Approval/review state.
- Retry/variant lineage.
- Export history.
- Signed file access.
- Deletion and data export.

Local storage can remain a private prototype fallback but cannot be presented as
cross-device Assets parity.

## 9. Truth states

```ts
type PublicCapabilityState =
  | "live"
  | "validation"
  | "preview"
  | "coming_soon";

type PublicMediaProvenance =
  | "official_cached"
  | "live_generated"
  | "concept"
  | "customer_public";
```

Rules:

- `customer_public` requires authenticated ownership, explicit public consent,
  moderation, and takedown support.
- `live_generated` requires a successful provider task.
- `official_cached` never implies the visitor upload was processed.
- `concept` never uses another recipe's video as proof.
- Navigation, cards, pricing, and docs read these same capability states.

## 10. Implementation waves

### Wave A — core video parity

- Home retention sequence.
- Explore feed.
- Create.
- Effects and effect detail.
- Inside Project.
- Library/Assets.
- Seller Pack.

Exit: the complete toy-video loop works without fake doors.

### Wave B — commercial workflow parity

- Marketing Studio.
- SKU/brand projects.
- Durable queue and assets.
- Canvas workflow builder.
- Team review.

Exit: one toy SKU can create, review, and export a content pack.

### Wave C — suite extensions

- Image.
- Cinema.
- Shorts.
- Explainer.
- Audio.

Exit: every visible suite destination has a real provider-backed job.

### Wave D — ecosystem

- Academy.
- MCP/API.
- Plugins.
- Apps submission.
- Real community.
- Originals.

Exit: every public route has owned content, permissions, moderation, and
operational support.

## 11. Acceptance

- Every route in the matrix returns 200 or an intentional redirect only after
  its capability state permits publication.
- No copied Higgsfield media, customer project, lesson, text, or trademark
  appears in PIKBO.
- Homepage proof cards use distinct, matching PIKBO assets.
- A user can complete the core path at 390, 768, and 1440 px.
- Videos are poster-first, autoplay-limited, keyboard accessible, and recover
  from failures.
- Cached, Live, Concept, Preview, and Coming soon are visually distinct.
- Create reports the actual server-used inputs and output metadata.
- Assets persist across browsers only after durable auth/storage ships.
- Private/account routes are `noindex`.
- Lint, typecheck, build, link-check, and critical-path tests pass.
- Public launch remains blocked until `GO_NO_GO.md` is green.

## 12. Immediate engineering handoff

Claude implements Wave A before adding any missing-suite navigation.

Grok merges in this order:

1. Traceable project model and `/projects/[slug]`.
2. Home `Inside Project` rail.
3. Explore category/filter behavior.
4. Create result metadata and version comparison.
5. Assets project grouping.
6. Seller Pack canonical Create mode and legacy redirect.

No Stripe, public DNS, copied target content, or empty suite door is included in
this parity phase.
