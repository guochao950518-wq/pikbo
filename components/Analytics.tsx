"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!measurementId) return;
    const thirty = window.setTimeout(() => track("engaged_30s"), 30_000);
    const sixty = window.setTimeout(() => track("engaged_60s"), 60_000);
    return () => {
      window.clearTimeout(thirty);
      window.clearTimeout(sixty);
    };
  }, [measurementId]);

  if (!measurementId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="pikbo-ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','${measurementId}',{send_page_view:true});`}
      </Script>
    </>
  );
}
