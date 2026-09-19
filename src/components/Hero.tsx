"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Quote, Sparkles } from "lucide-react";
import { hero as fallbackHero, site as fallbackSite } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, MagneticButton } from "./ui";
import { LogoStrip } from "./LogoStrip";

type HeroData = Pick<SiteContent, "hero" | "site" | "clientLogos" | "logoImages">;

export function Hero({ data }: { data?: HeroData } = {}) {
  const hero = data?.hero ?? fallbackHero;
  const site = data?.site ?? fallbackSite;
  const hasImage = Boolean(site.heroImage);
  return (
    <section
      id="hero"
      className="noise relative flex min-h-[100svh] flex-col overflow-hidden bg-transparent"
    >
      {/* bg portrait + red grade — bottom edge feathered so it melts
          into the shared canvas (no hard clip into the logo banner) */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_66%,transparent_100%)]">
        {hasImage && (
          <Image
            src={site.heroImage}
            alt={`${site.name} portrait`}
            fill
            priority
            sizes="100vw"
            className="scale-[1.05] object-cover object-[50%_12%] sm:object-[50%_15%] md:object-[50%_18%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7c3aed]/55 via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_70%_20%,rgba(124,58,237,0.35),transparent_60%)]" />
      </div>

      <GridLines />

      {/* giant name — scrolls naturally with the page like the
          reference (no parallax / fade, so it never lingers or pops) */}
      <div className="pointer-events-none relative z-[5] mx-auto w-full max-w-[1500px] select-none px-4 pt-24 sm:px-6 md:px-8 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          aria-hidden
          className="font-heading text-[clamp(64px,20vw,220px)] font-bold leading-[0.88] tracking-tight text-white md:text-[clamp(80px,11.5vw,180px)]"
        >
          <span className="name-sheen block bg-clip-text text-transparent">
            {hero.firstName}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
          aria-hidden
          className="-mt-[5vw] flex justify-end font-heading text-[clamp(64px,20vw,220px)] font-bold leading-[0.88] tracking-tight md:-mt-[2vw] md:text-[clamp(80px,11.5vw,180px)]"
        >
          <span className="bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">
            {hero.lastName}
          </span>
        </motion.div>
      </div>

      {/* bottom copy — plain flow, no scroll-linked opacity/y.
          Matches the recording: title, text and both CTAs stay fully
          opaque and scroll off together; they never fade early or
          pop back in. */}
      <div className="relative z-20 flex flex-1 items-end">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-8 px-5 pb-28 sm:px-6 md:gap-10 md:px-12 md:pb-36 lg:grid-cols-2">
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-balance text-[clamp(26px,7vw,30px)] font-bold leading-[1.08] md:text-[42px]"
            >
              {hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[560px] font-heading text-[15px] font-light leading-[1.6] text-white/90 sm:text-[16px] md:mt-5 md:text-[19px]"
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-7 md:gap-4"
            >
              {site.contraHref && (
                <MagneticButton
                  href={site.contraHref}
                  target="_blank"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[10px] border border-white/10 bg-[#111] px-7 py-4 text-[15px] font-medium transition-colors duration-300 hover:border-white/20 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[16px]"
                >
                  <Sparkles size={17} className="shrink-0 text-purple-300" aria-hidden />
                  Hire Me on Contra
                </MagneticButton>
              )}
              {site.calendly && (
                <MagneticButton
                  href={site.calendly}
                  target="_blank"
                  className="shimmer-btn inline-flex min-h-[52px] items-center justify-center rounded-[10px] border border-white/10 bg-[#111] px-7 py-4 text-[15px] font-medium transition-colors duration-300 hover:border-white/20 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[16px]"
                >
                  <span className="book-shine">Book Meeting</span>
                </MagneticButton>
              )}
            </motion.div>
          </div>

          <div className="min-w-0 lg:justify-self-end lg:text-right">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9 }}
              className="font-script -rotate-[4deg] text-[36px] leading-none text-white/90 sm:text-[44px] md:text-[58px]"
            >
              {site.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.9 }}
              className="mt-4 flex items-start gap-2 font-heading text-[16px] font-light leading-snug text-white sm:text-[18px] md:text-[22px] lg:justify-end"
            >
              <Quote size={24} className="mt-0.5 shrink-0 fill-white/90 text-white/90" aria-hidden />
              <span>{hero.quote}</span>
            </motion.p>
          </div>
        </div>
      </div>

      {/* running banner — floats over the image's lower fade, below the
          CTAs, so it never feels like a separate section or container */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <LogoStrip data={data} />
      </div>
    </section>
  );
}
