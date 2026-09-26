"use client";

import { Check, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { pricing as fallbackPricing } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, ScrollWipe } from "./ui";

export function Pricing({
  data,
}: {
  data?: Pick<SiteContent, "pricing">;
} = {}) {
  const tiers = data?.pricing ?? fallbackPricing;

  if (!tiers || tiers.length === 0) return null;

  return (
    <section
      id="pricing"
      aria-label="Pricing and Investment Packages"
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-20 sm:py-24 md:py-32"
    >
      <GridLines />

      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_35%,rgba(139,92,246,0.15),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[800px] text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/40 px-3.5 py-1 text-[12px] font-medium uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <CreditCard size={13} className="text-purple-400" />
              Transparent Investment
            </span>
          </ScrollReveal>

          <ScrollWipe
            as="h2"
            direction="down"
            className="mt-4 text-balance font-heading text-[clamp(32px,7vw,58px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Engagement Packages
          </ScrollWipe>

          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-balance font-heading text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              Clear deliverables, fixed pricing, and high-velocity turnarounds. No hidden retainers or surprise agency fees.
            </p>
          </ScrollReveal>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const isPopular = tier.popular;
            return (
              <ScrollReveal key={tier.name || idx} delay={Math.min(idx * 0.08, 0.25)}>
                <div
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
                    isPopular
                      ? "border-2 border-purple-500/60 bg-purple-950/[0.18] shadow-[0_20px_50px_-15px_rgba(139,92,246,0.35)] scale-[1.02]"
                      : "border border-white/10 bg-white/[0.03] hover:border-purple-500/30 hover:bg-white/[0.05]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/50 bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-md">
                        <Sparkles size={11} />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-[22px] font-bold text-white">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-extrabold text-white">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-[13px] font-medium text-white/50">
                          / {tier.period}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 font-heading text-[14px] font-light leading-relaxed text-white/70">
                      {tier.description}
                    </p>

                    {/* Features List */}
                    {tier.features && tier.features.length > 0 && (
                      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-[13.5px] text-white/80">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                              <Check size={11} strokeWidth={3} />
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <a
                      href={tier.ctaHref || "#contact"}
                      className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-center font-heading text-[14px] font-semibold transition-all duration-200 ${
                        isPopular
                          ? "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.4)]"
                          : "border border-white/20 bg-white/5 text-white hover:border-purple-500/50 hover:bg-white/10"
                      }`}
                    >
                      <span>{tier.ctaText || "Get Started"}</span>
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
