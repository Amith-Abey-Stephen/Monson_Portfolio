"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SectionKey, SiteContent } from "@/lib/schema";
import { LIMITS, MAX_COUNT, SECTION_KEYS, SECTION_LABELS } from "@/lib/schema";
import { Area, Field, ImageField, RowButtons, Text, move } from "./fields";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Gallery } from "@/components/Gallery";
import { Quote, About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";

type SaveState = "saved" | "saving" | "error";
type View = "edit" | "preview";
type PreviewMode = "desktop" | "tablet" | "mobile";

type HistoryEntry = {
  id: number;
  version: number;
  content: SiteContent;
  createdAt: string;
};

const TABS = [
  { id: "site", label: "Site" },
  { id: "hero", label: "Hero" },
  { id: "nav", label: "Nav" },
  { id: "intro", label: "Intro" },
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "gallery", label: "Gallery" },
  { id: "quote", label: "Quote" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
  { id: "visibility", label: "Sections" },
  { id: "publish", label: "Publish" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PREVIEW_WIDTH: Record<PreviewMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

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
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/35 focus:outline-none"
        placeholder="UI Design, UX Design"
      />
    </Field>
  );
}

export function StudioApp({
  initial,
  meta,
  email,
}: {
  initial: SiteContent;
  meta: { version: number; updatedAt: string | null; publishedAt: string | null };
  email: string;
}) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [tab, setTab] = useState<TabId>("hero");
  const [view, setView] = useState<View>("edit");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [publishMsg, setPublishMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [version, setVersion] = useState(meta.version);
  const firstRender = useRef(true);
  const router = useRouter();

  const patch = (fn: (d: SiteContent) => void) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  // Autosave (S18): debounce, show Saving/Saved/Error, never touch published.
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

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content?scope=history")
      .then(async (res) => {
        if (!res.ok || cancelled) return;
        const json = await res.json();
        if (!cancelled) setHistory(json.history as HistoryEntry[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const publish = async () => {
    setPublishing(true);
    setPublishMsg("");
    try {
      const res = await fetch("/api/content/publish", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Publish failed.");
      setVersion(json.version as number);
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
        setDraft(dj.content as SiteContent);
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
  const previewBlocks: Record<SectionKey, React.ReactNode> = {
    hero: <Hero key="hero" data={draft} />,
    intro: <AboutIntro key="intro" data={draft} />,
    projects: <Projects key="projects" data={draft} />,
    skills: <Journey key="skills" data={draft} />,
    gallery: <Gallery key="gallery" data={draft} />,
    quote: <Quote key="quote" data={draft} />,
    about: <About key="about" data={draft} />,
    testimonials: <Testimonials key="testimonials" data={draft} />,
    faq: <Faq key="faq" data={draft} />,
    contact: <Contact key="contact" data={draft} />,
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-3">
          <Link href="/" className="text-[14px] font-semibold text-white/80 hover:text-white">
            ← Site
          </Link>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold">Studio</span>
          <span
            aria-live="polite"
            className={`rounded-full px-3 py-1 text-[12px] font-medium ${
              saveState === "saved"
                ? "bg-green-500/15 text-green-300"
                : saveState === "saving"
                  ? "bg-yellow-500/15 text-yellow-300"
                  : "bg-red-500/15 text-red-300"
            }`}
          >
            {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Unable to save — retry"}
          </span>
          <span className="text-[12px] text-white/40">v{version}</span>
          <span className="ml-auto hidden text-[12px] text-white/40 sm:block">{email}</span>
          <div className="flex rounded-lg border border-white/10 p-0.5 sm:hidden">
            {(["edit", "preview"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium capitalize ${
                  view === v ? "bg-white/15 text-white" : "text-white/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => void publish()}
            disabled={publishing}
            className="rounded-lg bg-[#ece8df] px-4 py-2 text-[13px] font-semibold text-black hover:bg-white disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish"}
          </button>
          <button onClick={() => void logout()} className="rounded-lg border border-white/15 px-3 py-2 text-[13px] text-white/60 hover:bg-white/5">
            Logout
          </button>
        </div>
        {publishMsg && (
          <p aria-live="polite" className="border-t border-white/10 px-4 py-1.5 text-center text-[13px] text-green-300">
            {publishMsg}
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[340px_1fr]">
        {/* editor */}
        <div className={`${view === "preview" ? "hidden" : ""} lg:block`}>
          <nav aria-label="Studio sections" className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2 lg:sticky lg:top-[57px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "true" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-[13px] font-medium ${
                  tab === t.id ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <main className="space-y-5 px-4 py-5">
            {tab === "site" && (
              <section className="space-y-4">
                <h2 className="text-[15px] font-semibold">Site & contact</h2>
                <Field label="Name" value={draft.site.name} max={LIMITS.site.name} required>
                  <Text value={draft.site.name} max={LIMITS.site.name} onChange={(v) => patch((d) => { d.site.name = v; })} />
                </Field>
                <Field label="Role" value={draft.site.role} max={LIMITS.site.role}>
                  <Text value={draft.site.role} max={LIMITS.site.role} onChange={(v) => patch((d) => { d.site.role = v; })} />
                </Field>
                <Field label="Tagline" value={draft.site.tagline} max={LIMITS.site.tagline}>
                  <Text value={draft.site.tagline} max={LIMITS.site.tagline} onChange={(v) => patch((d) => { d.site.tagline = v; })} />
                </Field>
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
                <Field label="Hero background image" value={draft.site.heroImage} hint="Empty shows the gradient only.">
                  <ImageField value={draft.site.heroImage} onChange={(v) => patch((d) => { d.site.heroImage = v; })} />
                </Field>
                <Field label="About portrait" value={draft.site.aboutImage} hint="4/5 crop. Empty hides the portrait.">
                  <ImageField value={draft.site.aboutImage} aspect="4/5" onChange={(v) => patch((d) => { d.site.aboutImage = v; })} />
                </Field>
                <Field label="Social/OG image" value={draft.site.ogImage}>
                  <ImageField value={draft.site.ogImage} onChange={(v) => patch((d) => { d.site.ogImage = v; })} />
                </Field>
              </section>
            )}

            {tab === "hero" && (
              <section className="space-y-4">
                <h2 className="text-[15px] font-semibold">Hero</h2>
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
                <Field label="Client logos" value={draft.clientLogos} max={MAX_COUNT.clientLogos} hint="One per line in the box below.">
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
              </section>
            )}

            {tab === "nav" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold">Navigation ({draft.navLinks.length}/{MAX_COUNT.navLinks})</h2>
                  <button
                    disabled={draft.navLinks.length >= MAX_COUNT.navLinks}
                    onClick={() => patch((d) => { d.navLinks.push({ label: "New", href: "#hero", id: "hero" }); })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.navLinks.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — add your first item.</p>}
                {draft.navLinks.map((l, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-white/70">Link {i + 1}</span>
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

            {tab === "intro" && (
              <section className="space-y-4">
                <h2 className="text-[15px] font-semibold">Intro</h2>
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
                <h2 className="text-[15px] font-semibold">Journey / Skills</h2>
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
                    onClick={() => patch((d) => { d.stats.push({ value: "1+", target: 1, suffix: "+", label: "New stat" }); })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.stats.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — the stats row stays hidden until you add one.</p>}
                {draft.stats.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-white/70">Stat {i + 1}</span>
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
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[14px] text-white focus:border-white/35 focus:outline-none"
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
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.services.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — add your first item.</p>}
                {draft.services.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-white/70">Service {s.index}</span>
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
                      <Field label="Preview image" value={s.preview} hint="16/10 crop. Empty hides the preview.">
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
                  <h2 className="text-[15px] font-semibold">Projects ({draft.projects.length}/{MAX_COUNT.projects})</h2>
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
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.projects.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — the Work section stays hidden until you add one.</p>}
                {draft.projects.map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="truncate text-[13px] font-medium text-white/70">{p.name || `Project ${i + 1}`}</span>
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
                      <Field label="Cover image" value={p.image} hint="16/10 crop.">
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
                            className="h-9 w-12 cursor-pointer rounded border border-white/15 bg-transparent"
                          />
                          <input
                            value={p.accent}
                            maxLength={LIMITS.project.accent}
                            onChange={(e) => patch((d) => { d.projects[i].accent = e.target.value; })}
                            className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white focus:border-white/35 focus:outline-none"
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
                  <h2 className="text-[15px] font-semibold">Gallery ({draft.galleryItems.length}/{MAX_COUNT.galleryItems})</h2>
                  <button
                    disabled={draft.galleryItems.length >= MAX_COUNT.galleryItems}
                    onClick={() => patch((d) => { d.galleryItems.push({ title: "New work", image: "" }); })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                <p className="text-[12px] text-white/40">Needs 3+ images with URLs — fewer hides the section publicly.</p>
                {draft.galleryItems.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — add your first item.</p>}
                {draft.galleryItems.map((g, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="truncate text-[13px] font-medium text-white/70">{g.title || `Image ${i + 1}`}</span>
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
                      <Field label="Image" value={g.image} hint="16/10 crop.">
                        <ImageField value={g.image} aspect="16/10" onChange={(v) => patch((d) => { d.galleryItems[i].image = v; })} />
                      </Field>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {tab === "quote" && (
              <section className="space-y-4">
                <h2 className="text-[15px] font-semibold">Quote</h2>
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
                <h2 className="text-[15px] font-semibold">About / Experience</h2>
                <Field label="Title" value={draft.about.title}>
                  <Area value={draft.about.title} rows={3} onChange={(v) => patch((d) => { d.about.title = v; })} />
                </Field>
                <Field label="Body" value={draft.about.body} max={LIMITS.text.body}>
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
                  <h2 className="text-[15px] font-semibold">Testimonials ({draft.testimonials.length}/{MAX_COUNT.testimonials})</h2>
                  <button
                    disabled={draft.testimonials.length >= MAX_COUNT.testimonials}
                    onClick={() => patch((d) => { d.testimonials.push({ quote: "", name: "", role: "" }); })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.testimonials.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — the marquee stays hidden until you add one.</p>}
                {draft.testimonials.map((t, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="truncate text-[13px] font-medium text-white/70">{t.name || `Testimonial ${i + 1}`}</span>
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
                  <h2 className="text-[15px] font-semibold">FAQ ({draft.faqs.length}/{MAX_COUNT.faqs})</h2>
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
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                {draft.faqs.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — add your first item.</p>}
                {draft.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="truncate text-[13px] font-medium text-white/70">{f.q || `Question ${i + 1}`}</span>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold">Social links ({draft.socials.length}/{MAX_COUNT.socials})</h2>
                  <button
                    disabled={draft.socials.length >= MAX_COUNT.socials}
                    onClick={() => patch((d) => { d.socials.push({ label: "New", href: "" }); })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10 disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
                <p className="text-[12px] text-white/40">Links with an empty URL are hidden from the public strip. Contact details live under the Site tab.</p>
                {draft.socials.length === 0 && <p className="text-[13px] text-white/40">Nothing here yet — add your first item.</p>}
                {draft.socials.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-white/70">{s.label || `Link ${i + 1}`}</span>
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

            {tab === "visibility" && (
              <section className="space-y-3">
                <h2 className="text-[15px] font-semibold">Sections</h2>
                <p className="text-[12px] leading-relaxed text-white/40">
                  Reorder the page and toggle visibility. The layout itself never changes — only content, order, and visibility.
                </p>
                {order.map((key, i) => (
                  <div key={key} className="flex items-center gap-2 rounded-xl border border-white/10 p-3">
                    <input
                      type="checkbox"
                      checked={draft.sections.visible[key] !== false}
                      onChange={(e) => patch((d) => { d.sections.visible[key] = e.target.checked; })}
                      aria-label={`Show ${SECTION_LABELS[key]}`}
                      className="size-4 accent-white"
                    />
                    <span className="flex-1 text-[14px]">{SECTION_LABELS[key]}</span>
                    <RowButtons
                      index={i}
                      total={order.length}
                      onMove={(dir) =>
                        patch((d) => {
                          d.sections.order = move(d.sections.order, i, dir);
                        })
                      }
                    />
                  </div>
                ))}
              </section>
            )}

            {tab === "publish" && (
              <section className="space-y-4">
                <h2 className="text-[15px] font-semibold">Publish & history</h2>
                <p className="text-[13px] leading-relaxed text-white/55">
                  Editing autosaves to the <strong>draft</strong> only — visitors see the published version until you publish. Publishing archives the current version first (latest {20} kept).
                </p>
                <button
                  onClick={() => void publish()}
                  disabled={publishing}
                  className="w-full rounded-lg bg-[#ece8df] py-3 text-[14px] font-semibold text-black hover:bg-white disabled:opacity-50"
                >
                  {publishing ? "Publishing…" : `Publish draft as v${version + 1}`}
                </button>
                {publishMsg && (
                  <p aria-live="polite" className="text-[13px] text-green-300">
                    {publishMsg}
                  </p>
                )}
                <h3 className="pt-2 text-[14px] font-semibold">Version history</h3>
                {history.length === 0 && <p className="text-[13px] text-white/40">No archived versions yet.</p>}
                {history.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                    <div className="flex-1">
                      <p className="text-[14px] font-medium">v{h.version}</p>
                      <p className="text-[12px] text-white/40">{new Date(h.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => void restore(h.id)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-[13px] hover:bg-white/10"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>

        {/* live preview — the actual public components with draft data */}
        <div className={`${view === "edit" ? "hidden" : ""} border-t border-white/10 lg:block lg:border-l lg:border-t-0`}>
          <div className="sticky top-[57px] z-30 flex items-center gap-1 border-b border-white/10 bg-[#0b0b0d]/95 px-3 py-2 backdrop-blur">
            <span className="mr-1 text-[12px] font-medium text-white/50">Preview</span>
            {(["desktop", "tablet", "mobile"] as PreviewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setPreviewMode(m)}
                className={`rounded-md px-3 py-1.5 text-[12px] font-medium capitalize ${
                  previewMode === m ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
            <span className="ml-auto hidden text-[11px] text-white/30 sm:block">same components as the public site</span>
          </div>
          <div className="bg-black/40 p-2 sm:p-4">
            <div className="mx-auto overflow-hidden rounded-xl border border-white/10" style={{ maxWidth: PREVIEW_WIDTH[previewMode] }}>
              <div className="relative min-h-[400px] bg-[#070708] text-white">
                <SiteCanvas />
                <div className="relative">
                  {order.map((k) =>
                    draft.sections.visible[k] === false ? null : previewBlocks[k]
                  )}
                  <Footer data={draft} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
