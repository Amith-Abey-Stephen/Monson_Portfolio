"use client";

import { motion } from "motion/react";
import { testimonials as fallbackTestimonials } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollBlocks, ScrollWipe } from "./ui";

/** illustrated avatars (memoji-like) with a gradient fallback underneath */
const avatarSeeds = [
  { seed: "Layne", bg: "b6e3f4" },
  { seed: "Anna", bg: "ffdfbf" },
  { seed: "Timothy", bg: "c0aede" },
  { seed: "Rick", bg: "d1d4f9" },
  { seed: "Josh", bg: "ffd5dc" },
  { seed: "Anita", bg: "c7f9cc" },
];

function Card({
  t,
  i,
}: {
  t: { quote: string; name: string; role: string };
  i: number;
}) {
  const a = avatarSeeds[i % avatarSeeds.length];
  return (
    <figure className="relative flex min-h-[400px] w-[82vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.14] bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_1px_0_0_rgba(255,255,255,0.05),0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl backdrop-saturate-[1.6] sm:w-[300px] sm:p-8 md:min-h-[440px] md:w-[340px] md:p-10">
      {/* specular sheen across the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_28%,transparent_45%)]"
      />
      {/* fine grain etched into the glass for a realistic frosted feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        }}
      />
      <blockquote className="relative flex-1 font-heading text-[16px] font-light leading-[1.65] text-white/80 sm:text-[17px] md:text-[19px]">
        {t.quote}
      </blockquote>
      <figcaption className="relative mt-6 md:mt-8">
        <div className="size-[52px] overflow-hidden rounded-full bg-gradient-to-br from-violet-300 via-rose-300 to-purple-400">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${a.seed}&backgroundColor=${a.bg}`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mt-4 font-heading text-[18px] font-semibold tracking-[0.01em] text-white sm:text-[20px] md:mt-5 md:text-[22px]">
          {t.name}
        </p>
        <div className="mb-5 mt-5 h-px bg-white/25 md:mb-6 md:mt-6" />
        <p className="font-heading text-[14px] uppercase leading-[1.55] text-white/45 sm:text-[16px] md:text-[18px]">
          {t.role}
        </p>
      </figcaption>
    </figure>
  );
}

export function Testimonials({
  data,
}: {
  data?: Pick<SiteContent, "testimonials">;
} = {}) {
  const testimonials = data?.testimonials ?? fallbackTestimonials;
  if (testimonials.length === 0) {
    return null;
  }
  return (
    <section aria-label="Client testimonials" className="relative z-10 overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,#000_22%,#0d0716_40%,#22103d_52%,#4c1d95_64%,#6d28d9_76%,#5b21b6_87%,#2e1065_100%)] py-16 sm:py-20 md:py-28">
      <GridLines />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <ScrollWipe
          as="h2"
          direction="down"
          className="relative z-10 text-balance text-center font-heading text-[clamp(32px,10vw,56px)] font-bold leading-[0.95] tracking-tight text-[#e9e9e9] md:text-[7.4vw]"
        >
          What Clients Say
        </ScrollWipe>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="marquee-paused group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:mt-24"
      >
        {/* single seamless track: two identical halves, track translates -50% */}
        <div className="animate-marquee-slow flex w-max gap-5 pr-5 sm:gap-8 sm:pr-8 md:gap-10 md:pr-10">
          {[...testimonials, ...testimonials].map((t, i) => (
            <Card key={i} t={t} i={i} />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black/60 to-transparent sm:w-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black/60 to-transparent sm:w-20"
        />
        {/* tile cover — dark rectangles slide away staggered to unveil
            the marquee once when the section is reached */}
        <ScrollBlocks cols={8} rows={2} direction="left" className="absolute inset-0 z-20" />
      </motion.div>
    </section>
  );
}
