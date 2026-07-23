# G6 launch evidence log

Started: 2026-07-23T16:04:16.446Z
Base: http://127.0.0.1:3000

G6 launch pass @ http://127.0.0.1:3000 timeout=240000ms
health fal=true softLive=true mode=live-generate
topup → credits=10
START live-2 scout spin effect=360-spin-showcase still=scout-still.webp
OK live-2 scout spin requestId=019f8fb8-7b20-77e2-af8c-fcb392e2276f creditsAfter=0
topup → credits=10
START live-3 moon unbox effect=blind-box-unboxing still=moon-float.webp
OK live-3 moon unbox requestId=019f8fba-1b61-7ac1-9ab7-b41b05f1cb8c creditsAfter=0
SKIP refund (run separate server: PIKBO_FORCE_GENERATE_FAIL=1 npm run dev then G6_REFUND=1 node scripts/g6-launch-pass.mjs — or use g6-api-smoke G6_TEST_REFUND=1)

## Summary

Live successes this run: 2
- live-2 scout spin: effect=360-spin-showcase still=scout-still.webp requestId=019f8fb8-7b20-77e2-af8c-fcb392e2276f model=bytedance/seedance-2.0/mini/image-to-video
- live-3 moon unbox: effect=blind-box-unboxing still=moon-float.webp requestId=019f8fba-1b61-7ac1-9ab7-b41b05f1cb8c model=bytedance/seedance-2.0/mini/image-to-video

Ended: 2026-07-23T16:08:09.658Z

OK refund leg 2026-07-23T16:11:36.169Z credits 10→10 code=GENERATION_FAILED
