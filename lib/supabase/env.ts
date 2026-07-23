/**
 * Supabase env helpers — never log full keys.
 */

export function supabaseUrl(): string | null {
  const u =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    "";
  if (!u.startsWith("http")) return null;
  return u.replace(/\/$/, "");
}

export function supabaseAnonKey(): string | null {
  const k =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    "";
  return k.length > 10 ? k : null;
}

export function supabaseServiceRoleKey(): string | null {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  return k.length > 10 ? k : null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}
