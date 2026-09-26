"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Search, Sparkles, Filter, X, ArrowLeft } from "lucide-react";
import type { Project } from "@/data/content";
import { slugify, getProjectImage } from "@/lib/projects";

function LaptopMock({ p }: { p: Project }) {
  const [loaded, setLoaded] = useState(false);
  const imageSrc = getProjectImage(p);

  return (
    <div className="relative overflow-hidden bg-[#0c0c0e] px-4 pt-6 sm:px-6 sm:pt-8 md:px-8 md:pt-10">
      {/* ambient backdrop glow keyed to project accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40"
        style={{
          background: `radial-gradient(80% 70% at 50% 0%, ${p.accent || "#a855f7"}, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-20 bg-black/60 blur-xl" />

      {/* category pill */}
      <span className="absolute left-3 top-3 z-10 rounded-md bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md sm:left-4 sm:top-4 sm:text-[12px]">
        {p.tag}
      </span>

      {/* laptop screen */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-xl border border-white/10 border-b-0 bg-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
            {!loaded && (
              <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={p.name}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.08] ${
                loaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
          </div>
        </div>
        {/* laptop base */}
        <div className="relative mx-auto h-[8px] w-[96%] rounded-b-xl bg-gradient-to-b from-[#2b2b30] to-[#101012]" />
        <div className="mx-auto h-[3px] w-[14%] rounded-b-lg bg-[#333338]" />
      </div>
    </div>
  );
}

export function WorkArchive({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.tag && p.tag.trim()) set.add(p.tag.trim());
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCat =
        activeCategory === "All" ||
        p.tag.toLowerCase().trim() === activeCategory.toLowerCase().trim();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
      {/* Controls Bar: Category Filter Pills & Search Box */}
      <div className="mb-10 flex flex-col gap-4 border-b border-white/[0.08] pb-8 md:flex-row md:items-center md:justify-between">
        {/* Category Tabs with Animated Pill */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All"
                ? projects.length
                : projects.filter(
                    (p) => p.tag.toLowerCase() === cat.toLowerCase()
                  ).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors sm:px-4 sm:py-2 sm:text-[14px] ${
                  isActive ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="workActivePill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[#e9e1d3] shadow-[0_2px_12px_rgba(233,225,211,0.25)]"
                  />
                )}
                <span className="relative z-10">{cat}</span>
                <span
                  className={`relative z-10 text-[11px] font-semibold sm:text-[12px] ${
                    isActive ? "text-black/60" : "text-white/40"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by keyword..."
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-8 text-[13px] text-white placeholder-white/40 backdrop-blur-md transition-colors focus:border-white/30 focus:bg-white/[0.08] focus:outline-none sm:text-[14px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-2.5 flex items-center text-white/40 hover:text-white"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="mb-6 flex items-center justify-between text-[13px] text-white/50">
        <p>
          Showing{" "}
          <span className="font-semibold text-white">
            {filteredProjects.length}
          </span>{" "}
          of {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        {(activeCategory !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="text-[12px] text-white/60 underline underline-offset-4 hover:text-white"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, i) => {
              const slug = slugify(p.name);
              const targetUrl = `/work/${slug}`;

              return (
                <motion.div
                  key={p.name}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={targetUrl}
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#141414] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <LaptopMock p={p} />

                    <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#181818] px-5 py-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: p.accent || "#7CFFB2" }}
                            aria-hidden
                          />
                          <h3 className="truncate font-heading text-[17px] font-semibold text-white sm:text-[19px]">
                            {p.name}
                          </h3>
                        </div>
                        <p className="mt-0.5 truncate text-[13px] text-white/50">
                          {p.description}
                        </p>
                      </div>

                      <span className="group/btn relative inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2 font-heading text-[13px] font-medium text-white transition-all duration-300 group-hover:border-white/35 group-hover:bg-white/[0.10] group-hover:shadow-[0_0_20px_-4px_rgba(255,255,255,0.25)] sm:px-4 sm:text-[14px]">
                        Read Case Study
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-16 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-sm"
        >
          <div className="grid size-12 place-items-center rounded-full bg-white/10 text-white/60">
            <Filter size={22} />
          </div>
          <h3 className="mt-4 font-heading text-[18px] font-semibold text-white">
            No projects found
          </h3>
          <p className="mt-1 max-w-md text-[14px] text-white/50">
            No case studies matched your filter criteria &quot;{searchQuery || activeCategory}&quot;. Try selecting a different category or clearing the search.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="mt-5 rounded-full bg-white/10 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/20"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Bottom Collaboration Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative my-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#18181c] to-[#0d0d10] p-8 text-center sm:p-12 md:p-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.15),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-[12px] font-medium text-purple-300">
            <Sparkles size={13} />
            Available for Select Projects
          </span>
          <h3 className="mt-4 font-heading text-[28px] font-bold tracking-tight text-white sm:text-[36px] md:text-[42px]">
            Ready to design your next breakthrough product?
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
            Whether you need end-to-end mobile UX, a comprehensive Figma design system, or a high-converting web app, let&apos;s build something intuitive and memorable.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#contact"
              className="rounded-full bg-[#f2eee7] px-6 py-3 font-heading text-[14px] font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
            >
              Get in Touch
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 font-heading text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
