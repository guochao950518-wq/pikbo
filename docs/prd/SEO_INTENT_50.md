# PIKBO SEO Intent 50

**Status:** v1 search map
**Owner:** GPT product/SEO structure
**Implementation:** Claude
**Last reviewed:** 2026-07-23

## Rules

- One page must complete one search job: searchable H1, working uploader/recipe composer, relevant proof, limitations, FAQ, and Studio deep link.
- Existing routes are reused instead of creating canonical duplicates.
- A planned route stays out of sitemap until its tool and at least one relevant official example exist.
- Every page links to Create, its cluster hub, one commercial page, and at least three related pages.
- No page promises exact unseen product angles, sales, reach, speed, or unlimited generation.

## Intent registry

`Status` is `existing` when a route already exists in the current registry and `planned` when engineering must add it.

| # | Cluster | Route | Search-language H1 | Primary recipe | Related internal links | Status / acceptance |
|---:|---|---|---|---|---|---|
| 1 | Tool | `/tools/ai-toy-video-generator` | AI Toy Video Generator From One Photo | `floating-hero` | `/create`, `/effects`, `/toys/art-toys` | planned; uploader + official toy example |
| 2 | Tool | `/tools/toy-image-to-video-ai` | Turn a Toy Image Into a Video | `make-figure-walk` | `/create`, `/effects/make-figure-walk`, `/toys/action-figures` | planned; image input above fold |
| 3 | Tool | `/tools/ai-product-video-generator-for-toys` | AI Product Video Generator for Toys | `360-spin-showcase` | `/for/etsy-listing-videos`, `/effects/360-spin-showcase`, `/pricing` | planned; seller use case + quote |
| 4 | Tool | `/tools/collectible-video-generator` | Collectible Video Generator From a Photo | `display-case-glam` | `/toys/art-toys`, `/effects/display-case-glam`, `/community` | planned; collectible-specific proof |
| 5 | Tool | `/toys/action-figures` | Make an Action Figure Video From One Photo | `make-figure-walk` | `/effects/make-figure-walk`, `/effects/360-spin-showcase`, `/create` | existing; working recipe deep link |
| 6 | Tool | `/toys/art-toys` | AI Video Maker for Designer Toys and Art Toys | `display-case-glam` | `/effects/display-case-glam`, `/for/etsy-listing-videos`, `/create` | existing; owned-toy language |
| 7 | Tool | `/toys/blind-box-figures` | Blind Box Video Generator From One Photo | `blind-box-unboxing` | `/effects/blind-box-unboxing`, `/for/blind-box-brand-marketing`, `/create` | existing; packaging limitation |
| 8 | Tool | `/toys/plush-toys` | Make a Plush Toy Video From One Photo | `plushie-comes-alive` | `/effects/plushie-comes-alive`, `/effects/claw-machine-win`, `/create` | existing; fabric/detail warning |
| 9 | Tool | `/tools/toy-animation-from-photo` | Animate a Toy From a Photo | `make-figure-dance` | `/effects/make-figure-dance`, `/toys/action-figures`, `/create` | planned; live/cached state visible |
| 10 | Tool | `/supercomputer?pack=seller` | Batch Toy Video Generator for Product Sellers | `360-spin-showcase` | `/for/etsy-listing-videos`, `/pricing`, `/create` | existing surface; canonical content page still planned |
| 11 | Effect | `/effects/360-spin-showcase` | Make a 360° Product Video of a Toy From One Photo | `360-spin-showcase` | `/for/etsy-listing-videos`, `/toys/action-figures`, `/create?effect=360-spin-showcase` | existing; unseen-angle warning |
| 12 | Effect | `/effects/blind-box-unboxing` | Create a Blind Box Unboxing Video From One Product Photo | `blind-box-unboxing` | `/toys/blind-box-figures`, `/for/blind-box-brand-marketing`, `/create?effect=blind-box-unboxing` | existing; packaging proof |
| 13 | Effect | `/effects/floating-hero` | Create a Floating Toy Product Video From One Photo | `floating-hero` | `/for/amazon-product-videos`, `/effects/display-case-glam`, `/create?effect=floating-hero` | existing; reference-first tool |
| 14 | Effect | `/tools/toy-cgi-video-generator` | Create a CGI-Style Product Video for a Toy | `floating-hero` | `/effects/floating-hero`, `/effects/miniature-scene`, `/create` | planned; no claim of 3D model |
| 15 | Effect | `/effects/stop-motion-style` | Make a Stop-Motion Toy Video From One Photo | `stop-motion-style` | `/toys/art-toys`, `/guides/how-to-photograph-toys-for-ai-video`, `/create?effect=stop-motion-style` | existing; style not brand imitation |
| 16 | Effect | `/effects/make-figure-dance` | Make a Toy Figure Dance From One Photo | `make-figure-dance` | `/toys/action-figures`, `/for/instagram-reels-for-collectors`, `/create?effect=make-figure-dance` | existing; detail drift FAQ |
| 17 | Effect | `/effects/miniature-scene` | Put Your Toy in a Miniature World Video | `miniature-scene` | `/toys/diorama-scenes`, `/effects/neon-city-night`, `/create?effect=miniature-scene` | existing; world is generated |
| 18 | Effect | `/tools/toy-packaging-asmr-video` | Make an ASMR Packaging Video for a Toy | `blind-box-unboxing` | `/effects/blind-box-unboxing`, `/for/blind-box-brand-marketing`, `/create` | planned; requires packaging example |
| 19 | Effect | `/tools/toy-launch-teaser-generator` | Create a Toy Launch Teaser From One Photo | `paparazzi-flash` | `/for/blind-box-brand-marketing`, `/effects/mystery-box-reveal`, `/create` | planned; launch CTA + proof |
| 20 | Effect | `/tools/restock-announcement-video` | Make a Restock Announcement Video for a Toy | `mystery-box-reveal` | `/for/whatnot-live-selling`, `/effects/blind-box-unboxing`, `/create` | planned; no inventory integration claim |
| 21 | Marketplace | `/for/etsy-listing-videos` | Make an Etsy Listing Video for a Toy From One Photo | `360-spin-showcase` | `/effects/360-spin-showcase`, `/toys/art-toys`, `/pricing` | existing; current Etsy rules disclaimer |
| 22 | Marketplace | `/for/tiktok-shop-product-videos` | Create a TikTok Shop Video for a Toy From One Photo | `blind-box-unboxing` | `/effects/blind-box-unboxing`, `/effects/paparazzi-flash`, `/pricing` | existing; no reach guarantee |
| 23 | Marketplace | `/for/whatnot-live-selling` | Make a Whatnot Promo Video for a Toy From One Photo | `paparazzi-flash` | `/effects/paparazzi-flash`, `/effects/360-spin-showcase`, `/pricing` | existing; no publishing/attendance claim |
| 24 | Marketplace | `/for/amazon-product-videos` | Make an Amazon Product Video for a Toy From One Photo | `360-spin-showcase` | `/effects/360-spin-showcase`, `/effects/floating-hero`, `/pricing` | existing; product accuracy warning |
| 25 | Marketplace | `/for/shopify-toy-product-videos` | Create Product Videos for a Shopify Toy Store | `floating-hero` | `/effects/floating-hero`, `/supercomputer?pack=seller`, `/pricing` | planned; no Shopify import until implemented |
| 26 | Marketplace | `/for/instagram-reels-for-collectors` | Make Instagram Reels From Toy Collection Photos | `make-figure-dance` | `/effects/make-figure-dance`, `/effects/display-case-glam`, `/create` | existing; test-not-guarantee language |
| 27 | Marketplace | `/for/youtube-shorts-toy-videos` | Create YouTube Shorts From Toy Photos | `paparazzi-flash` | `/effects/paparazzi-flash`, `/effects/miniature-scene`, `/create` | planned; 9:16 proof |
| 28 | Marketplace | `/for/ebay-collectible-videos` | Make an eBay Collectible Listing Video | `360-spin-showcase` | `/effects/360-spin-showcase`, `/toys/vinyl-figures`, `/pricing` | planned; verify current eBay support |
| 29 | Marketplace | `/for/depop-shop-videos` | Make a Depop Listing Video for a Toy From One Photo | `display-case-glam` | `/effects/display-case-glam`, `/effects/360-spin-showcase`, `/pricing` | existing; no sales claim |
| 30 | Marketplace | `/tools/toy-ad-generator` | AI Toy Ad Generator From a Product Photo | `floating-hero` | `/for/tiktok-shop-product-videos`, `/for/etsy-listing-videos`, `/pricing` | planned; ad drafts + commercial terms |
| 31 | Workflow | `/tools/product-url-to-toy-video` | Turn a Toy Product URL Into a Video | `360-spin-showcase` | `/create`, `/for/shopify-toy-product-videos`, `/pricing` | planned; only after safe importer ships |
| 32 | Workflow | `/tools/toy-photo-to-listing-video` | Turn a Toy Photo Into a Listing Video | `360-spin-showcase` | `/effects/360-spin-showcase`, `/for/etsy-listing-videos`, `/create` | planned; listing composer above fold |
| 33 | Workflow | `/tools/one-photo-product-video` | Make a Product Video From One Toy Photo | `floating-hero` | `/effects/floating-hero`, `/tools/ai-product-video-generator-for-toys`, `/create` | planned; distinct one-photo intent |
| 34 | Workflow | `/tools/toy-drop-campaign-video` | Create a Video Pack for a Toy Drop | `blind-box-unboxing` | `/for/blind-box-brand-marketing`, `/supercomputer?pack=seller`, `/pricing` | planned; itemized pack quote |
| 35 | Workflow | `/tools/toy-restock-video-maker` | Make a Toy Restock Video for Social Media | `mystery-box-reveal` | `/tools/restock-announcement-video`, `/for/whatnot-live-selling`, `/create` | planned; avoid duplicate canonical with #20 |
| 36 | Workflow | `/tools/collector-pov-toy-video` | Create a Collector POV Video From a Toy Photo | `display-case-glam` | `/for/instagram-reels-for-collectors`, `/toys/art-toys`, `/create` | planned; collector-specific proof |
| 37 | Workflow | `/tools/toy-unboxing-hook-generator` | Generate a Toy Unboxing Hook for Reels and Shorts | `blind-box-unboxing` | `/effects/blind-box-unboxing`, `/for/tiktok-shop-product-videos`, `/create` | planned; first-second example |
| 38 | Workflow | `/tools/toy-ugc-ad-generator` | Create a UGC-Style Toy Ad From Product Photos | `paparazzi-flash` | `/tools/toy-ad-generator`, `/for/tiktok-shop-product-videos`, `/pricing` | planned; call style, not real UGC |
| 39 | Workflow | `/tools/toy-product-demo-video` | Make a Short Product Demo Video for a Toy | `360-spin-showcase` | `/effects/360-spin-showcase`, `/for/amazon-product-videos`, `/create` | planned; generated angle disclaimer |
| 40 | Workflow | `/tools/toy-social-content-pack` | Create a Social Content Pack for One Toy SKU | `paparazzi-flash` | `/supercomputer?pack=seller`, `/for/tiktok-shop-product-videos`, `/pricing` | planned; Launch Pack after durable jobs |
| 41 | Toy type | `/toys/action-figures` | Make an Action Figure Video From One Photo | `make-figure-walk` | `/effects/make-figure-walk`, `/effects/assemble-reveal`, `/create` | existing; canonical shared with #5 |
| 42 | Toy type | `/toys/resin-sofubi` | Create a Product Video for Resin and Sofubi Toys | `display-case-glam` | `/effects/display-case-glam`, `/effects/stop-motion-style`, `/create` | existing; material review |
| 43 | Toy type | `/toys/garage-kits` | Make a Video of a Garage Kit or Resin Figure | `assemble-reveal` | `/effects/assemble-reveal`, `/toys/resin-sofubi`, `/create` | existing; fine-detail warning |
| 44 | Toy type | `/toys/vinyl-figures` | Make a Vinyl Figure Video From One Photo | `display-case-glam` | `/effects/display-case-glam`, `/effects/360-spin-showcase`, `/create` | existing; colorway review |
| 45 | Toy type | `/toys/plush-toys` | Make a Plushie Animation From One Photo | `plushie-comes-alive` | `/effects/plushie-comes-alive`, `/effects/claw-machine-win`, `/create` | existing; canonical shared with #8 |
| 46 | Toy type | `/toys/model-kits` | Make a Model Kit Video From a Finished-Build Photo | `assemble-reveal` | `/effects/assemble-reveal`, `/effects/neon-city-night`, `/create` | existing; decals may drift |
| 47 | Toy type | `/for/blind-box-brand-marketing` | Create Blind Box Drop Videos From One Product Photo | `blind-box-unboxing` | `/toys/blind-box-figures`, `/effects/mystery-box-reveal`, `/pricing` | existing; brand/packaging rights |
| 48 | Toy type | `/tools/custom-toy-product-video` | Make a Product Video for a Custom Art Toy | `display-case-glam` | `/toys/art-toys`, `/toys/resin-sofubi`, `/create` | planned; maker/reseller proof |
| 49 | Toy type | `/toys/anime-figures` | Make an Anime Figure Showcase Video From One Photo | `floating-hero` | `/effects/floating-hero`, `/effects/miniature-scene`, `/create` | existing; user rights + detail review |
| 50 | Toy type | `/toys/tabletop-miniatures` | Make a Miniature Product Video From One Photo | `miniature-scene` | `/effects/miniature-scene`, `/toys/diorama-scenes`, `/create` | existing; scale/detail warning |

## Duplicate-intent handling

- Rows 5/41 and 8/45 share one canonical route; they are two query phrasings for the same page, not additional pages.
- Rows 20/35 may become separate only if one page serves inventory announcements and the other serves social-video creation with substantially different tools/examples. Otherwise choose one canonical and redirect the other.
- `/create?effect=<slug>` is a conversion deep link and must canonicalize to `/effects/<slug>`, not compete with the effect page.
- URL-import pages stay `noindex` until the safe importer is live and the rights confirmation is enforced.

## Release sequence

1. Existing 20 high-intent routes: improve proof and tool-first behavior.
2. Build planned rows 1–4, 9, 14, 19, 21-adjacent tools, and 31 only when the matching product capability is live.
3. Submit at most ten newly complete routes per indexing wave.
4. Expand only when Search Console shows impressions and Studio starts; do not mass-produce thin variants.
