"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { projects as fallbackProjects, type Project } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { slugify, getProjectImage } from "@/lib/projects";
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
  const imageSrc = getProjectImage(p);

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
      {/* studio glow — dark card backdrop with project accent hint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: `radial-gradient(80% 70% at 50% 0%, ${p.accent || "rgba(255,255,255,0.12)"}, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-24 bg-black/60 blur-2xl" />

      {/* Website / Category pill — floating top-left over the backdrop */}
      <span className="absolute left-4 top-4 z-10 rounded-md bg-white/[0.08] px-2.5 py-1 text-[12px] font-medium text-white/85 backdrop-blur-md">
        {p.tag}
      </span>

      {/* laptop mockup */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-xl border border-white/10 border-b-0 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
            {/* loading shimmer while the screenshot fades in */}
            {!loaded && (
              <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={p.name}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.10] ${
                loaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
              }`}
            />
            {/* subtle hover shade */}
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

  const isExternal = Boolean(p.href && p.href.startsWith("http"));
  const slug = slugify(p.name);
  const href = isExternal ? p.href : `/work/${slug}`;

  const CardWrapper = isExternal ? "a" : Link;

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
      <CardWrapper
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
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
        {/* cursor-following preview pill */}
        <motion.div
          aria-hidden
          animate={{
            opacity: previewHover && !btnHover ? 1 : 0,
            scale: previewHover && !btnHover ? 1 : 0.85,
          }}
          transition={{ duration: 0.22 }}
          className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-[13px] font-medium text-white shadow-xl backdrop-blur-md md:block"
          style={{ left: pos.x, top: pos.y }}
        >
          View Case Study
        </motion.div>

        <LaptopMock
          p={p}
          onHoverChange={setPreviewHover}
          onMove={(x, y) => {
            void x;
            void y;
          }}
        />

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#181818] px-4 py-4 sm:px-5 md:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: p.accent || "#7CFFB2" }}
                aria-hidden
              />
              <h3 className="truncate font-heading text-[17px] font-semibold text-white sm:text-[18px] md:text-[20px]">
                {p.name}
              </h3>
            </div>
            <p className="truncate font-heading text-[13px] text-white/50">{p.description}</p>
          </div>
          <span
            className="group/btn relative inline-flex min-h-[44px] shrink-0 items-center gap-1.5 overflow-visible rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 font-heading text-[13px] font-medium text-white transition-all duration-300 group-hover:border-white/35 group-hover:bg-white/[0.10] group-hover:shadow-[0_0_20px_-4px_rgba(255,255,255,0.25)] sm:px-4 sm:text-[14px]"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {isExternal ? "Live Project" : "Case Study"}
            {/* arrow swap */}
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
            {/* live-project tooltip */}
            <motion.span
              aria-hidden
              animate={{ opacity: btnHover ? 1 : 0, y: btnHover ? 0 : 6 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/90 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-xl backdrop-blur-md"
            >
              {isExternal ? "Visit Live Site" : "Explore Case Study"}
            </motion.span>
          </span>
        </div>
      </CardWrapper>
    </motion.div>
  );
}

export function Projects({
  data,
  limit = 4,
  showViewMore = true,
}: {
  data?: Pick<SiteContent, "projects">;
  limit?: number;
  showViewMore?: boolean;
} = {}) {
  const projects = data?.projects ?? fallbackProjects;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });

  // ghost title drifts slower than the cards — parallax
  const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0, 1, 1, 0.4]);

  if (projects.length === 0) return null;

  // On the landing page, prioritize explicitly featured projects from Studio,
  // filling any remaining slots up to `limit` with the existing list order
  const explicitFeatured = projects.filter((p) => p.featured);
  const displayProjects = (
    explicitFeatured.length > 0
      ? [
          ...explicitFeatured,
          ...projects.filter((p) => !p.featured),
        ]
      : projects
  ).slice(0, limit);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative -mt-px scroll-mt-24 overflow-hidden bg-[#0a0a0c] px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-24 md:pt-16"
    >
      <GridLines />
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="ghost-huge pointer-events-none absolute -top-4 left-0 text-[27vw] md:text-[15vw]"
      >
        Projects
      </motion.span>

      {/* 2-column Projects Grid */}
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-5 pt-[13vw] md:grid-cols-2 md:gap-6 md:pt-[7.5vw]">
        {displayProjects.map((p, i) => (
          <ProjectCard key={p.name} p={p} index={i} />
        ))}
      </div>

      {/* View More Option Section (Landing Page) */}
      {showViewMore && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-10 max-w-[1440px] md:mt-12"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:border-white/20 sm:p-8 md:p-10">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#a855f7]/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-[#7c3aed]/12 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-5 sm:gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-purple-400">
                    <span className="size-2 animate-ping rounded-full bg-purple-400 opacity-75" />
                  </span>
                  <span className="text-[12px] font-semibold tracking-wider text-purple-300 uppercase">
                    Showing 4 of {projects.length} Selected Works
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-[20px] font-bold text-white sm:text-[26px] md:text-[30px]">
                  Explore the Complete Design Archive
                </h3>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-white/55 sm:text-[15px]">
                  Browse in-depth case studies covering mobile UX, SaaS analytics dashboards, AI assistants, and enterprise design systems.
                </p>
              </div>

              {/* View More CTA Button */}
              <Link
                href="/work"
                className="group/btn relative inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-[#f2eee7] px-6 py-3.5 font-heading text-[14px] font-semibold text-black shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_40px_-8px_rgba(255,255,255,0.45)] sm:px-8 sm:text-[15px]"
              >
                <span>View All Projects ({projects.length})</span>
                <span className="relative grid size-5 place-items-center overflow-hidden" aria-hidden>
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
