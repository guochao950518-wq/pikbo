/**
 * Higgsfield-class short labels for preset cards.
 * SEO pages keep long h1/name; Explore/Community use these punchy titles.
 */
export const VIRAL_NAMES: Record<string, string> = {
  "360-spin-showcase": "PACKSHOT SPIN",
  "display-case-glam": "DISPLAY GLOW",
  "floating-hero": "ZERO-G FLOAT",
  "collection-shelf-pan": "SHELF PAN",
  "blind-box-unboxing": "BOX REVEAL",
  "mystery-box-reveal": "MYSTERY POP",
  "claw-machine-win": "CLAW WIN",
  "make-figure-dance": "TOY DANCE",
  "make-figure-walk": "TOY WALK",
  "toy-wave-hello": "WAVE HELLO",
  "plushie-comes-alive": "PLUSH ALIVE",
  "stop-motion-style": "STOP-MO",
  "miniature-scene": "MINI WORLD",
  "festive-snow": "SNOW GLAZE",
  "neon-city-night": "NEON NIGHT",
  "assemble-reveal": "ASSEMBLE",
  "paparazzi-flash": "PAPARAZZI",
  "kaiju-rampage": "KAIJU RUN",
  "smoke-burst-entrance": "SMOKE IN",
  "paint-splash": "PAINT HIT",
  "power-aura": "POWER AURA",
  "hologram-glitch": "HOLO GLITCH",
};

export function viralName(slug: string, fallback?: string): string {
  return VIRAL_NAMES[slug] ?? fallback ?? slug.toUpperCase().replace(/-/g, " ");
}
