import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";
import { supabaseAuthConfigured } from "@/lib/supabaseAuth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your private PIKBO toy video workspace.",
};

export default function LoginPage() {
  return (
    <main className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip">Private workspace</span>
        <h1 className="mt-4 text-4xl font-bold">Keep every toy campaign together.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--fg-muted)]">
          Sign in to reuse owned-toy references, track asynchronous jobs, and share
          one durable credit balance across devices.
        </p>
      </div>
      <AuthPanel enabled={supabaseAuthConfigured()} />
    </main>
  );
}
