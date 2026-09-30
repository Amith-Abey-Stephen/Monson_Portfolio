"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, Quote, Sparkles } from "lucide-react";
import type { CustomSection as CustomSectionType } from "@/lib/schema";
import { GridLines, MagneticButton, ScrollReveal, ScrollWipe } from "./ui";

export type SectionColorTheme = {
  radial: string;
  wash: string;
  glow: string;
  badge: string;
  badgeIcon: string;
  tag: string;
  hoverTitle: string;
  hoverBorder: string;
  hoverShadow: string;
  spotlight: string;
  metricSuffix: string;
  quoteIcon: string;
  ctaIcon: string;
};

const THEME_TOKENS: Record<string, SectionColorTheme> = {
  violet: {
    radial: "rgba(124, 58, 237, 0.20)",
    wash: "rgba(168, 85, 247, 0.12)",
    glow: "#7c3aed",
    badge: "border-purple-500/25 bg-purple-950/40 text-purple-300",
    badgeIcon: "text-purple-400",
    tag: "border-purple-500/25 bg-purple-950/30 text-purple-300",
    hoverTitle: "group-hover:text-purple-300",
    hoverBorder: "hover:border-purple-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.25)]",
    spotlight: "rgba(168, 85, 247, 0.16)",
    metricSuffix: "text-purple-400",
    quoteIcon: "text-purple-400/30 fill-purple-400/20",
    ctaIcon: "text-purple-600",
  },
  blue: {
    radial: "rgba(37, 99, 235, 0.20)",
    wash: "rgba(96, 165, 250, 0.12)",
    glow: "#2563eb",
    badge: "border-blue-500/25 bg-blue-950/40 text-blue-300",
    badgeIcon: "text-blue-400",
    tag: "border-blue-500/25 bg-blue-950/30 text-blue-300",
    hoverTitle: "group-hover:text-blue-300",
    hoverBorder: "hover:border-blue-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.25)]",
    spotlight: "rgba(96, 165, 250, 0.16)",
    metricSuffix: "text-blue-400",
    quoteIcon: "text-blue-400/30 fill-blue-400/20",
    ctaIcon: "text-blue-600",
  },
  emerald: {
    radial: "rgba(16, 185, 129, 0.18)",
    wash: "rgba(52, 211, 153, 0.12)",
    glow: "#10b981",
    badge: "border-emerald-500/25 bg-emerald-950/40 text-emerald-300",
    badgeIcon: "text-emerald-400",
    tag: "border-emerald-500/25 bg-emerald-950/30 text-emerald-300",
    hoverTitle: "group-hover:text-emerald-300",
    hoverBorder: "hover:border-emerald-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.25)]",
    spotlight: "rgba(52, 211, 153, 0.16)",
    metricSuffix: "text-emerald-400",
    quoteIcon: "text-emerald-400/30 fill-emerald-400/20",
    ctaIcon: "text-emerald-600",
  },
  amber: {
    radial: "rgba(245, 158, 11, 0.18)",
    wash: "rgba(251, 191, 36, 0.12)",
    glow: "#f59e0b",
    badge: "border-amber-500/25 bg-amber-950/40 text-amber-300",
    badgeIcon: "text-amber-400",
    tag: "border-amber-500/25 bg-amber-950/30 text-amber-300",
    hoverTitle: "group-hover:text-amber-300",
    hoverBorder: "hover:border-amber-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.25)]",
    spotlight: "rgba(251, 191, 36, 0.16)",
    metricSuffix: "text-amber-400",
    quoteIcon: "text-amber-400/30 fill-amber-400/20",
    ctaIcon: "text-amber-600",
  },
  rose: {
    radial: "rgba(225, 29, 72, 0.20)",
    wash: "rgba(244, 63, 94, 0.12)",
    glow: "#e11d48",
    badge: "border-rose-500/25 bg-rose-950/40 text-rose-300",
    badgeIcon: "text-rose-400",
    tag: "border-rose-500/25 bg-rose-950/30 text-rose-300",
    hoverTitle: "group-hover:text-rose-300",
    hoverBorder: "hover:border-rose-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.25)]",
    spotlight: "rgba(244, 63, 94, 0.16)",
    metricSuffix: "text-rose-400",
    quoteIcon: "text-rose-400/30 fill-rose-400/20",
    ctaIcon: "text-rose-600",
  },
  cyan: {
    radial: "rgba(6, 182, 212, 0.18)",
    wash: "rgba(34, 211, 238, 0.12)",
    glow: "#06b6d4",
    badge: "border-cyan-500/25 bg-cyan-950/40 text-cyan-300",
    badgeIcon: "text-cyan-400",
    tag: "border-cyan-500/25 bg-cyan-950/30 text-cyan-300",
    hoverTitle: "group-hover:text-cyan-300",
    hoverBorder: "hover:border-cyan-500/40",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.25)]",
    spotlight: "rgba(34, 211, 238, 0.16)",
    metricSuffix: "text-cyan-400",
    quoteIcon: "text-cyan-400/30 fill-cyan-400/20",
    ctaIcon: "text-cyan-600",
  },
  monochrome: {
    radial: "transparent",
    wash: "transparent",
    glow: "transparent",
    badge: "border-white/15 bg-white/5 text-stone-300",
    badgeIcon: "text-stone-300",
    tag: "border-white/10 bg-white/5 text-stone-300",
    hoverTitle: "group-hover:text-white",
    hoverBorder: "hover:border-white/30",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.06)]",
    spotlight: "rgba(255, 255, 255, 0.08)",
    metricSuffix: "text-white/60",
    quoteIcon: "text-white/20 fill-white/10",
    ctaIcon: "text-stone-900",
  },
  none: {
    radial: "transparent",
    wash: "transparent",
    glow: "transparent",
    badge: "border-white/15 bg-white/5 text-stone-300",
    badgeIcon: "text-stone-300",
    tag: "border-white/10 bg-white/5 text-stone-300",
    hoverTitle: "group-hover:text-white",
    hoverBorder: "hover:border-white/30",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.06)]",
    spotlight: "rgba(255, 255, 255, 0.08)",
    metricSuffix: "text-white/60",
    quoteIcon: "text-white/20 fill-white/10",
    ctaIcon: "text-stone-900",
  },
};

export function CustomSection({ section }: { section?: CustomSectionType }) {
  if (!section || !section.id) return null;

  const bgTheme = THEME_TOKENS[section.bgColor || "violet"] ?? THEME_TOKENS.violet;
  const isAnimated = section.bgAnimation !== "none";
  const hasGlow = section.bgColor !== "none" && section.bgColor !== "monochrome";

  return (
    <section
      id={section.id}
      className="noise relative scroll-mt-24 overflow-hidden bg-transparent py-24 sm:py-32 md:py-36"
    >
      <GridLines />

      {/* Dynamic Animated Background Ambiance — Contained & Smooth */}
      {hasGlow && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_35%,var(--radial-color),transparent_75%)]"
            style={{ ["--radial-color" as any]: bgTheme.radial }}
          />
          {isAnimated && (
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={
                section.bgAnimation === "aurora"
                  ? { opacity: [0.2, 0.45, 0.2], x: ["-2%", "2%", "-2%"] }
                  : { opacity: [0.25, 0.5, 0.25], scale: [0.98, 1.02, 0.98] }
              }
              transition={{
                duration: section.bgAnimation === "aurora" ? 10 : 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_40%,var(--wash-color),transparent_70%)]"
              style={{ ["--wash-color" as any]: bgTheme.wash }}
            />
          )}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12">
        {/* Template 1: Text / Story */}
        {section.template === "text-story" && (
          <div className="max-w-[900px] mx-auto text-left">
            <ScrollReveal>
              {section.eyebrow && (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                  <Sparkles size={12} className={bgTheme.badgeIcon} />
                  {section.eyebrow}
                </span>
              )}
            </ScrollReveal>

            <ScrollWipe
              as="h2"
              direction="down"
              className="mt-4 font-heading text-[clamp(32px,6vw,54px)] font-bold tracking-tight text-white leading-[1.10]"
            >
              {section.title || "Our Story"}
            </ScrollWipe>

            {section.subtitle && (
              <ScrollReveal delay={0.1}>
                <p className="mt-5 text-[18px] sm:text-[22px] font-light leading-relaxed text-white/90">
                  {section.subtitle}
                </p>
              </ScrollReveal>
            )}

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
            <div className="space-y-6">
              <ScrollReveal>
                {section.eyebrow && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                    <Sparkles size={12} className={bgTheme.badgeIcon} />
                    {section.eyebrow}
                  </span>
                )}
              </ScrollReveal>

              <ScrollWipe
                as="h2"
                direction="right"
                className="font-heading text-[clamp(28px,5vw,48px)] font-bold tracking-tight text-white leading-[1.12]"
              >
                {section.title || "Featured Focus"}
              </ScrollWipe>

              {section.subtitle && (
                <ScrollReveal delay={0.08}>
                  <p className="text-[17px] sm:text-[19px] font-light leading-relaxed text-white/90">
                    {section.subtitle}
                  </p>
                </ScrollReveal>
              )}

              {typeof section.body === "string" && section.body.trim().length > 0 && (
                <ScrollReveal delay={0.12}>
                  <div className="text-[15px] sm:text-[16px] leading-[1.75] text-white/70 space-y-3">
                    {section.body.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {(section.ctaPrimaryText || section.ctaSecondaryText) && (
                <ScrollReveal delay={0.16}>
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
                </ScrollReveal>
              )}
            </div>

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
            <div className="max-w-[760px]">
              <ScrollReveal>
                {section.eyebrow && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                    <Sparkles size={12} className={bgTheme.badgeIcon} />
                    {section.eyebrow}
                  </span>
                )}
              </ScrollReveal>

              <ScrollWipe
                as="h2"
                direction="down"
                className="mt-4 font-heading text-[clamp(28px,5vw,50px)] font-bold tracking-tight text-white leading-[1.12]"
              >
                {section.title || "Core Architecture"}
              </ScrollWipe>

              {section.subtitle && (
                <ScrollReveal delay={0.1}>
                  <p className="mt-4 text-[16px] sm:text-[18px] font-light leading-relaxed text-white/80">
                    {section.subtitle}
                  </p>
                </ScrollReveal>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(section.cards || []).filter(Boolean).map((card, i) => (
                <ScrollReveal key={card.id || `card-${i}`} delay={i * 0.08}>
                  <div
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${bgTheme.hoverBorder} hover:bg-white/[0.06] ${bgTheme.hoverShadow}`}
                  >
                    {/* Ambient interactive spotlight matching theme */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${bgTheme.spotlight}, transparent 40%)`
                      }}
                    />

                    <div className="relative z-10 space-y-3">
                      {(card.tag || card.badge) && (
                        <div className="flex items-center justify-between">
                          {card.tag && (
                            <span className={`rounded-md border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${bgTheme.tag}`}>
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
                      <h3 className={`font-heading text-[20px] font-bold text-white transition-colors ${bgTheme.hoverTitle}`}>
                        {card.title || "Untitled Card"}
                      </h3>
                      {card.description && (
                        <p className="text-[14px] leading-relaxed text-stone-300">
                          {card.description}
                        </p>
                      )}
                    </div>

                    {card.link && card.link.trim().length > 0 && (
                      <div className="relative z-10 pt-6">
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
            <div className="text-center max-w-[760px] mx-auto">
              <ScrollReveal>
                {section.eyebrow && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                    <Sparkles size={12} className={bgTheme.badgeIcon} />
                    {section.eyebrow}
                  </span>
                )}
              </ScrollReveal>

              <ScrollWipe
                as="h2"
                direction="down"
                className="mt-4 font-heading text-[clamp(28px,5vw,52px)] font-bold tracking-tight text-white leading-[1.10]"
              >
                {section.title || "Key Metrics"}
              </ScrollWipe>

              {section.subtitle && (
                <ScrollReveal delay={0.1}>
                  <p className="mt-4 text-[16px] sm:text-[18px] font-light leading-relaxed text-white/80">
                    {section.subtitle}
                  </p>
                </ScrollReveal>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {(section.metrics || []).filter(Boolean).map((m, i) => (
                <ScrollReveal key={m.id || `metric-${i}`} delay={i * 0.08}>
                  <div className={`flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md transition-all duration-300 ${bgTheme.hoverBorder}`}>
                    <div className="flex items-baseline font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 text-[42px] sm:text-[54px] md:text-[62px] leading-none">
                      <span>{m.value || "0"}</span>
                      {m.suffix && (
                        <span className={`text-[24px] sm:text-[32px] ml-1 ${bgTheme.metricSuffix}`}>
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
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                  <Sparkles size={12} className={bgTheme.badgeIcon} />
                  {section.eyebrow}
                </span>
              )}
              <div className="relative mt-8">
                <Quote
                  size={56}
                  className={`mx-auto -mb-4 ${bgTheme.quoteIcon}`}
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
            <div className="max-w-[760px] mx-auto space-y-6">
              <ScrollReveal>
                {section.eyebrow && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[12px] font-medium tracking-wide uppercase backdrop-blur-md ${bgTheme.badge}`}>
                    <Sparkles size={12} className={bgTheme.badgeIcon} />
                    {section.eyebrow}
                  </span>
                )}
              </ScrollReveal>

              <ScrollWipe
                as="h2"
                direction="down"
                className="font-heading text-[clamp(32px,6vw,58px)] font-extrabold tracking-tight text-white leading-[1.08]"
              >
                {section.title || "Let's Build Together"}
              </ScrollWipe>

              {section.subtitle && (
                <ScrollReveal delay={0.1}>
                  <p className="text-[17px] sm:text-[20px] font-light leading-relaxed text-white/80">
                    {section.subtitle}
                  </p>
                </ScrollReveal>
              )}

              {(section.ctaPrimaryText || section.ctaSecondaryText) && (
                <ScrollReveal delay={0.15}>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {section.ctaPrimaryText && (
                      <MagneticButton
                        href={section.ctaPrimaryHref || "#contact"}
                        className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-white px-8 text-[15px] font-bold text-black shadow-lg hover:bg-stone-200 transition"
                      >
                        <Sparkles size={16} className={bgTheme.ctaIcon} />
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
                </ScrollReveal>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
