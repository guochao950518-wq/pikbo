import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Device data and Pikbo session settings.",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
