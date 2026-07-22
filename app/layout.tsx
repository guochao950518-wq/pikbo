import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI Video Studio`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "ai video generator",
    "image to video",
    "seedance",
    "designer toy video",
    "figure video maker",
  ],
  openGraph: {
    title: `${site.name} — AI Video Studio`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI Video Studio`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg)] text-[var(--fg)]">
        <Analytics />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
