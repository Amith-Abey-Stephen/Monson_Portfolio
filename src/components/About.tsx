"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  about as fallbackAbout,
  galleryItems as fallbackGallery,
  site as fallbackSite,
} from "@/data/content";
import { quote as fallbackQuote } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal } from "./ui";

function QuoteLaptop({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
      {/* laptop base */}
      <div className="relative mx-auto h-[9px] w-[96%] rounded-b-xl bg-gradient-to-b from-[#2b2b30] to-[#101012]" />
      <div className="mx-auto mt-1 h-5 w-[80%] rounded-full bg-black/70 blur-xl" />
    </div>
  );
}

function QuotePair({
  left,
  leftTitle,
  right,
  rightTitle,
}: {
  left: string;
  leftTitle: string;
  right: string;
  rightTitle: string;
}) {
  return (
    <div className="flex w-full max-w-[1400px] items-center justify-center gap-3 px-4 sm:gap-4 md:gap-8 md:px-10">
      <QuoteLaptop
        src={left}
        title={leftTitle}
        className="w-[43vw] max-w-[520px] min-w-0 flex-1 shrink sm:flex-none md:w-[42vw]"
      />
      <QuoteLaptop
        src={right}
        title={rightTitle}
        className="w-[43vw] max-w-[520px] min-w-0 flex-1 shrink sm:flex-none md:w-[42vw]"
      />
    </div>
  );
}

function QuoteSingle({ src, title }: { src: string; title: string }) {
  return (
    <div className="flex w-full justify-center px-4">
      <QuoteLaptop
        src={src}
        title={title}
        className="w-[78vw] max-w-[560px] sm:w-[64vw] md:w-[38vw]"
      />
    </div>
  );
}

export function Quote({
  data,
}: {
  data?: Pick<SiteContent, "quote" | "galleryItems" | "site">;
} = {}) {
  const quote = data?.quote ?? fallbackQuote;
  const galleryItems = data?.galleryItems ?? fallbackGallery;
  const site = data?.site ?? fallbackSite;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start start", "end end"],
  });

  // text block: rises in, pins, then lifts away at the very end
  const textY = useTransform(
    scrollYProgress,
    [0, 0.06, 0.93, 1],
    [90, 0, 0, -90]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.93, 1],
    [0, 1, 1, 0]
  );
  const signOpacity = useTransform(scrollYProgress, [0.03, 0.09], [0, 1]);
  const signY = useTransform(scrollYProgress, [0.03, 0.09], [30, 0]);

  // laptop conveyor: streams from below the viewport to above it,
  // passing IN FRONT of the pinned text (laptops occlude the copy)
  const streamY = useTransform(
    scrollYProgress,
    [0.08, 0.95],
    ["72vh", "-305vh"]
  );

  return (
    <section ref={ref} className="relative bg-black" style={{ height: "380vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <GridLines />

        {/* pinned copy — behind the laptops */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-0 z-[10] grid place-items-center px-5 will-change-transform sm:px-6"
        >
          <div className="mx-auto w-full max-w-[1000px] text-center">
            <h2 className="text-balance font-heading text-[clamp(19px,5.4vw,22px)] font-medium leading-[1.5] text-white sm:text-[22px] md:text-[34px]">
              {quote.text}
            </h2>
            <motion.p
              style={{ opacity: signOpacity, y: signY }}
              className="font-script mt-6 text-[36px] text-white/90 will-change-transform sm:text-[44px] md:mt-8 md:text-[56px]"
            >
              {quote.signature || site.name}
            </motion.p>
          </div>
        </motion.div>

        {/* rising laptops — above the copy. Only available images stream;
            with no images the pinned quote stands alone. */}
        {(() => {
          const imgs = galleryItems.filter((g) => Boolean(g.image));
          if (imgs.length === 0) return null;
          const at = (i: number) => imgs[i % imgs.length];
          return (
            <motion.div
              style={{ y: streamY }}
              className="absolute inset-x-0 top-0 z-[20] will-change-transform"
            >
              <div className="flex flex-col items-center gap-[42vh] pb-[50vh] pt-[10vh]">
                {imgs.length >= 2 && (
                  <QuotePair
                    left={at(5).image}
                    leftTitle={at(5).title}
                    right={at(3).image}
                    rightTitle={at(3).title}
                  />
                )}
                {imgs.length >= 3 && (
                  <QuoteSingle src={at(6).image} title={at(6).title} />
                )}
                {imgs.length >= 4 && (
                  <QuotePair
                    left={at(1).image}
                    leftTitle={at(1).title}
                    right={at(0).image}
                    rightTitle={at(0).title}
                  />
                )}
                {imgs.length >= 5 && (
                  <QuoteSingle src={at(2).image} title={at(2).title} />
                )}
              </div>
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
}

export function About({
  data,
}: {
  data?: Pick<SiteContent, "about" | "site">;
} = {}) {
  const about = data?.about ?? fallbackAbout;
  const site = data?.site ?? fallbackSite;
  const firstName = site.name.split(" ")[0] || site.name;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });
  // Phase 1 (enter): portrait rises from below the fold (+380px) into place.
  // Phase 2 (pinned): portrait holds while the left copy scrolls past,
  // drifting up only slightly (-90px) like the recording.
  const imgY = useTransform(scrollYProgress, [0, 0.42, 1], [380, 0, -90]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.22], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0, 0.42, 1], [1.08, 1, 1.14]);
  // ghost heading sits BEHIND the portrait and rushes past, dissolving
  const ghostY = useTransform(scrollYProgress, [0, 1], [90, -130]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.15]);

  return (
    <section
      id="experience"
      ref={ref}
      className="noise relative scroll-mt-24 overflow-x-clip bg-transparent"
    >
      <GridLines />
      {/* ghost heading — absolute layer behind, portrait occludes it like the video */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity }}
        aria-hidden
        className="pointer-events-none relative z-[0] overflow-hidden px-5 pt-12 sm:px-6 md:px-12 md:pt-14"
      >
        <h2 className="ghost-huge text-center text-[22vw] sm:text-[24vw] md:text-[13vw]">
          About
        </h2>
        <h2 className="ghost-huge -mt-[4vw] text-right text-[22vw] sm:text-[24vw] md:text-[12vw]">
          {firstName}
        </h2>
      </motion.div>

      <div className="relative z-[10] mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 pb-20 sm:px-6 md:gap-10 md:px-12 md:pb-24 lg:grid-cols-2 lg:gap-8">
        <div className="lg:py-[8vh]">
          <ScrollReveal>
            <h3 className="text-balance font-heading text-[20px] font-semibold leading-[1.4] text-white sm:text-[22px] md:text-[28px]">
              {about.title}
            </h3>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-5 font-heading text-[15px] font-light leading-[1.75] text-white/70 sm:text-[16px] md:mt-6 md:text-[17px]">
              {about.body}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 md:mt-8">
              {about.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/10 px-3.5 py-2 font-heading text-[13px] text-white/80 sm:px-4 sm:py-2.5 sm:text-[14px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-black px-5 py-4 text-[14px] text-white/80 sm:text-[15px] md:mt-8 md:px-6">
              <span className="font-medium text-white">{about.role}</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span className="text-white/60">{about.type}</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span className="tabular-nums">{about.period}</span>
            </div>
          </ScrollReveal>
        </div>

        {/* portrait — sticky viewport-height stage on desktop so it pins
            while the left copy scrolls past; rises from below on entry,
            feathered with no frame so it melts into the gradient,
            bleeding under the next heading. Hidden when no portrait
            is set — the copy goes full-width instead. */}
        {site.aboutImage && (
          <div className="relative self-start lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:overflow-visible">
            <motion.div
              style={{ y: imgY, opacity: imgOpacity }}
              className="relative z-10 -mb-28 will-change-transform md:-mb-44 lg:mb-0 [mask-image:linear-gradient(to_right,transparent,black_22%)]"
            >
              <motion.img
                src={site.aboutImage}
                alt={site.name}
                style={{ scale: imgScale }}
                className="aspect-[4/5] w-full object-cover object-[50%_12%] will-change-transform [mask-image:linear-gradient(to_bottom,black_80%,transparent_99%)]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-[#7c3aed]/10" />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
