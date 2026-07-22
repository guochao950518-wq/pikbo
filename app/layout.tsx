import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Designer toy AI video studio`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "designer toy video maker",
    "figure spin video",
    "blind box video from photo",
    "toy product video",
    "image to video seedance",
    "collectible product video",
  ],
  openGraph: {
    title: `${site.name} — Designer toy AI video studio`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PIKBO — One toy photo. A whole campaign.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Designer toy AI video studio`,
    description: site.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)] antialiased">
        <Analytics />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
