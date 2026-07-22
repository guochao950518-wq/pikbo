import { cookies } from "next/headers";

const ACCESS_COOKIE = "pikbo_sb_access";
const REFRESH_COOKIE = "pikbo_sb_refresh";

type AuthUser = {
  id: string;
  email?: string;
};

type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AuthUser;
  error_description?: string;
  msg?: string;
};

function config() {
  return {
    url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
    anonKey:
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "",
  };
}
export function supabaseAuthConfigured(): boolean {
  const { url, anonKey } = config();
  return Boolean(url && anonKey);
}

async function authRequest(path: string, init: RequestInit = {}) {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => ({}))) as AuthTokens;
  if (!response.ok) {
    throw new Error(
      data.error_description || data.msg || `Authentication failed (${response.status})`
    );
  }
  return data;
}

async function saveTokens(tokens: AuthTokens) {
  if (!tokens.access_token || !tokens.refresh_token) return;
  const jar = await cookies();
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  jar.set(ACCESS_COOKIE, tokens.access_token, {
    ...common,
    maxAge: Math.max(60, tokens.expires_in ?? 3600),
  });
  jar.set(REFRESH_COOKIE, tokens.refresh_token, {
    ...common,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function authenticateWithEmail(options: {
  mode: "login" | "signup";
  email: string;
  password: string;
}): Promise<{ user: AuthUser | null; confirmationRequired: boolean }> {
  const path =
    options.mode === "login" ? "token?grant_type=password" : "signup";
  const tokens = await authRequest(path, {
    method: "POST",
    body: JSON.stringify({ email: options.email, password: options.password }),
  });
  await saveTokens(tokens);
  return {
    user: tokens.user ?? null,
    confirmationRequired: Boolean(tokens.user && !tokens.access_token),
  };
}

async function userForAccessToken(accessToken: string): Promise<AuthUser | null> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = (await response.json()) as AuthUser;
  return user.id ? user : null;
}

export async function getSupabaseAuthUser(): Promise<AuthUser | null> {
  if (!supabaseAuthConfigured()) return null;
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    const user = await userForAccessToken(accessToken);
    if (user) return user;
  }
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  try {
    const refreshed = await authRequest("token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    await saveTokens(refreshed);
    return refreshed.user ?? null;
  } catch {
    await clearSupabaseAuth();
    return null;
  }
}

export async function clearSupabaseAuth() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}
