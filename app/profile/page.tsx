import type { Metadata } from "next";
import { ProfilePanel } from "@/components/ProfilePanel";

export const metadata: Metadata = {
  title: "Profile",
  description: "Plan, credits, and your Pikbo session.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-lg">
        <span className="chip">Account</span>
        <h1 className="mt-3 text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Guest session for now — credits live in a signed cookie on this
          device.
        </p>
        <ProfilePanel />
      </div>
    </div>
  );
}
