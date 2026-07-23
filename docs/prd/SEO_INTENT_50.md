# PIKBO SEO Intent 50

**Status:** Product/content map v1
**Owner:** GPT
**Engineering/content owners:** Claude + Grok
**Last reviewed:** 2026-07-23

## Publishing contract

This is an intent map, not permission to publish fifty thin pages.

Every published page must contain:

- Search-language title, H1, and unique description.
- An upload-first Create entry with a registered recipe deep link.
- At least one matching Official example or a clearly static Concept recipe.
- Input guidance, workflow, output review guidance, and a unique FAQ.
- At least three relevant internal links.
- Canonical, breadcrumb structured data, and stable review date.

`Wave 1` is limited to ten routes already backed by current registered pages and
official examples. Planned rows remain unpublished until their unique content,
links, and proof requirements are met.

CTA format:

```text
/create?effect={registered-preset-slug}&source={intent-slug}
```

Seller Pack intents use:

```text
/create?mode=seller-pack&source={intent-slug}
```

## Wave 1 — publish/upgrade first

| # | Path | Search-language H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 1 | `/effects/360-spin-showcase` | Create a 360° toy product video from one photo | Etsy seller | `360-spin-showcase` | recipe CTA | `/for/etsy-listing-videos` · `/toys/action-figures` · `/effects/display-case-glam` | Scout spin input/output | Can AI replace a physical turntable? |
| 2 | `/effects/blind-box-unboxing` | Make a blind-box unboxing video from a product photo | Toy shop | `blind-box-unboxing` | recipe CTA | `/for/blind-box-brand-marketing` · `/toys/art-toys` · `/effects/mystery-box-reveal` | Moon reveal input/output | Does the box need to be visible? |
| 3 | `/effects/miniature-scene` | Turn a toy photo into a miniature story video | Collector | `miniature-scene` | recipe CTA | `/toys/art-toys` · `/effects/floating-hero` · `/for/instagram-reels-for-collectors` | Scout story input/output | Will PIKBO invent unseen scenery? |
| 4 | `/effects/paparazzi-flash` | Create a fast toy launch hook for Reels and Shorts | Whatnot host | `paparazzi-flash` | recipe CTA | `/for/whatnot-live-selling` · `/effects/smoke-burst-entrance` · `/toys/vinyl-figures` | Beatbot social-hook input/output | How quickly should the hook start? |
| 5 | `/effects/floating-hero` | Create a floating toy hero video from one photo | Toy brand | `floating-hero` | recipe CTA | `/effects/display-case-glam` · `/toys/art-toys` · `/for/tiktok-shop-product-videos` | Orbit hero input/output | Does the result preserve the toy design? |
| 6 | `/effects/mystery-box-reveal` | Make a mystery-box reveal video for a toy drop | Toy shop | `mystery-box-reveal` | recipe CTA | `/effects/blind-box-unboxing` · `/for/blind-box-brand-marketing` · `/toys/vinyl-figures` | Beatbot reveal input/output | Can PIKBO reproduce hidden package art? |
| 7 | `/effects/make-figure-dance` | Make an action figure dance from one photo | Collector | `make-figure-dance` | recipe CTA | `/toys/action-figures` · `/effects/make-figure-walk` · `/for/instagram-reels-for-collectors` | Orbit dance input/output | Can the motion change the figure's face? |
| 8 | `/effects/display-case-glam` | Create a premium display-case video for a collectible | Collector | `display-case-glam` | recipe CTA | `/effects/360-spin-showcase` · `/toys/resin-sofubi` · `/for/etsy-listing-videos` | Moon glow input/output | Is this suitable for a listing gallery? |
| 9 | `/for/etsy-listing-videos` | Create an Etsy listing video for a toy from one photo | Etsy seller | `360-spin-showcase` | Seller Pack CTA | `/effects/360-spin-showcase` · `/toys/action-figures` · `/for/depop-shop-videos` | Square listing case and limits | What aspect ratio should an Etsy toy listing use? |
| 10 | `/for/tiktok-shop-product-videos` | Make a TikTok Shop toy video from a product photo | Toy shop | `paparazzi-flash` | Seller Pack CTA | `/effects/paparazzi-flash` · `/effects/blind-box-unboxing` · `/toys/art-toys` | Vertical launch case and safe zone | Does PIKBO publish directly to TikTok Shop? |

## Effect intents — 12 total, including Wave 1

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 11 | `/effects/collection-shelf-pan` | Create a cinematic toy-shelf pan from one photo | Collector | `collection-shelf-pan` | recipe CTA | `/for/instagram-reels-for-collectors` · `/toys/anime-figures` · `/effects/display-case-glam` | Unique shelf-pan example | Does one photo show the whole collection? |
| 12 | `/effects/make-figure-walk` | Make a toy figure walk from a still image | Collector | `make-figure-walk` | recipe CTA | `/effects/make-figure-dance` · `/toys/action-figures` · `/effects/miniature-scene` | Unique walk-cycle example | Will the model create extra limbs? |
| 13 | `/effects/stop-motion-style` | Create a stop-motion-style toy video with AI | Toy artist | `stop-motion-style` | recipe CTA | `/toys/art-toys` · `/effects/assemble-reveal` · `/for/instagram-reels-for-collectors` | Unique stop-motion example | Is this real frame-by-frame stop motion? |
| 14 | `/effects/assemble-reveal` | Make a toy assembly reveal video from one image | Model-kit seller | `assemble-reveal` | recipe CTA | `/toys/model-kits` · `/effects/360-spin-showcase` · `/for/etsy-listing-videos` | Unique assembly example | Can it reproduce parts hidden in the photo? |

## Toy-type intents — 8

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 15 | `/toys/action-figures` | AI action-figure video generator from one photo | Figure seller | `360-spin-showcase` | recipe CTA | `/effects/make-figure-walk` · `/for/etsy-listing-videos` · `/effects/paparazzi-flash` | Articulated-figure case | Will joints and accessories stay consistent? |
| 16 | `/toys/plush-toys` | Make a plush toy come alive in a short video | Plush seller | `plushie-comes-alive` | recipe CTA | `/effects/miniature-scene` · `/for/tiktok-shop-product-videos` · `/effects/display-case-glam` | Plush-specific motion case | Will the plush become a human character? |
| 17 | `/toys/art-toys` | Create an AI video for a designer art toy | Toy artist | `floating-hero` | recipe CTA | `/effects/miniature-scene` · `/for/instagram-reels-for-collectors` · `/effects/display-case-glam` | Designer-toy identity case | Can I use art for which I own the rights? |
| 18 | `/toys/anime-figures` | Animate an anime figure from a product photo | Collector | `make-figure-dance` | recipe CTA | `/effects/make-figure-walk` · `/effects/collection-shelf-pan` · `/for/instagram-reels-for-collectors` | Anime-figure identity case | Does PIKBO grant character IP rights? |
| 19 | `/toys/vinyl-figures` | Create a product video for a vinyl figure | Vinyl-toy seller | `display-case-glam` | recipe CTA | `/effects/360-spin-showcase` · `/for/etsy-listing-videos` · `/effects/floating-hero` | Gloss/material case | Can reflections alter the paint color? |
| 20 | `/toys/resin-sofubi` | Make a cinematic video for a resin or sofubi toy | Sofubi artist | `floating-hero` | recipe CTA | `/effects/display-case-glam` · `/effects/paint-splash` · `/for/instagram-reels-for-collectors` | Material-preservation case | Will translucent resin stay translucent? |
| 21 | `/toys/model-kits` | Create a model-kit product video from one photo | Model-kit seller | `assemble-reveal` | recipe CTA | `/effects/360-spin-showcase` · `/for/etsy-listing-videos` · `/effects/miniature-scene` | Completed-kit case | Can the AI show an assembly it cannot see? |
| 22 | `/toys/blind-box-figures` | Make a blind-box toy reveal video with AI | Blind-box shop | `blind-box-unboxing` | recipe CTA | `/effects/mystery-box-reveal` · `/for/blind-box-brand-marketing` · `/toys/art-toys` | Box-visible case | Do I need both the box and figure in frame? |

## Platform intents — 8 total, including Wave 1

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 23 | `/for/whatnot-live-selling` | Create toy drop videos for Whatnot live selling | Whatnot host | `paparazzi-flash` | Seller Pack CTA | `/effects/paparazzi-flash` · `/effects/blind-box-unboxing` · `/toys/action-figures` | Whatnot opener case | Does PIKBO connect to a Whatnot stream? |
| 24 | `/for/amazon-product-videos` | Make an Amazon toy product video from one image | Marketplace seller | `360-spin-showcase` | Seller Pack CTA | `/effects/360-spin-showcase` · `/toys/action-figures` · `/for/etsy-listing-videos` | Marketplace-safe square case | Does PIKBO guarantee Amazon approval? |
| 25 | `/for/instagram-reels-for-collectors` | Turn a collectible photo into an Instagram Reel | Collector | `make-figure-dance` | recipe CTA | `/effects/make-figure-dance` · `/effects/miniature-scene` · `/toys/art-toys` | 9:16 social case | What Reel length does PIKBO create? |
| 26 | `/for/youtube-shorts-toy-videos` | Create a YouTube Short for a toy from one photo | Toy creator | `paparazzi-flash` | recipe CTA | `/effects/paparazzi-flash` · `/effects/stop-motion-style` · `/toys/anime-figures` | Vertical Shorts case | Does the result include music or captions? |
| 27 | `/for/shopify-toy-product-videos` | Make a Shopify product video for a collectible | Store owner | `360-spin-showcase` | Seller Pack CTA | `/effects/display-case-glam` · `/for/etsy-listing-videos` · `/toys/vinyl-figures` | Product-page case | Does PIKBO upload the file to Shopify? |
| 28 | `/for/ebay-collectible-videos` | Create an eBay collectible video from a listing photo | Reseller | `360-spin-showcase` | Seller Pack CTA | `/effects/360-spin-showcase` · `/for/depop-shop-videos` · `/toys/action-figures` | Resale listing case | Should generated angles be disclosed? |

## Commercial-task intents — 10

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 29 | `/for/ai-toy-video-generator` | AI toy video generator for photos you own | Mixed | `floating-hero` | recipe CTA | `/effects/floating-hero` · `/toys/art-toys` · `/for/toy-image-to-video` | Input/output hero case | Is the free result generated from my upload? |
| 30 | `/for/toy-image-to-video` | Turn a toy image into a short AI video | Mixed | `miniature-scene` | recipe CTA | `/effects/miniature-scene` · `/for/ai-toy-video-generator` · `/toys/action-figures` | Source/result comparison | What image types produce better motion? |
| 31 | `/for/toy-product-video-generator` | Create a toy product video without a photo shoot | Seller | `360-spin-showcase` | Seller Pack CTA | `/effects/360-spin-showcase` · `/for/etsy-listing-videos` · `/toys/vinyl-figures` | Product-video case | Does the output replace product photography? |
| 32 | `/for/blind-box-video-generator` | Generate a blind-box reveal video from one photo | Toy shop | `blind-box-unboxing` | recipe CTA | `/effects/blind-box-unboxing` · `/effects/mystery-box-reveal` · `/toys/blind-box-figures` | Reveal case with box visible | Can it reveal a toy hidden inside a closed box? |
| 33 | `/for/action-figure-video-generator` | Generate an action-figure video from a still photo | Figure seller | `make-figure-walk` | recipe CTA | `/toys/action-figures` · `/effects/360-spin-showcase` · `/effects/make-figure-walk` | Figure-motion case | How do I reduce warped limbs? |
| 34 | `/for/collectible-video-generator` | Create a collectible product clip from one image | Collector | `display-case-glam` | recipe CTA | `/effects/display-case-glam` · `/toys/resin-sofubi` · `/for/instagram-reels-for-collectors` | Display-case case | Will the result preserve small paint details? |
| 35 | `/for/toy-unboxing-video-generator` | Make a toy unboxing video without filming hands | Seller | `blind-box-unboxing` | recipe CTA | `/effects/blind-box-unboxing` · `/toys/blind-box-figures` · `/for/tiktok-shop-product-videos` | Hand-free reveal case | Does the generated video show real hands? |
| 36 | `/for/toy-360-video-generator` | Make a 360° toy video without a turntable | Seller | `360-spin-showcase` | recipe CTA | `/effects/360-spin-showcase` · `/for/etsy-listing-videos` · `/toys/action-figures` | Spin case and unseen-angle disclosure | Are generated reverse angles exact? |
| 37 | `/for/batch-toy-video-generator` | Generate three toy sales videos from one photo | Store owner | `360-spin-showcase` | Seller Pack CTA | `/effects/blind-box-unboxing` · `/effects/paparazzi-flash` · `/for/shopify-toy-product-videos` | Seller Pack three-result case | What happens if only one output fails? |
| 38 | `/for/toy-launch-video-maker` | Make a toy launch teaser from one product photo | Toy brand | `paparazzi-flash` | recipe CTA | `/effects/paparazzi-flash` · `/effects/mystery-box-reveal` · `/for/tiktok-shop-product-videos` | Launch teaser case | Does PIKBO promise ad performance? |

## Problem intents — 6

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 39 | `/for/toy-video-without-turntable` | Make a toy spin video without buying a turntable | Seller | `360-spin-showcase` | recipe CTA | `/effects/360-spin-showcase` · `/for/toy-360-video-generator` · `/for/etsy-listing-videos` | Physical-vs-generated limitation case | What details can change on the unseen side? |
| 40 | `/for/toy-video-from-one-photo` | Make a toy video from one product photo | Mixed | `floating-hero` | recipe CTA | `/for/toy-image-to-video` · `/effects/floating-hero` · `/toys/art-toys` | Single-input case | Do extra reference photos improve consistency? |
| 41 | `/for/consistent-toy-character-video` | Keep a toy character consistent in an AI video | Toy artist | `display-case-glam` | recipe CTA | `/toys/art-toys` · `/effects/display-case-glam` · `/for/toy-image-to-video` | Identity review example | Does PIKBO guarantee perfect identity? |
| 42 | `/for/toy-video-without-human-hands` | Create a toy reveal video without filming hands | Seller | `blind-box-unboxing` | recipe CTA | `/effects/blind-box-unboxing` · `/for/toy-unboxing-video-generator` · `/toys/blind-box-figures` | Hand-free case | Can hands still appear unexpectedly? |
| 43 | `/for/toy-video-without-filming` | Make a toy product video without recording footage | Seller | `360-spin-showcase` | Seller Pack CTA | `/for/toy-product-video-generator` · `/effects/360-spin-showcase` · `/for/shopify-toy-product-videos` | Photo-to-output case | Is the output a substitute for proof of condition? |
| 44 | `/for/preserve-toy-packaging-in-ai-video` | Preserve toy packaging details in an AI product video | Store owner | `blind-box-unboxing` | recipe CTA | `/effects/blind-box-unboxing` · `/for/blind-box-video-generator` · `/toys/blind-box-figures` | Packaging text failure/pass pair | Can AI reproduce small package text exactly? |

## User-role intents — 6

| # | Path | H1 | ICP | Recipe | CTA | Three related routes | Proof requirement | Unique FAQ |
|---:|---|---|---|---|---|---|---|---|
| 45 | `/for/toy-video-for-collectors` | AI toy videos for collectors and shelf displays | Collector | `display-case-glam` | recipe CTA | `/effects/display-case-glam` · `/effects/collection-shelf-pan` · `/toys/art-toys` | Collector-display case | Can I keep the result private? |
| 46 | `/for/toy-video-for-etsy-sellers` | Toy listing videos for Etsy sellers | Etsy seller | `360-spin-showcase` | Seller Pack CTA | `/for/etsy-listing-videos` · `/effects/360-spin-showcase` · `/toys/vinyl-figures` | Etsy workflow case | Does PIKBO guarantee more Etsy sales? |
| 47 | `/for/toy-video-for-whatnot-sellers` | Toy drop videos for Whatnot sellers | Whatnot host | `paparazzi-flash` | Seller Pack CTA | `/for/whatnot-live-selling` · `/effects/paparazzi-flash` · `/effects/blind-box-unboxing` | Live-drop opener case | Can I generate during a live show? |
| 48 | `/for/toy-video-for-blind-box-shops` | AI launch videos for blind-box shops | Toy shop | `blind-box-unboxing` | Seller Pack CTA | `/for/blind-box-brand-marketing` · `/effects/mystery-box-reveal` · `/toys/blind-box-figures` | Shop launch set | Can PIKBO create a character it cannot see? |
| 49 | `/for/toy-video-for-custom-toy-artists` | Product videos for custom and designer toy artists | Toy artist | `floating-hero` | recipe CTA | `/toys/art-toys` · `/effects/floating-hero` · `/effects/stop-motion-style` | Artist-owned character case | Who owns the generated output? |
| 50 | `/for/toy-video-for-creative-agencies` | Batch toy product videos for creative agencies | Agency | `360-spin-showcase` | Seller Pack CTA | `/for/batch-toy-video-generator` · `/effects/paparazzi-flash` · `/for/shopify-toy-product-videos` | Multi-SKU prototype, not fake customer work | Does PIKBO currently support team approval? |

## Release order

1. Upgrade and verify the ten Wave 1 pages.
2. Submit only Wave 1 routes to Search Console after the public launch gate.
3. Measure impressions → tool starts → Live starts → downloads.
4. Promote planned rows only when unique proof and content are complete.
5. Remove or merge pages that remain duplicative after real query data.
