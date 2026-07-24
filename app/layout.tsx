import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";

/**
 * Network-independent fonts (Phase B).
 * next/font/google was removed so CI/offline builds never hang on fonts.googleapis.com.
 * Stack is system + generic display; premium webfonts can return later as local files.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI Toy Video Generator for Sellers`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI toy video generator",
    "toy image to video",
    "figure product video maker",
    "blind box unboxing video generator",
    "Etsy toy listing video",
    "TikTok toy ad generator",
  ],
  openGraph: {
    title: `${site.name} — Turn one toy photo into a video ready to sell`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI Toy Video Generator`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
