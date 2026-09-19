"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects as fallbackProjects, type Project } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines } from "./ui";

function LaptopMock({
  p,
  onHoverChange,
  onMove,
}: {
  p: Project;
  onHoverChange: (v: boolean) => void;
  onMove: (x: number, y: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative overflow-hidden bg-[#0c0c0e] px-5 pt-8 md:px-10 md:pt-10"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onMove(e.clientX - r.left, e.clientY - r.top);
      }}
    >
      {/* studio glow — dark card backdrop like the recording */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-24 bg-black/60 blur-2xl" />

      {/* Website pill — floating top-left over the backdrop */}
      <span className="absolute left-4 top-4 z-10 rounded-md bg-white/[0.08] px-2.5 py-1 text-[12px] font-medium text-white/85 backdrop-blur-md">
        {p.tag}
      </span>

      {/* laptop */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-xl border border-white/10 border-b-0 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
            {/* loading shimmer while the screenshot fades in */}
            {!loaded && p.image && (
              <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />
            )}
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.12] ${
                  loaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
                }`}
              />
            ) : (
              <span
                aria-hidden
                className="grid h-full w-full place-items-center bg-[radial-gradient(80%_90%_at_50%_10%,rgba(255,255,255,0.10),transparent_70%)] font-heading text-[64px] font-bold text-white/25"
              >
                {p.name.charAt(0).toUpperCase()}
              </span>
            )}
            {/* subtle hover shade so the preview pill pops */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
          </div>
        </div>
        {/* laptop base */}
        <div className="relative mx-auto h-[10px] w-[96%] rounded-b-xl bg-gradient-to-b from-[#2b2b30] to-[#101012]" />
        <div className="mx-auto h-[4px] w-[14%] rounded-b-lg bg-[#333338]" />
        {/* desk shadow */}
        <div className="mx-auto mt-1 h-5 w-[80%] rounded-full bg-black/70 blur-xl" />
      </div>
    </div>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [previewHover, setPreviewHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const row = Math.floor(index / 2);
  const href = p.href || "#projects";

  return (
    <motion.div
      initial={{ opacity: 0, y: 64, scale: 0.96, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: (index % 2) * 0.12 + row * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <a
        href={href}
        target={href.startsWith("http") || href.endsWith(".html") ? "_blank" : undefined}
        rel="noreferrer"
        aria-label={`${p.name} — ${p.description}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        onMouseLeave={() => {
          setPreviewHover(false);
          setBtnHover(false);
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        {/* cursor-following preview pill — image zone only, hidden while
            the View button tooltip is active (matches the recording).
            Centered above the cursor so it never clips at card edges. */}
        <motion.div
          aria-hidden
          animate={{ opacity: previewHover && !btnHover ? 1 : 0, scale: previewHover && !btnHover ? 1 : 0.85 }}
          transition={{ duration: 0.22 }}
          className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-[13px] font-medium text-white shadow-xl backdrop-blur-md md:block"
          style={{ left: pos.x, top: pos.y }}
        >
          Click to Preview
        </motion.div>

        <LaptopMock
          p={p}
          onHoverChange={setPreviewHover}
          onMove={(x, y) => {
            // LaptopMock reports image-local coords; offset to card coords
            // is handled by the card-level tracker, this just ensures the
            // pill stays live while over the screen.
            void x;
            void y;
          }}
        />

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#181818] px-4 py-4 sm:px-5 md:px-6">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-[17px] font-semibold text-white sm:text-[18px] md:text-[20px]">
              {p.name}
            </h3>
            <p className="truncate font-heading text-[13px] text-white/50">{p.description}</p>
          </div>
          <span
            className="group/btn relative inline-flex min-h-[44px] shrink-0 items-center gap-1.5 overflow-visible rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 font-heading text-[13px] font-medium text-white transition-all duration-300 group-hover:border-white/35 group-hover:bg-white/[0.10] group-hover:shadow-[0_0_20px_-4px_rgba(255,255,255,0.25)] sm:px-4 sm:text-[14px]"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            View Project
            {/* arrow swap — fires on card hover too (group-hover), not
                just direct button hover: old slides out up-right, new
                slides in from bottom-left */}
            <span className="relative grid size-[17px] place-items-center overflow-hidden" aria-hidden>
              <ArrowUpRight
                size={17}
                className="absolute transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4 group-hover:opacity-0"
              />
              <ArrowUpRight
                size={17}
                className="absolute translate-y-4 -translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </span>
            {/* live-project tooltip — sits ABOVE the button (inside the
                card's overflow bounds) so it is never clipped */}
            <motion.span
              aria-hidden
              animate={{ opacity: btnHover ? 1 : 0, y: btnHover ? 0 : 6 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/90 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xl backdrop-blur-md"
            >
              Visit Live Project
            </motion.span>
          </span>
        </div>
      </a>
    </motion.div>
  );
}

export function Projects({
  data,
}: {
  data?: Pick<SiteContent, "projects">;
} = {}) {
  const projects = data?.projects ?? fallbackProjects;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });
  // ghost title drifts slower than the cards — parallax like the recording
  const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0, 1, 1, 0.4]);

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      ref={ref}
      className="relative -mt-px scroll-mt-24 overflow-hidden bg-[#0a0a0c] px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-20 md:pt-16"
    >
      {/* top starts in the same #0a0a0c the About melt ends in —
          no band, no line; the mix already happened above */}
      <GridLines />
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="ghost-huge pointer-events-none absolute -top-4 left-0 text-[27vw] md:text-[15vw]"
      >
        Projects
      </motion.span>
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-5 pt-[13vw] md:grid-cols-2 md:gap-6 md:pt-[7.5vw]">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
