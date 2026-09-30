"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  AlignLeft,
  Briefcase,
  FileText,
  Globe,
  History,
  Home,
  Images,
  Layers,
  Mail,
  Map,
  MessagesSquare,
  Monitor,
  Smartphone,
  Tablet,
  PanelRight,
  PanelRightClose,
  PanelLeft,
  PanelLeftClose,
  Quote,
  Redo2,
  Search,
  Settings,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  CircleHelp,
  Undo2,
  Clock,
  ChevronRight,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  Check,
  GitBranch,
  Cpu,
  CreditCard,
  Trophy,
} from "lucide-react";
import type { SectionKey, SiteContent, CustomSection, CustomSectionTemplate } from "@/lib/schema";
import { LIMITS, MAX_COUNT, SECTION_LABELS } from "@/lib/schema";
import { defaultContent } from "@/data/content";
import { autoDerivedKeywords } from "@/lib/seo";
import { Area, Field, ImageField, HeroPortraitField, ItemCard, RowButtons, Text, move, inputCls } from "./fields";
import { UnpublishedChangesModal } from "./UnpublishedChangesModal";
import { TemplateLibraryModal, CUSTOM_SECTION_TEMPLATES } from "./TemplateLibraryModal";

export type HistoryEntry = {
  id: number;
  version: number;
  content: SiteContent;
  createdAt: string;
};

type SaveState = "saved" | "saving" | "error";
type View = "edit" | "preview";

export type TabId =
  | "overview"
  | "sections"
  | "hero"
  | "intro"
  | "journey"
  | "work"
  | "services"
  | "process"
  | "techstack"
  | "pricing"
  | "awards"
  | "gallery"
  | "quote"
  | "about"
  | "testimonials"
  | "faq"
  | "contact"
  | "site-settings"
  | "seo"
  | "publish"
  | "history"
  | "custom-section";

const TABS: {
  id: TabId;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}[] = [
  { id: "overview", label: "Overview", Icon: Home },
  { id: "sections", label: "Sections & Nav", Icon: Layers },
  { id: "hero", label: "Hero", Icon: Sparkles },
  { id: "intro", label: "Intro", Icon: AlignLeft },
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "services", label: "Services", Icon: Sparkles },
  { id: "process", label: "Process", Icon: GitBranch },
  { id: "techstack", label: "Tech Stack", Icon: Cpu },
  { id: "pricing", label: "Pricing", Icon: CreditCard },
  { id: "awards", label: "Awards", Icon: Trophy },
  { id: "journey", label: "Journey", Icon: Map },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "quote", label: "Quote", Icon: Quote },
  { id: "about", label: "About", Icon: FileText },
  { id: "testimonials", label: "Testimonials", Icon: MessagesSquare },
  { id: "faq", label: "FAQ", Icon: CircleHelp },
  { id: "contact", label: "Contact", Icon: Mail },
  { id: "site-settings", label: "Site settings", Icon: Settings },
  { id: "seo", label: "SEO & Reach", Icon: Globe },
  { id: "history", label: "Version history", Icon: History },
];

export const TAB_GROUPS: {
  title: string;
  tabIds: TabId[];
}[] = [
  {
    title: "General",
    tabIds: ["overview", "sections"],
  },
  {
    title: "Portfolio Sections",
    tabIds: [
      "hero",
      "intro",
      "work",
      "services",
      "process",
      "techstack",
      "pricing",
      "awards",
      "journey",
      "gallery",
      "quote",
      "about",
      "testimonials",
      "faq",
      "contact",
    ],
  },
  {
    title: "Settings & System",
    tabIds: ["site-settings", "seo", "history"],
  },
];

export type DeviceCategory = "desktop" | "tablet" | "mobile";

export type DeviceModel = {
  id: string;
  category: DeviceCategory;
  name: string;
  shortName: string;
  dimsLabel: string;
  width: number;
  height: number;
  frameStyle: "laptop" | "tablet" | "mobile";
};

export const DEVICE_MODELS: DeviceModel[] = [
  // Desktop & Laptops
  { id: "laptop-air", category: "desktop", name: "Laptop", shortName: "Laptop", dimsLabel: "1440 × 900", width: 1440, height: 900, frameStyle: "laptop" },
  { id: "laptop-16", category: "desktop", name: "MacBook Pro 16″", shortName: "MacBook Pro 16″", dimsLabel: "1728 × 1117", width: 1728, height: 1117, frameStyle: "laptop" },
  { id: "laptop-14", category: "desktop", name: "MacBook Pro 14″", shortName: "MacBook Pro 14″", dimsLabel: "1512 × 982", width: 1512, height: 982, frameStyle: "laptop" },
  { id: "desktop-fhd", category: "desktop", name: "Desktop 1080p", shortName: "Desktop 1080p", dimsLabel: "1920 × 1080", width: 1920, height: 1080, frameStyle: "laptop" },
  { id: "desktop-2k", category: "desktop", name: "2K QHD Display", shortName: "2K Monitor", dimsLabel: "2560 × 1440", width: 2560, height: 1440, frameStyle: "laptop" },
  { id: "desktop-4k", category: "desktop", name: "4K Ultra HD", shortName: "4K Display", dimsLabel: "3840 × 2160", width: 3840, height: 2160, frameStyle: "laptop" },
  { id: "laptop-small", category: "desktop", name: "Small Laptop", shortName: "Small Laptop", dimsLabel: "1280 × 800", width: 1280, height: 800, frameStyle: "laptop" },

  // Tablets
  { id: "tablet-ipad-air", category: "tablet", name: "iPad Air", shortName: "iPad Air", dimsLabel: "820 × 1180", width: 820, height: 1180, frameStyle: "tablet" },
  { id: "tablet-ipad-pro", category: "tablet", name: "iPad Pro 12.9″", shortName: "iPad Pro 12.9″", dimsLabel: "1024 × 1366", width: 1024, height: 1366, frameStyle: "tablet" },
  { id: "tablet-ipad-mini", category: "tablet", name: "iPad Mini", shortName: "iPad Mini", dimsLabel: "744 × 1133", width: 744, height: 1133, frameStyle: "tablet" },
  { id: "tablet-galaxy", category: "tablet", name: "Galaxy Tab", shortName: "Galaxy Tab", dimsLabel: "800 × 1280", width: 800, height: 1280, frameStyle: "tablet" },
  { id: "tablet-surface", category: "tablet", name: "Surface Pro", shortName: "Surface Pro", dimsLabel: "912 × 1368", width: 912, height: 1368, frameStyle: "tablet" },

  // Mobile Phones
  { id: "phone-15-pro", category: "mobile", name: "iPhone 15 Pro", shortName: "iPhone 15 Pro", dimsLabel: "393 × 852", width: 393, height: 852, frameStyle: "mobile" },
  { id: "phone-16-pro-max", category: "mobile", name: "iPhone 16 Pro Max", shortName: "iPhone 16 Pro Max", dimsLabel: "430 × 932", width: 430, height: 932, frameStyle: "mobile" },
  { id: "phone-14-13", category: "mobile", name: "iPhone 14", shortName: "iPhone 14", dimsLabel: "390 × 844", width: 390, height: 844, frameStyle: "mobile" },
  { id: "phone-se", category: "mobile", name: "iPhone SE", shortName: "iPhone SE", dimsLabel: "375 × 667", width: 375, height: 667, frameStyle: "mobile" },
  { id: "phone-s24", category: "mobile", name: "Galaxy S24", shortName: "Galaxy S24", dimsLabel: "412 × 915", width: 412, height: 915, frameStyle: "mobile" },
  { id: "phone-pixel-8", category: "mobile", name: "Pixel 8", shortName: "Pixel 8", dimsLabel: "412 × 892", width: 412, height: 892, frameStyle: "mobile" },
];

/**
 * True scaled miniature with realistic device bezel framing, natural aspect ratio,
 * and true viewport CSS media query rendering via an isolated iframe.
 */
function ScaledPreview({
  device,
  draft,
  activeSectionId,
  onScale,
}: {
  device: DeviceModel;
  draft: SiteContent;
  activeSectionId?: string | null;
  onScale?: (pct: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [box, setBox] = useState({ w: 400, h: 500 });

  useEffect(() => {
    if (activeSectionId && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "STUDIO_SCROLL_TO_SECTION", id: activeSectionId },
        "*"
      );
    }
  }, [activeSectionId]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Post draft updates to the iframe whenever draft changes or iframe is ready
  const postDraftToIframe = useCallback(() => {
    try {
      localStorage.setItem("studio_active_draft", JSON.stringify(draft));
    } catch {}
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: "STUDIO_DRAFT_UPDATE", draft }, "*");
    }
  }, [draft]);

  useEffect(() => {
    postDraftToIframe();
  }, [postDraftToIframe]);

  // When iframe signals ready, immediately push latest draft
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "STUDIO_PREVIEW_READY") {
        postDraftToIframe();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [postDraftToIframe]);

  const isLaptop = device.frameStyle === "laptop";
  const isMobile = device.frameStyle === "mobile";
  const isTablet = device.frameStyle === "tablet";

  const headerHeight = isLaptop ? 24 : isMobile ? 26 : 20;
  const bottomBarHeight = isMobile ? 14 : 0;
  const bezelX = isLaptop ? 12 : isMobile ? 12 : 12;
  const bezelY = isLaptop ? 8 : isMobile ? 12 : 10;

  // Leave margin inside the dotted canvas card so the pattern is visible around the floating device
  const padX = 24;
  const padY = 24;
  const availW = Math.max(80, box.w - padX - bezelX);
  const availH = Math.max(80, box.h - padY - bezelY - headerHeight - bottomBarHeight);

  // Natural scaling: fits inside container horizontally and vertically
  const scale = Math.min(availW / device.width, availH / device.height, 1);

  useEffect(() => {
    onScale?.(Math.max(1, Math.round(scale * 100)));
  }, [scale, onScale]);

  const scaledInnerW = Math.round(device.width * scale);
  const scaledInnerH = Math.round(device.height * scale);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      {/* Device Mockup Shell */}
      <div
        className={`relative flex flex-col overflow-hidden transition-all duration-300 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] ${
          isMobile
            ? "rounded-[34px] border-[5px] border-[#202024] bg-[#161618]"
            : isTablet
            ? "rounded-[24px] border-[5px] border-[#202024] bg-[#161618]"
            : "rounded-xl border-[4px] border-[#18181b] bg-[#18181b]"
        }`}
        style={{
          width: scaledInnerW + bezelX,
          height: scaledInnerH + headerHeight + bottomBarHeight + bezelY,
        }}
      >
        {/* Device Frame Header */}
        {isLaptop && (
          <div className="flex h-[24px] shrink-0 items-center bg-[#18181b] px-2.5 select-none" aria-hidden>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ff5f56]" />
              <span className="size-2 rounded-full bg-[#ffbd2e]" />
              <span className="size-2 rounded-full bg-[#27c93f]" />
            </div>
          </div>
        )}

        {isTablet && (
          <div className="flex h-[20px] shrink-0 items-center justify-center bg-[#161618] select-none" aria-hidden>
            <span className="size-2 rounded-full bg-stone-700/80 ring-1 ring-stone-600" />
          </div>
        )}

        {isMobile && (
          <div className="relative flex h-[26px] shrink-0 items-center justify-center bg-[#161618] select-none" aria-hidden>
            {/* Dynamic Island */}
            <div className="flex h-3 w-16 items-center justify-between rounded-full bg-black px-1.5 shadow-inner">
              <span className="size-1 rounded-full bg-stone-800" />
              <span className="size-1 rounded-full bg-blue-950/80" />
            </div>
          </div>
        )}

        {/* Viewport content with authentic isolated browser viewport */}
        <div
          className="relative overflow-hidden bg-black"
          style={{
            width: scaledInnerW,
            height: scaledInnerH,
          }}
        >
          <iframe
            ref={iframeRef}
            onLoad={postDraftToIframe}
            src="/studio/preview"
            title="Portfolio preview"
            tabIndex={-1}
            className="border-0 bg-[#070708]"
            style={{
              width: device.width,
              height: device.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>

        {/* Bottom Bar for Mobile */}
        {isMobile && (
          <div className="flex h-[14px] shrink-0 items-center justify-center bg-[#161618] select-none" aria-hidden>
            <span className="h-1 w-16 rounded-full bg-stone-600/70" />
          </div>
        )}
      </div>
    </div>
  );
}

function TagsInput({ value, onChange, max }: { value: string[]; onChange: (v: string[]) => void; max: number }) {
  return (
    <Field label="Tags" value={value} max={max} hint="Comma-separated.">
      <input
        value={value.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, max)
          )
        }
        className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
        placeholder="UI Design, UX Design"
      />
    </Field>
  );
}

function sectionCount(key: SectionKey, d: SiteContent): string | null {
  switch (key) {
    case "projects":
      return `${d.projects.length} items`;
    case "skills":
      return `${d.stats.length} stats`;
    case "services":
      return `${d.services?.length ?? 0} offerings`;
    case "process":
      return `${d.process?.length ?? 0} steps`;
    case "techstack":
      return `${d.techstack?.length ?? 0} tools`;
    case "pricing":
      return `${d.pricing?.length ?? 0} packages`;
    case "awards":
      return `${d.awards?.length ?? 0} honors`;
    case "gallery":
      return `${d.galleryItems.length} items`;
    case "testimonials":
      return `${d.testimonials.length} items`;
    case "faq":
      return `${d.faqs.length} items`;
    case "contact":
      return `${d.socials.length} items`;
    default:
      return null;
  }
}

export function sectionKeyToTab(key: SectionKey): TabId {
  switch (key) {
    case "hero": return "hero";
    case "intro": return "intro";
    case "projects": return "work";
    case "skills": return "journey";
    case "services": return "services";
    case "process": return "process";
    case "techstack": return "techstack";
    case "pricing": return "pricing";
    case "awards": return "awards";
    case "gallery": return "gallery";
    case "quote": return "quote";
    case "about": return "about";
    case "testimonials": return "testimonials";
    case "faq": return "faq";
    case "contact": return "contact";
    default: return "overview";
  }
}

export const TAB_TO_SECTION_KEY: Partial<Record<TabId, SectionKey>> = {
  hero: "hero",
  intro: "intro",
  work: "projects",
  journey: "skills",
  services: "services",
  process: "process",
  techstack: "techstack",
  pricing: "pricing",
  awards: "awards",
  gallery: "gallery",
  quote: "quote",
  about: "about",
  testimonials: "testimonials",
  faq: "faq",
  contact: "contact",
};


function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type EditorState = { draft: SiteContent; past: SiteContent[]; future: SiteContent[] };

type EditorAction =
  | { type: "patch"; fn: (d: SiteContent) => void }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "replace"; draft: SiteContent };

function editorReducer(s: EditorState, a: EditorAction): EditorState {
  switch (a.type) {
    case "patch": {
      const next = structuredClone(s.draft);
      next.process = next.process ?? [];
      next.techstack = next.techstack ?? [];
      next.pricing = next.pricing ?? [];
      next.awards = next.awards ?? [];
      next.services = next.services ?? [];
      next.customSections = next.customSections ?? [];
      next.sections = next.sections ?? { order: [], visible: {} };
      next.sections.order = next.sections.order ?? [];
      next.sections.visible = next.sections.visible ?? {};
      a.fn(next);
      return { draft: next, past: [...s.past.slice(-49), s.draft], future: [] };
    }
    case "undo": {
      if (s.past.length === 0) return s;
      const prev = s.past[s.past.length - 1];
      return { draft: prev, past: s.past.slice(0, -1), future: [...s.future, s.draft] };
    }
    case "redo": {
      if (s.future.length === 0) return s;
      const next = s.future[s.future.length - 1];
      return { draft: next, past: [...s.past, s.draft], future: s.future.slice(0, -1) };
    }
    case "replace":
      return { draft: a.draft, past: [], future: [] };
  }
}

const cardCls =
  "rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs transition-all";
const addBtnCls =
  "rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-1.5 text-[13px] font-semibold text-stone-800 hover:bg-stone-200 disabled:opacity-30 transition cursor-pointer";
const iconBtnCls =
  "grid size-9 place-items-center rounded-xl border border-stone-200/80 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 disabled:opacity-30 transition cursor-pointer";

const TOP_KEYS = [
  "site",
  "navLinks",
  "hero",
  "clientLogos",
  "logoImages",
  "aboutIntro",
  "journey",
  "stats",
  "services",
  "process",
  "techstack",
  "pricing",
  "awards",
  "projects",
  "galleryItems",
  "quote",
  "about",
  "testimonials",
  "faqs",
  "socials",
  "seo",
  "sections",
  "customSections",
] as const;

const TAB_KEYS: Record<TabId, readonly string[]> = {
  overview: [],
  sections: ["sections", "navLinks", "customSections"],
  hero: ["hero"],
  intro: ["aboutIntro"],
  journey: ["journey", "stats"],
  work: ["projects"],
  services: ["services"],
  process: ["process"],
  techstack: ["techstack"],
  pricing: ["pricing"],
  awards: ["awards"],
  gallery: ["galleryItems"],
  quote: ["quote"],
  about: ["about"],
  testimonials: ["testimonials"],
  faq: ["faqs"],
  contact: ["site", "socials"],
  "site-settings": ["site", "clientLogos", "logoImages"],
  seo: ["seo"],
  publish: [],
  history: [],
  "custom-section": ["customSections", "sections"],
};

const IDLE_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes
const WARNING_DURATION_SEC = 120; // 2 minutes countdown

export function StudioApp({
  initial,
  publishedInitial,
  meta,
  historyInitial,
  email,
}: {
  initial: SiteContent;
  publishedInitial: SiteContent;
  meta: { version: number; updatedAt: string | null; publishedAt: string | null };
  historyInitial: HistoryEntry[];
  email: string;
}) {
  const [editor, dispatch] = useReducer(editorReducer, {
    draft: initial,
    past: [],
    future: [] as SiteContent[],
  });
  const draft = editor.draft;
  const [publishedSnap, setPublishedSnap] = useState<SiteContent>(publishedInitial);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [tab, setTab] = useState<TabId>("overview");
  const [view, setView] = useState<View>("edit");
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory>("desktop");
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel>(
    DEVICE_MODELS.find((m) => m.id === "laptop-air") ?? DEVICE_MODELS[0]
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("studio_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [history, setHistory] = useState<HistoryEntry[]>(historyInitial);
  const [publishMsg, setPublishMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [version, setVersion] = useState(meta.version);
  const [publishedAt, setPublishedAt] = useState<string | null>(meta.publishedAt);
  const [newKeyword, setNewKeyword] = useState("");
  const [filter, setFilter] = useState("");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [zoom, setZoom] = useState<number | null>(null);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [activeCustomSectionId, setActiveCustomSectionId] = useState<string | null>(null);
  const firstRender = useRef(true);
  const filterRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Inactivity & Session Timeout Configuration
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutSecondsLeft, setTimeoutSecondsLeft] = useState(WARNING_DURATION_SEC);
  const lastActivityRef = useRef(0);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("studio_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showTimeoutModal) {
      setShowTimeoutModal(false);
      setTimeoutSecondsLeft(WARNING_DURATION_SEC);
      void fetch("/api/studio/session");
    }
  }, [showTimeoutModal]);

  // Listen for user interaction events to track idle time
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    let lastThrottled = 0;
    const handler = () => {
      const now = Date.now();
      if (now - lastThrottled > 3000) {
        lastThrottled = now;
        lastActivityRef.current = now;
        if (showTimeoutModal) {
          setShowTimeoutModal(false);
          setTimeoutSecondsLeft(WARNING_DURATION_SEC);
        }
      }
    };
    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handler));
    };
  }, [showTimeoutModal]);

  // Idle interval check & heartbeat
  useEffect(() => {
    const timer = setInterval(async () => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= IDLE_TIMEOUT_MS) {
        try {
          await fetch("/api/studio/logout", { method: "POST" });
        } catch {}
        router.push("/studio/login?reason=timeout");
        return;
      }

      const warningThresholdMs = IDLE_TIMEOUT_MS - WARNING_DURATION_SEC * 1000;
      if (idleMs >= warningThresholdMs) {
        setShowTimeoutModal(true);
        const remaining = Math.max(0, Math.ceil((IDLE_TIMEOUT_MS - idleMs) / 1000));
        setTimeoutSecondsLeft(remaining);
      } else {
        setShowTimeoutModal(false);
      }
    }, 1000);

    const heartbeat = setInterval(async () => {
      try {
        const res = await fetch("/api/studio/session");
        if (!res.ok) {
          router.push("/studio/login?reason=expired");
        }
      } catch {}
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeat);
    };
  }, [router]);

  const isOpen = (list: string, i: number) => openMap[`${list}:${i}`] ?? i === 0;
  const toggleOpen = (list: string, i: number) =>
    setOpenMap((m) => {
      const key = `${list}:${i}`;
      return { ...m, [key]: !(m[key] ?? i === 0) };
    });

  const patch = (fn: (d: SiteContent) => void) => dispatch({ type: "patch", fn });
  const undo = () => dispatch({ type: "undo" });
  const redo = () => dispatch({ type: "redo" });

  const deleteSection = useCallback(
    (key: string) => {
      if (typeof window !== "undefined" && !window.confirm("Are you sure you want to remove this section from your portfolio?")) {
        return;
      }
      patch((d) => {
        d.sections = d.sections ?? { order: [], visible: {} };
        d.sections.order = (d.sections.order ?? []).filter((k) => k !== key);
        if (d.sections.visible) {
          delete d.sections.visible[key];
        }
        d.customSections = (d.customSections ?? []).filter((s) => s.id !== key);
      });
      if (tab === "custom-section" && activeCustomSectionId === key) {
        setTab("sections");
        setActiveCustomSectionId(null);
      } else if (tab === sectionKeyToTab(key as SectionKey)) {
        setTab("sections");
      }
    },
    [tab, activeCustomSectionId]
  );

  const duplicateCustomSection = useCallback(
    (sourceId: string) => {
      const source = (draft.customSections || []).find((s) => s.id === sourceId);
      if (!source) return;
      const newId = `section-${Date.now().toString(36)}`;
      const duplicated: CustomSection = {
        ...structuredClone(source),
        id: newId,
        title: `${source.title || "Custom Section"} (Copy)`,
        inNav: false,
      };

      patch((d) => {
        d.customSections = d.customSections ?? [];
        d.customSections.push(duplicated);
        d.sections = d.sections ?? { order: [], visible: {} };
        d.sections.order = d.sections.order ?? [];
        d.sections.visible = d.sections.visible ?? {};
        const sourceIdx = d.sections.order.indexOf(sourceId);
        if (sourceIdx !== -1) {
          d.sections.order.splice(sourceIdx + 1, 0, newId);
        } else {
          d.sections.order.push(newId);
        }
        d.sections.visible[newId] = true;
      });

      setActiveCustomSectionId(newId);
      setTab("custom-section");
    },
    [draft.customSections]
  );

  const addSection = useCallback(
    (key: SectionKey) => {
      patch((d) => {
        if (!d.sections.order.includes(key)) {
          d.sections.order.push(key);
        }
        d.sections.visible[key] = true;
        if (key === "process" && (!d.process || d.process.length === 0)) {
          d.process = structuredClone(defaultContent.process || []);
        } else if (key === "techstack" && (!d.techstack || d.techstack.length === 0)) {
          d.techstack = structuredClone(defaultContent.techstack || []);
        } else if (key === "pricing" && (!d.pricing || d.pricing.length === 0)) {
          d.pricing = structuredClone(defaultContent.pricing || []);
        } else if (key === "awards" && (!d.awards || d.awards.length === 0)) {
          d.awards = structuredClone(defaultContent.awards || []);
        } else if (key === "services" && (!d.services || d.services.length === 0)) {
          d.services = structuredClone(defaultContent.services || []);
        }
      });
    },
    []
  );

  const addCustomSection = useCallback(
    (template: CustomSectionTemplate) => {
      const id = `section-${Date.now().toString(36)}`;
      let newSection: CustomSection;

      switch (template) {
        case "text-story":
          newSection = {
            id,
            template: "text-story",
            title: "Design Philosophy & Editorial Story",
            eyebrow: "Our Perspective",
            subtitle: "Crafting digital experiences with purpose, precision, and enduring impact.",
            body: "Great design isn't just about how it looks—it's about how it works, how it feels, and the clarity it brings to complex ideas.\n\nOver the past eight years, I've partnered with venture-backed startups and category leaders to build software that scales effortlessly while maintaining distinct visual character.",
            inNav: true,
            navLabel: "Story",
            bgColor: "violet",
            bgAnimation: "aurora",
          };
          break;
        case "image-text":
          newSection = {
            id,
            template: "image-text",
            title: "Architecting Digital Products that Resonate",
            eyebrow: "Visual Focus",
            subtitle: "Bridging the gap between ambitious product vision and pixel-perfect execution.",
            body: "From rapid design sprints to comprehensive production design systems, every detail is engineered for measurable user adoption and brand elevation.",
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
            imagePosition: "right",
            ctaPrimaryText: "Explore Process",
            ctaPrimaryHref: "#process",
            inNav: true,
            navLabel: "Focus",
            bgColor: "cyan",
            bgAnimation: "pulse",
          };
          break;
        case "cards-grid":
          newSection = {
            id,
            template: "cards-grid",
            title: "Core Principles & Architecture",
            eyebrow: "What Guides Us",
            subtitle: "A structured foundation powering high-velocity product execution.",
            cards: [
              { id: "c1", title: "Radical Simplicity", description: "Stripping away clutter to elevate what truly matters to your users.", tag: "UX Strategy" },
              { id: "c2", title: "Design Systems at Scale", description: "Tokenized, token-driven component libraries built for swift developer handoff.", tag: "Architecture" },
              { id: "c3", title: "Motion & Micro-interactions", description: "Subtle physics-based animations that reward attention without distraction.", tag: "Interaction" },
            ],
            inNav: true,
            navLabel: "Principles",
            bgColor: "emerald",
            bgAnimation: "drift",
          };
          break;
        case "metrics":
          newSection = {
            id,
            template: "metrics",
            title: "Measurable Impact & Milestones",
            eyebrow: "Proven Track Record",
            subtitle: "Data-backed results from multi-platform launches and enterprise redesigns.",
            metrics: [
              { id: "m1", value: "98.4%", label: "Client Satisfaction" },
              { id: "m2", value: "4.8M+", label: "Active App Users" },
              { id: "m3", value: "32+", label: "Design Systems Shipped" },
              { id: "m4", value: "$120M+", label: "Client Funding Raised" },
            ],
            inNav: true,
            navLabel: "Impact",
            bgColor: "blue",
            bgAnimation: "pulse",
          };
          break;
        case "quote-testimonial":
          newSection = {
            id,
            template: "quote-testimonial",
            title: "Client Endorsement",
            eyebrow: "Testimonial",
            quoteText: "Monson's intuition for modern product design transformed our platform from functional to unforgettable. He doesn't just design interfaces; he shapes how customers feel about our brand.",
            quoteAuthor: "Elena Rostova",
            quoteRole: "Chief Product Officer, ScaleFlow",
            inNav: false,
            navLabel: "Quote",
            bgColor: "amber",
            bgAnimation: "aurora",
          };
          break;
        case "cta":
          newSection = {
            id,
            template: "cta",
            title: "Ready to Build Something Extraordinary?",
            eyebrow: "Next Steps",
            subtitle: "Currently accepting select design engagements, system architectures, and advisory roles for Q3/Q4.",
            ctaPrimaryText: "Schedule a Discovery Call",
            ctaPrimaryHref: "#contact",
            ctaSecondaryText: "View Case Studies",
            ctaSecondaryHref: "#work",
            inNav: false,
            navLabel: "CTA",
            bgColor: "rose",
            bgAnimation: "pulse",
          };
          break;
      }

      patch((d) => {
        d.customSections = d.customSections ?? [];
        d.customSections.push(newSection);
        d.sections = d.sections ?? { order: [], visible: {} };
        d.sections.order = d.sections.order ?? [];
        d.sections.visible = d.sections.visible ?? {};
        
        // Smart placement: insert before contact if present, else append
        const contactIdx = d.sections.order.indexOf("contact");
        if (contactIdx !== -1) {
          d.sections.order.splice(contactIdx, 0, id);
        } else {
          d.sections.order.push(id);
        }
        d.sections.visible[id] = true;
      });

      setActiveCustomSectionId(id);
      setTab("custom-section");
      setShowTemplateModal(false);
    },
    []
  );

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(publishedSnap),
    [draft, publishedSnap]
  );

  const changedKeys = useMemo(
    () =>
      TOP_KEYS.filter(
        (k) =>
          JSON.stringify((draft as Record<string, unknown>)[k]) !==
          JSON.stringify((publishedSnap as Record<string, unknown>)[k])
      ),
    [draft, publishedSnap]
  );

  const tabDirty = (id: TabId) => TAB_KEYS[id].some((k) => (changedKeys as readonly string[]).includes(k));
  const dirtyTabs = TABS.filter(
    (t) => !["overview", "history"].includes(t.id) && tabDirty(t.id)
  );

  const previewTargetSectionId = useMemo(() => {
    if (tab === "custom-section") return activeCustomSectionId;
    if (tab === "hero") return "hero";
    if (tab === "intro") return "intro";
    if (tab === "work") return "projects";
    if (tab === "journey") return "skills";
    if (tab === "services") return "services";
    if (tab === "process") return "process";
    if (tab === "techstack") return "techstack";
    if (tab === "pricing") return "pricing";
    if (tab === "awards") return "awards";
    if (tab === "gallery") return "gallery";
    if (tab === "about") return "about";
    if (tab === "testimonials") return "testimonials";
    if (tab === "faq") return "faq";
    if (tab === "contact") return "contact";
    return null;
  }, [tab, activeCustomSectionId]);

  const revertKey = useCallback(
    (key: string) => {
      patch((d) => {
        const liveVal = (publishedSnap as Record<string, unknown>)[key];
        const defVal = (defaultContent as Record<string, unknown>)[key];
        (d as Record<string, unknown>)[key] =
          liveVal !== undefined ? structuredClone(liveVal) : structuredClone(defVal ?? []);

        if (key === "sections") {
          d.customSections = structuredClone(publishedSnap.customSections ?? []);
        }
        if (key === "customSections") {
          const validIds = new Set((publishedSnap.customSections ?? []).map((s) => s.id));
          d.sections.order = (d.sections?.order ?? []).filter(
            (id) => (!id.startsWith("section-") && !id.startsWith("custom-")) || validIds.has(id)
          );
        }
      });
    },
    [publishedSnap]
  );

  const revertAll = useCallback(() => {
    patch((d) => {
      for (const key of TOP_KEYS) {
        const liveVal = (publishedSnap as Record<string, unknown>)[key];
        const defVal = (defaultContent as Record<string, unknown>)[key];
        (d as Record<string, unknown>)[key] =
          liveVal !== undefined ? structuredClone(liveVal) : structuredClone(defVal ?? []);
      }
      d.customSections = structuredClone(publishedSnap.customSections ?? []);
      d.sections = structuredClone(publishedSnap.sections ?? defaultContent.sections);
    });
  }, [publishedSnap]);

  // Autosave: debounce, show Saving/Saved/Error, never touch published.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/content/draft", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: draft }),
        });
        if (!res.ok) throw new Error(await res.text());
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draft]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/content?scope=history");
      if (res.ok) {
        const json = await res.json();
        setHistory(json.history as HistoryEntry[]);
      }
    } catch {}
  }, []);

  const publish = useCallback(async () => {
    if (!dirty || publishing) return;
    setPublishing(true);
    setPublishMsg("");
    try {
      const res = await fetch("/api/content/publish", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Publish failed.");
      setVersion(json.version as number);
      setPublishedAt(new Date().toISOString());
      setPublishedSnap(structuredClone(draft));
      setPublishMsg("Published.");
      await loadHistory();
    } catch (e) {
      setPublishMsg(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  }, [dirty, publishing, draft, loadHistory]);

  // Shortcuts: ⌘/Ctrl+Enter publish · ⌘/Ctrl+Z undo · ⇧⌘Z redo · / search.
  // Typing inside fields keeps native behavior.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = Boolean(t.closest("input, textarea, select") || t.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (dirty && !publishing) {
          void publish();
        }
      } else if (mod && e.key.toLowerCase() === "b" && !typing) {
        e.preventDefault();
        toggleSidebar();
      } else if (mod && e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "redo" : "undo" });
      } else if (e.key === "/" && !typing && !mod) {
        e.preventDefault();
        filterRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [publish, toggleSidebar, dirty, publishing]);

  const restore = async (id: number) => {
    if (!window.confirm("Restore this version? Current published content will be archived first.")) return;
    try {
      const res = await fetch("/api/content/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Restore failed.");
      const d = await fetch("/api/content?scope=draft");
      if (d.ok) {
        const dj = await d.json();
        const content = dj.content as SiteContent;
        dispatch({ type: "replace", draft: content });
        setPublishedSnap(structuredClone(content));
        setVersion((dj.meta as { version: number }).version);
      }
      setPublishMsg("Published.");
      await loadHistory();
    } catch (e) {
      setPublishMsg(e instanceof Error ? e.message : "Restore failed.");
    }
  };

  const logout = async () => {
    await fetch("/api/studio/logout", { method: "POST" });
    router.push("/studio/login");
    router.refresh();
  };

  const order = draft.sections.order;
  const autoKeywords = useMemo(() => autoDerivedKeywords(draft), [draft]);
  const ownerFirst = (draft.site.name.split(" ")[0] || draft.site.name || "there");

  const sidebarTabs = useMemo(() => {
    return TABS.filter((t) => {
      if (t.id === "custom-section") return false;
      const secKey = TAB_TO_SECTION_KEY[t.id];
      if (!secKey) return true;
      return draft.sections.order.includes(secKey);
    });
  }, [draft.sections.order]);

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];
  const saveLabel = saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Save failed";

  const sideNav = sidebarCollapsed ? (
    <div className="flex flex-col items-center gap-1.5 py-1">
      {/* Expand button at top */}
      <button
        onClick={toggleSidebar}
        title="Expand sidebar (⌘B)"
        aria-label="Expand sidebar"
        className="grid size-10 place-items-center rounded-xl bg-black font-heading text-[15px] font-bold text-white transition hover:bg-stone-800 shadow-xs"
      >
        {(draft.site.name.charAt(0) || "M").toUpperCase()}
      </button>

      <div className="my-1.5 h-px w-8 bg-stone-200/80" />

      {sidebarTabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          aria-current={tab === t.id ? "true" : undefined}
          title={t.label}
          aria-label={t.label}
          className={`relative grid size-10 place-items-center rounded-xl transition ${
            tab === t.id
              ? "bg-black text-white shadow-xs font-semibold"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          <t.Icon size={17} aria-hidden />
          {tabDirty(t.id) && (
            <span
              aria-label="Has unpublished changes"
              title="Has unpublished changes"
              className="absolute right-1.5 top-1.5 size-2 rounded-full bg-amber-500 ring-2 ring-white"
            />
          )}
        </button>
      ))}

      <div className="my-2 h-px w-8 bg-stone-200/80" />

      <button
        onClick={() => void logout()}
        title={`Sign out (${email})`}
        aria-label="Sign out"
        className="grid size-10 place-items-center rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
      >
        <span className="text-[13px] font-bold">⎋</span>
      </button>
    </div>
  ) : (
    <>
      <div className="hidden items-center justify-between px-3 pb-3 pt-1 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-black font-heading text-[15px] font-bold text-white shadow-xs">
            {(draft.site.name.charAt(0) || "M").toUpperCase()}
          </span>
          <div>
            <span className="block text-[14px] font-bold text-stone-900 leading-tight">Content Studio</span>
            <span className="block text-[11px] text-stone-500 font-medium">Portfolio CMS</span>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          aria-label="Collapse sidebar (⌘B)"
          title="Collapse sidebar (⌘B)"
          className="grid size-7 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-200/80 hover:text-stone-900"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      <div className="relative mb-3 hidden shrink-0 lg:block">
        <Search size={14} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          ref={filterRef}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter sections… ( / )"
          aria-label="Search sections"
          className="w-full rounded-xl border border-stone-200/90 bg-white py-1.5 pl-8 pr-3 text-[12.5px] text-stone-900 placeholder:text-stone-400 transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        {TAB_GROUPS.map((grp) => {
          const matchingTabs = sidebarTabs.filter(
            (t) =>
              grp.tabIds.includes(t.id) &&
              t.label.toLowerCase().includes(filter.trim().toLowerCase())
          );
          if (matchingTabs.length === 0) return null;
          return (
            <div key={grp.title} className="space-y-1">
              <p className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-stone-400">
                {grp.title}
              </p>
              <div className="space-y-0.5">
                {matchingTabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    aria-current={tab === t.id ? "true" : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[12.5px] font-medium transition ${
                      tab === t.id
                        ? "bg-black text-white shadow-xs font-semibold"
                        : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-950"
                    }`}
                  >
                    <t.Icon size={15} className={`shrink-0 ${tab === t.id ? "text-white" : "text-stone-400"}`} aria-hidden />
                    <span className="truncate">{t.label}</span>
                    {tabDirty(t.id) && (
                      <span
                        aria-label="Has unpublished changes"
                        title="Has unpublished changes"
                        className={`ml-auto size-2 shrink-0 rounded-full ${
                          tab === t.id ? "bg-amber-300" : "bg-amber-500"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Custom Sections dynamic sidebar links */}
        {(draft.customSections || []).length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400">
                Custom Sections ({draft.customSections.length})
              </p>
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="text-[11px] font-semibold text-stone-900 hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-0.5">
              {draft.customSections.map((cs) => {
                const isSelected = tab === "custom-section" && activeCustomSectionId === cs.id;
                return (
                  <button
                    key={cs.id}
                    onClick={() => {
                      setActiveCustomSectionId(cs.id);
                      setTab("custom-section");
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-[12px] font-medium transition ${
                      isSelected
                        ? "bg-black text-white shadow-xs font-semibold"
                        : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        cs.bgColor === "emerald" ? "bg-emerald-400" :
                        cs.bgColor === "blue" ? "bg-blue-400" :
                        cs.bgColor === "cyan" ? "bg-cyan-400" :
                        cs.bgColor === "amber" ? "bg-amber-400" :
                        cs.bgColor === "rose" ? "bg-rose-400" :
                        "bg-stone-400"
                      }`}
                    />
                    <span className="truncate">{cs.title || "Custom Section"}</span>
                    {cs.inNav && (
                      <span className="ml-auto text-[9.5px] font-semibold uppercase px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                        Nav
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto hidden border-t border-stone-200/90 pt-3 lg:block">
        <div className="rounded-xl bg-stone-100/70 border border-stone-200/80 p-2.5">
          <p className="truncate text-[11px] font-medium text-stone-600">{email}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active session
            </span>
            <button
              onClick={() => void logout()}
              className="text-[11px] font-semibold text-stone-500 transition hover:text-red-600 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-stone-400">
          ⌘↵ publish · ⌘B sidebar · ⌘Z undo
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-3 px-4 py-2.5">
          {/* Left: Brand, Sidebar Toggle, Breadcrumb & Save Status */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
              title={sidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
              className={`${iconBtnCls} hidden lg:grid`}
            >
              {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-black font-heading text-[13px] font-bold text-white shadow-xs">
                {(draft.site.name.charAt(0) || "M").toUpperCase()}
              </span>
              <div className="hidden sm:block">
                <span className="text-[13px] font-semibold text-stone-900">Monson Studio</span>
                <span className="text-stone-400 mx-1.5">/</span>
                <span className="text-[13px] font-medium text-stone-600">
                  {tab === "overview" ? "Overview" : activeTab.label}
                </span>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                saveState === "saving"
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : saveState === "error"
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-stone-100 text-stone-700 ring-1 ring-stone-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  saveState === "saving"
                    ? "bg-amber-500 animate-pulse"
                    : saveState === "error"
                    ? "bg-red-500"
                    : "bg-stone-500"
                }`}
              />
              {saveLabel}
            </span>
          </div>

          {/* Center: Review Changes Quick Action */}
          <div className="hidden md:flex items-center">
            {dirty ? (
              <button
                type="button"
                onClick={() => setShowChangesModal(true)}
                className="flex items-center gap-2 rounded-full border border-amber-200/90 bg-amber-50/80 px-3.5 py-1 text-[12px] font-semibold text-amber-900 shadow-2xs hover:bg-amber-100/80 transition cursor-pointer"
              >
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>{changedKeys.length} Unpublished {changedKeys.length === 1 ? "Change" : "Changes"}</span>
                <span className="text-[11px] text-amber-700/70 font-normal">· Review</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-stone-400">
                <Check size={13} className="text-emerald-500" />
                <span>All changes published</span>
              </span>
            )}
          </div>

          {/* Right: Actions, Undo/Redo, Preview Toggle & Publish */}
          <div className="flex items-center gap-2">
            {/* Undo / Redo Group */}
            <div className="flex items-center rounded-xl border border-stone-200/80 bg-white p-0.5 shadow-2xs">
              <button
                onClick={undo}
                disabled={editor.past.length === 0}
                aria-label="Undo (⌘Z)"
                title="Undo (⌘Z)"
                className="grid size-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 transition cursor-pointer"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={redo}
                disabled={editor.future.length === 0}
                aria-label="Redo (⇧⌘Z)"
                title="Redo (⇧⌘Z)"
                className="grid size-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 transition cursor-pointer"
              >
                <Redo2 size={15} />
              </button>
            </div>

            {/* Split Preview Toggle */}
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              aria-label={previewOpen ? "Hide live preview" : "Show live preview"}
              title={previewOpen ? "Hide live preview" : "Show live preview"}
              className={`${iconBtnCls} hidden lg:grid`}
            >
              {previewOpen ? <PanelRightClose size={16} /> : <PanelRight size={16} />}
            </button>

            {/* View Live Site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              aria-label="View live site in new tab"
              title="View live site in new tab"
              className={iconBtnCls}
            >
              <ExternalLink size={15} />
            </a>

            {/* Mobile View Toggle */}
            <div className="flex rounded-lg border border-stone-200 bg-white p-0.5 lg:hidden">
              {(["edit", "preview"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-md px-2.5 py-1 text-[12px] font-medium capitalize ${
                    view === v ? "bg-black text-white" : "text-stone-500"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Publish CTA Button */}
            <button
              onClick={() => void publish()}
              disabled={publishing || !dirty}
              title={!dirty ? "No unpublished changes" : "Publish changes live (⌘↵)"}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
                dirty
                  ? "bg-black text-white shadow-sm hover:bg-stone-800 active:scale-[0.98] cursor-pointer"
                  : "bg-stone-200/80 text-stone-400 cursor-not-allowed opacity-60"
              }`}
            >
              <Sparkles size={14} className={dirty ? "text-stone-300" : ""} />
              <span>{publishing ? "Publishing…" : dirty ? "Publish Live" : "Published"}</span>
              {dirty && <kbd className="hidden sm:inline-block text-[10px] opacity-75 font-mono bg-white/20 px-1 py-0.2 rounded">⌘↵</kbd>}
            </button>
          </div>
        </div>
        {publishMsg && (
          <p aria-live="polite" className="border-t border-stone-200/80 bg-stone-100 px-4 py-1.5 text-center text-[13px] font-medium text-stone-900">
            {publishMsg}
          </p>
        )}
      </header>

      {/* Main Studio Grid: Sidebar, Main Editor, and 1/3rd Screen Live Preview */}
      <div className={`mx-auto grid max-w-[1920px] grid-cols-1 gap-0 ${
        previewOpen
          ? sidebarCollapsed
            ? "studio-grid-collapsed-preview"
            : "studio-grid-expanded-preview"
          : sidebarCollapsed
            ? "studio-grid-collapsed-no-preview"
            : "studio-grid-expanded-no-preview"
      }`}>
        {/* sidebar */}
        <aside
          data-lenis-prevent="true"
          className={`${view === "preview" ? "hidden" : ""} lg:block transition-all duration-200 bg-[#faf9f6]`}
        >
          <nav
            aria-label="Studio sections"
            className={`flex gap-1 overflow-x-auto border-b border-stone-200/80 px-3 py-2 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r ${
              sidebarCollapsed ? "lg:p-2" : "lg:p-3"
            }`}
          >
            {sideNav}
          </nav>
        </aside>

        {/* editor */}
        <main
          data-lenis-prevent="true"
          className={`${view === "preview" ? "hidden" : ""} space-y-6 px-4 py-6 sm:px-6 lg:block lg:border-r lg:border-stone-200/80 ${previewOpen ? "" : "lg:mx-auto lg:w-full lg:max-w-[920px] lg:border-r-0"}`}
        >
          {tab === "overview" && (
            <section className="space-y-6">
              {/* Welcome & Quick Action Hero */}
              <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs">
                <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-800">
                        <Sparkles size={11} className="text-stone-600" />
                        Studio Dashboard
                      </span>
                      <span className="text-[12px] text-stone-400">· Live version v{version}</span>
                    </div>
                    <h2 className="mt-2 font-heading text-[26px] font-bold tracking-tight text-stone-950 sm:text-[28px]">
                      {greeting()}, {ownerFirst} 👋
                    </h2>
                    <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-stone-500 sm:text-[14px]">
                      Manage content, reorder sections, inspect responsive device previews, and publish live changes directly to production.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setTab("sections")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-stone-700 shadow-2xs hover:bg-stone-50 transition cursor-pointer"
                    >
                      <Layers size={14} className="text-stone-400" />
                      <span>Manage Sections</span>
                    </button>

                    {dirty ? (
                      <button
                        type="button"
                        onClick={() => setShowChangesModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-stone-800 transition cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>Review & Publish ({changedKeys.length})</span>
                      </button>
                    ) : (
                      <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-stone-800 transition"
                      >
                        <ExternalLink size={14} />
                        <span>View Live Site</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Live Status</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-[22px] font-bold text-stone-900">v{version}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Published</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-stone-400">
                    {publishedAt ? new Date(publishedAt).toLocaleDateString() : "Live on production"}
                  </p>
                </div>

                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Active Sections</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-[22px] font-bold text-stone-900">{order.length}</span>
                    <span className="text-[11px] text-stone-500 font-medium">on landing page</span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-400">Ordered & interactive</p>
                </div>

                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Selected Works</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-[22px] font-bold text-stone-900">{draft.projects.length}</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-800">
                      {draft.projects.filter((p) => p.featured).length} Featured
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-400">Complete case studies</p>
                </div>

                <div
                  onClick={() => setTab("history")}
                  className={`${cardCls} cursor-pointer hover:border-stone-400 transition`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Revisions</p>
                    <span className="text-[11px] font-medium text-stone-900">History →</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-[22px] font-bold text-stone-900">{history.length}</span>
                    <span className="text-[11px] text-stone-400">Versions</span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-400">Full rollback support</p>
                </div>
              </div>

              {/* Unpublished Changes Spotlight */}
              {dirtyTabs.length > 0 && (
                <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="text-[14px] font-bold text-amber-950">
                        {changedKeys.length} Unpublished {changedKeys.length === 1 ? "Change" : "Changes"} in {dirtyTabs.length} {dirtyTabs.length === 1 ? "Section" : "Sections"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChangesModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-900 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-2xs hover:bg-amber-950 transition cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Review Diffs & Revert</span>
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dirtyTabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-[12px] font-medium text-amber-900 shadow-2xs hover:bg-amber-50 transition cursor-pointer"
                      >
                        <t.Icon size={13} />
                        <span>{t.label}</span>
                        <ChevronRight size={12} className="text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {tab === "sections" && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
                <div>
                  <h3 className="text-[15px] font-bold text-stone-900">Portfolio Sections ({order.length})</h3>
                  <p className="text-[12px] text-stone-400">
                    Add, remove, reorder, and toggle visibility. Changes update the live preview instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-black px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-stone-800 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Section</span>
                </button>
              </div>

              {order.length === 0 && (
                <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
                  <p className="text-[14px] font-medium text-stone-600">No sections currently active</p>
                  <p className="mt-1 text-[12px] text-stone-400">Add sections from the template library to build your page.</p>
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-stone-800 transition"
                  >
                    <Plus size={15} />
                    <span>Browse Template Library</span>
                  </button>
                </div>
              )}

              <div className="space-y-2.5">
                {order.map((key, i) => {
                  const isCustom = (draft.customSections || []).some((s) => s.id === key);
                  const customSec = isCustom ? draft.customSections.find((s) => s.id === key) : null;
                  const label = isCustom
                    ? customSec?.title || "Custom Section"
                    : SECTION_LABELS[key as SectionKey] || key;
                  const count = isCustom
                    ? customSec?.template
                      ? `${CUSTOM_SECTION_TEMPLATES.find((t) => t.template === customSec.template)?.name || customSec.template}`
                      : "Custom Section"
                    : sectionCount(key as SectionKey, draft);
                  const visible = draft.sections.visible[key] !== false;
                  const targetTab = isCustom ? "custom-section" : sectionKeyToTab(key as SectionKey);
                  return (
                    <div key={key} className={`${cardCls} flex items-center gap-2.5 transition hover:border-stone-300`}>
                      <div className="flex shrink-0 flex-col">
                        <button
                          aria-label={`Move ${label} up`}
                          disabled={i === 0}
                          onClick={() => patch((d) => { d.sections.order = move(d.sections.order, i, -1); })}
                          className="px-1 text-[11px] text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          aria-label={`Move ${label} down`}
                          disabled={i === order.length - 1}
                          onClick={() => patch((d) => { d.sections.order = move(d.sections.order, i, 1); })}
                          className="px-1 text-[11px] text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>

                      <span className="font-mono text-[11px] font-semibold text-stone-400 shrink-0 w-5">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[14px] font-semibold text-stone-900">{label}</p>
                          {isCustom && customSec?.inNav && (
                            <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.2 text-[10px] font-bold text-blue-700">
                              Nav: {customSec.navLabel || "Link"}
                            </span>
                          )}
                          {isCustom && customSec?.bgColor && customSec.bgColor !== "none" && (
                            <span
                              title={`Ambient glow: ${customSec.bgColor}`}
                              className="size-2 rounded-full"
                              style={{
                                backgroundColor:
                                  customSec.bgColor === "emerald" ? "#10b981" :
                                  customSec.bgColor === "blue" ? "#2563eb" :
                                  customSec.bgColor === "cyan" ? "#06b6d4" :
                                  customSec.bgColor === "amber" ? "#f59e0b" :
                                  customSec.bgColor === "rose" ? "#e11d48" : "#7c3aed"
                              }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-stone-400">
                          {count && <span>{count}</span>}
                          {count && <span>·</span>}
                          <span className={visible ? "text-emerald-600 font-medium" : "text-stone-400"}>
                            {visible ? "Shown" : "Hidden"}
                          </span>
                        </div>
                      </div>

                      {/* Quick jump to edit this section */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isCustom && customSec) {
                            setActiveCustomSectionId(customSec.id);
                            setTab("custom-section");
                          } else {
                            setTab(targetTab);
                          }
                        }}
                        className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition cursor-pointer"
                      >
                        <span>Edit</span>
                        <ChevronRight size={13} className="text-stone-400" />
                      </button>

                      {/* Toggle visibility */}
                      <button
                        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
                        aria-pressed={visible}
                        title={visible ? "Hide section on public site" : "Show section on public site"}
                        onClick={() => patch((d) => { d.sections.visible[key] = !visible; })}
                        className={`grid size-9 shrink-0 place-items-center rounded-xl border cursor-pointer ${
                          visible ? "border-stone-200 bg-white text-stone-700 hover:bg-stone-50" : "border-stone-200 bg-stone-100 text-stone-400 hover:bg-stone-200"
                        }`}
                      >
                        {visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      {/* Delete / Remove section */}
                      <button
                        type="button"
                        aria-label={`Delete ${label} from portfolio`}
                        title={`Delete ${label} from portfolio`}
                        onClick={() => deleteSection(key)}
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-stone-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition shadow-sm cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Header Navigation Links */}
              <div className="pt-6 border-t border-stone-200/80">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-[15px] font-bold text-stone-900">Header Navigation Links ({draft.navLinks.length}/{MAX_COUNT.navLinks})</h3>
                    <p className="text-[12px] text-stone-400">
                      Configure quick-jump anchor links displayed in the floating site header.
                    </p>
                  </div>
                  <button
                    disabled={draft.navLinks.length >= MAX_COUNT.navLinks}
                    onClick={() => patch((d) => { d.navLinks.push({ label: "New", href: "#hero", id: "hero" }); })}
                    className={addBtnCls}
                  >
                    Add Link
                  </button>
                </div>
                {draft.navLinks.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first navigation link.</p>}
                <div className="space-y-2.5 mt-2">
                  {draft.navLinks.map((l, i) => (
                    <div key={i} className={cardCls}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-stone-600">Link {i + 1}: {l.label}</span>
                        <RowButtons
                          index={i}
                          total={draft.navLinks.length}
                          onMove={(dir) => patch((d) => { d.navLinks = move(d.navLinks, i, dir); })}
                          onDelete={() => patch((d) => { d.navLinks.splice(i, 1); })}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Field label="Label" value={l.label} max={LIMITS.nav.label}>
                          <Text value={l.label} max={LIMITS.nav.label} onChange={(v) => patch((d) => { d.navLinks[i].label = v; })} />
                        </Field>
                        <Field label="Link" value={l.href} max={LIMITS.nav.href}>
                          <Text value={l.href} max={LIMITS.nav.href} onChange={(v) => patch((d) => { d.navLinks[i].href = v; })} />
                        </Field>
                        <Field label="Section ID" value={l.id}>
                          <Text value={l.id} onChange={(v) => patch((d) => { d.navLinks[i].id = v; })} />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {tab === "hero" && (
            <section className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" value={draft.hero.firstName} max={LIMITS.hero.name}>
                  <Text value={draft.hero.firstName} max={LIMITS.hero.name} onChange={(v) => patch((d) => { d.hero.firstName = v; })} />
                </Field>
                <Field label="Last name" value={draft.hero.lastName} max={LIMITS.hero.name}>
                  <Text value={draft.hero.lastName} max={LIMITS.hero.name} onChange={(v) => patch((d) => { d.hero.lastName = v; })} />
                </Field>
              </div>
              <Field label="Title" value={draft.hero.title} max={LIMITS.hero.title}>
                <Text value={draft.hero.title} max={LIMITS.hero.title} onChange={(v) => patch((d) => { d.hero.title = v; })} />
              </Field>
              <Field label="Subtitle" value={draft.hero.subtitle} max={LIMITS.hero.subtitle}>
                <Area value={draft.hero.subtitle} max={LIMITS.hero.subtitle} rows={4} onChange={(v) => patch((d) => { d.hero.subtitle = v; })} />
              </Field>
              <Field label="Quote" value={draft.hero.quote} max={LIMITS.hero.quote}>
                <Text value={draft.hero.quote} max={LIMITS.hero.quote} onChange={(v) => patch((d) => { d.hero.quote = v; })} />
              </Field>
              <div>
                <label className="block text-[13px] font-semibold text-stone-800 mb-1.5">
                  Hero Portrait Cutout / Image
                </label>
                <HeroPortraitField
                  value={draft.hero.personImage || draft.site.heroImage || ""}
                  onChange={(v) =>
                    patch((d) => {
                      d.hero.personImage = v;
                      d.site.heroImage = v;
                    })
                  }
                />
              </div>
              <Field
                label="Signature Image (Optional)"
                value={draft.hero.signatureImage}
                hint="Upload or paste a handwritten signature image (white or transparent PNG/SVG). If empty, your name renders in script font."
              >
                <ImageField
                  value={draft.hero.signatureImage}
                  onChange={(v) =>
                    patch((d) => {
                      d.hero.signatureImage = v;
                    })
                  }
                />
              </Field>
              {/* Company Names / Marquee Banner List */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold">
                      Company Names / Marquee Strip ({draft.clientLogos.length}/{MAX_COUNT.clientLogos})
                    </h3>
                    <p className="text-[12px] text-stone-400">
                      Company and client names that scroll continuously across the bottom of the hero page.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={draft.clientLogos.length >= MAX_COUNT.clientLogos}
                    onClick={() =>
                      patch((d) => {
                        d.clientLogos.push(`Company ${d.clientLogos.length + 1}`);
                      })
                    }
                    className={addBtnCls}
                  >
                    + Add Company
                  </button>
                </div>

                {draft.clientLogos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-300 py-6 text-center">
                    <p className="text-[13px] text-stone-500">No company names added yet.</p>
                    <button
                      type="button"
                      onClick={() =>
                        patch((d) => {
                          d.clientLogos.push("Company 1");
                        })
                      }
                      className="mt-2 text-[12px] font-medium text-stone-900 underline hover:text-stone-700"
                    >
                      Click here to add your first company name
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {draft.clientLogos.map((companyName, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white p-2.5 shadow-xs"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[12px] font-semibold text-stone-600">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={companyName}
                            maxLength={80}
                            placeholder="e.g. Caxita Tech Solutions, Jay4Web, Google"
                            onChange={(e) =>
                              patch((d) => {
                                d.clientLogos[idx] = e.target.value;
                              })
                            }
                            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-1.5 text-[13px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                          />
                        </div>
                        <RowButtons
                          index={idx}
                          total={draft.clientLogos.length}
                          onMove={(dir) =>
                            patch((d) => {
                              d.clientLogos = move(d.clientLogos, idx, dir);
                              if (d.logoImages[idx] !== undefined) {
                                d.logoImages = move(d.logoImages, idx, dir);
                              }
                            })
                          }
                          onDelete={() =>
                            patch((d) => {
                              d.clientLogos.splice(idx, 1);
                              if (d.logoImages[idx] !== undefined) {
                                d.logoImages.splice(idx, 1);
                              }
                            })
                          }
                          onDuplicate={() =>
                            patch((d) => {
                              if (d.clientLogos.length < MAX_COUNT.clientLogos) {
                                d.clientLogos.splice(idx + 1, 0, d.clientLogos[idx]);
                              }
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Marquee Speed Slider */}
                <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-stone-700">Banner Scroll Speed</span>
                    <span className="font-mono text-stone-500">{draft.logoMarqueeSpeed ?? 8} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={draft.logoMarqueeSpeed ?? 8}
                    onChange={(e) =>
                      patch((d) => {
                        d.logoMarqueeSpeed = Math.min(10, Math.max(1, Number(e.target.value) || 1));
                      })
                    }
                    className="mt-2 w-full accent-stone-900"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-stone-400">
                    <span>Fast (1)</span>
                    <span>Standard Pace (8)</span>
                    <span>Slow Crawl (10)</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === "intro" && (
            <section className="space-y-4">
              <Field label="Heading" value={draft.aboutIntro.heading} max={LIMITS.text.heading}>
                <Area value={draft.aboutIntro.heading} max={LIMITS.text.heading} rows={3} onChange={(v) => patch((d) => { d.aboutIntro.heading = v; })} />
              </Field>
              <Field label="Body" value={draft.aboutIntro.body} max={LIMITS.text.body}>
                <Area value={draft.aboutIntro.body} max={LIMITS.text.body} rows={6} onChange={(v) => patch((d) => { d.aboutIntro.body = v; })} />
              </Field>
            </section>
          )}

          {tab === "journey" && (
            <section className="space-y-4">
              <Field label="Eyebrow" value={draft.journey.eyebrow}>
                <Text value={draft.journey.eyebrow} onChange={(v) => patch((d) => { d.journey.eyebrow = v; })} />
              </Field>
              <Field label="Heading" value={draft.journey.heading} max={LIMITS.text.heading}>
                <Text value={draft.journey.heading} max={LIMITS.text.heading} onChange={(v) => patch((d) => { d.journey.heading = v; })} />
              </Field>
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-[14px] font-semibold">Stats ({draft.stats.length}/{MAX_COUNT.stats})</h3>
                <button
                  disabled={draft.stats.length >= MAX_COUNT.stats}
                  onClick={() => patch((d) => { d.stats.push({ value: "1", target: 1, suffix: "+", label: "New stat" }); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              {draft.stats.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — the stats row stays hidden until you add one.</p>}
              {draft.stats.map((s, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-stone-600">Stat {i + 1}</span>
                    <RowButtons
                      index={i}
                      total={draft.stats.length}
                      onMove={(dir) => patch((d) => { d.stats = move(d.stats, i, dir); })}
                      onDelete={() => patch((d) => { d.stats.splice(i, 1); })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Label" value={s.label} max={LIMITS.stat.label}>
                      <Text value={s.label} max={LIMITS.stat.label} onChange={(v) => patch((d) => { d.stats[i].label = v; })} />
                    </Field>
                    <Field label="Count to" value={String(s.target)}>
                      <input
                        type="number"
                        min={0}
                        max={100000}
                        value={s.target}
                        onChange={(e) => patch((d) => { d.stats[i].target = Math.max(0, Number(e.target.value) || 0); })}
                        className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 focus:border-stone-400 focus:outline-none"
                      />
                    </Field>
                    <Field label="Suffix" value={s.suffix} max={LIMITS.stat.suffix}>
                      <Text value={s.suffix} max={LIMITS.stat.suffix} onChange={(v) => patch((d) => { d.stats[i].suffix = v; })} />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
          )}

          {tab === "work" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Projects ({draft.projects.length}/{MAX_COUNT.projects})</h3>
                  <p className="text-[12px] text-stone-400">Featured case studies with mockups and live links.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("projects")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Projects section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.projects.length >= MAX_COUNT.projects}
                    onClick={() =>
                      patch((d) => {
                        const featuredCount = d.projects.filter((x) => x.featured).length;
                        d.projects.push({
                          name: "New project",
                          tag: "",
                          description: "",
                          mockTitle: "",
                          mockSubtitle: "",
                          image: "",
                          accent: "#FFFFFF",
                          href: "#projects",
                          behanceUrl: "",
                          featured: featuredCount < 4,
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Front Page Selection Indicator */}
              {(() => {
                const featuredCount = draft.projects.filter((p) => p.featured).length;
                return (
                  <div className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-[12px] text-amber-900 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex size-2 rounded-full bg-amber-500" />
                      <span>
                        <strong>Front Page Selection:</strong> {featuredCount} of 4 selected to appear on homepage.
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-amber-800">
                      {featuredCount === 4
                        ? "✓ 4 of 4 filled"
                        : `${4 - featuredCount} slot${4 - featuredCount === 1 ? "" : "s"} open`}
                    </span>
                  </div>
                );
              })()}

              {draft.projects.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — the Work section stays hidden until you add one.</p>}
              {draft.projects.map((p, i) => (
                <ItemCard
                  key={i}
                  title={p.name || `Project ${i + 1}`}
                  badge={p.featured ? `★ Front Page • ${p.tag || p.description || "Featured"}` : (p.tag || p.description)}
                  thumb={p.image}
                  fallback={p.name}
                  open={isOpen("projects", i)}
                  onToggle={() => toggleOpen("projects", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.projects.length}
                      onMove={(dir) => patch((d) => { d.projects = move(d.projects, i, dir); })}
                      onDelete={() => patch((d) => { d.projects.splice(i, 1); })}
                      onDuplicate={() =>
                        patch((d) => {
                          if (d.projects.length < MAX_COUNT.projects)
                            d.projects.splice(i + 1, 0, structuredClone(d.projects[i]));
                        })
                      }
                    />
                  }
                >
                  <div className="space-y-3">
                    {/* Front Page Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50/80 px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            patch((d) => {
                              const current = Boolean(d.projects[i].featured);
                              const count = d.projects.filter((x) => x.featured).length;
                              if (!current && count >= 4) {
                                alert("You already have 4 projects selected for the front page. Deselect one first to feature this project.");
                                return;
                              }
                              d.projects[i].featured = !current;
                            })
                          }
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            p.featured ? "bg-amber-600" : "bg-stone-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              p.featured ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <div>
                          <p className="text-[12px] font-semibold text-stone-800">
                            Show in 4 Front Page Slots
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {p.featured
                              ? "Currently active in the 4 front page slots"
                              : "Only displayed in the full /work archive"}
                          </p>
                        </div>
                      </div>
                      {p.featured && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          ★ On Front Page
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Name" value={p.name} max={LIMITS.project.name} required>
                        <Text value={p.name} max={LIMITS.project.name} onChange={(v) => patch((d) => { d.projects[i].name = v; })} />
                      </Field>
                      <Field label="Tag" value={p.tag} max={LIMITS.project.tag}>
                        <Text value={p.tag} max={LIMITS.project.tag} onChange={(v) => patch((d) => { d.projects[i].tag = v; })} />
                      </Field>
                    </div>
                    <Field label="Description" value={p.description} max={LIMITS.project.description}>
                      <Text value={p.description} max={LIMITS.project.description} onChange={(v) => patch((d) => { d.projects[i].description = v; })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Mock title" value={p.mockTitle} max={LIMITS.project.mockTitle}>
                        <Text value={p.mockTitle} max={LIMITS.project.mockTitle} onChange={(v) => patch((d) => { d.projects[i].mockTitle = v; })} />
                      </Field>
                      <Field label="Mock subtitle" value={p.mockSubtitle} max={LIMITS.project.mockSubtitle}>
                        <Text value={p.mockSubtitle} max={LIMITS.project.mockSubtitle} onChange={(v) => patch((d) => { d.projects[i].mockSubtitle = v; })} />
                      </Field>
                    </div>
                    <Field label="Cover image" value={p.image} hint="Cropped to 16:10.">
                      <ImageField value={p.image} aspect="16/10" onChange={(v) => patch((d) => { d.projects[i].image = v; })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Link URL" value={p.href} max={LIMITS.project.href}>
                        <Text value={p.href} max={LIMITS.project.href} onChange={(v) => patch((d) => { d.projects[i].href = v; })} />
                      </Field>
                      <Field label="Behance URL" value={p.behanceUrl ?? ""} max={LIMITS.project.href}>
                        <Text value={p.behanceUrl ?? ""} max={LIMITS.project.href} onChange={(v) => patch((d) => { d.projects[i].behanceUrl = v; })} />
                      </Field>
                    </div>
                    <Field label="Accent" value={p.accent}>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={/^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : "#ffffff"}
                          onChange={(e) => patch((d) => { d.projects[i].accent = e.target.value; })}
                          className="h-9 w-12 cursor-pointer rounded-lg border border-stone-300 bg-white"
                        />
                        <input
                          value={p.accent}
                          maxLength={LIMITS.project.accent}
                          onChange={(e) => patch((d) => { d.projects[i].accent = e.target.value; })}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none"
                        />
                      </div>
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "gallery" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Gallery ({draft.galleryItems.length}/{MAX_COUNT.galleryItems})</h3>
                  <p className="text-[12px] text-stone-400">Needs 3+ images with URLs — fewer hides the section publicly.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("gallery")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Gallery section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.galleryItems.length >= MAX_COUNT.galleryItems}
                    onClick={() => patch((d) => { d.galleryItems.push({ title: "New work", image: "" }); })}
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              <p className="text-[12px] text-stone-400">Needs 3+ images with URLs — fewer hides the section publicly.</p>
              {draft.galleryItems.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.galleryItems.map((g, i) => (
                <ItemCard
                  key={i}
                  title={g.title || `Image ${i + 1}`}
                  badge={`Image ${i + 1} of ${draft.galleryItems.length}`}
                  thumb={g.image}
                  fallback={g.title}
                  open={isOpen("gallery", i)}
                  onToggle={() => toggleOpen("gallery", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.galleryItems.length}
                      onMove={(dir) => patch((d) => { d.galleryItems = move(d.galleryItems, i, dir); })}
                      onDelete={() => patch((d) => { d.galleryItems.splice(i, 1); })}
                    />
                  }
                >
                  <div className="space-y-3">
                    <Field label="Title" value={g.title} max={LIMITS.gallery.title}>
                      <Text value={g.title} max={LIMITS.gallery.title} onChange={(v) => patch((d) => { d.galleryItems[i].title = v; })} />
                    </Field>
                    <Field label="Image" value={g.image} hint="Cropped to 16:10.">
                      <ImageField value={g.image} aspect="16/10" onChange={(v) => patch((d) => { d.galleryItems[i].image = v; })} />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "quote" && (
            <section className="space-y-4">
              <Field label="Text" value={draft.quote.text}>
                <Area value={draft.quote.text} rows={3} onChange={(v) => patch((d) => { d.quote.text = v; })} />
              </Field>
              <Field label="Signature" value={draft.quote.signature} max={LIMITS.site.name}>
                <Text value={draft.quote.signature} max={LIMITS.site.name} onChange={(v) => patch((d) => { d.quote.signature = v; })} />
              </Field>
            </section>
          )}

          {tab === "about" && (
            <section className="space-y-4">
              <Field label="Title" value={draft.about.title}>
                <Area value={draft.about.title} rows={3} onChange={(v) => patch((d) => { d.about.title = v; })} />
              </Field>
              <Field label="Body" value={draft.about.body} max={LIMITS.text.body} hint="A blank line starts a new paragraph on render where supported.">
                <Area value={draft.about.body} max={LIMITS.text.body} rows={6} onChange={(v) => patch((d) => { d.about.body = v; })} />
              </Field>
              <TagsInput value={draft.about.tags} max={MAX_COUNT.aboutTags} onChange={(v) => patch((d) => { d.about.tags = v; })} />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Role" value={draft.about.role}>
                  <Text value={draft.about.role} onChange={(v) => patch((d) => { d.about.role = v; })} />
                </Field>
                <Field label="Type / org" value={draft.about.type}>
                  <Text value={draft.about.type} onChange={(v) => patch((d) => { d.about.type = v; })} />
                </Field>
                <Field label="Period" value={draft.about.period}>
                  <Text value={draft.about.period} onChange={(v) => patch((d) => { d.about.period = v; })} />
                </Field>
              </div>
            </section>
          )}

          {tab === "testimonials" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Testimonials ({draft.testimonials.length}/{MAX_COUNT.testimonials})</h3>
                  <p className="text-[12px] text-stone-400">Client quotes and social proof.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("testimonials")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Testimonials section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.testimonials.length >= MAX_COUNT.testimonials}
                    onClick={() => patch((d) => { d.testimonials.push({ quote: "", name: "", role: "" }); })}
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.testimonials.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — the marquee stays hidden until you add one.</p>}
              {draft.testimonials.map((t, i) => (
                <ItemCard
                  key={i}
                  title={t.name || `Testimonial ${i + 1}`}
                  badge={t.role}
                  fallback={t.name}
                  open={isOpen("testimonials", i)}
                  onToggle={() => toggleOpen("testimonials", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.testimonials.length}
                      onMove={(dir) => patch((d) => { d.testimonials = move(d.testimonials, i, dir); })}
                      onDelete={() => patch((d) => { d.testimonials.splice(i, 1); })}
                    />
                  }
                >
                  <div className="space-y-3">
                    <Field label="Quote" value={t.quote} max={LIMITS.testimonial.quote} required>
                      <Area value={t.quote} max={LIMITS.testimonial.quote} rows={3} onChange={(v) => patch((d) => { d.testimonials[i].quote = v; })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Name" value={t.name} max={LIMITS.testimonial.name} required>
                        <Text value={t.name} max={LIMITS.testimonial.name} onChange={(v) => patch((d) => { d.testimonials[i].name = v; })} />
                      </Field>
                      <Field label="Role" value={t.role} max={LIMITS.testimonial.role}>
                        <Text value={t.role} max={LIMITS.testimonial.role} onChange={(v) => patch((d) => { d.testimonials[i].role = v; })} />
                      </Field>
                    </div>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "faq" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">FAQ ({draft.faqs.length}/{MAX_COUNT.faqs})</h3>
                  <p className="text-[12px] text-stone-400">Questions & answers shown on the home page.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("faq")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove FAQ section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.faqs.length >= MAX_COUNT.faqs}
                    onClick={() =>
                      patch((d) => {
                        d.faqs.push({
                          index: String(d.faqs.length + 1).padStart(2, "0"),
                          q: "",
                          a: "",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.faqs.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.faqs.map((f, i) => (
                <ItemCard
                  key={i}
                  title={f.q || `Question ${i + 1}`}
                  badge={`Q${i + 1}`}
                  fallback={f.q}
                  open={isOpen("faqs", i)}
                  onToggle={() => toggleOpen("faqs", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.faqs.length}
                      onMove={(dir) => patch((d) => { d.faqs = move(d.faqs, i, dir); })}
                      onDelete={() => patch((d) => { d.faqs.splice(i, 1); })}
                    />
                  }
                >
                  <div className="space-y-3">
                    <Field label="Question" value={f.q} max={LIMITS.faq.q} required>
                      <Text value={f.q} max={LIMITS.faq.q} onChange={(v) => patch((d) => { d.faqs[i].q = v; })} />
                    </Field>
                    <Field label="Answer" value={f.a} max={LIMITS.faq.a}>
                      <Area value={f.a} max={LIMITS.faq.a} rows={3} onChange={(v) => patch((d) => { d.faqs[i].a = v; })} />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "services" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Services & Capabilities ({draft.services.length}/{MAX_COUNT.services})</h3>
                  <p className="text-[12px] text-stone-400">Offerings shown with 3D spotlight cards and deliverable tags.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("services")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Services section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.services.length >= MAX_COUNT.services}
                    onClick={() =>
                      patch((d) => {
                        d.services.push({
                          index: String(d.services.length + 1).padStart(2, "0"),
                          title: "New service",
                          description: "",
                          tags: [],
                          preview: "",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.services.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first service offering.</p>}
              {draft.services.map((s, i) => (
                <ItemCard
                  key={i}
                  title={s.title || `Service ${s.index}`}
                  badge={`Service ${s.index}${s.tags.length > 0 ? ` · ${s.tags.slice(0, 3).join(", ")}` : ""}`}
                  thumb={s.preview}
                  fallback={s.title}
                  open={isOpen("services", i)}
                  onToggle={() => toggleOpen("services", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.services.length}
                      onMove={(dir) => patch((d) => { d.services = move(d.services, i, dir); })}
                      onDelete={() => patch((d) => { d.services.splice(i, 1); })}
                      onDuplicate={() =>
                        patch((d) => {
                          if (d.services.length < MAX_COUNT.services)
                            d.services.splice(i + 1, 0, structuredClone(d.services[i]));
                        })
                      }
                    />
                  }
                >
                  <div className="space-y-3">
                    <Field label="Title" value={s.title} max={LIMITS.service.title} required>
                      <Text value={s.title} max={LIMITS.service.title} onChange={(v) => patch((d) => { d.services[i].title = v; })} />
                    </Field>
                    <Field label="Description" value={s.description} max={LIMITS.service.description}>
                      <Area value={s.description} max={LIMITS.service.description} rows={3} onChange={(v) => patch((d) => { d.services[i].description = v; })} />
                    </Field>
                    <TagsInput value={s.tags} max={MAX_COUNT.tagsPerService} onChange={(v) => patch((d) => { d.services[i].tags = v; })} />
                    <Field label="Preview image" value={s.preview} hint="Cropped to 16:10. Empty hides preview.">
                      <ImageField value={s.preview} aspect="16/10" onChange={(v) => patch((d) => { d.services[i].preview = v; })} />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "process" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Process & Methodology ({draft.process.length}/{MAX_COUNT.process})</h3>
                  <p className="text-[12px] text-stone-400">Step-by-step framework displayed with glowing flow cards and deliverable tags.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("process")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Process section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.process.length >= MAX_COUNT.process}
                    onClick={() =>
                      patch((d) => {
                        d.process.push({
                          step: String(d.process.length + 1).padStart(2, "0"),
                          title: "New step",
                          description: "",
                          deliverable: "",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.process.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first workflow step.</p>}
              {draft.process.map((p, i) => (
                <ItemCard
                  key={i}
                  title={p.title || `Step ${p.step || i + 1}`}
                  badge={`Step ${p.step || `0${i + 1}`}${p.deliverable ? ` · ${p.deliverable}` : ""}`}
                  fallback={p.step || `0${i + 1}`}
                  open={isOpen("process", i)}
                  onToggle={() => toggleOpen("process", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.process.length}
                      onMove={(dir) => patch((d) => { d.process = move(d.process, i, dir); })}
                      onDelete={() => patch((d) => { d.process.splice(i, 1); })}
                      onDuplicate={() =>
                        patch((d) => {
                          if (d.process.length < MAX_COUNT.process)
                            d.process.splice(i + 1, 0, structuredClone(d.process[i]));
                        })
                      }
                    />
                  }
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        <Field label="Step" value={p.step} max={LIMITS.process.step} required>
                          <Text value={p.step} max={LIMITS.process.step} placeholder="01" onChange={(v) => patch((d) => { d.process[i].step = v; })} />
                        </Field>
                      </div>
                      <div className="col-span-3">
                        <Field label="Title" value={p.title} max={LIMITS.process.title} required>
                          <Text value={p.title} max={LIMITS.process.title} onChange={(v) => patch((d) => { d.process[i].title = v; })} />
                        </Field>
                      </div>
                    </div>
                    <Field label="Description" value={p.description} max={LIMITS.process.description}>
                      <Area value={p.description} max={LIMITS.process.description} rows={3} onChange={(v) => patch((d) => { d.process[i].description = v; })} />
                    </Field>
                    <Field label="Key deliverable" value={p.deliverable} max={LIMITS.process.deliverable} hint="e.g. Design Specs & Component Library">
                      <Text value={p.deliverable} max={LIMITS.process.deliverable} onChange={(v) => patch((d) => { d.process[i].deliverable = v; })} />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "techstack" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Tech Stack & Tools ({draft.techstack.length}/{MAX_COUNT.techstack})</h3>
                  <p className="text-[12px] text-stone-400">Software, frameworks, and tools displayed with proficiency tags.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("techstack")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Tech Stack section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.techstack.length >= MAX_COUNT.techstack}
                    onClick={() =>
                      patch((d) => {
                        d.techstack.push({
                          name: "New tool",
                          category: "Design",
                          proficiency: "Expert",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.techstack.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first tool.</p>}
              <div className="space-y-2">
                {draft.techstack.map((t, i) => (
                  <div key={i} className={`${cardCls} flex flex-col gap-2.5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-stone-800">{t.name || `Tool ${i + 1}`}</span>
                      <RowButtons
                        index={i}
                        total={draft.techstack.length}
                        onMove={(dir) => patch((d) => { d.techstack = move(d.techstack, i, dir); })}
                        onDelete={() => patch((d) => { d.techstack.splice(i, 1); })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Field label="Tool name" value={t.name} max={LIMITS.techstack.name} required>
                        <Text value={t.name} max={LIMITS.techstack.name} onChange={(v) => patch((d) => { d.techstack[i].name = v; })} />
                      </Field>
                      <Field label="Category" value={t.category} max={LIMITS.techstack.category}>
                        <Text value={t.category} max={LIMITS.techstack.category} placeholder="UI/UX Design" onChange={(v) => patch((d) => { d.techstack[i].category = v; })} />
                      </Field>
                      <Field label="Proficiency" value={t.proficiency} max={LIMITS.techstack.proficiency}>
                        <Text value={t.proficiency} max={LIMITS.techstack.proficiency} placeholder="Expert / Advanced" onChange={(v) => patch((d) => { d.techstack[i].proficiency = v; })} />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "pricing" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Pricing & Packages ({draft.pricing.length}/{MAX_COUNT.pricing})</h3>
                  <p className="text-[12px] text-stone-400">Engagement packages with feature checklists and popular highlights.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("pricing")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Pricing section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.pricing.length >= MAX_COUNT.pricing}
                    onClick={() =>
                      patch((d) => {
                        d.pricing.push({
                          name: "New tier",
                          price: "$2,500",
                          period: "per project",
                          description: "",
                          features: ["Deliverable 1", "Deliverable 2"],
                          popular: false,
                          ctaText: "Book Package",
                          ctaHref: "#contact",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.pricing.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first package.</p>}
              {draft.pricing.map((p, i) => (
                <ItemCard
                  key={i}
                  title={p.name || `Package ${i + 1}`}
                  badge={`${p.price}${p.period ? ` / ${p.period}` : ""}${p.popular ? " · Most Popular" : ""}`}
                  fallback={p.name}
                  open={isOpen("pricing", i)}
                  onToggle={() => toggleOpen("pricing", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.pricing.length}
                      onMove={(dir) => patch((d) => { d.pricing = move(d.pricing, i, dir); })}
                      onDelete={() => patch((d) => { d.pricing.splice(i, 1); })}
                      onDuplicate={() =>
                        patch((d) => {
                          if (d.pricing.length < MAX_COUNT.pricing)
                            d.pricing.splice(i + 1, 0, structuredClone(d.pricing[i]));
                        })
                      }
                    />
                  }
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Package name" value={p.name} max={LIMITS.pricing.name} required>
                        <Text value={p.name} max={LIMITS.pricing.name} onChange={(v) => patch((d) => { d.pricing[i].name = v; })} />
                      </Field>
                      <div className="flex items-center gap-2 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-stone-700">
                          <input
                            type="checkbox"
                            checked={p.popular}
                            onChange={(e) => patch((d) => { d.pricing[i].popular = e.target.checked; })}
                            className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                          />
                          Mark as &quot;Most Popular&quot;
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Price" value={p.price} max={LIMITS.pricing.price} required>
                        <Text value={p.price} max={LIMITS.pricing.price} placeholder="$4,500" onChange={(v) => patch((d) => { d.pricing[i].price = v; })} />
                      </Field>
                      <Field label="Billing period" value={p.period} max={LIMITS.pricing.period}>
                        <Text value={p.period} max={LIMITS.pricing.period} placeholder="2–3 weeks / monthly" onChange={(v) => patch((d) => { d.pricing[i].period = v; })} />
                      </Field>
                    </div>
                    <Field label="Description" value={p.description} max={LIMITS.pricing.description}>
                      <Area value={p.description} max={LIMITS.pricing.description} rows={2} onChange={(v) => patch((d) => { d.pricing[i].description = v; })} />
                    </Field>
                    <div>
                      <label className="block text-[13px] font-semibold text-stone-800">Features (one per line, up to 10)</label>
                      <textarea
                        rows={4}
                        value={p.features.join("\n")}
                        onChange={(e) => {
                          const feats = e.target.value.split("\n").filter((f) => f.trim().length > 0).slice(0, 10);
                          patch((d) => { d.pricing[i].features = feats; });
                        }}
                        placeholder="Full Product Architecture&#10;Design System & Tokens&#10;Weekly Strategy Calls"
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Button text" value={p.ctaText} max={LIMITS.pricing.cta}>
                        <Text value={p.ctaText} max={LIMITS.pricing.cta} placeholder="Book Package" onChange={(v) => patch((d) => { d.pricing[i].ctaText = v; })} />
                      </Field>
                      <Field label="Button URL" value={p.ctaHref} max={500}>
                        <Text value={p.ctaHref} max={500} placeholder="#contact or https://calendly.com/…" onChange={(v) => patch((d) => { d.pricing[i].ctaHref = v; })} />
                      </Field>
                    </div>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "awards" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold">Awards & Honors ({draft.awards.length}/{MAX_COUNT.awards})</h3>
                  <p className="text-[12px] text-stone-400">Design awards, industry recognitions, and publication features.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection("awards")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:border-red-300 hover:bg-red-100 transition shadow-sm"
                    title="Remove Awards section from portfolio"
                  >
                    <Trash2 size={13} />
                    <span>Remove Section</span>
                  </button>
                  <button
                    disabled={draft.awards.length >= MAX_COUNT.awards}
                    onClick={() =>
                      patch((d) => {
                        d.awards.push({
                          year: new Date().getFullYear().toString(),
                          title: "New award",
                          organization: "Design Award",
                          project: "",
                          link: "",
                        });
                      })
                    }
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.awards.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first award or honor.</p>}
              {draft.awards.map((a, i) => (
                <ItemCard
                  key={i}
                  title={a.title || `Award ${i + 1}`}
                  badge={`${a.year} · ${a.organization}${a.project ? ` · ${a.project}` : ""}`}
                  fallback={a.year}
                  open={isOpen("awards", i)}
                  onToggle={() => toggleOpen("awards", i)}
                  actions={
                    <RowButtons
                      index={i}
                      total={draft.awards.length}
                      onMove={(dir) => patch((d) => { d.awards = move(d.awards, i, dir); })}
                      onDelete={() => patch((d) => { d.awards.splice(i, 1); })}
                      onDuplicate={() =>
                        patch((d) => {
                          if (d.awards.length < MAX_COUNT.awards)
                            d.awards.splice(i + 1, 0, structuredClone(d.awards[i]));
                        })
                      }
                    />
                  }
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        <Field label="Year" value={a.year} max={LIMITS.award.year} required>
                          <Text value={a.year} max={LIMITS.award.year} placeholder="2024" onChange={(v) => patch((d) => { d.awards[i].year = v; })} />
                        </Field>
                      </div>
                      <div className="col-span-3">
                        <Field label="Award / Honor title" value={a.title} max={LIMITS.award.title} required>
                          <Text value={a.title} max={LIMITS.award.title} onChange={(v) => patch((d) => { d.awards[i].title = v; })} />
                        </Field>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Organization / Body" value={a.organization} max={LIMITS.award.organization} required>
                        <Text value={a.organization} max={LIMITS.award.organization} placeholder="e.g. Awwwards, UX Design Awards" onChange={(v) => patch((d) => { d.awards[i].organization = v; })} />
                      </Field>
                      <Field label="Project name" value={a.project} max={LIMITS.award.project}>
                        <Text value={a.project} max={LIMITS.award.project} placeholder="e.g. FinTech App" onChange={(v) => patch((d) => { d.awards[i].project = v; })} />
                      </Field>
                    </div>
                    <Field label="Verification URL (optional)" value={a.link} max={500} hint="External link to view the award announcement.">
                      <Text value={a.link} max={500} placeholder="https://…" onChange={(v) => patch((d) => { d.awards[i].link = v; })} />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </section>
          )}

          {tab === "contact" && (
            <section className="space-y-4">
              <h3 className="text-[14px] font-semibold">Contact details</h3>
              <Field label="Email" value={draft.site.email} max={LIMITS.site.email} hint="Empty hides the email row on the public site.">
                <Text value={draft.site.email} max={LIMITS.site.email} onChange={(v) => patch((d) => { d.site.email = v; })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone label" value={draft.site.phoneDisplay} max={LIMITS.site.phone}>
                  <Text value={draft.site.phoneDisplay} max={LIMITS.site.phone} onChange={(v) => patch((d) => { d.site.phoneDisplay = v; })} />
                </Field>
                <Field label="Phone link" value={draft.site.phoneHref} max={LIMITS.site.url}>
                  <Text value={draft.site.phoneHref} max={LIMITS.site.url} onChange={(v) => patch((d) => { d.site.phoneHref = v; })} />
                </Field>
              </div>
              {(
                [
                  ["calendly", "Calendly URL"],
                  ["resumeHref", "Resume URL"],
                  ["contraHref", "Contra URL"],
                  ["behanceUrl", "Behance URL"],
                  ["linkedinUrl", "LinkedIn URL"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label} value={draft.site[key]} max={LIMITS.site.url} hint="Empty hides the matching button.">
                  <Text value={draft.site[key]} max={LIMITS.site.url} onChange={(v) => patch((d) => { d.site[key] = v; })} />
                </Field>
              ))}
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-[14px] font-semibold">Social links ({draft.socials.length}/{MAX_COUNT.socials})</h3>
                <button
                  disabled={draft.socials.length >= MAX_COUNT.socials}
                  onClick={() => patch((d) => { d.socials.push({ label: "New", href: "" }); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              <p className="text-[12px] text-stone-400">Links with an empty URL are hidden from the public strip.</p>
              {draft.socials.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.socials.map((s, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-stone-600">{s.label || `Link ${i + 1}`}</span>
                    <RowButtons
                      index={i}
                      total={draft.socials.length}
                      onMove={(dir) => patch((d) => { d.socials = move(d.socials, i, dir); })}
                      onDelete={() => patch((d) => { d.socials.splice(i, 1); })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Label" value={s.label} max={LIMITS.social.label}>
                      <Text value={s.label} max={LIMITS.social.label} onChange={(v) => patch((d) => { d.socials[i].label = v; })} />
                    </Field>
                    <Field label="URL" value={s.href} max={LIMITS.social.href}>
                      <Text value={s.href} max={LIMITS.social.href} onChange={(v) => patch((d) => { d.socials[i].href = v; })} />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
          )}

          {tab === "site-settings" && (
            <section className="space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold">Site identity</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Name, role, tagline, and imagery. The design system itself stays locked.</p>
              </div>
              <Field label="Name" value={draft.site.name} max={LIMITS.site.name} required>
                <Text value={draft.site.name} max={LIMITS.site.name} onChange={(v) => patch((d) => { d.site.name = v; })} />
              </Field>
              <Field label="Role" value={draft.site.role} max={LIMITS.site.role}>
                <Text value={draft.site.role} max={LIMITS.site.role} onChange={(v) => patch((d) => { d.site.role = v; })} />
              </Field>
              <Field label="Tagline" value={draft.site.tagline} max={LIMITS.site.tagline}>
                <Text value={draft.site.tagline} max={LIMITS.site.tagline} onChange={(v) => patch((d) => { d.site.tagline = v; })} />
              </Field>
              <div>
                <label className="block text-[13px] font-semibold text-stone-800 mb-1.5">
                  Hero Portrait Cutout / Image
                </label>
                <HeroPortraitField
                  value={draft.hero.personImage || draft.site.heroImage || ""}
                  onChange={(v) =>
                    patch((d) => {
                      d.hero.personImage = v;
                      d.site.heroImage = v;
                    })
                  }
                />
              </div>
              <Field label="About portrait" value={draft.site.aboutImage} hint="Cropped to 4:5. Empty hides the portrait.">
                <ImageField value={draft.site.aboutImage} aspect="4/5" onChange={(v) => patch((d) => { d.site.aboutImage = v; })} />
              </Field>
              <Field label="Social/OG image" value={draft.site.ogImage} hint="Used for metadata when no share image is set in SEO.">
                <ImageField value={draft.site.ogImage} onChange={(v) => patch((d) => { d.site.ogImage = v; })} />
              </Field>
              <div className="pt-2">
                <h3 className="text-[14px] font-semibold">Company banner (hero strip)</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Names marquee across the hero bottom. Add a logo image per name, or leave logos empty for text.</p>
              </div>
              <Field label="Companies" value={draft.clientLogos} max={MAX_COUNT.clientLogos} hint="One per line.">
                <Area
                  value={draft.clientLogos.join("\n")}
                  rows={4}
                  onChange={(v) =>
                    patch((d) => {
                      d.clientLogos = v.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, MAX_COUNT.clientLogos);
                    })
                  }
                />
              </Field>
              <Field label="Marquee speed" value={String(draft.logoMarqueeSpeed ?? 8)} hint="1 = fastest, 10 = slowest (≈80s per loop). Decimals allowed, e.g. 3.5, 7.2.">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={draft.logoMarqueeSpeed ?? 8}
                    onChange={(e) => patch((d) => { d.logoMarqueeSpeed = Math.min(10, Math.max(1, Number(e.target.value) || 1)); })}
                    className="mt-1.5 flex-1 accent-stone-900"
                  />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.1}
                    value={draft.logoMarqueeSpeed ?? 8}
                    onChange={(e) => patch((d) => { d.logoMarqueeSpeed = Math.min(10, Math.max(1, Number(e.target.value) || 1)); })}
                    className="mt-1.5 w-20 shrink-0 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-[14px] text-stone-900 focus:border-stone-400 focus:outline-none"
                  />
                  <span className="mt-1.5 shrink-0 text-[12px] text-stone-400">/ 10</span>
                </div>
              </Field>
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold">Banner logos ({draft.logoImages.length}/{MAX_COUNT.logoImages})</h3>
                <button
                  disabled={draft.logoImages.length >= MAX_COUNT.logoImages}
                  onClick={() => patch((d) => { d.logoImages.push(""); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              {draft.logoImages.length === 0 && <p className="text-[13px] text-stone-400">No logos — names render as text.</p>}
              {draft.logoImages.map((src, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-stone-600">
                      Logo {i + 1}{draft.clientLogos[i] ? ` — ${draft.clientLogos[i]}` : ""}
                    </span>
                    <RowButtons
                      index={i}
                      total={draft.logoImages.length}
                      onMove={(dir) => patch((d) => { d.logoImages = move(d.logoImages, i, dir); })}
                      onDelete={() => patch((d) => { d.logoImages.splice(i, 1); })}
                    />
                  </div>
                  <ImageField value={src} hint="White-friendly mark works best; shown inverted." onChange={(v) => patch((d) => { d.logoImages[i] = v; })} />
                </div>
              ))}
              <div className="pt-2">
                <h3 className="text-[14px] font-semibold">Favicon</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">The small icon in the browser tab. Square mark works best. Applies on publish.</p>
              </div>
              <Field label="Icon" value={draft.site.favicon} hint="Cropped to 1:1.">
                <ImageField value={draft.site.favicon} aspect="1/1" onChange={(v) => patch((d) => { d.site.favicon = v; })} />
              </Field>
              <div className="pt-2">
                <h3 className="text-[14px] font-semibold">Footer copyright</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Leave blank to automatically display the current year and your name.</p>
              </div>
              <Field label="Copyright notice" value={draft.site.copyrightNotice} max={LIMITS.copyright}>
                <Text value={draft.site.copyrightNotice} max={LIMITS.copyright} onChange={(v) => patch((d) => { d.site.copyrightNotice = v; })} />
              </Field>
            </section>
          )}

          {tab === "seo" && (
            <section className="space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold">Search & social</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Empty fields fall back to site content automatically.</p>
              </div>
              <Field label="Page title" value={draft.seo.title} max={LIMITS.seo.title} hint="Aim for ~60 characters. Empty uses name + role.">
                <Text value={draft.seo.title} max={LIMITS.seo.title} onChange={(v) => patch((d) => { d.seo.title = v; })} />
              </Field>
              <Field label="Meta description" value={draft.seo.description} max={LIMITS.seo.description} hint="Aim for ~160 characters. Empty uses the hero subtitle.">
                <Area value={draft.seo.description} max={LIMITS.seo.description} rows={3} onChange={(v) => patch((d) => { d.seo.description = v; })} />
              </Field>
              <Field label="X / Twitter handle" value={draft.seo.twitterHandle} max={LIMITS.seo.handle} hint="Attributed in twitter:creator and twitter:site cards.">
                <Text value={draft.seo.twitterHandle} max={LIMITS.seo.handle} placeholder="@handle" onChange={(v) => patch((d) => { d.seo.twitterHandle = v; })} />
              </Field>
              <Field label="Canonical URL" value={draft.seo.canonicalUrl} max={LIMITS.seo.url} hint="The single official URL for this page.">
                <Text value={draft.seo.canonicalUrl} max={LIMITS.seo.url} placeholder="https://…" onChange={(v) => patch((d) => { d.seo.canonicalUrl = v; })} />
              </Field>
              <div>
                <h3 className="text-[14px] font-semibold">Keywords & AI reach</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Auto-derived keywords compile from your projects, services, skills, and companies to help search engines discover the work.</p>
              </div>
              <div className={`${cardCls} !p-4`}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Auto-derived keywords ({autoKeywords.length})
                </p>
                {autoKeywords.length === 0 ? (
                  <p className="mt-2 text-[13px] text-stone-400">Add content to generate keywords.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {autoKeywords.map((k) => (
                      <span key={k} className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-[12px] text-stone-600">
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold">Custom keywords ({draft.seo.customKeywords.length}/{MAX_COUNT.customKeywords})</h3>
                <div className="flex gap-2">
                  <input
                    value={newKeyword}
                    maxLength={LIMITS.seo.keyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const t = newKeyword.trim();
                        if (t && draft.seo.customKeywords.length < MAX_COUNT.customKeywords) {
                          patch((d) => { d.seo.customKeywords.push(t); });
                          setNewKeyword("");
                        }
                      }
                    }}
                    placeholder="Add keyword…"
                    className="w-36 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                  <button
                    disabled={!newKeyword.trim() || draft.seo.customKeywords.length >= MAX_COUNT.customKeywords}
                    onClick={() => {
                      const t = newKeyword.trim();
                      if (!t) return;
                      patch((d) => { d.seo.customKeywords.push(t); });
                      setNewKeyword("");
                    }}
                    className={addBtnCls}
                  >
                    Add
                  </button>
                </div>
              </div>
              {draft.seo.customKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {draft.seo.customKeywords.map((k, i) => (
                    <span key={`${k}-${i}`} className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-2.5 py-1 text-[12px] text-stone-700">
                      {k}
                      <button
                        aria-label={`Remove keyword ${k}`}
                        onClick={() => patch((d) => { d.seo.customKeywords.splice(i, 1); })}
                        className="text-stone-400 hover:text-stone-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div>
                <h3 className="text-[14px] font-semibold">Search console & analytics</h3>
                <p className="mt-0.5 text-[12px] text-stone-400">Verify ownership with search engines and connect visitor tracking.</p>
              </div>
              <Field label="Google site verification code" value={draft.seo.googleSiteVerification} max={LIMITS.seo.verification} hint="Just the code, not the full meta tag.">
                <Text value={draft.seo.googleSiteVerification} max={LIMITS.seo.verification} onChange={(v) => patch((d) => { d.seo.googleSiteVerification = v; })} />
              </Field>
              <Field label="Google Analytics ID" value={draft.seo.analyticsId} max={LIMITS.seo.analytics} hint="Measurement ID like G-XXXXXXXXXX. Loads gtag on the public site.">
                <Text value={draft.seo.analyticsId} max={LIMITS.seo.analytics} placeholder="G-XXXXXXXXXX" onChange={(v) => patch((d) => { d.seo.analyticsId = v; })} />
              </Field>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-stone-200/90 bg-white p-3.5 text-[14px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <input
                  type="checkbox"
                  checked={draft.seo.noIndex}
                  onChange={(e) => patch((d) => { d.seo.noIndex = e.target.checked; })}
                  className="size-4 accent-black"
                />
                <span>
                  Hide from search engines
                  <span className="block text-[12px] font-normal text-stone-400">Adds noindex, nofollow to the public site.</span>
                </span>
              </label>
            </section>
          )}

          {tab === "publish" && (
            <section className="space-y-4">
              <p className="text-[13px] leading-relaxed text-stone-500">
                Editing autosaves to the <strong className="text-stone-900">draft</strong> only — visitors see the published
                version (v{version}) until you publish. Publishing archives the current version first (latest 20 kept).
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Draft</p>
                  <p className={`mt-1 text-[14px] font-semibold ${dirty ? "text-red-600" : "text-green-700"}`}>
                    {dirty ? "Unpublished changes" : "Matches published"}
                  </p>
                </div>
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Publishing as</p>
                  <p className="mt-1 font-heading text-[22px] font-bold">v{version + 1}</p>
                </div>
              </div>
              <button
                onClick={() => void publish()}
                disabled={publishing || !dirty}
                title={!dirty ? "No unpublished changes to publish" : `Publish draft as v${version + 1}`}
                className={`w-full rounded-full py-3 text-[14px] font-semibold transition ${
                  dirty
                    ? "bg-black text-white hover:bg-stone-800 shadow-sm cursor-pointer"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed opacity-60"
                }`}
              >
                {publishing ? "Publishing…" : dirty ? `Publish draft as v${version + 1}` : "No unpublished changes to publish"}
              </button>
              {dirtyTabs.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Going live in v{version + 1} ({dirtyTabs.length} section{dirtyTabs.length === 1 ? "" : "s"})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {dirtyTabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-medium text-stone-600 hover:bg-stone-100"
                      >
                        <t.Icon size={13} aria-hidden />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {publishMsg && (
                <p aria-live="polite" className="text-[13px] font-medium text-green-700">
                  {publishMsg}
                </p>
              )}
            </section>
          )}

          {tab === "history" && (
            <section className="space-y-3">
              <p className="text-[12px] text-stone-400">Restoring archives the current version first — nothing is ever silently deleted.</p>
              {publishMsg && (
                <p aria-live="polite" className="text-[13px] font-medium text-green-700">
                  {publishMsg}
                </p>
              )}
              {history.length === 0 && <p className="text-[13px] text-stone-400">No archived versions yet.</p>}
              {history.map((h) => (
                <div key={h.id} className={`${cardCls} flex items-center gap-3`}>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold">v{h.version}</p>
                    <p className="text-[12px] text-stone-400">{new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => void restore(h.id)}
                    className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </section>
          )}

          {tab === "custom-section" && (() => {
            const customSec = (draft.customSections || []).find((s) => s.id === activeCustomSectionId);

            if (!customSec) {
              return (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setTab("sections")}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-stone-900 hover:underline cursor-pointer"
                  >
                    ← Back to Sections & Nav
                  </button>
                  <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
                    <p className="text-[14px] text-stone-600">No custom section currently selected.</p>
                    <button
                      type="button"
                      onClick={() => setTab("sections")}
                      className="mt-3 rounded-xl bg-black px-4 py-2 text-[12px] font-semibold text-white cursor-pointer hover:bg-stone-800 transition"
                    >
                      Go to Sections & Nav
                    </button>
                  </div>
                </div>
              );
            }

            const tmplInfo = CUSTOM_SECTION_TEMPLATES.find((t) => t.template === customSec.template);

            return (
              <section className="space-y-4">
                {/* Header: Clean & unburdened */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div className="space-y-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => setTab("sections")}
                      className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer"
                    >
                      ← Back to Sections & Nav
                    </button>
                    <div className="flex items-center gap-2.5">
                      <h3 className="truncate text-[18px] font-bold text-stone-900">
                        {customSec.title || "Custom Section"}
                      </h3>
                      <span className="shrink-0 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                        {tmplInfo?.name || customSec.template}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => duplicateCustomSection(customSec.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>Duplicate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        patch((d) => {
                          d.sections.visible[customSec.id] = draft.sections.visible[customSec.id] === false ? true : false;
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-medium transition cursor-pointer ${
                        draft.sections.visible[customSec.id] !== false
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-stone-200 bg-stone-100 text-stone-400"
                      }`}
                    >
                      {draft.sections.visible[customSec.id] !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{draft.sections.visible[customSec.id] !== false ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSection(customSec.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* 1. Main Content Card (Immediate focus!) */}
                <div className={`${cardCls} space-y-4`}>
                  <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                    <div>
                      <h4 className="text-[14.5px] font-bold text-stone-900">Content</h4>
                      <p className="text-[12px] text-stone-400">Headlines and message text for this section.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-stone-700">Eyebrow Tag</label>
                      <input
                        type="text"
                        value={customSec.eyebrow || ""}
                        onChange={(e) =>
                          patch((d) => {
                            const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                            if (sec) sec.eyebrow = e.target.value;
                          })
                        }
                        placeholder="e.g. Visual Focus"
                        className={`mt-1 ${inputCls}`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[12.5px] font-semibold text-stone-700">Section Title</label>
                      <input
                        type="text"
                        value={customSec.title || ""}
                        onChange={(e) =>
                          patch((d) => {
                            const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                            if (sec) sec.title = e.target.value;
                          })
                        }
                        placeholder="Main headline"
                        className={`mt-1 ${inputCls}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-stone-700">Subtitle / Lead-in</label>
                    <textarea
                      rows={2}
                      value={customSec.subtitle || ""}
                      onChange={(e) =>
                        patch((d) => {
                          const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                          if (sec) sec.subtitle = e.target.value;
                        })
                      }
                      placeholder="High-level introductory phrase or supporting statement"
                      className={`mt-1 ${inputCls}`}
                    />
                  </div>

                  {(customSec.template === "text-story" || customSec.template === "image-text") && (
                    <div>
                      <label className="block text-[12.5px] font-semibold text-stone-700">Narrative Body Text</label>
                      <textarea
                        rows={4}
                        value={customSec.body || ""}
                        onChange={(e) =>
                          patch((d) => {
                            const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                            if (sec) sec.body = e.target.value;
                          })
                        }
                        placeholder="Paragraphs describing your narrative, philosophy, or framework..."
                        className={`mt-1 ${inputCls}`}
                      />
                    </div>
                  )}

                  {/* Template-specific details inside Content */}
                  {/* Template 2: Image + Text */}
                  {customSec.template === "image-text" && (
                    <div className="pt-3 border-t border-stone-100 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12.5px] font-semibold text-stone-700 mb-1">Featured Photo / Graphic</label>
                          <ImageField
                            value={customSec.image || ""}
                            onChange={(url) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.image = url;
                              })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[12.5px] font-semibold text-stone-700 mb-1.5">Image Layout</label>
                            <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-0.5 text-[12px] font-medium">
                              <button
                                type="button"
                                onClick={() =>
                                  patch((d) => {
                                    const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                    if (sec) sec.imagePosition = "right";
                                  })
                                }
                                className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                                  customSec.imagePosition !== "left"
                                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                                    : "text-stone-600 hover:text-stone-900"
                                }`}
                              >
                                Image on Right
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  patch((d) => {
                                    const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                    if (sec) sec.imagePosition = "left";
                                  })
                                }
                                className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                                  customSec.imagePosition === "left"
                                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                                    : "text-stone-600 hover:text-stone-900"
                                }`}
                              >
                                Image on Left
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[12px] font-semibold text-stone-700">Button Text</label>
                              <input
                                type="text"
                                value={customSec.ctaPrimaryText || ""}
                                onChange={(e) =>
                                  patch((d) => {
                                    const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                    if (sec) sec.ctaPrimaryText = e.target.value;
                                  })
                                }
                                placeholder="e.g. Explore"
                                className={`mt-1 ${inputCls}`}
                              />
                            </div>
                            <div>
                              <label className="block text-[12px] font-semibold text-stone-700">Button Link</label>
                              <input
                                type="text"
                                value={customSec.ctaPrimaryHref || ""}
                                onChange={(e) =>
                                  patch((d) => {
                                    const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                    if (sec) sec.ctaPrimaryHref = e.target.value;
                                  })
                                }
                                placeholder="#contact"
                                className={`mt-1 ${inputCls}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template 3: Cards / Grid */}
                  {customSec.template === "cards-grid" && (
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-bold text-stone-900">Grid Cards ({(customSec.cards || []).length})</label>
                        <button
                          type="button"
                          onClick={() =>
                            patch((d) => {
                              const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                              if (sec) {
                                if (!sec.cards) sec.cards = [];
                                sec.cards.push({
                                  id: `card-${Date.now().toString(36)}`,
                                  title: "New Principle / Offering",
                                  description: "Brief description of this core capability or principle.",
                                  tag: "Capability",
                                });
                              }
                            })
                          }
                          className={addBtnCls}
                        >
                          + Add Card
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(customSec.cards || []).map((card, idx) => {
                          const cardId = card.id;
                          return (
                            <div key={cardId || idx} className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-bold text-stone-700">Card #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    patch((d) => {
                                      const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                      if (sec && sec.cards) {
                                        sec.cards = sec.cards.filter((c, i) => cardId ? c.id !== cardId : i !== idx);
                                      }
                                    })
                                  }
                                  className="text-[11.5px] font-medium text-red-600 hover:underline cursor-pointer"
                                >
                                  Delete Card
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                  <label className="block text-[11.5px] font-semibold text-stone-600">Card Title</label>
                                  <input
                                    type="text"
                                    value={card.title || ""}
                                    onChange={(e) =>
                                      patch((d) => {
                                        const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                        if (sec && sec.cards?.[idx]) sec.cards[idx].title = e.target.value;
                                      })
                                    }
                                    placeholder="Title"
                                    className={`mt-0.5 ${inputCls}`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11.5px] font-semibold text-stone-600">Tag / Badge</label>
                                  <input
                                    type="text"
                                    value={card.tag || ""}
                                    onChange={(e) =>
                                      patch((d) => {
                                        const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                        if (sec && sec.cards?.[idx]) sec.cards[idx].tag = e.target.value;
                                      })
                                    }
                                    placeholder="e.g. UX Strategy"
                                    className={`mt-0.5 ${inputCls}`}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11.5px] font-semibold text-stone-600">Description</label>
                                <textarea
                                  rows={2}
                                  value={card.description || ""}
                                  onChange={(e) =>
                                    patch((d) => {
                                      const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                      if (sec && sec.cards?.[idx]) sec.cards[idx].description = e.target.value;
                                    })
                                  }
                                  placeholder="Description..."
                                  className={`mt-0.5 ${inputCls}`}
                                />
                              </div>

                              <div>
                                <label className="block text-[11.5px] font-semibold text-stone-600">Optional Link URL</label>
                                <input
                                  type="text"
                                  value={card.link || ""}
                                  onChange={(e) =>
                                    patch((d) => {
                                      const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                      if (sec && sec.cards?.[idx]) sec.cards[idx].link = e.target.value;
                                    })
                                  }
                                  placeholder="https://... or #contact"
                                  className={`mt-0.5 ${inputCls}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Template 4: Metrics / Highlights */}
                  {customSec.template === "metrics" && (
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-bold text-stone-900">Key Statistics ({(customSec.metrics || []).length})</label>
                        <button
                          type="button"
                          onClick={() =>
                            patch((d) => {
                              const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                              if (sec) {
                                if (!sec.metrics) sec.metrics = [];
                                sec.metrics.push({
                                  id: `metric-${Date.now().toString(36)}`,
                                  value: "100%",
                                  label: "Quality Score",
                                });
                              }
                            })
                          }
                          className={addBtnCls}
                        >
                          + Add Metric
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(customSec.metrics || []).map((m, idx) => {
                          const metricId = m.id;
                          return (
                            <div key={metricId || idx} className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11.5px] font-bold text-stone-700">Metric #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    patch((d) => {
                                      const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                      if (sec && sec.metrics) {
                                        sec.metrics = sec.metrics.filter((item, i) => metricId ? item.id !== metricId : i !== idx);
                                      }
                                    })
                                  }
                                  className="text-[11px] font-medium text-red-600 hover:underline cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-semibold text-stone-600">Value</label>
                                  <input
                                    type="text"
                                    value={m.value || ""}
                                    onChange={(e) =>
                                      patch((d) => {
                                        const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                        if (sec && sec.metrics?.[idx]) sec.metrics[idx].value = e.target.value;
                                      })
                                    }
                                    placeholder="e.g. 98.4%"
                                    className={`mt-0.5 ${inputCls}`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-stone-600">Suffix</label>
                                  <input
                                    type="text"
                                    value={m.suffix || ""}
                                    onChange={(e) =>
                                      patch((d) => {
                                        const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                        if (sec && sec.metrics?.[idx]) sec.metrics[idx].suffix = e.target.value;
                                      })
                                    }
                                    placeholder="e.g. +"
                                    className={`mt-0.5 ${inputCls}`}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-stone-600">Label</label>
                                <input
                                  type="text"
                                  value={m.label || ""}
                                  onChange={(e) =>
                                    patch((d) => {
                                      const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                      if (sec && sec.metrics?.[idx]) sec.metrics[idx].label = e.target.value;
                                    })
                                  }
                                  placeholder="e.g. Client Satisfaction"
                                  className={`mt-0.5 ${inputCls}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Template 5: Quote / Testimonial */}
                  {customSec.template === "quote-testimonial" && (
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div>
                        <label className="block text-[12.5px] font-semibold text-stone-700">Quote Text</label>
                        <textarea
                          rows={3}
                          value={customSec.quoteText || ""}
                          onChange={(e) =>
                            patch((d) => {
                              const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                              if (sec) sec.quoteText = e.target.value;
                            })
                          }
                          placeholder="Client quote or statement..."
                          className={`mt-1 ${inputCls}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Author Name</label>
                          <input
                            type="text"
                            value={customSec.quoteAuthor || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.quoteAuthor = e.target.value;
                              })
                            }
                            placeholder="e.g. Elena Rostova"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Role & Company</label>
                          <input
                            type="text"
                            value={customSec.quoteRole || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.quoteRole = e.target.value;
                              })
                            }
                            placeholder="e.g. CPO, ScaleFlow"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template 6: CTA / Callout */}
                  {customSec.template === "cta" && (
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Primary Button Text</label>
                          <input
                            type="text"
                            value={customSec.ctaPrimaryText || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.ctaPrimaryText = e.target.value;
                              })
                            }
                            placeholder="e.g. Get in touch"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Primary Button Link</label>
                          <input
                            type="text"
                            value={customSec.ctaPrimaryHref || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.ctaPrimaryHref = e.target.value;
                              })
                            }
                            placeholder="#contact"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Secondary Button Text</label>
                          <input
                            type="text"
                            value={customSec.ctaSecondaryText || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.ctaSecondaryText = e.target.value;
                              })
                            }
                            placeholder="Optional secondary action"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-700">Secondary Button Link</label>
                          <input
                            type="text"
                            value={customSec.ctaSecondaryHref || ""}
                            onChange={(e) =>
                              patch((d) => {
                                const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                if (sec) sec.ctaSecondaryHref = e.target.value;
                              })
                            }
                            placeholder="#"
                            className={`mt-1 ${inputCls}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Atmosphere & Style (Compact, clean bar) */}
                <div className={`${cardCls} space-y-3`}>
                  <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-stone-900 text-white shadow-2xs">
                      <Sparkles size={12} />
                    </span>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-stone-900">Atmosphere & Glow Theme</h4>
                      <p className="text-[11.5px] text-stone-400">Ambient background lighting and motion effect.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-stone-700 mb-1.5">Accent Glow</label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: "violet", label: "Violet", hex: "#7c3aed" },
                          { id: "blue", label: "Blue", hex: "#2563eb" },
                          { id: "emerald", label: "Emerald", hex: "#10b981" },
                          { id: "amber", label: "Amber", hex: "#f59e0b" },
                          { id: "rose", label: "Rose", hex: "#e11d48" },
                          { id: "cyan", label: "Cyan", hex: "#06b6d4" },
                          { id: "monochrome", label: "Stealth", hex: "#1c1917" },
                          { id: "none", label: "None", hex: "#44403c" },
                        ].map((col) => {
                          const isSelected = (customSec.bgColor || "violet") === col.id;
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() =>
                                patch((d) => {
                                  const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                  if (sec) sec.bgColor = col.id as any;
                                })
                              }
                              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                                isSelected
                                  ? "border-black bg-black text-white shadow-xs font-semibold"
                                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                              }`}
                            >
                              <span className="size-2 rounded-full" style={{ backgroundColor: col.hex }} />
                              <span>{col.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-stone-700 mb-1.5">Motion Style</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "aurora", label: "Aurora Drift" },
                          { id: "pulse", label: "Breathing Pulse" },
                          { id: "drift", label: "Horizontal Drift" },
                          { id: "none", label: "Static (No Motion)" },
                        ].map((anim) => {
                          const isSelected = (customSec.bgAnimation || "aurora") === anim.id;
                          return (
                            <button
                              key={anim.id}
                              type="button"
                              onClick={() =>
                                patch((d) => {
                                  const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                                  if (sec) sec.bgAnimation = anim.id as any;
                                })
                              }
                              className={`rounded-lg border px-2.5 py-1.5 text-center text-[11.5px] font-medium transition cursor-pointer ${
                                isSelected
                                  ? "border-black bg-black text-white shadow-2xs font-semibold"
                                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                              }`}
                            >
                              {anim.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Header Navigation (Compact 1-line setting, zero jargon) */}
                <div className={`${cardCls} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-stone-900 text-white shadow-2xs">
                        <Layers size={12} />
                      </span>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-stone-900">Navigation Menu Link</h4>
                        <p className="text-[11.5px] text-stone-400">Show this section in the site header navigation.</p>
                      </div>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={customSec.inNav ?? false}
                        onChange={(e) =>
                          patch((d) => {
                            const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                            if (sec) {
                              sec.inNav = e.target.checked;
                              if (e.target.checked && !sec.navLabel) {
                                sec.navLabel = tmplInfo?.defaultNavLabel || "Section";
                              }
                            }
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-stone-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-black peer-checked:after:translate-x-full peer-focus:outline-none" />
                    </label>
                  </div>

                  {customSec.inNav && (
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
                      <label className="text-[12px] font-semibold text-stone-700">Navbar Link Text:</label>
                      <input
                        type="text"
                        value={customSec.navLabel || ""}
                        onChange={(e) =>
                          patch((d) => {
                            const sec = (d.customSections || []).find((s) => s.id === customSec.id);
                            if (sec) sec.navLabel = e.target.value;
                          })
                        }
                        placeholder="e.g. Focus"
                        className="max-w-[200px] rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[12.5px] text-stone-900 focus:border-stone-900 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          })()}
        </main>

        {/* live preview — 1/3rd of screen column at right side */}
        <div className={`${view === "edit" ? "hidden" : ""} ${previewOpen ? "lg:flex" : "lg:hidden"} min-w-0 flex-col border-t border-stone-200/80 bg-[#faf9f6] lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:overflow-hidden lg:border-l lg:border-t-0`}>
          <div className="flex h-full flex-col">
            {/* Top Bar: Title & Controls */}
            <div className="shrink-0 px-4 pt-4 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
                  LIVE PREVIEW
                </span>
                <span className="text-[12px] font-mono text-stone-400">
                  {selectedDevice.width} × {selectedDevice.height}{zoom ? ` · ${zoom}%` : ""}
                </span>
              </div>

              {/* Controls Row: Left Dropdown, Right Segmented Pill */}
              <div className="mt-2.5 flex items-center justify-between gap-3">
                {/* Left: Device model dropdown */}
                <div className="relative min-w-0 flex-1 max-w-[240px]">
                  <select
                    value={selectedDevice.id}
                    onChange={(e) => {
                      const dev = DEVICE_MODELS.find((m) => m.id === e.target.value);
                      if (dev) {
                        setSelectedDevice(dev);
                        setSelectedCategory(dev.category);
                      }
                    }}
                    aria-label="Select device model"
                    className="w-full appearance-none rounded-xl border border-stone-200/90 bg-white py-1.5 pl-3.5 pr-8 text-[12.5px] font-medium text-stone-800 shadow-2xs transition hover:border-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 focus:outline-none cursor-pointer"
                  >
                    <optgroup label="Desktop & Laptops">
                      {DEVICE_MODELS.filter((m) => m.category === "desktop").map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.width}×{p.height}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Tablets">
                      {DEVICE_MODELS.filter((m) => m.category === "tablet").map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.width}×{p.height}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Mobile Phones">
                      {DEVICE_MODELS.filter((m) => m.category === "mobile").map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.width}×{p.height}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500"
                    aria-hidden
                  />
                </div>

                {/* Right: Segmented Category Switcher Icons [ Smartphone ] [ Tablet ] [ Monitor ] */}
                <div className="flex shrink-0 items-center rounded-xl border border-stone-200/90 bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("mobile");
                      if (selectedDevice.category !== "mobile") {
                        setSelectedDevice(
                          DEVICE_MODELS.find((m) => m.id === "phone-15-pro") ?? DEVICE_MODELS[12]
                        );
                      }
                    }}
                    aria-label="Mobile phone preview"
                    aria-pressed={selectedCategory === "mobile"}
                    title="Mobile preview"
                    className={`grid size-8 place-items-center rounded-lg transition cursor-pointer ${
                      selectedCategory === "mobile"
                        ? "bg-black text-white shadow-2xs"
                        : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <Smartphone size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("tablet");
                      if (selectedDevice.category !== "tablet") {
                        setSelectedDevice(
                          DEVICE_MODELS.find((m) => m.id === "tablet-ipad-air") ?? DEVICE_MODELS[7]
                        );
                      }
                    }}
                    aria-label="Tablet preview"
                    aria-pressed={selectedCategory === "tablet"}
                    title="Tablet preview"
                    className={`grid size-8 place-items-center rounded-lg transition cursor-pointer ${
                      selectedCategory === "tablet"
                        ? "bg-black text-white shadow-2xs"
                        : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <Tablet size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("desktop");
                      if (selectedDevice.category !== "desktop") {
                        setSelectedDevice(
                          DEVICE_MODELS.find((m) => m.id === "laptop-air") ?? DEVICE_MODELS[0]
                        );
                      }
                    }}
                    aria-label="Desktop and Laptop preview"
                    aria-pressed={selectedCategory === "desktop"}
                    title="Desktop & Laptop preview"
                    className={`grid size-8 place-items-center rounded-lg transition cursor-pointer ${
                      selectedCategory === "desktop"
                        ? "bg-black text-white shadow-2xs"
                        : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <Monitor size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {/* Dotted Canvas Card with Centered Floating Mockup */}
            <div className="flex-1 min-h-0 px-4 pb-4 pt-1">
              <div className="studio-preview-dots h-full w-full rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 flex items-center justify-center overflow-hidden">
                <ScaledPreview device={selectedDevice} draft={draft} activeSectionId={previewTargetSectionId} onScale={setZoom} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile sign-out */}
      <div className="border-t border-stone-200/80 px-4 py-3 lg:hidden">
        <p className="truncate text-[12px] text-stone-400">{email}</p>
        <button onClick={() => void logout()} className="mt-1 text-[13px] font-medium text-stone-500 hover:text-stone-900">
          Sign out
        </button>
      </div>

      {/* Session Inactivity Timeout Warning Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-[400px] rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-[17px] font-bold text-stone-900">Session Timeout Warning</h3>
                <p className="text-[12px] text-stone-500">Inactivity detected in studio</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-stone-600">
              For security, your session will automatically log out in:
            </p>
            <div className="mt-3 flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50/80 py-2.5">
              <span className="font-mono text-[22px] font-bold tracking-wider text-amber-900">
                {Math.floor(timeoutSecondsLeft / 60)}:{String(timeoutSecondsLeft % 60).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 text-center text-[11px] text-stone-400">
              All your latest drafts are auto-saved safely.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={resetActivity}
                className="flex-1 rounded-full bg-black py-2.5 text-[13px] font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99]"
              >
                Stay Signed In
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-[13px] font-medium text-stone-600 transition hover:bg-stone-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublished Changes Inspector Modal */}
      <UnpublishedChangesModal
        isOpen={showChangesModal}
        onClose={() => setShowChangesModal(false)}
        draft={draft}
        publishedSnap={publishedSnap}
        changedKeys={changedKeys}
        onRevertKey={revertKey}
        onRevertAll={revertAll}
        onNavigateTab={(targetTab) => setTab(targetTab)}
        onPublish={() => void publish()}
        publishing={publishing}
        version={version}
      />

      {/* Template Library Modal with Guaranteed Smooth Scrolling */}
      <TemplateLibraryModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        order={order}
        onAddSection={addSection}
        onAddCustomSection={addCustomSection}
        onNavigateToSection={(sectionKey) => setTab(sectionKeyToTab(sectionKey))}
      />
    </div>
  );
}
