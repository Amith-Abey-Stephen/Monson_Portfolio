"use client";

import { GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
import { process as fallbackProcess } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function Process({
  data,
}: {
  data?: Pick<SiteContent, "process">;
} = {}) {
  const steps = data?.process ?? fallbackProcess;

  if (!steps || steps.length === 0) return null;

  return (
    <section
      id="process"
      aria-label="Design Process and Methodology"
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-20 sm:py-24 md:py-32"
    >
      <GridLines />

      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_40%,rgba(139,92,246,0.12),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[800px] text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/40 px-3.5 py-1 text-[12px] font-medium uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <GitBranch size={13} className="text-purple-400" />
              Workflow & Methodology
            </span>
          </ScrollReveal>

          <ScrollWipe
            as="h2"
            direction="down"
            className="mt-4 text-balance font-heading text-[clamp(32px,7vw,58px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            How Great Products Are Built
          </ScrollWipe>

          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-balance font-heading text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              A disciplined, high-velocity design framework turning ambiguous problems into intuitive digital experiences.
            </p>
          </ScrollReveal>
        </div>

        {/* Process Steps Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => (
            <ScrollReveal key={item.step || idx} delay={Math.min(idx * 0.08, 0.3)}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] sm:p-7">
                {/* Ambient hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(350px_circle_at_50%_0%,rgba(168,85,247,0.18),transparent_50%)]"
                />

                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-mono text-2xl font-bold tracking-tight text-purple-400">
                      {item.step || `0${idx + 1}`}
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-110">
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 font-heading text-[20px] font-bold leading-snug text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 font-heading text-[14px] font-light leading-relaxed text-white/70">
                    {item.description}
                  </p>
                </div>

                {/* Deliverable tag */}
                {item.deliverable && (
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-purple-300">
                      <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                      <span className="truncate">{item.deliverable}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
