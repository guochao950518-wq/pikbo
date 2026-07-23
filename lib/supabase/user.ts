/**
 * Resolve Supabase Auth user from a request (Bearer access token).
 * Browser sessions use localStorage; clients pass Authorization: Bearer.
 */

import { createHash } from "crypto";
import { getSupabaseAnonServer, getSupabaseAdmin } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

export function guestSessionIdHash(sessionId: string): string {
  return createHash("sha256").update(`pikbo-guest:${sessionId}`).digest("hex");
}

/** Extract Bearer token from Authorization header. */
export function bearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m?.[1]?.trim() || null;
}

/**
 * Validate access token and return user. Prefers admin client when present
 * (service role); falls back to anon getUser(jwt).
 */
export async function getAuthUserFromRequest(
  req: Request
): Promise<AuthUser | null> {
  const token = bearerToken(req);
  if (!token) return null;
  const admin = getSupabaseAdmin();
  const client = admin ?? getSupabaseAnonServer();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user?.id) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? null,
    };
  } catch {
    return null;
  }
}
