"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ArchiveWatermark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef as never,
    offset: ["start end", "end start"],
  });

  // Parallax translation: drifts gracefully as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [30, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0.9, 1, 0.9, 0.4]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-6 select-none overflow-hidden sm:-top-10 md:-top-14"
    >
      <motion.div
        style={{ y, opacity }}
        className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-10"
      >
        <span
          className="block font-heading font-black leading-none tracking-tighter text-white/[0.24] [text-shadow:0_0_80px_rgba(255,255,255,0.12)] text-[32vw] sm:text-[24vw] md:text-[17vw] lg:text-[15vw]"
          style={{
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.38)",
            color: "rgba(255, 255, 255, 0.22)",
          }}
        >
          Archive
        </span>
      </motion.div>
    </div>
  );
}
