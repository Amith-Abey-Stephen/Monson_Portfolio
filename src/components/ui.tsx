"use client";

import { motion, useInView } from "motion/react";
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
