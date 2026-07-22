# Pikbo UI kit (template-grade, not full theme swap)

## What we use

- **Pattern:** shadcn/ui-style primitives (`components/ui/*`)
- **Deps:** `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, `lucide-react`
- **Config:** `components.json` (aliases ready for more `npx shadcn add …` later)
- **Utils:** `lib/utils.ts` → `cn()`

## Components

| File | Role |
|------|------|
| `ui/button` | Primary / secondary / ghost / accent CTAs |
| `ui/card` | Pricing, FAQ, promo panels |
| `ui/badge` | Live / soon / brand chips |
| `ui/separator` | Shell + section rules |

Legacy CSS (`.btn`, `.card`, `.chip`) still works for older pages — migrate gradually.

## Why not replace the whole app with a ThemeForest template

Business logic (fal, credits, SEO landings) stays. Kit only raises **visual finish** on shell + pricing.

## Add more later

```bash
npx shadcn@latest add dialog input tabs
# or hand-copy from ui.shadcn.com into components/ui/
```
