"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
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
  Quote,
  Redo2,
  Send,
  Settings,
  Smartphone,
  Sparkles,
  Tablet,
  Eye,
  EyeOff,
  ExternalLink,
  CircleHelp,
  Undo2,
} from "lucide-react";
import type { SectionKey, SiteContent } from "@/lib/schema";
import { LIMITS, MAX_COUNT, SECTION_KEYS, SECTION_LABELS } from "@/lib/schema";
import { autoDerivedKeywords } from "@/lib/seo";
import { Area, Field, ImageField, RowButtons, Text, move } from "./fields";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Gallery } from "@/components/Gallery";
import { Quote as QuoteSection, About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";

export type HistoryEntry = {
  id: number;
  version: number;
  content: SiteContent;
  createdAt: string;
};

type SaveState = "saved" | "saving" | "error";
type View = "edit" | "preview";

type TabId =
  | "overview"
  | "sections"
  | "hero"
  | "intro"
  | "journey"
  | "work"
  | "gallery"
  | "quote"
  | "about"
  | "testimonials"
  | "faq"
  | "contact"
  | "site-settings"
  | "seo"
  | "publish"
  | "history";

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "overview", label: "Overview", Icon: Home },
  { id: "sections", label: "Sections", Icon: Layers },
  { id: "hero", label: "Hero", Icon: Sparkles },
  { id: "intro", label: "Intro", Icon: AlignLeft },
  { id: "journey", label: "Journey", Icon: Map },
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "quote", label: "Quote", Icon: Quote },
  { id: "about", label: "About", Icon: FileText },
  { id: "testimonials", label: "Testimonials", Icon: MessagesSquare },
  { id: "faq", label: "FAQ", Icon: CircleHelp },
  { id: "contact", label: "Contact", Icon: Mail },
  { id: "site-settings", label: "Site settings", Icon: Settings },
  { id: "seo", label: "SEO & Reach", Icon: Globe },
  { id: "publish", label: "Publish", Icon: Send },
  { id: "history", label: "Version history", Icon: History },
];

type PreviewPreset = { id: string; label: string; dims: string; designWidth: number; Icon: typeof Monitor };

const PRESETS: PreviewPreset[] = [
  { id: "laptop", label: "Laptop", dims: "1440 × 900", designWidth: 1440, Icon: Monitor },
  { id: "tablet", label: "Tablet", dims: "820 × 1180", designWidth: 820, Icon: Tablet },
  { id: "phone", label: "Phone", dims: "390 × 844", designWidth: 390, Icon: Smartphone },
];

/**
 * True scaled miniature: the site lays out at the full design width
 * (so breakpoints and vw units behave exactly like the real device),
 * then the whole thing is scaled to fit the panel — like the reference
 * studio's zoomed preview. The inner page scrolls natively.
 */
function ScaledPreview({ designWidth, children }: { designWidth: number; children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 800, h: 600 });

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

  const scale = box.w / designWidth;
  return (
    <div
      ref={wrapRef}
      className="h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.35)]"
    >
      <div
        data-lenis-prevent
        data-studio-preview
        className="overscroll-contain overflow-y-auto bg-white"
        style={{
          width: designWidth,
          height: box.h / scale,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
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
      return `${d.stats.length + d.services.length} items`;
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
  "rounded-2xl border border-stone-200/90 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]";
const addBtnCls =
  "rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-30";
const iconBtnCls =
  "grid size-9 place-items-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-30";

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
  const [preset, setPreset] = useState<PreviewPreset>(PRESETS[0]);
  const [history, setHistory] = useState<HistoryEntry[]>(historyInitial);
  const [publishMsg, setPublishMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [version, setVersion] = useState(meta.version);
  const [publishedAt, setPublishedAt] = useState<string | null>(meta.publishedAt);
  const [newKeyword, setNewKeyword] = useState("");
  const firstRender = useRef(true);
  const router = useRouter();

  const patch = (fn: (d: SiteContent) => void) => dispatch({ type: "patch", fn });
  const undo = () => dispatch({ type: "undo" });
  const redo = () => dispatch({ type: "redo" });

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(publishedSnap),
    [draft, publishedSnap]
  );

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

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/content?scope=history");
      if (res.ok) {
        const json = await res.json();
        setHistory(json.history as HistoryEntry[]);
      }
    } catch {}
  };

  const publish = async () => {
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
  };

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

  const order = draft.sections.order.filter((k) => (SECTION_KEYS as readonly string[]).includes(k));
  const autoKeywords = useMemo(() => autoDerivedKeywords(draft), [draft]);
  const ownerFirst = (draft.site.name.split(" ")[0] || draft.site.name || "there");

  const previewBlocks: Record<SectionKey, React.ReactNode> = {
    hero: <Hero key="hero" data={draft} />,
    intro: <AboutIntro key="intro" data={draft} />,
    projects: <Projects key="projects" data={draft} />,
    skills: <Journey key="skills" data={draft} />,
    gallery: <Gallery key="gallery" data={draft} />,
    quote: <QuoteSection key="quote" data={draft} />,
    about: <About key="about" data={draft} />,
    testimonials: <Testimonials key="testimonials" data={draft} />,
    faq: <Faq key="faq" data={draft} />,
    contact: <Contact key="contact" data={draft} />,
  };

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];
  const saveLabel = saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Save failed";

  const sideNav = (
    <>
      <div className="hidden items-center gap-2.5 px-3 pb-4 pt-1 lg:flex">
        <span className="grid size-9 place-items-center rounded-xl bg-black font-heading text-[15px] font-bold text-white">
          {(draft.site.name.charAt(0) || "S").toUpperCase()}
        </span>
        <span className="text-[14px] font-bold text-stone-900">Content studio</span>
      </div>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          aria-current={tab === t.id ? "true" : undefined}
          className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium ${
            tab === t.id ? "bg-black text-white" : "text-stone-500 hover:bg-black/5 hover:text-stone-900"
          }`}
        >
          <t.Icon size={16} className="shrink-0" aria-hidden />
          {t.label}
        </button>
      ))}
      <div className="mt-1 hidden border-t border-stone-200 pt-3 lg:block">
        <p className="truncate px-3 text-[12px] text-stone-400">{email}</p>
        <button
          onClick={() => void logout()}
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-stone-500 hover:bg-black/5 hover:text-stone-900"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f2ec] text-stone-900">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f4f2ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-lg bg-black font-heading text-[14px] font-bold text-white lg:hidden">
            {(draft.site.name.charAt(0) || "S").toUpperCase()}
          </span>
          <h1 className="text-[17px] font-bold tracking-tight">
            {tab === "overview" ? "Overview" : activeTab.label}
            <span className="ml-2 align-middle text-[12px] font-normal text-stone-400">{saveLabel}</span>
          </h1>
          <span className="ml-auto flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                dirty ? "bg-red-500/10 text-red-600" : "bg-green-600/10 text-green-700"
              }`}
            >
              {dirty && <span aria-hidden className="size-1.5 rounded-full bg-red-500" />}
              {dirty ? "Unpublished changes" : "Everything is published"}
            </span>
            <button
              onClick={undo}
              disabled={editor.past.length === 0}
              aria-label="Undo"
              title="Undo"
              className={iconBtnCls}
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={editor.future.length === 0}
              aria-label="Redo"
              title="Redo"
              className={iconBtnCls}
            >
              <Redo2 size={16} />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              aria-label="View live site"
              title="View live site"
              className={iconBtnCls}
            >
              <ExternalLink size={16} />
            </a>
          </span>
          <div className="flex rounded-full border border-stone-200 bg-white p-0.5 lg:hidden">
            {(["edit", "preview"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium capitalize ${
                  view === v ? "bg-black text-white" : "text-stone-500"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => void publish()}
            disabled={publishing}
            className="rounded-full bg-black px-5 py-2 text-[13px] font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
        {publishMsg && (
          <p aria-live="polite" className="border-t border-stone-200/80 px-4 py-1.5 text-center text-[13px] font-medium text-green-700">
            {publishMsg}
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 lg:grid-cols-[200px_minmax(0,400px)_minmax(0,1fr)]">
        {/* sidebar */}
        <aside className={`${view === "preview" ? "hidden" : ""} lg:block`}>
          <nav aria-label="Studio sections" className="flex gap-1 overflow-x-auto border-b border-stone-200/80 px-3 py-2 lg:sticky lg:top-[57px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3">
            {sideNav}
          </nav>
        </aside>

        {/* editor */}
        <main className={`${view === "preview" ? "hidden" : ""} space-y-5 px-4 py-5 sm:px-6 lg:block lg:border-r lg:border-stone-200/80`}>
          {tab === "overview" && (
            <section className="space-y-4">
              <div>
                <h3 className="font-heading text-[26px] font-bold tracking-tight">
                  {greeting()}, {ownerFirst} 👋
                </h3>
                <p className="mt-1 text-[13px] text-stone-500">Manage your portfolio content and publish updates.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Live version</p>
                  <p className="mt-1 font-heading text-[26px] font-bold">v{version}</p>
                </div>
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Last published</p>
                  <p className="mt-1 font-heading text-[15px] font-bold leading-snug">
                    {publishedAt ? new Date(publishedAt).toLocaleString() : "Not yet"}
                  </p>
                </div>
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Draft status</p>
                  <p className={`mt-1 text-[14px] font-semibold ${dirty ? "text-red-600" : "text-green-700"}`}>
                    {dirty ? "Unpublished changes" : "Everything is published"}
                  </p>
                </div>
                <div className={cardCls}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Earlier versions</p>
                  <p className="mt-1 text-[14px] font-semibold">{history.length} in history</p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-stone-500">
                Pick a section from the menu to edit it. Everything you type saves to your draft automatically — the
                live site only changes when you press <strong className="text-stone-900">Publish</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTab("sections")}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-[13px] font-medium text-stone-700 hover:bg-stone-100"
                >
                  Manage sections
                </button>
                <button
                  onClick={() => void publish()}
                  disabled={publishing}
                  className="rounded-full bg-black px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  {publishing ? "Publishing…" : "Publish now"}
                </button>
              </div>
            </section>
          )}

          {tab === "sections" && (
            <section className="space-y-3">
              <p className="text-[12px] leading-relaxed text-stone-400">
                Reorder the page and toggle visibility. Item counts and visibility stay in sync with the live preview.
                The layout itself never changes.
              </p>
              {order.map((key, i) => {
                const count = sectionCount(key, draft);
                const visible = draft.sections.visible[key] !== false;
                return (
                  <div key={key} className={`${cardCls} flex items-center gap-2.5`}>
                    <div className="flex shrink-0 flex-col">
                      <button
                        aria-label={`Move ${SECTION_LABELS[key]} up`}
                        disabled={i === 0}
                        onClick={() => patch((d) => { d.sections.order = move(d.sections.order, i, -1); })}
                        className="px-1 text-[10px] text-stone-400 hover:text-stone-900 disabled:opacity-25"
                      >
                        ▲
                      </button>
                      <button
                        aria-label={`Move ${SECTION_LABELS[key]} down`}
                        disabled={i === order.length - 1}
                        onClick={() => patch((d) => { d.sections.order = move(d.sections.order, i, 1); })}
                        className="px-1 text-[10px] text-stone-400 hover:text-stone-900 disabled:opacity-25"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold">{SECTION_LABELS[key]}</p>
                      <p className="text-[12px] text-stone-400">
                        {count ? `${count} · ` : ""}
                        {visible ? "Shown" : "Hidden"}
                      </p>
                    </div>
                    <button
                      aria-label={visible ? `Hide ${SECTION_LABELS[key]}` : `Show ${SECTION_LABELS[key]}`}
                      aria-pressed={visible}
                      onClick={() => patch((d) => { d.sections.visible[key] = !visible; })}
                      className={`grid size-9 shrink-0 place-items-center rounded-xl border ${
                        visible ? "border-stone-200 bg-white text-stone-700" : "border-stone-200 bg-stone-100 text-stone-400"
                      } hover:bg-stone-100`}
                    >
                      {visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                );
              })}
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
              <p className="text-[12px] text-stone-400">CTA buttons and the client-logo banner live under Site settings and the Contact tab.</p>
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
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-[14px] font-semibold">Services ({draft.services.length}/{MAX_COUNT.services})</h3>
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
              {draft.services.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.services.map((s, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-stone-600">Service {s.index}</span>
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
                  </div>
                  <div className="space-y-3">
                    <Field label="Title" value={s.title} max={LIMITS.service.title} required>
                      <Text value={s.title} max={LIMITS.service.title} onChange={(v) => patch((d) => { d.services[i].title = v; })} />
                    </Field>
                    <Field label="Description" value={s.description} max={LIMITS.service.description}>
                      <Area value={s.description} max={LIMITS.service.description} rows={3} onChange={(v) => patch((d) => { d.services[i].description = v; })} />
                    </Field>
                    <TagsInput value={s.tags} max={MAX_COUNT.tagsPerService} onChange={(v) => patch((d) => { d.services[i].tags = v; })} />
                    <Field label="Preview image" value={s.preview} hint="Cropped to 16:10. Empty hides the preview.">
                      <ImageField value={s.preview} aspect="16/10" onChange={(v) => patch((d) => { d.services[i].preview = v; })} />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
          )}

          {tab === "work" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold">Projects ({draft.projects.length}/{MAX_COUNT.projects})</h3>
                <button
                  disabled={draft.projects.length >= MAX_COUNT.projects}
                  onClick={() =>
                    patch((d) => {
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
                      });
                    })
                  }
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              {draft.projects.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — the Work section stays hidden until you add one.</p>}
              {draft.projects.map((p, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-stone-600">{p.name || `Project ${i + 1}`}</span>
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
                  </div>
                  <div className="space-y-3">
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
                </div>
              ))}
            </section>
          )}

          {tab === "gallery" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold">Gallery ({draft.galleryItems.length}/{MAX_COUNT.galleryItems})</h3>
                <button
                  disabled={draft.galleryItems.length >= MAX_COUNT.galleryItems}
                  onClick={() => patch((d) => { d.galleryItems.push({ title: "New work", image: "" }); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              <p className="text-[12px] text-stone-400">Needs 3+ images with URLs — fewer hides the section publicly.</p>
              {draft.galleryItems.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.galleryItems.map((g, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-stone-600">{g.title || `Image ${i + 1}`}</span>
                    <RowButtons
                      index={i}
                      total={draft.galleryItems.length}
                      onMove={(dir) => patch((d) => { d.galleryItems = move(d.galleryItems, i, dir); })}
                      onDelete={() => patch((d) => { d.galleryItems.splice(i, 1); })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Field label="Title" value={g.title} max={LIMITS.gallery.title}>
                      <Text value={g.title} max={LIMITS.gallery.title} onChange={(v) => patch((d) => { d.galleryItems[i].title = v; })} />
                    </Field>
                    <Field label="Image" value={g.image} hint="Cropped to 16:10.">
                      <ImageField value={g.image} aspect="16/10" onChange={(v) => patch((d) => { d.galleryItems[i].image = v; })} />
                    </Field>
                  </div>
                </div>
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
                <h3 className="text-[14px] font-semibold">Testimonials ({draft.testimonials.length}/{MAX_COUNT.testimonials})</h3>
                <button
                  disabled={draft.testimonials.length >= MAX_COUNT.testimonials}
                  onClick={() => patch((d) => { d.testimonials.push({ quote: "", name: "", role: "" }); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              {draft.testimonials.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — the marquee stays hidden until you add one.</p>}
              {draft.testimonials.map((t, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-stone-600">{t.name || `Testimonial ${i + 1}`}</span>
                    <RowButtons
                      index={i}
                      total={draft.testimonials.length}
                      onMove={(dir) => patch((d) => { d.testimonials = move(d.testimonials, i, dir); })}
                      onDelete={() => patch((d) => { d.testimonials.splice(i, 1); })}
                    />
                  </div>
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
                </div>
              ))}
            </section>
          )}

          {tab === "faq" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold">FAQ ({draft.faqs.length}/{MAX_COUNT.faqs})</h3>
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
              {draft.faqs.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.faqs.map((f, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-stone-600">{f.q || `Question ${i + 1}`}</span>
                    <RowButtons
                      index={i}
                      total={draft.faqs.length}
                      onMove={(dir) => patch((d) => { d.faqs = move(d.faqs, i, dir); })}
                      onDelete={() => patch((d) => { d.faqs.splice(i, 1); })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Field label="Question" value={f.q} max={LIMITS.faq.q} required>
                      <Text value={f.q} max={LIMITS.faq.q} onChange={(v) => patch((d) => { d.faqs[i].q = v; })} />
                    </Field>
                    <Field label="Answer" value={f.a} max={LIMITS.faq.a}>
                      <Area value={f.a} max={LIMITS.faq.a} rows={3} onChange={(v) => patch((d) => { d.faqs[i].a = v; })} />
                    </Field>
                  </div>
                </div>
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
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-[14px] font-semibold">Navigation ({draft.navLinks.length}/{MAX_COUNT.navLinks})</h3>
                <button
                  disabled={draft.navLinks.length >= MAX_COUNT.navLinks}
                  onClick={() => patch((d) => { d.navLinks.push({ label: "New", href: "#hero", id: "hero" }); })}
                  className={addBtnCls}
                >
                  Add
                </button>
              </div>
              {draft.navLinks.length === 0 && <p className="text-[13px] text-stone-400">Nothing here yet — add your first item.</p>}
              {draft.navLinks.map((l, i) => (
                <div key={i} className={cardCls}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-stone-600">Link {i + 1}</span>
                    <RowButtons
                      index={i}
                      total={draft.navLinks.length}
                      onMove={(dir) => patch((d) => { d.navLinks = move(d.navLinks, i, dir); })}
                      onDelete={() => patch((d) => { d.navLinks.splice(i, 1); })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Label" value={l.label} max={LIMITS.nav.label}>
                      <Text value={l.label} max={LIMITS.nav.label} onChange={(v) => patch((d) => { d.navLinks[i].label = v; })} />
                    </Field>
                    <Field label="Link" value={l.href} max={LIMITS.nav.href}>
                      <Text value={l.href} max={LIMITS.nav.href} onChange={(v) => patch((d) => { d.navLinks[i].href = v; })} />
                    </Field>
                    <Field label="Section id" value={l.id}>
                      <Text value={l.id} onChange={(v) => patch((d) => { d.navLinks[i].id = v; })} />
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
              <Field label="Hero background image" value={draft.site.heroImage} hint="Empty shows the gradient only.">
                <ImageField value={draft.site.heroImage} onChange={(v) => patch((d) => { d.site.heroImage = v; })} />
              </Field>
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
                disabled={publishing}
                className="w-full rounded-full bg-black py-3 text-[14px] font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {publishing ? "Publishing…" : `Publish draft as v${version + 1}`}
              </button>
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
        </main>

        {/* live preview — fixed corner window; the draft site scrolls
            inside the frame only, never with the page */}
        <div className={`${view === "edit" ? "hidden" : ""} min-w-0 border-t border-stone-200/80 lg:sticky lg:top-[57px] lg:block lg:h-[calc(100vh-57px)] lg:overflow-hidden lg:border-l lg:border-t-0`}>
          <div className="flex h-full flex-col">
          <div className="border-b border-stone-200/80 bg-[#f4f2ec] px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Live preview · {preset.dims}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={preset.id}
                onChange={(e) => setPreset(PRESETS.find((p) => p.id === e.target.value) ?? PRESETS[0])}
                aria-label="Preview device"
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-medium text-stone-700 focus:border-stone-400 focus:outline-none [&>option]:bg-white"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} · {p.dims}
                  </option>
                ))}
              </select>
              <div className="flex rounded-full border border-stone-200 bg-white p-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p)}
                    aria-label={`${p.label} preview`}
                    aria-pressed={preset.id === p.id}
                    title={`${p.label} · ${p.dims}`}
                    className={`grid size-8 place-items-center rounded-full ${
                      preset.id === p.id ? "bg-black text-white" : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <p.Icon size={15} aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="studio-preview-dots min-h-0 h-[70vh] flex-1 p-2 sm:p-5 lg:h-auto">
            <ScaledPreview designWidth={preset.designWidth}>
              {preset.id === "laptop" && (
                <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-3.5 py-2.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
              )}
              <div className="relative min-h-[320px] bg-[#070708] text-white">
                <SiteCanvas />
                <div className="relative">
                  {order.map((k) =>
                    draft.sections.visible[k] === false ? null : previewBlocks[k]
                  )}
                  <Footer data={draft} />
                </div>
              </div>
            </ScaledPreview>
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
    </div>
  );
}
