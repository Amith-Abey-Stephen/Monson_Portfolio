"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  animate,
} from "motion/react";
import { services as fallbackServices, stats as fallbackStats } from "@/data/content";
import { journey as fallbackJourney } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal, TextReveal } from "./ui";

/* ---------- count-up number, like the recording (3+ → 20+, etc.) ---------- */
function CountUp({
  end,
  suffix = "+",
  duration = 1.8,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ---------- scroll-drawn aurora line (gradient path draws on scroll) ---------- */
function JourneyLine({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: target as never,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 1600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    >
      <defs>
        <linearGradient id="journey-aurora" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34ffb5" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ffb03a" />
        </linearGradient>
        <filter id="journey-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* faint track */}
      <path
        d="M -60 60 C 280 110, 620 20, 920 90 S 1290 180, 1120 330 S 880 520, 1080 720 S 1280 980, 1000 1150 S 620 1330, 760 1550"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="2"
      />
      {/* drawn gradient line */}
      <motion.path
        d="M -60 60 C 280 110, 620 20, 920 90 S 1290 180, 1120 330 S 880 520, 1080 720 S 1280 980, 1000 1150 S 620 1330, 760 1550"
        fill="none"
        stroke="url(#journey-aurora)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#journey-glow)"
        style={{ pathLength: progress, opacity: 0.95 }}
      />
    </svg>
  );
}

export function Journey({
  data,
}: {
  data?: Pick<SiteContent, "services" | "stats" | "journey">;
} = {}) {
  const services = data?.services ?? fallbackServices;
  const stats = data?.stats ?? fallbackStats;
  const journey = data?.journey ?? fallbackJourney;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(0);
  // scroll fallback so the center preview also swaps while scrolling
  // (touch devices / no hover) — hover always wins when present.
  const active = hovered ?? scrolled;
  const hasPreview = services.some((s) => Boolean(s.preview));

  /* ---------- cursor-following preview (like the Framer recording) ---------- */
  const mx = useMotionValue(600);
  const my = useMotionValue(300);
  const sx = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 260, damping: 26, mass: 0.55 });

  const setPreviewPos = (clientX: number, clientY: number, jump = false) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (jump) {
      mx.jump?.(x);
      my.jump?.(y);
      sx.jump?.(x);
      sy.jump?.(y);
      mx.set(x);
      my.set(y);
      sx.set(x);
      sy.set(y);
    } else {
      mx.set(x);
      my.set(y);
    }
  };

  // Hooks must run unconditionally — empty sections hide here instead.
  if (services.length === 0 && stats.length === 0) return null;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-14 sm:px-6 md:px-12 md:pt-24"
    >
      <GridLines />
      <JourneyLine target={sectionRef} />
      <div className="relative z-[2] mx-auto max-w-[1200px] text-center">
        <ScrollReveal>
          <p className="font-heading text-[16px] text-white/90 md:text-[18px]">
            {journey.eyebrow}
          </p>
        </ScrollReveal>
        <TextReveal
          as="h2"
          className="mt-3 text-balance font-heading text-[clamp(32px,9vw,40px)] font-bold leading-[1.05] tracking-tight text-white md:text-[68px]"
        >
          {journey.heading}
        </TextReveal>

        {stats.length > 0 && (
          <div className="mt-10 grid grid-cols-2 md:mt-14 md:grid-cols-4">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08}>
              <div
                className={`px-4 py-6 md:py-2 ${
                  i > 0 ? "border-l border-white/15" : ""
                } ${i >= 2 ? "max-md:border-t max-md:border-white/15" : ""} ${
                  i === 2 ? "max-md:border-l-0" : ""
                }`}
              >
                <p className="font-heading text-[32px] font-bold leading-none text-white sm:text-[40px] md:text-[56px]">
                  <CountUp
                    end={"target" in s ? (s as { target: number }).target : 20}
                    suffix={"suffix" in s ? (s as { suffix: string }).suffix : "+"}
                  />
                </p>
                <p className="mt-2 font-heading text-[13px] text-white/60 sm:text-[14px] md:mt-3 md:text-[17px]">
                  {s.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
          </div>
        )}
      </div>

      {/* services */}
      {services.length > 0 && (
        <div
          ref={listRef}
          onMouseMove={(e) => {
            if (hovered !== null) setPreviewPos(e.clientX, e.clientY);
          }}
          onMouseLeave={() => setHovered(null)}
          className="relative z-[2] mx-auto mt-16 max-w-[1440px] cursor-pointer md:mt-24"
        >
        {/* floating preview — follows the mouse like the Framer recording.
            Desktop only; mobile uses inline images below. Hidden when
            no service has a preview image. */}
        {hasPreview && (
          <motion.div
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
          >
          <motion.div
            initial={false}
            animate={{
              opacity: hovered !== null ? 1 : 0,
              scale: hovered !== null ? 1 : 0.65,
              rotate: 0,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="-translate-x-[68%] -translate-y-[82%] will-change-transform"
          >
            <div className="relative aspect-[16/10] w-[440px] overflow-hidden rounded-2xl border border-white/20 shadow-[0_40px_120px_-20px_rgba(255,110,60,0.35)]">
              {services.map((s, i) =>
                s.preview ? (
                  <motion.img
                    key={s.index}
                    src={s.preview}
                    alt=""
                    aria-hidden
                    initial={false}
                    animate={{
                      opacity: active === i ? 1 : 0,
                      scale: active === i ? 1 : 1.12,
                    }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null
              )}
            </div>
          </motion.div>
        </motion.div>
        )}

        <div>
          {services.map((s, i) => (
            <motion.div
              key={s.index}
              onMouseEnter={(e) => {
                setPreviewPos(e.clientX, e.clientY, true);
                setHovered(i);
              }}
              onMouseMove={(e) => setPreviewPos(e.clientX, e.clientY)}
              onMouseLeave={() => setHovered(null)}
              onViewportEnter={() => setScrolled(i)}
              viewport={{ margin: "-35% 0px -35% 0px" }}
              className="group grid grid-cols-1 gap-4 border-b border-white/20 py-7 first:border-t sm:py-8 md:py-10 lg:grid-cols-2 lg:gap-12"
            >
              <motion.h3
                initial={{ opacity: 0, y: 56, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-balance font-heading text-[26px] leading-tight tracking-tight text-white transition-transform duration-500 sm:text-[30px] md:text-[42px] lg:group-hover:translate-x-2"
              >
                {s.title}
                <sup className="ml-2 align-super text-[12px] font-normal text-white/50">
                  {s.index}
                </sup>
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.9,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="font-heading text-[16px] font-light leading-[1.65] text-white/80 md:text-[19px]">
                  {s.description}
                </p>
                <p className="mt-4 flex flex-wrap gap-x-2 gap-y-2 font-heading text-[14px] text-white/60 md:text-[16px]">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="border-l border-white/25 pl-3 first:border-l-0 first:pl-0"
                    >
                      # {t}
                    </span>
                  ))}
                </p>
                {/* mobile preview with loading shimmer */}
                {s.preview && (
                  <div className="relative mt-5 overflow-hidden rounded-xl border border-white/10 lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.preview}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full animate-[journey-img-in_0.8s_ease-out] object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
        </div>
      )}
    </section>
  );
}
