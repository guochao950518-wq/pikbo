import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { CREDITS_PER_VIDEO, getPlan, type PlanId } from "@/lib/pricing";

export const SESSION_COOKIE = "pikbo_s";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export type UserSession = {
  id: string;
  plan: PlanId;
  credits: number;
  /** YYYY-MM — free credits refresh when this rolls over */
  periodKey: string;
};

export type PublicSession = UserSession & {
  watermark: boolean;
  planName: string;
  clipsLeft: number;
  creditsPerVideo: number;
};

function secret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.CREDITS_SECRET ||
    "pikbo-dev-secret-change-me"
  );
}

export function currentPeriodKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

export function encodeSession(session: UserSession): string {
  const payloadB64 = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url"
  );
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function decodeSession(raw: string | undefined | null): UserSession | null {
  if (!raw) return null;
  const [payloadB64, sig] = raw.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as UserSession;
    if (!data.id || !data.plan || typeof data.credits !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

function newGuest(): UserSession {
  const plan = getPlan("free");
  return {
    id: randomUUID(),
    plan: "free",
    credits: plan.credits,
    periodKey: currentPeriodKey(),
  };
}

/** Refresh free monthly allowance; paid plans keep remaining until Stripe renews. */
export function refreshPeriod(session: UserSession): UserSession {
  const key = currentPeriodKey();
  if (session.periodKey === key) return session;

  if (session.plan === "free") {
    const plan = getPlan("free");
    return {
      ...session,
      periodKey: key,
      credits: plan.credits,
    };
  }

  // Paid: reset to plan allotment on calendar month (placeholder until Stripe webhook)
  const plan = getPlan(session.plan);
  return {
    ...session,
    periodKey: key,
    credits: plan.credits,
  };
}

export function publicSession(session: UserSession): PublicSession {
  const plan = getPlan(session.plan);
  return {
    ...session,
    watermark: plan.watermark,
    planName: plan.name,
    clipsLeft: Math.floor(session.credits / CREDITS_PER_VIDEO),
    creditsPerVideo: CREDITS_PER_VIDEO,
  };
}

export async function getOrCreateSession(): Promise<UserSession> {
  const jar = await cookies();
  const existing = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (existing) return refreshPeriod(existing);
  return newGuest();
}

export async function readSession(): Promise<UserSession | null> {
  const jar = await cookies();
  const existing = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (!existing) return null;
  return refreshPeriod(existing);
}

export async function saveSession(session: UserSession): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function ensureSession(): Promise<UserSession> {
  const session = await getOrCreateSession();
  await saveSession(session);
  return session;
}

export function setPlan(
  session: UserSession,
  planId: PlanId,
  options?: { resetCredits?: boolean }
): UserSession {
  const plan = getPlan(planId);
  return {
    ...session,
    plan: plan.id,
    credits: options?.resetCredits === false ? session.credits : plan.credits,
    periodKey: currentPeriodKey(),
  };
}
