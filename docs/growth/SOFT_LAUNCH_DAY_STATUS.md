# Soft launch day status (哥飞 Path A)

**Updated:** 2026-07-24  
**Tip:** `git log -1 --oneline`

## Engineering ready (local main)

| Item | Status |
|------|--------|
| Production `npm run build` | green |
| Homepage TDH freeze | `site.titleDefault` / `description` / `homeH1` |
| Homepage free-trial strip | `SoftLaunchStrip` |
| Viral demo wall | Lab demos only |
| Generate free deep link | `/create?try=1&sample=scout` → **200** |
| Seller Pack | `/create?mode=seller-pack` → **200** |
| SEO sample | `/for/etsy-listing-videos` · `/tools/ai-toy-video-generator` → **200** |
| sitemap | **200** |
| Payments | Stripe live off (intentional) |

## Boss still owns

1. Vercel deploy + env (`SESSION_SECRET`, `FAL_KEY`)  
2. pikbo.ai DNS  
3. After live: GSC + sitemap submit  

## Local smoke (dev)

```
/ → 200
/create?try=1&sample=scout → 200
/create?mode=seller-pack → 200
/for/etsy-listing-videos → 200
/tools/ai-toy-video-generator → 200
/sitemap.xml → 200
```

## After boss deploys

- [ ] health softLive on preview  
- [ ] link-check against preview URL  
- [ ] one free Generate path on production  
- [ ] freeze Title / Description / H1 1–4 weeks  
