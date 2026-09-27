"use client";

import { useEffect, useState } from "react";
import { FALLBACK_ORDER, type SectionKey, type SiteContent, type CustomSection as CustomSectionType } from "@/lib/schema";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutIntro } from "@/components/AboutIntro";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { TechStack } from "@/components/TechStack";
import { Pricing } from "@/components/Pricing";
import { Awards } from "@/components/Awards";
import { Gallery } from "@/components/Gallery";
import { Quote as QuoteSection, About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { CustomSection } from "@/components/CustomSection";

export function PreviewRenderer({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("studio_active_draft");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch {}
    }
    return initialContent;
  });

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "STUDIO_DRAFT_UPDATE" && event.data.draft) {
        setContent(event.data.draft);
        try {
          localStorage.setItem("studio_active_draft", JSON.stringify(event.data.draft));
        } catch {}
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "studio_active_draft" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === "object") {
            setContent(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);

    // Notify parent window that preview renderer is ready (with retries for race condition safety)
    window.parent?.postMessage({ type: "STUDIO_PREVIEW_READY" }, "*");
    const timer = setInterval(() => {
      window.parent?.postMessage({ type: "STUDIO_PREVIEW_READY" }, "*");
    }, 400);
    const cancelTimer = setTimeout(() => clearInterval(timer), 2400);

    return () => {
      clearInterval(timer);
      clearTimeout(cancelTimer);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const visible = content.sections?.visible;

  const blocks: Record<SectionKey, React.ReactNode> = {
    hero: <Hero key="hero" data={content} />,
    intro: <AboutIntro key="intro" data={content} />,
    projects: <Projects key="projects" data={content} />,
    skills: <Journey key="skills" data={content} />,
    services: <Services key="services" data={content} />,
    process: <Process key="process" data={content} />,
    techstack: <TechStack key="techstack" data={content} />,
    pricing: <Pricing key="pricing" data={content} />,
    awards: <Awards key="awards" data={content} />,
    gallery: <Gallery key="gallery" data={content} />,
    quote: <QuoteSection key="quote" data={content} />,
    about: <About key="about" data={content} />,
    testimonials: <Testimonials key="testimonials" data={content} />,
    faq: <Faq key="faq" data={content} />,
    contact: <Contact key="contact" data={content} />,
  };

  const customMap = new Map<string, CustomSectionType>();
  (content.customSections || []).forEach((sec) => {
    if (sec && sec.id) customMap.set(sec.id, sec);
  });

  const order = (content.sections?.order ?? FALLBACK_ORDER).filter(
    (k) => k in blocks || customMap.has(k)
  );

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      <SiteCanvas />
      <div className="relative">
        <Navbar data={content} />
        {order.map((k) => {
          if (visible && visible[k] === false) return null;
          if (k in blocks) return blocks[k as SectionKey];
          const customSec = customMap.get(k);
          if (customSec) return <CustomSection key={k} section={customSec} />;
          return null;
        })}
        <Footer data={content} />
      </div>
    </main>
  );
}
