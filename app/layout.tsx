import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Designer toy AI video`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "designer toy video maker",
    "figure spin video",
    "blind box video from photo",
    "etsy listing video toys",
    "image to video seedance",
    "collectible product video",
  ],
  openGraph: {
    title: `${site.name} — Designer toy AI video`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Designer toy AI video`,
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
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)] antialiased">
        <Analytics />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
