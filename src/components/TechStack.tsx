"use client";

import { Cpu, Layers } from "lucide-react";
import { techstack as fallbackTechStack } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function TechStack({
  data,
}: {
  data?: Pick<SiteContent, "techstack">;
} = {}) {
  const tools = data?.techstack ?? fallbackTechStack;

  if (!tools || tools.length === 0) return null;

  return (
    <section
      id="techstack"
      aria-label="Technologies and Tooling"
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-20 sm:py-24 md:py-32"
    >
      <GridLines />

      {/* Radial backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_45%_at_50%_35%,rgba(168,85,247,0.1),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[800px] text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/40 px-3.5 py-1 text-[12px] font-medium uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <Cpu size={13} className="text-purple-400" />
              Weapons of Choice
            </span>
          </ScrollReveal>

          <ScrollWipe
            as="h2"
            direction="down"
            className="mt-4 text-balance font-heading text-[clamp(32px,7vw,58px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Tools & Technical Stack
          </ScrollWipe>

          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-balance font-heading text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              Modern industry standard software, rapid prototyping engines, and code frameworks powering high-impact digital experiences.
            </p>
          </ScrollReveal>
        </div>

        {/* Responsive Grid of Tech items */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {tools.map((item, idx) => (
            <ScrollReveal key={`${item.name}-${idx}`} delay={Math.min(idx * 0.05, 0.25)}>
              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-white/[0.06] hover:translate-y-[-2px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                      <Layers size={16} />
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate font-heading text-[16px] font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="truncate text-[12px] text-white/50">{item.category}</p>
                    </div>
                  </div>

                  {item.proficiency && (
                    <span className="shrink-0 rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10.5px] font-medium text-purple-300">
                      {item.proficiency}
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
