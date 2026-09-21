"use client";

import { aboutIntro as fallbackIntro } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function AboutIntro({
  data,
}: {
  data?: Pick<SiteContent, "aboutIntro">;
} = {}) {
  const aboutIntro = data?.aboutIntro ?? fallbackIntro;
  if (!aboutIntro.heading && !aboutIntro.body) return null;
  return (
    <section className="relative overflow-hidden bg-transparent px-5 pb-24 pt-14 sm:px-6 md:px-12 md:pb-44 md:pt-24">
      <GridLines />
      {/* bottom melt — violet canvas mixes into the Projects black.
          Ends in the exact Projects base (#0a0a0c) so the seam
          disappears into a smooth color blend, never a hard cut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#2a1650]/30 to-[#0a0a0c] md:h-72"
      />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-6 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <ScrollWipe
          as="h2"
          direction="right"
          className="text-balance font-heading text-[clamp(28px,7.5vw,36px)] font-semibold leading-[1.12] tracking-tight text-white sm:text-[36px] md:text-[60px]"
        >
          {aboutIntro.heading}
        </ScrollWipe>
        <ScrollReveal delay={0.15}>
          <p className="max-w-[62ch] font-heading text-[15px] font-light leading-[1.7] text-white/85 sm:text-[16px] md:text-[19px]">
            {aboutIntro.body}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
