"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote, Sparkles } from "lucide-react";
import type { CustomSection as CustomSectionType } from "@/lib/schema";
import { GridLines, MagneticButton, ScrollReveal } from "./ui";

const BG_COLORS: Record<string, { radial: string; wash: string; glow: string }> = {
  violet: {
    radial: "rgba(124, 58, 237, 0.22)",
    wash: "rgba(168, 85, 247, 0.14)",
    glow: "#7c3aed",
  },
  blue: {
    radial: "rgba(37, 99, 235, 0.22)",
    wash: "rgba(96, 165, 250, 0.14)",
    glow: "#2563eb",
  },
  emerald: {
    radial: "rgba(16, 185, 129, 0.20)",
    wash: "rgba(52, 211, 153, 0.14)",
    glow: "#10b981",
  },
  amber: {
    radial: "rgba(245, 158, 11, 0.20)",
    wash: "rgba(251, 191, 36, 0.14)",
    glow: "#f59e0b",
  },
  rose: {
    radial: "rgba(225, 29, 72, 0.22)",
    wash: "rgba(244, 63, 94, 0.14)",
    glow: "#e11d48",
  },
  cyan: {
    radial: "rgba(6, 182, 212, 0.20)",
    wash: "rgba(34, 211, 238, 0.14)",
    glow: "#06b6d4",
  },
  none: {
    radial: "transparent",
    wash: "transparent",
    glow: "transparent",
  },
};

export function CustomSection({ section }: { section?: CustomSectionType }) {
  if (!section || !section.id) return null;

  const bgTheme = BG_COLORS[section.bgColor || "violet"] ?? {
    radial: section.bgColor?.startsWith("#") ? `${section.bgColor}33` : BG_COLORS.violet.radial,
    wash: section.bgColor?.startsWith("#") ? `${section.bgColor}22` : BG_COLORS.violet.wash,
    glow: section.bgColor || "#7c3aed",
  };

  const isAnimated = section.bgAnimation !== "none";

  return (
    <section
      id={section.id}
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-24 sm:py-32 md:py-36"
    >
      <GridLines />

      {/* Dynamic Animated Background Ambiance */}
      {section.bgColor !== "none" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Animated radial glow wash */}
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={
              isAnimated
                ? section.bgAnimation === "aurora"
                  ? {
                      opacity: [0.35, 0.65, 0.35],
                      x: ["-4%", "4%", "-4%"],
                      scale: [1, 1.05, 1],
                    }
                  : {
                      opacity: [0.4, 0.75, 0.4],
                      scale: [0.96, 1.06, 0.96],
                    }
                : {}
            }
            transition={{
              duration: section.bgAnimation === "aurora" ? 11 : 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 h-[70vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] md:blur-[150px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
            style={{
              background: `radial-gradient(ellipse at center, ${bgTheme.radial} 0%, ${bgTheme.wash} 45%, transparent 75%)`,
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12">
        {/* Template 1: Text / Story */}
        {section.template === "text-story" && (
          <div className="max-w-[900px] mx-auto text-left">
            <ScrollReveal>
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <h2 className="mt-4 font-heading text-[32px] sm:text-[44px] md:text-[54px] font-bold tracking-tight text-white leading-[1.12]">
                {section.title || "Our Story"}
              </h2>
              {section.subtitle && (
                <p className="mt-5 text-[18px] sm:text-[22px] font-light leading-relaxed text-white/90">
                  {section.subtitle}
                </p>
              )}
            </ScrollReveal>

            {typeof section.body === "string" && section.body.trim().length > 0 && (
              <ScrollReveal delay={0.15} className="mt-8 pt-8 border-t border-white/10">
                <div className="prose prose-invert max-w-none text-[16px] sm:text-[17px] leading-[1.8] text-white/75 space-y-4">
                  {section.body.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Template 2: Image + Text */}
        {section.template === "image-text" && (
          <div
            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
              section.imagePosition === "left" ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <ScrollReveal className="space-y-6">
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <h2 className="font-heading text-[30px] sm:text-[42px] md:text-[48px] font-bold tracking-tight text-white leading-[1.14]">
                {section.title || "Featured Focus"}
              </h2>
              {section.subtitle && (
                <p className="text-[17px] sm:text-[19px] font-light leading-relaxed text-white/90">
                  {section.subtitle}
                </p>
              )}
              {typeof section.body === "string" && section.body.trim().length > 0 && (
                <div className="text-[15px] sm:text-[16px] leading-[1.75] text-white/70 space-y-3">
                  {section.body.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
              {(section.ctaPrimaryText || section.ctaSecondaryText) && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {section.ctaPrimaryText && (
                    <MagneticButton
                      href={section.ctaPrimaryHref || "#contact"}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-6 text-[14px] font-semibold text-black hover:bg-stone-200 transition"
                    >
                      {section.ctaPrimaryText}
                    </MagneticButton>
                  )}
                  {section.ctaSecondaryText && (
                    <MagneticButton
                      href={section.ctaSecondaryHref || "#"}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-[14px] font-medium text-white hover:bg-white/10 transition"
                    >
                      {section.ctaSecondaryText}
                    </MagneticButton>
                  )}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121215] shadow-2xl">
                {section.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={section.image}
                    alt={section.title || "Featured image"}
                    className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-4/3 w-full items-center justify-center bg-white/[0.02] text-stone-500 text-[14px]">
                    No image uploaded yet
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Template 3: Cards / Grid */}
        {section.template === "cards-grid" && (
          <div className="space-y-12 sm:space-y-16">
            <ScrollReveal className="max-w-[760px]">
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <h2 className="mt-4 font-heading text-[30px] sm:text-[42px] md:text-[50px] font-bold tracking-tight text-white leading-[1.14]">
                {section.title || "Core Architecture"}
              </h2>
              {section.subtitle && (
                <p className="mt-4 text-[16px] sm:text-[18px] font-light leading-relaxed text-white/80">
                  {section.subtitle}
                </p>
              )}
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(section.cards || []).filter(Boolean).map((card, i) => (
                <ScrollReveal key={card.id || `card-${i}`} delay={i * 0.08}>
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-2xl">
                    <div className="space-y-3">
                      {(card.tag || card.badge) && (
                        <div className="flex items-center justify-between">
                          {card.tag && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-purple-300">
                              {card.tag}
                            </span>
                          )}
                          {card.badge && (
                            <span className="text-[11px] text-stone-400 font-mono">
                              {card.badge}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className="font-heading text-[20px] font-bold text-white group-hover:text-purple-300 transition-colors">
                        {card.title || "Untitled Card"}
                      </h3>
                      {card.description && (
                        <p className="text-[14px] leading-relaxed text-stone-300">
                          {card.description}
                        </p>
                      )}
                    </div>

                    {card.link && card.link.trim().length > 0 && (
                      <div className="pt-6">
                        <Link
                          href={card.link}
                          target={card.link.startsWith("http") ? "_blank" : undefined}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white transition"
                        >
                          <span>Learn more</span>
                          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Template 4: Metrics / Highlights */}
        {section.template === "metrics" && (
          <div className="space-y-12 sm:space-y-16">
            <ScrollReveal className="text-center max-w-[760px] mx-auto">
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <h2 className="mt-4 font-heading text-[30px] sm:text-[44px] md:text-[52px] font-bold tracking-tight text-white leading-[1.12]">
                {section.title || "Key Metrics"}
              </h2>
              {section.subtitle && (
                <p className="mt-4 text-[16px] sm:text-[18px] font-light leading-relaxed text-white/80">
                  {section.subtitle}
                </p>
              )}
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {(section.metrics || []).filter(Boolean).map((m, i) => (
                <ScrollReveal key={m.id || `metric-${i}`} delay={i * 0.08}>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md hover:border-white/20 transition">
                    <div className="flex items-baseline font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 text-[42px] sm:text-[54px] md:text-[62px] leading-none">
                      <span>{m.value || "0"}</span>
                      {m.suffix && (
                        <span className="text-purple-400 text-[24px] sm:text-[32px] ml-1">
                          {m.suffix}
                        </span>
                      )}
                    </div>
                    {m.label && (
                      <p className="mt-3 text-[13px] sm:text-[14px] font-medium uppercase tracking-wider text-stone-400">
                        {m.label}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Template 5: Quote / Testimonial */}
        {section.template === "quote-testimonial" && (
          <div className="max-w-[960px] mx-auto text-center">
            <ScrollReveal>
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <div className="relative mt-8">
                <Quote
                  size={56}
                  className="mx-auto text-purple-400/30 -mb-4 fill-purple-400/20"
                  aria-hidden
                />
                <blockquote className="font-heading text-[22px] sm:text-[32px] md:text-[38px] font-light italic leading-snug text-white/95">
                  &ldquo;{section.quoteText || section.subtitle || section.title || "Exceptional design and execution."}&rdquo;
                </blockquote>
              </div>

              {(section.quoteAuthor || section.quoteRole) && (
                <div className="mt-8 flex flex-col items-center justify-center gap-1.5">
                  {section.quoteAuthor && (
                    <p className="font-heading text-[18px] font-bold text-white">
                      {section.quoteAuthor}
                    </p>
                  )}
                  {section.quoteRole && (
                    <p className="text-[14px] text-stone-400">
                      {section.quoteRole}
                    </p>
                  )}
                </div>
              )}
            </ScrollReveal>
          </div>
        )}

        {/* Template 6: CTA / Callout */}
        {section.template === "cta" && (
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 sm:p-14 md:p-20 text-center backdrop-blur-xl shadow-2xl">
            <ScrollReveal className="max-w-[760px] mx-auto space-y-6">
              {section.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-md">
                  <Sparkles size={12} className="text-purple-300" />
                  {section.eyebrow}
                </span>
              )}
              <h2 className="font-heading text-[32px] sm:text-[46px] md:text-[58px] font-extrabold tracking-tight text-white leading-[1.08]">
                {section.title || "Let's Build Together"}
              </h2>
              {section.subtitle && (
                <p className="text-[17px] sm:text-[20px] font-light leading-relaxed text-white/80">
                  {section.subtitle}
                </p>
              )}
              {(section.ctaPrimaryText || section.ctaSecondaryText) && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  {section.ctaPrimaryText && (
                    <MagneticButton
                      href={section.ctaPrimaryHref || "#contact"}
                      className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-white px-8 text-[15px] font-bold text-black shadow-lg hover:bg-stone-200 transition"
                    >
                      <Sparkles size={16} className="text-purple-600" />
                      {section.ctaPrimaryText}
                    </MagneticButton>
                  )}
                  {section.ctaSecondaryText && (
                    <MagneticButton
                      href={section.ctaSecondaryHref || "#"}
                      className="inline-flex min-h-[52px] items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-[15px] font-medium text-white hover:bg-white/10 transition"
                    >
                      {section.ctaSecondaryText}
                    </MagneticButton>
                  )}
                </div>
              )}
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}
