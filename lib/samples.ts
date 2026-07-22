/** Local stills used as one-click sample inputs (no network). */
export const SAMPLE_TOYS = [
  {
    id: "orbit",
    label: "Orbit float",
    path: "/demos/orbit-still.webp",
    effect: "floating-hero",
  },
  {
    id: "moon",
    label: "Moon box",
    path: "/demos/moon-float.webp",
    effect: "blind-box-unboxing",
  },
  {
    id: "scout",
    label: "Scout pack",
    path: "/demos/scout-still.webp",
    effect: "360-spin-showcase",
  },
  {
    id: "beatbot",
    label: "Beatbot",
    path: "/demos/beatbot-still.webp",
    effect: "paparazzi-flash",
  },
] as const;

/** Fetch a public still and return a data URL for Generate API. */
export async function sampleToDataUrl(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Could not load sample");
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsDataURL(blob);
  });
}
