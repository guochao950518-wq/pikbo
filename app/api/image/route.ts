import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { deductCredits, refundCredits } from "@/lib/credits";
import { IMAGE_MODEL } from "@/lib/models";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { ensureSession, publicSession, saveSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Image generations cost same credit unit as a short clip for simplicity. */
const COST = CREDITS_PER_VIDEO;

export async function POST(req: Request) {
  let body: { prompt?: string; aspect?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt || prompt.length < 4) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }

  let session = await ensureSession();
  if (session.credits < COST) {
    return NextResponse.json(
      {
        error: "Not enough credits",
        code: "INSUFFICIENT_CREDITS",
        session: publicSession(session),
      },
      { status: 402 }
    );
  }

  session = deductCredits(session, COST);
  await saveSession(session);

  if (!process.env.FAL_KEY) {
    await new Promise((r) => setTimeout(r, 800));
    // placeholder gradient SVG data URL as demo
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff4d8d"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="48%" fill="white" font-size="28" text-anchor="middle" font-family="sans-serif">Pikbo demo still</text><text x="50%" y="54%" fill="white" font-size="14" text-anchor="middle" opacity=".8">set FAL_KEY for Flux</text></svg>`;
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    return NextResponse.json({
      imageUrl,
      demo: true,
      model: "demo",
      session: publicSession(session),
    });
  }

  try {
    fal.config({ credentials: process.env.FAL_KEY });
    const aspect = body.aspect || "3:4";
    // flux schnell uses image_size enums often
    const sizeMap: Record<string, string> = {
      "1:1": "square_hd",
      "3:4": "portrait_4_3",
      "9:16": "portrait_16_9",
      "16:9": "landscape_16_9",
    };

    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: `${prompt}. Product photography style, designer toy / collectible figure, sharp detail, studio lighting.`,
        image_size: sizeMap[aspect] || "portrait_4_3",
        num_images: 1,
      },
      logs: false,
    });

    const data = result.data as {
      images?: Array<{ url?: string }>;
      image?: { url?: string };
    };
    const imageUrl = data.images?.[0]?.url || data.image?.url;
    if (!imageUrl) {
      session = refundCredits(session, COST);
      await saveSession(session);
      return NextResponse.json(
        { error: "No image returned", session: publicSession(session) },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imageUrl,
      model: IMAGE_MODEL,
      session: publicSession(session),
    });
  } catch (err) {
    console.error("image gen error:", err);
    session = refundCredits(session, COST);
    await saveSession(session);
    const msg = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json(
      { error: msg, session: publicSession(session) },
      { status: 500 }
    );
  }
}
