import type { Metadata } from "next";
import { Inter, Inter_Tight, Great_Vibes } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CursorTrail } from "@/components/CursorTrail";
import { Preloader } from "@/components/Preloader";
import { getPublishedContent } from "@/lib/content";
import {
  effectiveDescription,
  effectiveKeywords,
  effectiveTitle,
  withAt,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-next",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display-next",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-next",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const title = effectiveTitle(content);
  const description = effectiveDescription(content);
  const images = content.site.ogImage ? [content.site.ogImage] : [];
  const twitterHandle = withAt(content.seo.twitterHandle);
  return {
    title,
    description,
    keywords: effectiveKeywords(content),
    ...(content.seo.canonicalUrl
      ? { alternates: { canonical: content.seo.canonicalUrl } }
      : {}),
    ...(content.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
    ...(content.seo.googleSiteVerification
      ? { verification: { google: content.seo.googleSiteVerification } }
      : {}),
    openGraph: {
      type: "website",
      title,
      description,
      ...(content.seo.canonicalUrl ? { url: content.seo.canonicalUrl } : {}),
      ...(images.length > 0 ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterHandle
        ? { site: twitterHandle, creator: twitterHandle }
        : {}),
      ...(images.length > 0 ? { images } : {}),
    },
    ...(content.site.favicon ? { icons: { icon: content.site.favicon } } : {}),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getPublishedContent();
  const analyticsId = content.seo.analyticsId.trim();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${greatVibes.variable}`}
    >
      <body className="bg-[#09090b] text-white antialiased">
        {analyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}');`,
              }}
            />
          </>
        )}
        <LenisProvider>
          <Preloader name={content.site.name} role={content.site.role} />
          <CursorTrail />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
