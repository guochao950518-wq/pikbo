# PIKBO unit economics — Seedance credits and free allowance

**Reviewed:** 2026-07-23

**Scope:** C3 / T26. **Partial product apply 2026-07-23 by Grok:** Free `10` credits (~1 clip), Creator `50` (~5), Shop `150` (~15) at 10 credits/clip — see `lib/pricing.ts`. Full model×duration metering still TODO.

**Launch rule:** re-check provider and payment pricing before enabling real charges.

## Decision

The current public allowance is not economically safe for live generation:

- Free: `30 credits / 10 credits per clip = 3 clips` every month.
- Creator: `$19 / month`, `500 credits = about 50 clips`.
- Every 5-second and 10-second clip currently costs the same 10 credits.

At fal's current Seedance 2.0 rates, a fully used Creator plan would spend more on model inference than it collects in subscription revenue. Do not enable real Stripe charging while `1 clip = 10 credits` remains the production rule.

Recommended launch shape:

1. Replace three monthly free generations with **one one-time, 4-second, 480p, watermarked trial**.
2. Require an email-backed account before the live trial; device/IP controls are secondary abuse signals, not identity.
3. Keep Creator at `$19`, but price generation by model, resolution, and duration.
4. Target roughly **five 5-second Fast 720p clips** or **four 5-second Standard 720p clips** per Creator allowance, not 50.
5. Keep demo mode free and clearly labeled because cached playback has zero marginal model cost.

## Source rates

The production code currently selects:

- Free: `bytedance/seedance-2.0/fast/image-to-video`, forced to 480p.
- Paid default: `bytedance/seedance-2.0/image-to-video`, default 720p.
- Studio duration: 5 or 10 seconds.

Official fal pricing reviewed on 2026-07-23:

| Endpoint / planning path | Rate per generated second | 5 seconds | 10 seconds | Status in PIKBO |
|---|---:|---:|---:|---|
| Seedance 2.0 Fast, 480p | **~$0.108 estimated** | **~$0.54** | **~$1.08** | Current Free live path |
| Seedance 2.0 Fast, 720p | $0.2419 | $1.21 | $2.42 | Available paid preference |
| Seedance 2.0 Standard, 720p | $0.3024 | $1.51 | $3.02 | Current paid default |
| Seedance 2.0 Mini, 480p | $0.0721 | $0.36 | $0.72 | Not currently wired; candidate only |
| Seedance 2.0 Mini, 720p | $0.1547 | $0.77 | $1.55 | Not currently wired; candidate only |

Sources:

- [fal — Seedance 2.0 Image to Video](https://fal.ai/models/bytedance/seedance-2.0/image-to-video)
- [fal — Seedance 2.0 Fast Image to Video](https://fal.ai/models/bytedance/seedance-2.0/fast/image-to-video)
- [fal — Seedance 2.0 Mini Image to Video](https://fal.ai/models/bytedance/seedance-2.0/mini/image-to-video)
- [Stripe — standard online payment pricing](https://stripe.com/pricing)

### Why the 480p Fast number is an estimate

fal publishes `$0.2419 / second` for Fast 720p and a token formula based on output width, height, duration, and 24 fps. The planning estimate scales the published 720p rate by the 16:9 / 9:16 pixel ratio from 1280×720 to approximately 854×480:

```text
$0.2419 × (854 × 480) / (1280 × 720) ≈ $0.1076 / second
```

Actual billing can vary with output dimensions and provider pricing. Treat `$0.108 / second` as a budget estimate, not a customer quote. Before launch, run controlled 4-, 5-, and 10-second jobs and compare the fal invoice to this table.

## Free allowance

### Current maximum exposure

Assuming a user consumes all three monthly clips:

| Free usage | Raw model cost | With 10% operations buffer |
|---|---:|---:|
| 3 × 5s Fast 480p | ~$1.61 | ~$1.78 |
| 3 × 10s Fast 480p | ~$3.23 | ~$3.55 |

The 10% buffer is a planning allowance for storage, delivery, retries, monitoring, and pricing variance. It is not an official fal fee.

This exposure is too high for anonymous recurring acquisition because the current guest balance is cookie-based. Clearing or rotating client state is not a reliable anti-abuse boundary.

### Recommended free policy

| Control | Recommendation |
|---|---|
| Allowance | One live generation per verified account, not three per month |
| Duration | 4 seconds |
| Resolution | 480p |
| Model | Fast initially; evaluate Mini only after a toy-consistency quality test |
| Output | Visible and file-level PIKBO watermark before public launch |
| Credits | One-time trial grant; do not silently refresh anonymous credits monthly |
| Abuse | Email-backed user ID plus device/IP velocity limits |

Estimated acquisition subsidy for one 4-second Fast 480p result:

```text
Raw model cost: 4 × ~$0.1076 = ~$0.43
With 10% buffer: ~$0.47 per fully used trial
```

If Seedance Mini passes a real toy-preservation test, a 5-second Mini 480p trial would cost about `$0.36` raw. Do not switch solely on price; the trial must represent the quality a customer will later buy.

## Creator $19

### Payment baseline

For a simple US-card planning example, Stripe lists `2.9% + $0.30`:

```text
$19.00 - (2.9% × $19.00) - $0.30 = ~$18.15 net receipt
```

Stripe fees depend on the account country, payment method, currency conversion, tax tooling, and negotiated agreement. `$18.15` is a comparison baseline, not the final PIKBO settlement forecast.

### Current 50-clip promise

| Fully used Creator allowance | Raw Seedance cost | Contribution after example Stripe fee | Contribution margin |
|---|---:|---:|---:|
| 50 × 5s Fast 720p | $60.48 | **-$42.33** | **-233%** |
| 50 × 5s Standard 720p | $75.60 | **-$57.45** | **-317%** |
| 50 × 10s Fast 720p | $120.95 | **-$102.80** | **-566%** |
| 50 × 10s Standard 720p | $151.20 | **-$133.05** | **-733%** |

Therefore the existing `~50 clips` Creator copy is a launch blocker for real billing. Low average usage does not make an upside-down maximum allowance safe; a small group of power users would create negative contribution margin.

### Recommended Creator capacity

Use a target model-cost envelope of roughly 35%–40% of net subscription revenue before support and company overhead.

Two equivalent safe starting bundles are:

| Creator bundle | Raw model cost | With 10% buffer | Contribution after example Stripe fee | Margin after model + buffer |
|---|---:|---:|---:|---:|
| 5 × 5s Fast 720p | $6.05 | $6.65 | $11.50 | 63.3% |
| 4 × 5s Standard 720p | $6.05 | $6.65 | $11.50 | 63.3% |

This leaves room for storage, customer support, chargebacks, failed-but-billed edge cases, taxes, and future discounts. It does not guarantee company-level profitability because payroll, marketing, and fixed infrastructure are excluded.

## Recommended credit weights

If Creator continues to include 500 credits, credits must represent cost-weighted usage rather than a clip count:

| Generation | Recommended charge | Approx. Creator capacity |
|---|---:|---:|
| Fast 480p, 5s | 45 credits | 11 clips |
| Fast 480p, 10s | 90 credits | 5 clips |
| Fast 720p, 5s | 100 credits | 5 clips |
| Fast 720p, 10s | 200 credits | 2 clips |
| Standard 720p, 5s | 125 credits | 4 clips |
| Standard 720p, 10s | 250 credits | 2 clips |

Rounding is intentional. It creates a buffer against provider price changes and makes duration visibly cost more. The quote shown before Generate must be calculated from the selected model, resolution, duration, and variant count.

The free trial can remain a separate promotional entitlement rather than forcing its acquisition subsidy into the paid credit exchange rate.

## Product and copy implications

Before real billing:

- Replace `1 clip = 10 credits` with a model-aware quote.
- Replace Creator `~50 clips` with an honest output range tied to model and duration.
- Make 10-second generations cost approximately twice the equivalent 5-second generation.
- Do not advertise “lowest cost per clip” on Shop until its allowance is recalculated with the same method.
- Do not enable live checkout while anonymous monthly credits can be reset through client state.
- Keep cached demo playback outside credit accounting and label it as cached.

No pricing-code changes are included in T26 because the current assignment forbids changes to generation, session, credits, and Stripe. Grok should implement the cost quote atomically with durable credit accounting, not as a front-end-only number.

## Launch gate and measurement

Run a limited cost test before changing public pricing:

1. Generate at least five jobs for each offered model/resolution/duration combination.
2. Record requested seconds, delivered seconds, fal invoice cost, failures, retries, storage size, and delivery bytes.
3. Compare p50 and p95 cost per successful downloadable result.
4. Add observed retry/storage overhead instead of keeping the temporary 10% assumption.
5. Recalculate plan limits with the actual Stripe account's fee schedule.
6. Review provider pricing weekly until the product has stable margins.

### Go / no-go

Real charging is **no-go** until all are true:

- Variable credit quotes are enforced server-side.
- Free is limited to one verified trial or an approved equivalent subsidy.
- Creator and Shop copy matches the implemented cost weights.
- Durable identity and credit ledger prevent repeated anonymous grants.
- Server-side watermarked downloads exist for Free.
- A small live-generation test confirms the billed rates above.
