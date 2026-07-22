import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";

/** Display: fashion/retail impact · Body: clean readable */
const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
