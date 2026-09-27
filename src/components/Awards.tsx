"use client";

import { Trophy, ArrowUpRight } from "lucide-react";
import { awards as fallbackAwards } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function Awards({
  data,
}: {
  data?: Pick<SiteContent, "awards">;
} = {}) {
  const honors = data?.awards ?? fallbackAwards;

  if (!honors || honors.length === 0) return null;

  return (
    <section
      id="awards"
      aria-label="Awards and Recognition"
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-20 sm:py-24 md:py-32"
    >
      <GridLines />

      {/* Radial ambient backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_35%,rgba(234,179,8,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[800px] text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-950/30 px-3.5 py-1 text-[12px] font-medium uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <Trophy size={13} className="text-amber-400" />
              Honors & Recognition
            </span>
          </ScrollReveal>

          <ScrollWipe
            as="h2"
            direction="down"
            className="mt-4 text-balance font-heading text-[clamp(32px,7vw,58px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Awards & Mentions
          </ScrollWipe>

          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-balance font-heading text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              Industry recognition for user-centric digital experiences, interfaces, and product craft.
            </p>
          </ScrollReveal>
        </div>

        {/* Awards List */}
        <div className="mx-auto mt-12 sm:mt-16 max-w-[1000px] divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
          {honors.map((award, idx) => {
            const ContentWrapper = award.link ? "a" : "div";
            return (
              <ScrollReveal key={`${award.title}-${idx}`} delay={Math.min(idx * 0.05, 0.25)}>
                <ContentWrapper
                  {...(award.link
                    ? {
                        href: award.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 transition-colors duration-200 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="font-mono text-sm font-semibold text-amber-400/90 shrink-0">
                      {award.year}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-heading text-[17px] font-bold text-white group-hover:text-amber-300 transition-colors">
                        {award.title}
                      </h4>
                      <p className="text-[13px] text-white/50">
                        {award.organization} {award.project ? `• ${award.project}` : ""}
                      </p>
                    </div>
                  </div>

                  {award.link && (
                    <span className="self-end sm:self-center inline-flex items-center gap-1 text-[12px] font-medium text-white/40 group-hover:text-amber-300 transition-colors">
                      View Award <ArrowUpRight size={14} />
                    </span>
                  )}
                </ContentWrapper>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
