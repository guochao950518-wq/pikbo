import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { AppShell } from "@/components/AppShell";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI video for designer toys`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "designer toy video maker",
    "figure spin video",
    "blind box video from photo",
    "image to video seedance",
  ],
  openGraph: {
    title: `${site.name} — AI video for designer toys`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="min-h-full bg-[var(--bg)] text-[var(--fg)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
