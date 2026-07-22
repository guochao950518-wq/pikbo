# Competitor UI/UX clone spec (Higgsfield-class · Yiha-class)

**Boss order:** Do NOT ship/deploy first. First rebuild the product to match how those AI video sites work, **module-for-module**. Then re-skin for designer toys.

## Legal boundary (non-negotiable)
- ❌ Copy their logo, name, exact marketing copy, screenshots, or proprietary media
- ❌ Steal their CSS/JS bundles
- ✅ Recreate **layout, navigation, generate flow, preset grid, pricing shape, library** as original Pikbo UI
- ✅ Same product pattern: multi-model shelf + presets + credits + generate workspace

## Primary reference: Higgsfield.ai
Secondary: Yiha.ai (tool shelf + create flow + credits)

---

## Site map to rebuild

| Module | Higgsfield pattern | Pikbo route | Owner |
|---|---|---|---|
| App shell | Left/bottom nav: Home, Community, Generate, Library, Profile | layout + `AppShell` | Grok |
| Home feed | Hero model cards, Seedance feature, viral presets masonry, community projects | `/` | GPT |
| Generate | Full workspace: upload/ref, model chip, prompt, aspect, generate, result | `/create` (later `/generate`) | Grok |
| Viral presets | Grid of effect cards → open generate prefilled | `/effects` + home section | Claude |
| Library | Past generations grid | `/library` | Grok |
| Pricing | Plan cards + credits language | `/pricing` | GPT |
| Profile | Plan, credits, settings | `/profile` | Grok |
| Community | Explore / public projects (can be static mock first) | `/community` | Claude |

---

## Generate workspace (copy this interaction)

1. Left or top: **mode tabs** — Image-to-Video (default), Text-to-Video (optional stub)
2. **Model selector** chip — default Seedance 2.0 (ByteDance); show name like big apps do
3. **Reference image dropzone** (required for i2v)
4. **Prompt** textarea (prefilled from preset)
5. **Controls row**: duration, aspect ratio, resolution
6. **Generate** primary CTA + credit cost
7. **Result panel**: video player, download, regenerate
8. **Preset rail**: click preset → fills prompt + effect id

This is how Higgsfield-class tools feel — not a marketing landing-only site.

---

## Visual system (original, but same vibe)
- Near-black background, high contrast white text
- Neon accent (pink/lime/violet) — Pikbo keeps candy pink/violet, not Higgs lime clone of their logo
- Large rounded cards, dense grid of presets
- Sticky generate chrome

---

## Phase order
1. **Shell + Generate 1:1 flow** (Grok) — done/in progress this sprint
2. **Home like model marketplace + presets** (GPT)
3. **Preset/community content density** (Claude)
4. Only then: toy-niche copy pass + deploy

---

## Acceptance (boss “像他们了”)
- [ ] Open site → feels like an AI **app**, not a blog
- [ ] One click to Generate workspace
- [ ] Model name visible (Seedance)
- [ ] Big preset grid
- [ ] Credits + pricing present
- [ ] Library + profile stubs exist
