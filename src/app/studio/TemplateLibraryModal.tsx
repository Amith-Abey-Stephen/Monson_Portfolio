"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Sparkles,
  Plus,
  Check,
  Search,
  Cpu,
  CreditCard,
  Trophy,
  Briefcase,
  MessagesSquare,
  Images,
  CircleHelp,
  Workflow,
  LayoutGrid,
  Layers,
} from "lucide-react";
import type { SectionKey, CustomSectionTemplate } from "@/lib/schema";

export type CustomSectionTemplateInfo = {
  template: CustomSectionTemplate;
  name: string;
  description: string;
  defaultBgColor: "violet" | "blue" | "emerald" | "amber" | "rose" | "cyan";
  defaultNavLabel: string;
};

export const CUSTOM_SECTION_TEMPLATES: CustomSectionTemplateInfo[] = [
  {
    template: "text-story",
    name: "Text / Story",
    description: "Clean editorial storytelling layout with headline, lead-in, and narrative paragraphs.",
    defaultBgColor: "violet",
    defaultNavLabel: "Story",
  },
  {
    template: "image-text",
    name: "Image + Text",
    description: "Visual storytelling with a side-by-side featured photo or graphic and narrative text.",
    defaultBgColor: "cyan",
    defaultNavLabel: "Focus",
  },
  {
    template: "cards-grid",
    name: "Cards / Grid",
    description: "Multi-item grid layout perfect for principles, services, articles, or side projects.",
    defaultBgColor: "emerald",
    defaultNavLabel: "Principles",
  },
  {
    template: "metrics",
    name: "Metrics / Highlights",
    description: "Prominent statistics and numerical milestones that quantify your impact.",
    defaultBgColor: "blue",
    defaultNavLabel: "Impact",
  },
  {
    template: "quote-testimonial",
    name: "Quote / Testimonial",
    description: "Typography-led featured quote or client endorsement with attribution.",
    defaultBgColor: "amber",
    defaultNavLabel: "Quote",
  },
  {
    template: "cta",
    name: "CTA / Callout",
    description: "High-impact call-to-action banner driving visitors to take action or get in touch.",
    defaultBgColor: "rose",
    defaultNavLabel: "CTA",
  },
];

export type SectionTemplate = {
  key: SectionKey;
  name: string;
  category: "Offerings" | "Workflow" | "Technical" | "Commercial" | "Credibility" | "Portfolio" | "Content";
  description: string;
  animationType: string;
  features: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    key: "services",
    name: "Services & Capabilities",
    category: "Offerings",
    description: "High-impact spotlight cards detailing core design offerings, custom deliverable tags, and interactive previews.",
    animationType: "3D Spotlight & ScrollWipe Heading",
    features: ["Interactive ambient spotlight", "Custom deliverable tags", "Hover preview triggers", "Responsive 2-column grid"],
    icon: Sparkles,
  },
  {
    key: "process",
    name: "Process & Methodology",
    category: "Workflow",
    description: "Multi-step timeline showcasing your end-to-end design framework from strategy to developer handoff.",
    animationType: "ScrollReveal Stagger & Micro-arrow Transitions",
    features: ["Interactive numbered stages", "Key milestone bullets", "Step-by-step progress cards", "Clear deliverables per phase"],
    icon: Workflow,
  },
  {
    key: "techstack",
    name: "Tech Stack & Tools",
    category: "Technical",
    description: "Grid of design software, prototyping engines, frontend frameworks, and proficiency ratings.",
    animationType: "Card Hover Lift & Glowing Accents",
    features: ["Category categorization", "Proficiency tags (Expert, Advanced)", "Fluid responsive cards", "Modern icon wrappers"],
    icon: Cpu,
  },
  {
    key: "pricing",
    name: "Pricing & Packages",
    category: "Commercial",
    description: "Transparent engagement tier cards with highlighted 'Most Popular' package and direct booking buttons.",
    animationType: "Gradient Shimmer Border & Scaled Hover",
    features: ["Featured tier glow border", "Deliverable feature checklist", "Direct Calendly/Contact CTAs", "Responsive 3-column deck"],
    icon: CreditCard,
  },
  {
    key: "awards",
    name: "Awards & Recognition",
    category: "Credibility",
    description: "Honors and design award showcase celebrating industry recognition, client achievements, and press.",
    animationType: "Row Hover Glow & Ambient Backlight",
    features: ["Year badges", "Organizing body citations", "External verified links", "Clean responsive list"],
    icon: Trophy,
  },
  {
    key: "projects",
    name: "Work / Projects",
    category: "Portfolio",
    description: "Featured case studies with custom hero imagery, metadata tags, and external links.",
    animationType: "Curtain wipe & Parallax image tilt",
    features: ["16:10 case study previews", "Behance & live URL links", "Custom accent color badges"],
    icon: Briefcase,
  },
  {
    key: "testimonials",
    name: "Client Testimonials",
    category: "Credibility",
    description: "Quotes and recommendations from founders, CTOs, and product leaders.",
    animationType: "Subtle pulse & quotation marks reveal",
    features: ["Author name and role tags", "Clean quote presentation", "High-credibility cards"],
    icon: MessagesSquare,
  },
  {
    key: "gallery",
    name: "Visual Gallery",
    category: "Portfolio",
    description: "Visual exploration grid displaying high-fidelity mobile and web UI shots.",
    animationType: "Zoom on hover & lightbox trigger",
    features: ["Flexible image assets", "Responsive multi-column view", "Asset title overlays"],
    icon: Images,
  },
  {
    key: "faq",
    name: "Frequently Asked Questions",
    category: "Content",
    description: "Accordion style FAQ answering common questions about engagement, timelines, and rates.",
    animationType: "Smooth height expand & chevron rotate",
    features: ["Ghost huge title integration", "Clean collapsible answers", "Zero leak when hidden"],
    icon: CircleHelp,
  },
];

export function TemplatePreview({ sectionKey }: { sectionKey: SectionKey }) {
  switch (sectionKey) {
    case "services":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-3 text-white shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-purple-400 font-mono">
            <span>{"// 01 CAPABILITIES"}</span>
            <span className="rounded-full bg-purple-500/20 px-1.5 py-0.2 text-[8.5px] font-semibold text-purple-300">3D Spotlight</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border border-purple-500/30 bg-white/[0.04] p-2">
              <span className="font-mono text-[9px] text-purple-400 font-bold">{"// 01"}</span>
              <p className="mt-0.5 text-[11px] font-bold text-white leading-tight">Product Design</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded bg-white/10 px-1 py-0.2 text-[8px] text-white/70">Figma</span>
                <span className="rounded bg-white/10 px-1 py-0.2 text-[8px] text-white/70">Tokens</span>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
              <span className="font-mono text-[9px] text-purple-400 font-bold">{"// 02"}</span>
              <p className="mt-0.5 text-[11px] font-bold text-white leading-tight">Design Systems</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded bg-white/10 px-1 py-0.2 text-[8px] text-white/70">Components</span>
                <span className="rounded bg-white/10 px-1 py-0.2 text-[8px] text-white/70">Specs</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "process":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-3 text-white shadow-inner">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-purple-400">01</span>
                <span className="text-[10px] text-purple-400">→</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-white leading-tight">Discovery</p>
              <p className="mt-1 text-[8.5px] text-purple-300 font-medium">✓ Product Brief</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-purple-400">02</span>
                <span className="text-[10px] text-purple-400">→</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-white leading-tight">Wireframes</p>
              <p className="mt-1 text-[8.5px] text-purple-300 font-medium">✓ UX Flows</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] text-white/50 border-t border-white/10 pt-1.5">
            <span>4-step progressive timeline cards</span>
            <span className="text-purple-400 font-semibold">Interactive Flow</span>
          </div>
        </div>
      );

    case "techstack":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-2.5 text-white shadow-inner">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                <span className="text-[11px] font-semibold text-white">Figma</span>
              </div>
              <span className="rounded bg-purple-500/20 px-1 py-0.2 text-[8px] font-semibold text-purple-300">Expert</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                <span className="text-[11px] font-semibold text-white">Framer</span>
              </div>
              <span className="rounded bg-purple-500/20 px-1 py-0.2 text-[8px] font-semibold text-purple-300">Advanced</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                <span className="text-[11px] font-semibold text-white">Tailwind</span>
              </div>
              <span className="rounded bg-purple-500/20 px-1 py-0.2 text-[8px] font-semibold text-purple-300">Expert</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                <span className="text-[11px] font-semibold text-white">Spline 3D</span>
              </div>
              <span className="rounded bg-purple-500/20 px-1 py-0.2 text-[8px] font-semibold text-purple-300">Advanced</span>
            </div>
          </div>
        </div>
      );

    case "pricing":
      return (
        <div className="relative overflow-hidden rounded-xl border border-purple-500/40 bg-[#0c0a14] p-3 text-white shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-bold text-white">Full Product MVP</span>
            <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-xs">
              ★ Popular
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-[17px] font-extrabold text-white">$6,500</span>
            <span className="text-[9px] text-white/50">/ project</span>
          </div>
          <div className="mt-1.5 space-y-0.5 text-[9.5px] text-white/70">
            <div className="flex items-center gap-1">
              <span className="text-purple-400 font-bold">✓</span>
              <span>Full UI/UX Design System</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-400 font-bold">✓</span>
              <span>Developer Specs & Tokens</span>
            </div>
          </div>
          <div className="mt-2 rounded-lg bg-purple-600 py-1 text-center text-[10px] font-bold text-white">
            Book Package →
          </div>
        </div>
      );

    case "awards":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-2.5 text-white shadow-inner space-y-1.5">
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2 py-1.5 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400">2024</span>
              <span className="text-[11px] font-semibold text-white">Best Mobile Experience</span>
            </div>
            <span className="text-[9px] text-amber-300 font-medium">Award ↗</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2 py-1.5 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400">2023</span>
              <span className="text-[11px] font-semibold text-white">Featured UI Designer</span>
            </div>
            <span className="text-[9px] text-amber-300 font-medium">Award ↗</span>
          </div>
        </div>
      );

    case "projects":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-2.5 text-white shadow-inner">
          <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-purple-950/60 via-stone-900 to-black border border-white/10 p-2.5 flex flex-col justify-end">
            <span className="text-[8.5px] font-semibold uppercase tracking-wider text-purple-400">FinTech Platform</span>
            <p className="font-heading text-[12px] font-bold text-white">Global Wealth Management</p>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/50">
            <span>16:10 Case Study View</span>
            <span className="text-purple-400 font-medium">Live Demo ↗</span>
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-3 text-white shadow-inner">
          <p className="text-[10.5px] italic text-white/80 leading-snug">
            &ldquo;Monson designed a breathtaking product for our Series A launch. Intuitive and polished.&rdquo;
          </p>
          <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-1.5">
            <div className="size-5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold grid place-items-center">
              A
            </div>
            <div>
              <p className="text-[9.5px] font-bold text-white leading-tight">Alex Rivera</p>
              <p className="text-[8px] text-white/50 leading-tight">VP Product @ ScaleFlow</p>
            </div>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-2.5 text-white shadow-inner">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-10 rounded bg-gradient-to-br from-purple-800/40 to-black border border-white/10" />
            <div className="h-10 rounded bg-gradient-to-br from-indigo-800/40 to-black border border-white/10" />
            <div className="h-10 rounded bg-gradient-to-br from-pink-800/40 to-black border border-white/10" />
          </div>
          <p className="mt-1.5 text-center text-[9px] text-white/50">Visual exploration masonry grid</p>
        </div>
      );

    case "faq":
      return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-2.5 text-white shadow-inner space-y-1.5">
          <div className="rounded-lg bg-white/[0.04] p-2 border border-white/5 flex items-center justify-between">
            <span className="text-[10.5px] font-semibold text-white">What is your turnaround time?</span>
            <span className="text-[9px] text-purple-400">▾</span>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-2 border border-white/5 flex items-center justify-between">
            <span className="text-[10.5px] font-semibold text-white">How do we collaborate on Figma?</span>
            <span className="text-[9px] text-purple-400">▾</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: string[];
  onAddSection: (key: SectionKey) => void;
  onAddCustomSection?: (template: CustomSectionTemplate) => void;
  onNavigateToSection: (key: SectionKey) => void;
}

const PREBUILT_CATEGORIES = ["All", "Offerings", "Workflow", "Technical", "Commercial", "Credibility", "Portfolio", "Content"] as const;

export function TemplateLibraryModal({
  isOpen,
  onClose,
  order,
  onAddSection,
  onAddCustomSection,
  onNavigateToSection,
}: TemplateLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"custom" | "prebuilt">("custom");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  // Keyboard shortcut to close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTemplates = useMemo(() => {
    return SECTION_TEMPLATES.filter((tmpl) => {
      const matchCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q) ||
        tmpl.features.some((f) => f.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose a section template"
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Dialog Card matching user's clean cream/stone aesthetic */}
      <div
        data-lenis-prevent="true"
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] h-[88vh] rounded-3xl bg-[#f6f3ee] shadow-2xl border border-stone-300/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-200/90 px-6 sm:px-8 py-5 bg-[#f6f3ee]">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] sm:text-[19px] font-extrabold text-stone-900 tracking-wider uppercase font-heading">
              CHOOSE A SECTION TEMPLATE
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid size-9 place-items-center rounded-full text-stone-400 hover:bg-stone-200/70 hover:text-stone-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch between Modular Formats & Pre-built Sections */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-200/70 px-6 sm:px-8 py-2.5 bg-[#f1ece3]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${
                activeTab === "custom"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <LayoutGrid size={14} className={activeTab === "custom" ? "text-[#f95721]" : "text-stone-400"} />
              <span>Modular Section Formats (6)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prebuilt")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${
                activeTab === "prebuilt"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers size={14} className={activeTab === "prebuilt" ? "text-purple-600" : "text-stone-400"} />
              <span>Pre-built Showcase Sections (9)</span>
            </button>
          </div>

          {activeTab === "prebuilt" && (
            <div className="relative min-w-[180px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white py-1 pl-8 pr-3 text-[12px] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 min-h-0 overflow-y-scroll studio-modal-scroll p-6 sm:p-8"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
        >
          {activeTab === "custom" ? (
            /* EXACT 6 MODULAR TEMPLATES FROM USER SCREENSHOT */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
              {CUSTOM_SECTION_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.template}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-stone-300"
                >
                  <div>
                    <h3 className="text-[17px] font-bold text-stone-900 tracking-tight">
                      {tmpl.name}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-stone-500">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddCustomSection) {
                          onAddCustomSection(tmpl.template);
                        }
                        onClose();
                      }}
                      className="group inline-flex items-center justify-between w-full text-[13.5px] font-semibold text-[#f95721] hover:text-[#d8400f] transition cursor-pointer"
                    >
                      <span>Use template</span>
                      <Plus size={16} className="transition-transform group-hover:scale-125" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* PREBUILT SHOWCASE TEMPLATES (Services, Process, Tech Stack, Pricing, Awards, etc.) */
            <div>
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-5">
                {PREBUILT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition ${
                        isSelected
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
                    <Search size={22} />
                  </span>
                  <p className="text-[15px] font-bold text-stone-800">No template models found</p>
                  <p className="mt-1 text-[12.5px] text-stone-400 max-w-sm">
                    No sections matched &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
                  {filteredTemplates.map((tmpl) => {
                    const isAdded = order.includes(tmpl.key);
                    const IconComp = tmpl.icon;
                    return (
                      <div
                        key={tmpl.key}
                        className={`flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                          isAdded
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-stone-200 bg-white hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80 shadow-xs">
                                <IconComp size={18} />
                              </span>
                              <div>
                                <h4 className="text-[15px] font-bold text-stone-900 leading-tight">{tmpl.name}</h4>
                                <span className="text-[11px] font-medium text-stone-400">{tmpl.category}</span>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[10.5px] font-medium text-purple-700">
                              <Sparkles size={10} className="text-purple-500" />
                              <span>{tmpl.animationType}</span>
                            </span>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                              <span>Live Design Preview</span>
                              <span className="text-[9.5px] text-purple-600 font-medium">Dark Canvas Mode</span>
                            </div>
                            <TemplatePreview sectionKey={tmpl.key} />
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-stone-100">
                          {isAdded ? (
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
                                <Check size={14} /> Active on portfolio
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onNavigateToSection(tmpl.key);
                                }}
                                className="text-[12px] font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                              >
                                Edit section content →
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onAddSection(tmpl.key);
                                onClose();
                              }}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-[13px] font-semibold text-white hover:bg-stone-800 shadow-sm transition"
                            >
                              <Plus size={15} />
                              <span>Add to Portfolio</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-stone-200/90 bg-[#f6f3ee] px-6 sm:px-8 py-3 text-[12px] text-stone-500">
          <div>
            {activeTab === "custom" ? (
              <span className="font-semibold text-stone-700">
                6 Modular section templates available · Select any to add instantly
              </span>
            ) : (
              <span className="font-semibold text-stone-700">
                {filteredTemplates.length} of {SECTION_TEMPLATES.length} pre-built sections
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToTop}
              title="Scroll to top"
              className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>↑ Top</span>
            </button>
            <button
              type="button"
              onClick={scrollToBottom}
              title="Scroll to bottom"
              className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>↓ Bottom</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
