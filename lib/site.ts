/**
 * Launch TDH (Title / Description / H1) — FREEZE 1–4 weeks after public go-live
 * (哥飞 SEO SOP). Change only with explicit boss approval during freeze.
 */
export const site = {
  name: "Pikbo",
  domain: "pikbo.ai",
  url: "https://pikbo.ai",
  /**
   * VIDEO-first product. Photo = input; short AI video = output.
   * Soft launch: free Mini trial / labeled Lab demos; no fake multi-model.
   */
  tagline: "AI toy video generator — photo to short video",
  /** Meta description — frozen for soft launch */
  description:
    "Turn one photo of a designer toy you own into a short AI video for TikTok, listings, and drops. Free Mini trial. No card. Failed live jobs refund credits.",
  /** Default document title (layout) — frozen for soft launch */
  titleDefault: "Pikbo — AI Toy Video Generator | Photo to Short Video",
  /** Canonical homepage H1 — stable; do not rotate with demo carousel */
  homeH1: "Turn one toy photo into a short video",
  keyword: "AI toy video generator",
  twitter: "@pikbo_ai",
  suiteLine: "AI video for toys · Seedance live",
} as const;
