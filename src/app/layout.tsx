import type { Metadata } from "next";
import { Inter, Inter_Tight, Great_Vibes } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CursorTrail } from "@/components/CursorTrail";
import { Preloader } from "@/components/Preloader";
import { getPublishedContent } from "@/lib/content";

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
  const title = `${content.site.name} — ${content.site.role || "Portfolio"}`;
  const description =
    content.hero.subtitle || `${content.site.name}, ${content.site.role}`;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      ...(content.site.ogImage ? { images: [content.site.ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(content.site.ogImage ? { images: [content.site.ogImage] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getPublishedContent();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${greatVibes.variable}`}
    >
      <body className="bg-[#09090b] text-white antialiased">
        <LenisProvider>
          <Preloader name={content.site.name} role={content.site.role} />
          <CursorTrail />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
