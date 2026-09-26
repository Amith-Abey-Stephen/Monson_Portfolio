"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SectionKey, SiteContent } from "@/lib/schema";
import { SECTION_LABELS } from "@/lib/schema";
import {
  X,
  RotateCcw,
  Send,
  ArrowRight,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { TabId } from "./StudioApp";

// Map TOP_KEYS to friendly section names and tabs
const KEY_INFO: Record<string, { label: string; tab: TabId; iconName?: string }> = {
  site: { label: "Site Identity & Contact", tab: "contact" },
  navLinks: { label: "Navigation Links", tab: "sections" },
  hero: { label: "Hero Header", tab: "hero" },
  clientLogos: { label: "Client Logos (Text)", tab: "site-settings" },
  logoImages: { label: "Client Logos (Images)", tab: "site-settings" },
  aboutIntro: { label: "Intro Section", tab: "intro" },
  journey: { label: "Journey Header", tab: "journey" },
  stats: { label: "Key Statistics", tab: "journey" },
  services: { label: "Services & Capabilities", tab: "services" },
  process: { label: "Process & Workflow", tab: "process" },
  techstack: { label: "Tech Stack & Tools", tab: "techstack" },
  pricing: { label: "Pricing & Packages", tab: "pricing" },
  awards: { label: "Awards & Honors", tab: "awards" },
  projects: { label: "Featured Projects", tab: "work" },
  galleryItems: { label: "Visual Gallery", tab: "gallery" },
  quote: { label: "Quote Section", tab: "quote" },
  about: { label: "About Bio & Skills", tab: "about" },
  testimonials: { label: "Testimonials", tab: "testimonials" },
  faqs: { label: "Frequently Asked Questions", tab: "faq" },
  socials: { label: "Social Media Links", tab: "contact" },
  seo: { label: "SEO & Social Sharing", tab: "seo" },
  sections: { label: "Sections Order & Visibility", tab: "sections" },
};

export type ChangeDiffItem = {
  field: string;
  before: string;
  after: string;
  type?: "modify" | "add" | "remove";
};

/**
 * Generate human-readable diff items between draft and published snapshot for a given top-level key.
 */
export function generateDiffsForKey(
  key: string,
  draftVal: unknown,
  liveVal: unknown
): ChangeDiffItem[] {
  if (draftVal === undefined && liveVal === undefined) return [];

  // Special handling for sections order & visibility
  if (key === "sections") {
    const dSec = draftVal as { order?: SectionKey[]; visible?: Record<string, boolean> } | undefined;
    const lSec = liveVal as { order?: SectionKey[]; visible?: Record<string, boolean> } | undefined;
    const diffs: ChangeDiffItem[] = [];

    // Check order changes
    const dOrder = dSec?.order ?? [];
    const lOrder = lSec?.order ?? [];
    if (JSON.stringify(dOrder) !== JSON.stringify(lOrder)) {
      const added = dOrder.filter((k) => !lOrder.includes(k));
      const removed = lOrder.filter((k) => !dOrder.includes(k));
      if (added.length > 0) {
        diffs.push({
          field: "Added sections",
          before: "—",
          after: added.map((k) => SECTION_LABELS[k] ?? k).join(", "),
          type: "add",
        });
      }
      if (removed.length > 0) {
        diffs.push({
          field: "Removed sections",
          before: removed.map((k) => SECTION_LABELS[k] ?? k).join(", "),
          after: "—",
          type: "remove",
        });
      }
      if (added.length === 0 && removed.length === 0) {
        diffs.push({
          field: "Section sequence",
          before: `${lOrder.length} sections in previous order`,
          after: `${dOrder.length} sections reordered`,
          type: "modify",
        });
      }
    }

    // Check visibility changes
    const dVis = dSec?.visible ?? {};
    const lVis = lSec?.visible ?? {};
    const allVisKeys = Array.from(new Set([...Object.keys(dVis), ...Object.keys(lVis)])) as SectionKey[];
    for (const vk of allVisKeys) {
      const dv = dVis[vk] !== false;
      const lv = lVis[vk] !== false;
      if (dv !== lv) {
        diffs.push({
          field: `${SECTION_LABELS[vk] ?? vk} visibility`,
          before: lv ? "Shown on live site" : "Hidden on live site",
          after: dv ? "Shown on live site" : "Hidden on live site",
          type: dv ? "add" : "remove",
        });
      }
    }
    return diffs;
  }

  // Handle Array fields (projects, services, process, techstack, pricing, awards, testimonials, faqs, stats, etc.)
  if (Array.isArray(draftVal) || Array.isArray(liveVal)) {
    const dArr = Array.isArray(draftVal) ? (draftVal as Record<string, unknown>[]) : [];
    const lArr = Array.isArray(liveVal) ? (liveVal as Record<string, unknown>[]) : [];
    const diffs: ChangeDiffItem[] = [];

    if (dArr.length !== lArr.length) {
      diffs.push({
        field: "Total items count",
        before: `${lArr.length} ${lArr.length === 1 ? "item" : "items"}`,
        after: `${dArr.length} ${dArr.length === 1 ? "item" : "items"} (${
          dArr.length > lArr.length ? `+${dArr.length - lArr.length} added` : `-${lArr.length - dArr.length} removed`
        })`,
        type: dArr.length > lArr.length ? "add" : "remove",
      });
    }

    // Inspect individual items for modified text
    const maxLen = Math.max(dArr.length, lArr.length);
    for (let i = 0; i < maxLen; i++) {
      const dItem = dArr[i];
      const lItem = lArr[i];

      if (!lItem && dItem) {
        const title = (dItem.name || dItem.title || dItem.q || dItem.label || `Item ${i + 1}`) as string;
        diffs.push({
          field: `Added item #${i + 1}`,
          before: "—",
          after: `"${title}"`,
          type: "add",
        });
        continue;
      }
      if (lItem && !dItem) {
        const title = (lItem.name || lItem.title || lItem.q || lItem.label || `Item ${i + 1}`) as string;
        diffs.push({
          field: `Deleted item #${i + 1}`,
          before: `"${title}"`,
          after: "—",
          type: "remove",
        });
        continue;
      }

      if (dItem && lItem && JSON.stringify(dItem) !== JSON.stringify(lItem)) {
        const itemLabel = (dItem.name || dItem.title || dItem.q || dItem.label || `Item #${i + 1}`) as string;
        // Find which fields inside changed
        const itemKeys = Array.from(new Set([...Object.keys(dItem), ...Object.keys(lItem)]));
        for (const ik of itemKeys) {
          if (JSON.stringify(dItem[ik]) !== JSON.stringify(lItem[ik])) {
            const dvStr = typeof dItem[ik] === "object" ? JSON.stringify(dItem[ik]) : String(dItem[ik] ?? "");
            const lvStr = typeof lItem[ik] === "object" ? JSON.stringify(lItem[ik]) : String(lItem[ik] ?? "");
            diffs.push({
              field: `${itemLabel} → ${ik}`,
              before: lvStr.length > 80 ? `${lvStr.slice(0, 80)}…` : lvStr || "(empty)",
              after: dvStr.length > 80 ? `${dvStr.slice(0, 80)}…` : dvStr || "(empty)",
              type: "modify",
            });
          }
        }
      }
    }

    return diffs.slice(0, 8); // Cap per section so modal stays concise
  }

  // Handle Objects (hero, about, quote, site, seo, journey, etc.)
  if (typeof draftVal === "object" && draftVal !== null && typeof liveVal === "object" && liveVal !== null) {
    const dObj = draftVal as Record<string, unknown>;
    const lObj = liveVal as Record<string, unknown>;
    const diffs: ChangeDiffItem[] = [];
    const keys = Array.from(new Set([...Object.keys(dObj), ...Object.keys(lObj)]));

    for (const k of keys) {
      if (JSON.stringify(dObj[k]) !== JSON.stringify(lObj[k])) {
        const dv = dObj[k];
        const lv = lObj[k];

        let dvStr = "";
        let lvStr = "";

        if (Array.isArray(dv)) dvStr = dv.join(", ");
        else if (typeof dv === "object" && dv !== null) dvStr = JSON.stringify(dv);
        else dvStr = String(dv ?? "");

        if (Array.isArray(lv)) lvStr = lv.join(", ");
        else if (typeof lv === "object" && lv !== null) lvStr = JSON.stringify(lv);
        else lvStr = String(lv ?? "");

        diffs.push({
          field: k,
          before: lvStr.length > 80 ? `${lvStr.slice(0, 80)}…` : lvStr || "(empty)",
          after: dvStr.length > 80 ? `${dvStr.slice(0, 80)}…` : dvStr || "(empty)",
          type: "modify",
        });
      }
    }
    return diffs;
  }

  // Primitive value
  return [
    {
      field: key,
      before: String(liveVal ?? "(empty)"),
      after: String(draftVal ?? "(empty)"),
      type: "modify",
    },
  ];
}

interface UnpublishedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: SiteContent;
  publishedSnap: SiteContent;
  changedKeys: string[];
  onRevertKey: (key: string) => void;
  onRevertAll: () => void;
  onNavigateTab: (tabId: TabId) => void;
  onPublish: () => void;
  publishing: boolean;
  version: number;
}

export function UnpublishedChangesModal({
  isOpen,
  onClose,
  draft,
  publishedSnap,
  changedKeys,
  onRevertKey,
  onRevertAll,
  onNavigateTab,
  onPublish,
  publishing,
  version,
}: UnpublishedChangesModalProps) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [confirmRevertAll, setConfirmRevertAll] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Compute diffs map for each changed key
  const changesMap = useMemo(() => {
    const map: Record<string, ChangeDiffItem[]> = {};
    for (const key of changedKeys) {
      const dVal = (draft as unknown as Record<string, unknown>)[key];
      const lVal = (publishedSnap as unknown as Record<string, unknown>)[key];
      map[key] = generateDiffsForKey(key, dVal, lVal);
    }
    return map;
  }, [changedKeys, draft, publishedSnap]);

  if (!isOpen) return null;

  const totalChanges = changedKeys.length;

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unpublished-changes-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative flex flex-col w-full max-w-2xl max-h-[88vh] rounded-3xl border border-stone-200 bg-[#faf9f6] text-stone-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200/80 bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                <Sparkles size={16} />
              </span>
              <h2 id="unpublished-changes-title" className="text-[17px] font-bold text-stone-900">
                Unpublished Changes
              </h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                {totalChanges} {totalChanges === 1 ? "section" : "sections"} modified
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-stone-500">
              Review edits against your live site (v{version}). You can revert any section individually or publish all changes live.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close unpublished changes modal"
            className="grid size-8 place-items-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content Body: List of Modified Sections */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto studio-modal-scroll p-5 space-y-3.5 overscroll-contain"
        >
          {totalChanges === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
                <Check size={22} />
              </span>
              <p className="text-[15px] font-bold text-stone-900">All Changes Are Live!</p>
              <p className="mt-1 text-[12.5px] text-stone-400 max-w-sm">
                Your draft currently matches your published website. Any new changes you make in the Studio will appear here for review.
              </p>
            </div>
          ) : (
            changedKeys.map((key) => {
              const info = KEY_INFO[key] ?? { label: key, tab: "overview" as TabId };
              const diffs = changesMap[key] ?? [];
              const isExpanded = expandedKeys[key] ?? true;

              return (
                <div
                  key={key}
                  className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm transition hover:border-stone-300"
                >
                  {/* Section Title & Revert Button Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-700">
                        <Layers size={15} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-[14px] font-bold text-stone-900">
                            {info.label}
                          </h3>
                          <span className="rounded-full bg-amber-50 px-2 py-0.2 text-[10px] font-semibold text-amber-700 border border-amber-200/60">
                            {diffs.length} {diffs.length === 1 ? "diff" : "diffs"}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 truncate">key: {key}</p>
                      </div>
                    </div>

                    {/* Section Actions: Revert & Jump to Edit */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onRevertKey(key)}
                        title={`Revert ${info.label} back to live published state`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-stone-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition shadow-xs"
                      >
                        <RotateCcw size={13} />
                        <span>Revert section</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab(info.tab);
                          onClose();
                        }}
                        title={`Open ${info.label} editor`}
                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[12px] font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition shadow-xs"
                      >
                        <span>Edit</span>
                        <ArrowRight size={13} className="text-stone-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(key)}
                        aria-label={isExpanded ? "Collapse diff" : "Expand diff"}
                        className="grid size-7 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Diff Details (Collapsible) */}
                  {isExpanded && (
                    <div className="mt-3.5 space-y-2 border-t border-stone-100 pt-3">
                      {diffs.length === 0 ? (
                        <p className="text-[12px] text-stone-400 italic">Content modified</p>
                      ) : (
                        diffs.map((d, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-stone-100 bg-stone-50/80 p-2.5 text-[12px]"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-stone-700 capitalize">
                                {d.field}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  d.type === "add"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : d.type === "remove"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {d.type === "add" ? "+ Added" : d.type === "remove" ? "- Removed" : "Modified"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                              {/* Live Value (Before) */}
                              <div className="rounded-lg border border-red-200/60 bg-red-50/50 p-2 text-red-950">
                                <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-red-600 mb-0.5">
                                  Live published
                                </span>
                                <p className="break-words line-clamp-3">{d.before || "(empty)"}</p>
                              </div>

                              {/* Draft Value (After) */}
                              <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-2 text-emerald-950">
                                <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">
                                  Unpublished draft
                                </span>
                                <p className="break-words line-clamp-3">{d.after || "(empty)"}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-stone-200/80 bg-white px-6 py-3.5">
          {/* Revert All trigger */}
          {totalChanges > 0 ? (
            confirmRevertAll ? (
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-red-700 flex items-center gap-1">
                  <AlertCircle size={14} /> Discard all edits?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRevertAll();
                    setConfirmRevertAll(false);
                    onClose();
                  }}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-red-700 transition"
                >
                  Yes, Revert All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRevertAll(false)}
                  className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-[12px] font-medium text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRevertAll(true)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-stone-500 hover:text-red-600 transition self-start sm:self-auto py-1"
              >
                <RotateCcw size={13} />
                <span>Revert all changes</span>
              </button>
            )
          ) : (
            <span className="text-[12px] text-stone-400">0 pending modifications</span>
          )}

          {/* Right Action buttons: Close & Publish */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onPublish();
                onClose();
              }}
              disabled={publishing || totalChanges === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2 text-[13px] font-semibold text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              <Send size={13} />
              <span>{publishing ? "Publishing…" : `Publish live updates (v${version + 1})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
