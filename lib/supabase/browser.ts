/**
 * Browser Supabase client (anon key only).
 */

"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function readPublicEnv(): { url: string; anon: string } | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  // Client bundle only sees NEXT_PUBLIC_*. Server mirrors SUPABASE_* into these.
  if (!url.startsWith("http") || anon.length < 10) return null;
  return { url: url.replace(/\/$/, ""), anon };
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (browserClient) return browserClient;
  // Prefer NEXT_PUBLIC_SUPABASE_URL; if only SUPABASE_URL was set, login form
  // can still work via server route for OTP send.
  const fromEnv = readPublicEnv();
  if (!fromEnv) return null;
  browserClient = createClient(fromEnv.url, fromEnv.anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}

export function isBrowserSupabaseReady(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "").startsWith("http") &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").length > 10
  );
}
