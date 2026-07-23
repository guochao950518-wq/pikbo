"use client";

type AuthPublic = {
  configured: boolean;
  providers: { emailMagicLink: boolean; google: boolean };
  mode: string;
  message: string;
};

export function LoginForm({ auth }: { auth: AuthPublic }) {
  if (!auth.configured) {
    return (
      <div className="mt-6 space-y-3 rounded-2xl border border-dashed border-white/15 bg-black/40 p-5">
        <p className="text-sm font-semibold text-white">Sign-in not live yet</p>
        <p className="text-xs leading-relaxed text-white/55">
          Supabase Auth keys are not configured on this deployment. Your guest
          cookie still works for Generate, credits, and this-device Library. No
          fake login form — we will not pretend email works.
        </p>
        <ul className="list-inside list-disc text-[11px] text-white/45">
          <li>Needs SUPABASE_URL + anon key</li>
          <li>Magic link + optional Google</li>
          <li>Guest balance migrates once (max 10 credits)</li>
        </ul>
      </div>
    );
  }

  return (
    <form
      className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      onSubmit={(e) => {
        e.preventDefault();
        // Wired when Supabase client ships — form is present so layout is stable.
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") || "").trim();
        if (!email) return;
        window.alert(
          `Auth client not mounted yet for ${email}. Keys are present; next deploy wires the magic link.`
        );
      }}
    >
      <label className="block text-xs font-semibold text-white/70">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@studio.com"
          className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--mint)]"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full py-2.5 text-sm">
        Email magic link
      </button>
      {auth.providers.google ? (
        <button
          type="button"
          className="btn btn-ghost w-full py-2.5 text-sm"
          onClick={() =>
            window.alert("Google OAuth client mounts with Supabase SDK next.")
          }
        >
          Continue with Google
        </button>
      ) : null}
      <p className="text-[10px] leading-relaxed text-white/40">
        Keys detected. Magic-link send is the next wiring step — not a finished
        auth product yet.
      </p>
    </form>
  );
}
