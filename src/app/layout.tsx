import type { Metadata, Viewport } from "next";
import { clashDisplay, switzer } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { schemas } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteProviders } from "@/components/providers/SiteProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Atlantic Connect Marketing Inc. · Face-to-face field marketing in Halifax",
    template: "%s · Atlantic Connect Marketing Inc.",
  },
  description:
    "Halifax's people-first field-marketing & sales firm. We win customers for brands face to face across Atlantic Canada, and grow the careers of the people who do it.",
  applicationName: site.name,
  keywords: [
    "field marketing Halifax",
    "face-to-face marketing",
    "direct sales Halifax",
    "customer acquisition Atlantic Canada",
    "sales jobs Halifax",
    "marketing careers Nova Scotia",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title: "Atlantic Connect Marketing Inc. · The most powerful marketing still happens in person.",
    description:
      "People-first field marketing in Halifax & Atlantic Canada. Partner with us to grow your brand, or grow your career with us.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#0B1A2B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={cn(clashDisplay.variable, switzer.variable)} suppressHydrationWarning>
      <head>
        {/* If JS fails, reveal everything the motion layer would have animated in. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <JsonLd data={[schemas.localBusiness(), schemas.organization()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteProviders>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SiteProviders>
      </body>
    </html>
  );
}
