import type { Metadata } from "next";
import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Editorial display face for headings — premium, characterful, toy-brand-friendly.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

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
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full bg-[var(--bg)] text-[var(--fg)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
