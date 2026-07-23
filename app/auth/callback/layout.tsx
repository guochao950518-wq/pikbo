import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/seoIndex";

/** Phase H — private auth exchange surface; never index. */
export const metadata: Metadata = {
  title: "Signing in",
  robots: PRIVATE_ROBOTS,
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
