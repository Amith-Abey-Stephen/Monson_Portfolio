"use client";

import { useState } from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { services as fallbackServices } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function Services({
  data,
}: {
  data?: Pick<SiteContent, "services">;
} = {}) {
  const services = data?.services ?? fallbackServices;
  const [activePreview, setActivePreview] = useState<string | null>(null);

  if (services.length === 0) return null;

  return (
    <section
      id="services"
      aria-label="Services and capabilities"
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-20 sm:py-24 md:py-32"
    >
      <GridLines />

      {/* soft radial glow behind cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_30%,rgba(124,58,237,0.18),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[800px] text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/40 px-3.5 py-1 text-[12px] font-medium uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <Sparkles size={13} className="text-purple-400" />
              Core Capabilities
            </span>
          </ScrollReveal>

          <ScrollWipe
            as="h2"
            direction="down"
            className="mt-4 text-balance font-heading text-[clamp(32px,7vw,58px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Services & Offerings
          </ScrollWipe>

          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-balance font-heading text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              Specialized product design expertise tailored for high-growth tech companies and fast-moving founders.
            </p>
          </ScrollReveal>
        </div>

        {/* Responsive Grid of Cards: 1-col on mobile, 2-col on md/lg */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:gap-8">
          {services.map((s, i) => (
            <ScrollReveal key={s.index || i} delay={Math.min(i * 0.08, 0.3)}>
              <div
                onMouseEnter={() => s.preview && setActivePreview(s.preview)}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.25)] sm:p-8"
              >
                {/* ambient spotlight on card hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(168,85,247,0.15),transparent_40%)]"
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-semibold tracking-wider text-purple-400">
                      {s.index ? `// ${s.index}` : `// 0${i + 1}`}
                    </span>
                    {s.preview && (
                      <span className="inline-flex items-center gap-1 text-[12px] text-white/40 transition group-hover:text-purple-300">
                        Preview <ArrowUpRight size={14} />
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-heading text-[22px] font-bold leading-snug text-white sm:text-[26px]">
                    {s.title}
                  </h3>

                  <p className="mt-3 font-heading text-[14.5px] font-light leading-relaxed text-white/70 sm:text-[15.5px]">
                    {s.description}
                  </p>
                </div>

                {s.tags && s.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-medium text-white/80 transition-colors group-hover:border-purple-500/25 group-hover:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Floating Image Preview Modal on preview click/hover if available */}
      {activePreview && (
        <div
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md md:hidden"
        >
          <div className="relative max-h-[80vh] max-w-full overflow-hidden rounded-xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activePreview} alt="Service preview" className="max-h-[75vh] object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
