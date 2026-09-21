"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { galleryItems as fallbackGallery } from "@/data/content";
import type { SiteContent } from "@/lib/schema";

/**
 * Match to screen recording (2026-09-13):
 * - dusty-rose stage, huge "Gallery" behind, G cut off at left edge
 * - the WHOLE grid is SLANTED ~ -5deg (right side higher) and flies
 *   OVER the heading on scroll: enters from bottom (y + rotateX tilt),
 *   sits flat in the middle, exits up with opposite tilt into black
 * - cards are NOT pre-placed: they start bunched/overlapped in the
 *   centre and fan out SIDEWAYS into their grid slots as you scroll
 *   (edge cards travel furthest, with a slight fan rotation) — then
 *   hold the tight grid (thin pink gaps, small rounding)
 * - rows drift horizontally opposite for subtle parallax
 */

type SideFrom = { x: number; y: number; r: number };

function sideFrom(row: number, i: number, len: number): SideFrom {
  const c = (len - 1) / 2;
  const off = i - c; // e.g. len 4 -> -1.5,-0.5,0.5,1.5
  return {
    // sideways fan: edges travel furthest so neighbours overlap ~50%
    // in the centre at progress 0, then align into the grid
    x: off * 280,
    // edges sit slightly lower + per-row offset for a fanned stack feel
    y: Math.abs(off) * 26 + (row - 1) * 36,
    // fan rotation: left tilts one way, right the other
    r: off * 4.5 + (row - 1) * 1,
  };
}

function Card({
  src,
  title,
  progress,
  from,
  z,
}: {
  src: string;
  title: string;
  progress: MotionValue<number>;
  from: SideFrom;
  z: number;
}) {
  // bunched centre -> aligned grid across the entrance; hold after
  const x = useTransform(progress, [0.02, 0.38], [from.x, 0]);
  const y = useTransform(progress, [0.02, 0.38], [from.y, 0]);
  const rotate = useTransform(progress, [0.02, 0.38], [from.r, 0]);
  const scale = useTransform(progress, [0.02, 0.38], [0.92, 1]);

  return (
    <motion.figure
      style={{ x, y, rotate, scale, zIndex: z }}
      className="relative aspect-[16/10] h-[168px] w-auto shrink-0 overflow-hidden rounded-[10px] bg-[#111] will-change-transform min-[420px]:h-[190px] sm:h-[240px] md:h-[330px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </motion.figure>
  );
}

function Row({
  items,
  row,
  progress,
  x,
}: {
  items: { title: string; image: string }[];
  row: number;
  progress: MotionValue<number>;
  x: MotionValue<number>;
}) {
  return (
    <motion.div style={{ x }} className="flex w-max items-center gap-2.5 px-2">
      {items.map((g, i) => (
        <Card
          key={`${row}-${i}-${g.title}`}
          src={g.image}
          title={g.title}
          progress={progress}
          from={sideFrom(row, i, items.length)}
          z={10 + i}
        />
      ))}
    </motion.div>
  );
}

export function Gallery({
  data,
}: {
  data?: Pick<SiteContent, "galleryItems">;
} = {}) {
  const galleryItems = data?.galleryItems ?? fallbackGallery;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });

  // heading sits BEHIND the cards — parallaxes up + fades as grid flies over
  const headingY = useTransform(scrollYProgress, [0, 0.5, 0.72], [70, -60, -280]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.38, 0.6], [1, 1, 0]);

  // grid as one slanted unit: comes from bottom, holds, goes out the top
  const gridY = useTransform(
    scrollYProgress,
    [0, 0.32, 0.62, 1],
    [340, 0, 0, -300]
  );
  // 3D fly-over tilt: tipped back on entrance, flat in middle, tips away on exit
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.32, 0.62, 1],
    [22, 0, 0, -18]
  );
  const gridScale = useTransform(
    scrollYProgress,
    [0, 0.32, 0.62, 1],
    [0.94, 1, 1, 1.04]
  );
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0.9]
  );

  // opposing horizontal drift per row (subtle parallax while scrolling)
  const xRow1 = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const xRow2 = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const xRow3 = useTransform(scrollYProgress, [0, 1], [70, -70]);

  const row1 = galleryItems.slice(0, 4);
  const row2 = galleryItems.slice(4, 7);
  const row3 = galleryItems.slice(7, 10);

  // Defensive: the fly-over choreography needs a full grid — hide the
  // section entirely when there is nothing meaningful to show.
  if (galleryItems.length < 3) return null;

  return (
    <section ref={ref} aria-label="Design gallery" className="relative overflow-hidden bg-transparent">
      {/* pink stage — long eased ramp from black above into rose
          (no hard edge at the section start), back to black below */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #0d0507 4%, #3a161d 8%, #7c3540 12%, #b84e5d 17%, #d77f89 26%, #df8d97 36%, #df8d97 56%, #b84e5d 78%, #7c3540 84%, #3a161d 89%, #0d0507 94%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="relative">
        {/* heading — z-1, cards fly over it */}
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="relative z-[1] mx-auto max-w-[1600px] overflow-hidden px-2 pt-10 md:pt-16"
        >
          <h2 className="-ml-[2vw] select-none whitespace-nowrap font-heading text-[26vw] font-bold leading-[0.8] tracking-[-0.04em] text-[#f8c2c8]/80 md:text-[19vw]">
            Gallery
          </h2>
        </motion.div>

        {/* perspective wrapper for the 3D fly */}
        <div
          className="relative z-[2] -mt-[4vw] overflow-hidden pb-24 pt-8 md:-mt-[3vw] md:pb-28 md:pt-10"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              y: gridY,
              rotateX,
              scale: gridScale,
              opacity: gridOpacity,
              // constant slant like the recording: right side higher.
              // Shallower on small screens so cards stay in frame.
              rotate: -5,
              transformStyle: "preserve-3d",
            }}
            className="-mx-[6vw] w-[112vw] space-y-2.5 will-change-transform sm:-mx-[10vw] sm:w-[120vw]"
          >
            <Row items={row1} row={0} progress={scrollYProgress} x={xRow1} />
            <Row items={row2} row={1} progress={scrollYProgress} x={xRow2} />
            <Row items={row3} row={2} progress={scrollYProgress} x={xRow3} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
