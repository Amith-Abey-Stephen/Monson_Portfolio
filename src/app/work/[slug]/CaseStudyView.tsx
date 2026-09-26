"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Wrench,
  Calendar,
  User,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { Project } from "@/data/content";
import type { CaseStudyData } from "@/lib/projects";
import { slugify, getProjectImage } from "@/lib/projects";

export function CaseStudyView({
  caseStudy,
  project,
  prevProject,
  nextProject,
}: {
  caseStudy: CaseStudyData;
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}) {
  const [activeTab, setActiveTab] = useState<"preview" | "system" | "approach">("preview");
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageSrc = getProjectImage(project);

  const prevSlug = prevProject ? slugify(prevProject.name) : null;
  const nextSlug = nextProject ? slugify(nextProject.name) : null;

  return (
    <div className="relative mx-auto max-w-[1300px] px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-24 md:pt-40">
      {/* Top Floating Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6"
      >
        {/* Back Link & Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 font-heading text-[13px] text-white/50">
          <Link
            href="/work"
            className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-medium text-white/80 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All Projects
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/40">{caseStudy.category}</span>
          <span className="text-white/20">/</span>
          <span className="font-medium text-white/90">{caseStudy.title}</span>
        </div>

        {/* External Links if available */}
        <div className="flex items-center gap-2">
          {caseStudy.liveUrl && (
            <a
              href={caseStudy.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[12px] font-medium text-white/80 transition-colors hover:bg-white/12 hover:text-white"
            >
              <ExternalLink size={13} />
              Visit Live
            </a>
          )}
          {caseStudy.behanceUrl && (
            <a
              href={caseStudy.behanceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[12px] font-medium text-white/80 transition-colors hover:bg-white/12 hover:text-white"
            >
              <ExternalLink size={13} />
              Behance
            </a>
          )}
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative">
        {/* Ambient Color Glow matching project accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-[360px] w-[90%] -translate-x-1/2 rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: caseStudy.accent }}
        />

        {/* Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <span
            className="size-2 rounded-full animate-pulse"
            style={{ backgroundColor: caseStudy.accent }}
          />
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-heading text-[12px] font-medium tracking-wide text-white/80 uppercase">
            {caseStudy.category} • {caseStudy.year}
          </span>
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 max-w-4xl"
        >
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-white sm:text-[44px] md:text-[56px] lg:text-[66px] leading-[1.08] sm:leading-[1.05]">
            {caseStudy.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70 sm:text-[18px] md:text-[21px]">
            {caseStudy.tagline}
          </p>
        </motion.div>

        {/* Metadata Specification Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-4 sm:gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-3.5 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-white/40">
              <User size={14} />
              <span className="text-[11px] sm:text-[12px] font-medium tracking-wider uppercase">
                My Role
              </span>
            </div>
            <p className="mt-1.5 font-heading text-[13px] font-semibold text-white sm:text-[15px]">
              {caseStudy.role}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-3.5 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-white/40">
              <Calendar size={14} />
              <span className="text-[11px] sm:text-[12px] font-medium tracking-wider uppercase">
                Timeline
              </span>
            </div>
            <p className="mt-1.5 font-heading text-[13px] font-semibold text-white sm:text-[15px]">
              {caseStudy.timeline} ({caseStudy.year})
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-3.5 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-white/40">
              <Layers size={14} />
              <span className="text-[11px] sm:text-[12px] font-medium tracking-wider uppercase">
                Client / Context
              </span>
            </div>
            <p className="mt-1.5 font-heading text-[13px] font-semibold text-white sm:text-[15px]">
              {caseStudy.client}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-3.5 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-white/40">
              <Wrench size={14} />
              <span className="text-[11px] sm:text-[12px] font-medium tracking-wider uppercase">
                Core Toolkit
              </span>
            </div>
            <p className="mt-1.5 font-heading text-[13px] font-semibold text-white sm:text-[15px]">
              {caseStudy.tools[0] || "Figma"} + {caseStudy.tools[1] || "AI Tools"}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Main Interactive Showcase Display */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="mt-10 sm:mt-12 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-[#0c0c0e] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
      >
        {/* Showcase Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#151518] px-4 py-3 sm:px-8 sm:py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 sm:size-3 rounded-full bg-red-500/70" />
            <span className="size-2.5 sm:size-3 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 sm:size-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-[11px] sm:text-[12px] text-white/40 truncate max-w-[140px] sm:max-w-none">
              {caseStudy.slug}.figma
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-[11px] sm:text-[12px]">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`rounded-full px-2.5 py-1 sm:px-3 font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Mockup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("system")}
              className={`rounded-full px-2.5 py-1 sm:px-3 font-medium transition-colors ${
                activeTab === "system"
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Tokens
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("approach")}
              className={`rounded-full px-2.5 py-1 sm:px-3 font-medium transition-colors ${
                activeTab === "approach"
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              UX Process
            </button>
          </div>
        </div>

        {/* Screen / Showcase Canvas */}
        <div className="relative p-4 sm:p-8 md:p-14">
          {activeTab === "preview" && (
            <div className="mx-auto max-w-5xl">
              {/* Laptop Display Frame */}
              <div className="relative overflow-hidden rounded-t-2xl border border-white/15 border-b-0 bg-black shadow-2xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d12]">
                  {!imgLoaded && (
                    <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={caseStudy.title}
                    onLoad={() => setImgLoaded(true)}
                    className={`h-full w-full object-cover object-top transition-all duration-700 ${
                      imgLoaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
                    }`}
                  />
                </div>
              </div>
              {/* Laptop Base Stand */}
              <div className="relative mx-auto h-[12px] w-[98%] rounded-b-2xl bg-gradient-to-b from-[#2a2a32] to-[#121216]" />
              <div className="mx-auto h-[4px] w-[16%] rounded-b-lg bg-[#3a3a44]" />
            </div>
          )}

          {activeTab === "system" && (
            <div className="mx-auto max-w-4xl py-6">
              <h3 className="font-heading text-[20px] font-semibold text-white">
                Color Palette & Tokens
              </h3>
              <p className="mt-1 text-[14px] text-white/50">
                Design tokens calibrated for high contrast, dark mode harmony, and accessible readability.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {caseStudy.tokens.map((token) => (
                  <div
                    key={token.name}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#16161c] p-3"
                  >
                    <div
                      className="h-16 w-full rounded-lg border border-white/10 shadow-inner"
                      style={{ backgroundColor: token.hex }}
                    />
                    <div className="mt-3">
                      <p className="font-heading text-[13px] font-medium text-white">
                        {token.name}
                      </p>
                      <p className="font-mono text-[11px] text-white/60">
                        {token.hex}
                      </p>
                      <p className="mt-1 text-[11px] text-white/40">
                        {token.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h4 className="font-heading text-[15px] font-semibold text-white">
                  Tools & Production Stack
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {caseStudy.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 text-[12px] font-medium text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "approach" && (
            <div className="mx-auto max-w-4xl py-6">
              <h3 className="font-heading text-[20px] font-semibold text-white">
                {caseStudy.approach.heading}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                {caseStudy.approach.body}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {caseStudy.approach.steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-white/10 bg-[#15151a] p-5"
                  >
                    <span
                      className="font-heading text-[24px] font-bold"
                      style={{ color: caseStudy.accent }}
                    >
                      {step.number}
                    </span>
                    <h4 className="mt-2 font-heading text-[16px] font-semibold text-white">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Case Study Editorial Sections */}
      <section className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Context & Overview */}
        <div className="lg:col-span-7">
          <div className="space-y-12">
            {/* Overview Section */}
            <div>
              <span className="font-mono text-[12px] font-semibold tracking-widest text-white/40 uppercase">
                01 / Project Overview
              </span>
              <h2 className="mt-2 font-heading text-[26px] font-bold text-white sm:text-[32px]">
                The Vision & Purpose
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/70 sm:text-[17px]">
                {caseStudy.overview}
              </p>
            </div>

            {/* The Challenge */}
            <div className="rounded-2xl border border-white/10 bg-[#121216] p-6 sm:p-8">
              <span className="font-mono text-[12px] font-semibold tracking-widest text-white/40 uppercase">
                02 / The Challenge
              </span>
              <h3 className="mt-2 font-heading text-[22px] font-bold text-white sm:text-[26px]">
                {caseStudy.challenge.heading}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                {caseStudy.challenge.body}
              </p>

              {/* Pain Points */}
              <div className="mt-6 space-y-3">
                <p className="text-[13px] font-semibold tracking-wider text-white/40 uppercase">
                  Identified Obstacles & Friction Points
                </p>
                {caseStudy.challenge.painPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-400" />
                    <p className="text-[14px] text-white/80">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <span className="font-mono text-[12px] font-semibold tracking-widest text-white/40 uppercase">
                03 / Deliverables Handed Off
              </span>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {caseStudy.deliverables.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white/80"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0"
                      style={{ color: caseStudy.accent }}
                    />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Features & Measurable Outcomes */}
        <div className="lg:col-span-5">
          <div className="space-y-6">
            {/* Measurable Results Card */}
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#181820] to-[#101015] p-6 sm:p-7 shadow-xl">
              <div className="flex items-center gap-2 text-[12px] font-semibold tracking-widest text-emerald-400 uppercase">
                <TrendingUp size={15} />
                Measurable Impact & Metrics
              </div>

              <div className="mt-6 divide-y divide-white/10">
                {caseStudy.metrics.map((m) => (
                  <div key={m.label} className="py-4 first:pt-0 last:pb-0">
                    <p
                      className="font-heading text-[32px] font-bold sm:text-[38px]"
                      style={{ color: caseStudy.accent }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-0.5 font-heading text-[15px] font-semibold text-white">
                      {m.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/50">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="rounded-2xl border border-white/10 bg-[#121216] p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[12px] font-semibold tracking-widest text-white/40 uppercase">
                <Sparkles size={14} />
                Feature Innovations
              </div>

              <div className="mt-5 space-y-4">
                {caseStudy.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading text-[15px] font-semibold text-white">
                        {feat.title}
                      </h4>
                      <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Project Pagination: Next & Prev Projects */}
      <section className="mt-24 border-t border-white/10 pt-12">
        <div className="flex items-center justify-between text-[13px] text-white/50">
          <span>Explore More Work</span>
          <Link
            href="/work"
            className="flex items-center gap-1 text-white/70 hover:text-white"
          >
            All Case Studies <ChevronRight size={14} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Previous Project */}
          {prevProject && prevSlug && (
            <Link
              href={`/work/${prevSlug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-6 transition-all duration-300 hover:border-white/25 hover:bg-[#16161c]"
            >
              <div className="flex items-center gap-2 text-[12px] text-white/50">
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Previous Project
              </div>
              <div className="mt-4">
                <p className="text-[12px] font-medium text-white/40">
                  {prevProject.tag}
                </p>
                <h4 className="mt-1 font-heading text-[18px] font-bold text-white group-hover:text-white sm:text-[20px]">
                  {prevProject.name}
                </h4>
              </div>
            </Link>
          )}

          {/* Next Project */}
          {nextProject && nextSlug && (
            <Link
              href={`/work/${nextSlug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-6 text-right transition-all duration-300 hover:border-white/25 hover:bg-[#16161c]"
            >
              <div className="flex items-center justify-end gap-2 text-[12px] text-white/50">
                Next Project
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
              <div className="mt-4">
                <p className="text-[12px] font-medium text-white/40">
                  {nextProject.tag}
                </p>
                <h4 className="mt-1 font-heading text-[18px] font-bold text-white group-hover:text-white sm:text-[20px]">
                  {nextProject.name}
                </h4>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Inquiry Call to Action */}
      <section className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#16161a] to-[#0c0c0e] p-8 text-center sm:p-12">
        <div className="relative z-10 mx-auto max-w-xl">
          <span className="font-heading text-[12px] font-semibold tracking-widest text-purple-400 uppercase">
            Let&apos;s Build Together
          </span>
          <h3 className="mt-3 font-heading text-[26px] font-bold text-white sm:text-[34px]">
            Interested in partnering on your next digital experience?
          </h3>
          <p className="mt-2 text-[14px] text-white/60">
            Let&apos;s discuss how intuitive UI/UX design and scalable Figma architectures can transform your product metrics.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#contact"
              className="rounded-full bg-[#f2eee7] px-6 py-2.5 font-heading text-[14px] font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              Schedule Discovery Call
            </a>
            <Link
              href="/work"
              className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 font-heading text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Browse More Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
