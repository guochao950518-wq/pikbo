# PIKBO Home Retention + Remix Loop

**Owner:** GPT / Product  
**Date:** 2026-07-23  
**Status:** Frozen for Claude implementation  
**Scope:** Public home, official project detail, recipe handoff, Create first-run path  
**Does not authorize:** Stripe live mode, fake community content, unverified model claims, or public DNS

---

## 1. Product decision

PIKBO's public experience must stop behaving like a marketing page followed by a
form. It must become one continuous product loop:

```text
watch a real toy result
  → inspect the input and recipe
  → remix the recipe with one owned toy photo
  → generate
  → review and export
  → return to the saved project
```

The home page earns attention with moving toy results. Every result is an
executable recipe, not a decorative video card. Create then preserves the
context and asks the user to make only the decisions required for the first
output.

The target product sentence is:

> Watch what a toy recipe does. Replace the toy. Generate your version.

---

## 2. Evidence from the current products

The following observations were collected from the public pages on 2026-07-23.
DOM counts are directional evidence of product density, not a claim about
traffic, quality, or revenue.

### Higgsfield

- The public home exposed 23 video elements and a large sequence of product,
  project, model, app, campaign, and preset cards.
- Public project links preserve authorship and open an inspectable project.
- The video workspace states a three-step job:
  `ADD IMAGE → CHOOSE PRESET → GET VIDEO`.
- The workspace keeps model, duration, framing, resolution, bitrate, cost, and
  history close to the Generate action.
- It uses the home as a discovery surface and the workspace as the production
  surface. The two are connected by presets and projects.

### Yiha

- The public home groups content into recommendation, visual effects, camera
  control, trends, and commercial-content rails.
- Result cards expose `/create?remix=<id>` links instead of sending users to
  explanatory articles.
- The public Create page exposed a very dense preset-video surface, plus model,
  reference, T2V, material library, prompt, generation, and history controls.
- Its strength is executable density: a user can keep watching examples and
  repeatedly enter Create with a selected starting point.

### What PIKBO currently does

- `HfExploreHome` renders one low-opacity hero background and a text-first hero.
- The page then renders at most eight official example cards in a regular grid.
- `projects` is accepted by the component but intentionally ignored.
- Example cards do not open an in-context "inside this recipe" experience.
- The home does not contain a quick Composer; the only first action is leaving
  the page for `/create`.
- `CreateStudio` already has upload, recipe, quote/cost language, generation,
  result, and honesty states, but the recipe rail is primarily text/emoji and
  the first-run surface presents more structure than a new user needs.
- The important production logic exists. The missing layer is a compelling,
  context-preserving route into it.

---

## 3. What to learn, and what not to copy

| Learn | PIKBO implementation |
|---|---|
| Higgsfield result-first discovery | Full-bleed verified toy clips above product explanation |
| Higgsfield inspectable projects | Official recipe drawer/page with input, output, settings, cost, and quality notes |
| Yiha remix links | Every verified example carries one complete `RemixIntent` into Create |
| Yiha preset density | Multiple small recipe rails, but only with unique media and useful categories |
| Both products' history loop | Generation result returns to a persistent project when durable storage exists |

Do not copy:

- Higgsfield's promotion banner, broad navigation, model marketplace, names,
  footage, authors, or visual branding.
- Yiha's unrelated Image, Music, KOL, and sub-product shelf.
- Hundreds of duplicate videos or a shared clip under different recipe names.
- Fake public authors, likes, comments, generations, savings, or live labels.
- A model selector before a user has chosen the toy-video job.

---

## 4. Home v2 information architecture

The first three screens are a single retention sequence.

### Screen 1 — Toy Premiere

Desktop:

- Height: `min(860px, calc(100svh - header))`.
- Center stage: one verified vertical or landscape toy clip, chosen for
  unmistakable subject or scene motion.
- Adjacent clips may peek by 8–12% to signal swipe/navigation.
- Minimal overlay:
  - recipe name;
  - one outcome line, such as `Turn a blind box into a 9:16 reveal`;
  - `Official example` or `Live verified` provenance;
  - `Use this recipe`;
  - `See input & settings`.
- A small progress rail shows 4–8 verified clips.
- No pricing table, model shelf, Seller Pack panel, FAQ, or long body copy in
  the first viewport.

Mobile:

- One clip fills the usable viewport.
- Horizontal swipe changes clip.
- Tap toggles pause; sound remains off until the user turns it on.
- The primary CTA stays above the bottom navigation.
- Only the current clip plays. Adjacent clips preload metadata; all others use
  posters.

Hero headline remains indexable but visually secondary:

> One toy photo. A clip ready to list or post.

The video, recipe name, and CTA must remain the visual hierarchy.

### Screen 2 — Before → after proof

- Use the same selected project as Screen 1.
- Left/top: exact input still.
- Right/bottom: exact verified output.
- A scrub or hold interaction may reveal the still over the output.
- Show only claims supported by the project record:
  - model actually used;
  - duration;
  - aspect ratio;
  - generation status;
  - identity review status;
  - whether the displayed file is cached.
- CTA: `Replace this toy with mine`.

This screen answers the highest-trust question: "Did this video start from one
toy photo?"

### Screen 3 — Recipe rails

Use job language rather than provider language:

1. **Sell the toy**
   - Listing Spin
   - Product CGI
   - Collector POV
2. **Open the box**
   - Blind Box Reveal
   - UGC Unboxing
   - ASMR Packaging
3. **Bring it alive**
   - Shelf to Life
   - Character Story
   - Miniature World
4. **Announce the drop**
   - Viral Hook
   - Limited Drop
   - Restock Alert

Rules:

- Home shows only recipes with a unique verified or clearly labelled official
  cached clip.
- A recipe without verified media remains on `/effects` as `Concept recipe`.
- Each card contains output channel, ratio, duration, provenance, and one
  `Use recipe` action.
- Selecting a card updates the selected project and opens the recipe detail
  drawer; it must not silently navigate to generic SEO copy.

### Lower page

Only after the first three screens:

- Seller Pack;
- three-step explanation;
- pricing teaser;
- trust and rights language;
- SEO body/footer.

---

## 5. Official project detail

Clicking a home or Explore result opens `Inside this recipe` as:

- a right-side drawer on desktop;
- a bottom sheet on mobile;
- a stable `/projects/<slug>` route when opened directly or shared.

Required fields:

1. output player;
2. exact input still;
3. recipe name and intended commercial job;
4. actual model/provider label when verified;
5. duration, aspect ratio, resolution, and audio state;
6. short prompt summary, not a false promise of exact reproduction;
7. provenance state;
8. identity review warnings, if any;
9. estimated current credit cost;
10. `Use this recipe`.

Never display:

- fake author identity;
- fake engagement counts;
- a provider/model that did not produce the asset;
- `Live` for a cached file;
- the same output as proof for another recipe.

---

## 6. Remix handoff contract

Every executable example produces one canonical `RemixIntent`.

```ts
type RemixIntent = {
  sourceProjectSlug: string;
  recipeSlug: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
  durationSeconds: 5 | 10;
  channel:
    | "etsy"
    | "whatnot"
    | "tiktok"
    | "reels"
    | "shorts"
    | "pdp";
  promptHint?: string;
};
```

Canonical deep link:

```text
/create
  ?effect=<recipeSlug>
  &source=<sourceProjectSlug>
  &ratio=<aspectRatio>
  &duration=<durationSeconds>
  &channel=<channel>
```

Rules:

- Create validates every value against a registry.
- Unknown values are ignored with a visible fallback notice.
- The source project is attribution and analytics context; it does not grant
  access to another user's private asset.
- Prompt hints are server-registered or project-record values, not arbitrary
  prompt text trusted from the URL.
- The user must still upload or select an owned toy asset.

---

## 7. Create first-run path

The first successful generation should require three product decisions:

```text
1. Add my toy
2. Choose what I need
3. Review cost and generate
```

### Step 1 — Add my toy

- One primary drop zone.
- Front photo required.
- Side, back, packaging, and material references stay collapsed under
  `Improve identity`.
- A deep link shows the selected example beside the upload target so the user
  understands what will be replaced.

### Step 2 — Choose what I need

- Default to the recipe carried from Home/Explore.
- Recipe cards use real preview media or a clear concept state.
- The first surface shows no provider marketplace.
- Group by seller job, not internal preset category.
- Selecting a recipe immediately updates duration, ratio, channel, and quote.

### Step 3 — Review and generate

A compact preflight strip must show:

- owned toy thumbnail;
- selected recipe and intended channel;
- output ratio and duration;
- current mode (`Cached validation` or `Live generation`);
- exact credits;
- watermark state;
- rights confirmation;
- Generate.

Advanced controls remain collapsed:

- provider/model;
- seed;
- prompt override;
- resolution upgrade;
- negative constraints.

### Result

- Side-by-side input and output by default.
- Display verified generation facts from the response, not only client
  selections.
- Actions: download, retry failed job, create variant, use another recipe, open
  project.
- Cached validation clearly states that the result did not use the uploaded
  photo.

---

## 8. Data model additions

```ts
type ShowcaseProject = {
  slug: string;
  title: string;
  commercialJob:
    | "listing"
    | "unboxing"
    | "character"
    | "drop";
  recipeSlug: string;
  inputAsset: {
    src: string;
    alt: string;
  };
  outputAsset: {
    poster: string;
    mp4: string;
    webm?: string;
  };
  aspectRatio: "9:16" | "16:9" | "1:1";
  durationSeconds: number;
  channel: RemixIntent["channel"];
  provenance: "live_verified" | "official_cached";
  provider?: string;
  providerTaskId?: string;
  identityReview?: {
    score?: number;
    warnings: string[];
    reviewedAt?: string;
  };
  lastReviewedAt: string;
};
```

Public serialization must omit private provider payloads, private source URLs,
organization IDs, private prompts, and private user assets.

---

## 9. Analytics contract

Required events:

| Event | When | Required properties |
|---|---|---|
| `home_clip_start` | current hero starts | project, recipe, index, provenance |
| `home_clip_25` | 25% watched | project, recipe |
| `home_clip_complete` | loop completed | project, recipe |
| `home_clip_change` | swipe/rail changes selection | from, to, method |
| `recipe_detail_open` | drawer/page opens | project, recipe, source |
| `remix_click` | Use recipe clicked | project, recipe, channel |
| `create_asset_added` | valid toy asset selected | source, recipe |
| `create_recipe_selected` | recipe changes | recipe, source |
| `generation_preflight` | cost summary visible | recipe, credits, mode |
| `generation_start` | confirmed submission | recipe, mode |
| `generation_success` | output delivered | recipe, mode, elapsed |
| `generation_export` | file downloaded/exported | recipe, format |

Engaged-time timers alone are insufficient. The core funnel is:

```text
clip start
  → second clip
  → recipe detail
  → remix click
  → asset added
  → generation start
  → export
```

---

## 10. Performance and accessibility

- The first poster is in the initial response.
- Only the selected hero video receives eager loading.
- Adjacent hero videos preload metadata.
- Grid/rail items default to poster until focus, hover, or intersection.
- Maximum concurrent autoplay:
  - desktop: two;
  - mobile: one.
- Normal 4G target: meaningful poster within 1.5 seconds; first playable hero
  within 3 seconds.
- Respect `prefers-reduced-motion`: show poster and explicit Play.
- Every video has pause/play and mute controls.
- Swipe has equivalent arrow-key and button controls.
- Focus must not trigger an unexpected route change.

---

## 11. Acceptance

### Functional

- Every home proof card opens the correct project detail.
- Every `Use this recipe` link loads the exact recipe, ratio, duration, and
  channel in Create.
- Replacing the toy never reuses the official input as the user's asset.
- Back navigation restores the selected clip and approximate scroll position.
- Direct `/projects/<slug>` routes render and share correctly.
- Unknown project and recipe slugs return 404 or a visible safe fallback.

### Truth

- Home contains no fake community identity or engagement.
- Each homepage recipe has unique media.
- Cached, live-verified, and concept states remain visually distinct.
- Provider/model names appear only when backed by a project record.
- A cached validation result never implies it used the upload.

### Responsive

- 1440px: centered premiere, adjacent peek, detail drawer.
- 768px: two-column proof and compact rail.
- 390px: one active video, swipe, bottom sheet, sticky CTA above navigation.
- No horizontal document overflow at any target viewport.

### Product measurement

Before declaring the redesign successful, collect a baseline and compare:

- plays per session;
- percentage reaching a second clip;
- recipe-detail open rate;
- Remix click-through;
- upload completion from Remix;
- generation start and export rates.

Do not claim increased retention until observed data shows it.

---

## 12. Engineering map

Primary implementation owner: Claude. Product contract owner: GPT.

| Existing area | Required change |
|---|---|
| `components/HfExploreHome.tsx` | Replace text-first hero + regular grid with Toy Premiere, before/after, recipe rails, and selected-project state |
| `lib/videoFeed.ts` | Return registry-backed `ShowcaseProject` records; stop treating display items as anonymous cards |
| `lib/demoVideos.ts` | Keep media registry, but add exact project/recipe provenance rather than inferring claims |
| `components/CreateStudio.tsx` | Read validated RemixIntent, show source example, use visual recipe selection, compress first-run preflight |
| `app/projects/[slug]` | Render shareable official project detail; reuse drawer content |
| `app/effects/[slug]` | Continue as search landing page; `Use recipe` deep-links into Create |
| analytics adapter | Emit the events in section 9 without breaking when analytics is unconfigured |

Recommended delivery order:

1. registry-backed eight official projects;
2. deep-link validation and Create preselection;
3. Toy Premiere;
4. project drawer/page;
5. before/after proof;
6. recipe rails;
7. analytics and performance validation.

---

## 13. Explicit non-goals

- Public UGC feed before real moderation and consent.
- Hundreds of recipe cards before unique media exists.
- Model marketplace before multiple providers are truly connected.
- Audio, image, music, KOL, cinema, MCP, or agent product shelves.
- Pricing promotions copied from competitors.
- Public launch, live Stripe, or DNS changes in this slice.
