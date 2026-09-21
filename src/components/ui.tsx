"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  distance = 48,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({
  children,
  as = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "div" | "p";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      ref={ref as never}
      initial={{ opacity: 0, y: 56, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Scroll-triggered block wipe + gentle rise for primary section
 * headings — the same solid-block sweep as the hero load-in, played
 * once when the section is reached (never on site load). Pass a
 * different `direction` per heading so no two wipes match.
 * Use sparingly: one heading per section max.
 */
export function ScrollWipe({
  children,
  as = "div",
  className,
  delay = 0,
  direction = "right",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "div" | "p";
  className?: string;
  delay?: number;
  /** side the block travels toward — vary per heading so no two wipes match */
  direction?: "right" | "left" | "down" | "up";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }
  const from =
    direction === "left"
      ? { x: "102%" }
      : direction === "down"
        ? { y: "-102%" }
        : direction === "up"
          ? { y: "102%" }
          : { x: "-102%" };
  const to =
    direction === "left"
      ? { x: "-102%" }
      : direction === "down"
        ? { y: "102%" }
        : direction === "up"
          ? { y: "-102%" }
          : { x: "102%" };
  return (
    <Tag
      initial={{ y: 48 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <span className="relative inline-block overflow-hidden align-top">
        <motion.span
          aria-hidden
          initial={from}
          whileInView={to}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: delay + 0.1, duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 z-10 block bg-white"
        />
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: delay + 0.4, duration: 0.35, ease: "easeOut" }}
          className="relative block"
        >
          {children}
        </motion.span>
      </span>
    </Tag>
  );
}

/**
 * Scroll-triggered tile cover — a grid of dark rectangles that slide
 * away diagonally staggered to unveil the content beneath, like the
 * hero's load-in blocks. Plays once when scrolled into view.
 * Use sparingly: one per visual grid max (Projects, marquee).
 */
export function ScrollBlocks({
  cols = 6,
  rows = 3,
  className,
  tileClassName = "bg-[#0a0a0c]",
  delay = 0,
  direction = "right",
}: {
  cols?: number;
  rows?: number;
  className?: string;
  tileClassName?: string;
  delay?: number;
  /** side the tiles slide out toward */
  direction?: "right" | "left" | "up" | "down";
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const slide =
    direction === "left"
      ? { x: "-102%" }
      : direction === "up"
        ? { y: "-102%" }
        : direction === "down"
          ? { y: "102%" }
          : { x: "102%" };
  return (
    <div
      aria-hidden
      className={`pointer-events-none grid overflow-hidden ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const d = delay + (col + row) * 0.05;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0 }}
            whileInView={{ opacity: 0, ...slide }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              x: { delay: d, duration: 0.55, ease: [0.76, 0, 0.24, 1] },
              y: { delay: d, duration: 0.55, ease: [0.76, 0, 0.24, 1] },
              opacity: { delay: d + 0.35, duration: 0.2, ease: "easeOut" },
            }}
            className={tileClassName}
          />
        );
      })}
    </div>
  );
}

export function MagneticButton({
  children,
  className,
  href,
  strength = 0.22,
  target,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  target?: string;
}) {
  // Matched to the Framer recording: hero CTAs stay perfectly fixed.
  // No JS translate on hover (the old magnetic pull made the button
  // chase the cursor, so it flickered — disappeared / re-appeared —
  // when the cursor sat on its edge). Only a stable CSS brighten.
  void strength;
  const isExternal = target === "_blank";
  return (
    <motion.a
      href={href}
      target={target}
      rel={isExternal ? "noreferrer" : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={className}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.a>
  );
}

export function GridLines({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 md:grid-cols-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`border-l border-white/[0.08] last:border-r ${
              i > 3 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
