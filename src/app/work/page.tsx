import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { GridLines } from "@/components/ui";
import { getPublishedContent } from "@/lib/content";
import { WorkArchive } from "./WorkArchive";
import { ArchiveWatermark } from "./ArchiveWatermark";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const name = content.site.name || "Monson Sunny";
  return {
    title: `Selected Works & Case Studies — ${name}`,
    description: `Browse all UI/UX design projects, mobile apps, SaaS dashboards, and design systems crafted by ${name}.`,
    openGraph: {
      title: `Selected Works & Case Studies — ${name}`,
      description: `Browse all UI/UX design projects, mobile apps, SaaS dashboards, and design systems crafted by ${name}.`,
    },
  };
}

export default async function WorkPage() {
  const content = await getPublishedContent();
  const projects = content.projects ?? [];

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      {/* Background canvas & atmosphere */}
      <SiteCanvas />

      <div className="relative">
        <Navbar data={content} />

        {/* Page Hero Header */}
        <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20">
          <GridLines />

          {/* Parallax ambient typographic watermark */}
          <ArchiveWatermark />

          <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 font-heading text-[13px] text-white/50">
              <Link
                href="/"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} />
                Home
              </Link>
              <ChevronRight size={13} className="text-white/30" />
              <span className="text-white/80">Selected Works</span>
            </div>

            {/* Eyebrow & Status */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-[12px] font-medium text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Portfolio Archive • 2021–2026
              </span>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] sm:text-[12px] font-medium text-white/60">
                {projects.length} Case Studies
              </span>
            </div>

            {/* Headline */}
            <div className="mt-4 max-w-4xl">
              <h1 className="font-heading text-[32px] font-bold tracking-tight text-white sm:text-[48px] md:text-[60px] lg:text-[70px] leading-[1.08] sm:leading-[1.05]">
                Selected Works &{" "}
                <span className="font-script font-normal text-[#e9e1d3] tracking-normal">
                  Case Studies
                </span>
              </h1>
              <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-white/60 sm:text-[17px] md:text-[18px]">
                A curated deep-dive into digital products, responsive web apps, mobile ecosystems, and design architectures crafted with Figma and AI-assisted workflows.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-sm">
                <p className="font-heading text-[22px] font-bold text-white sm:text-[26px]">
                  {projects.length}
                </p>
                <p className="text-[12px] text-white/50">Production Projects</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-sm">
                <p className="font-heading text-[22px] font-bold text-white sm:text-[26px]">
                  4+
                </p>
                <p className="text-[12px] text-white/50">Years Experience</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-sm">
                <p className="font-heading text-[22px] font-bold text-white sm:text-[26px]">
                  100%
                </p>
                <p className="text-[12px] text-white/50">Responsive & Tokenized</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-sm">
                <p className="font-heading text-[22px] font-bold text-[#7CFFB2] sm:text-[26px]">
                  Figma
                </p>
                <p className="text-[12px] text-white/50">& AI-Powered Workflows</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Filterable Projects Grid */}
        <section className="relative pb-24">
          <WorkArchive projects={projects} />
        </section>

        <Footer data={content} />
      </div>
    </main>
  );
}
