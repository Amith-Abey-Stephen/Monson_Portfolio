"use client";

import { useEffect, useState } from "react";
import { FALLBACK_ORDER, type SectionKey, type SiteContent } from "@/lib/schema";
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
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "STUDIO_DRAFT_UPDATE" && event.data.draft) {
        setContent(event.data.draft);
      }
    };
    window.addEventListener("message", onMessage);
    // Notify parent window that preview renderer is ready
    window.parent?.postMessage({ type: "STUDIO_PREVIEW_READY" }, "*");
    return () => window.removeEventListener("message", onMessage);
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

  const order = (content.sections?.order ?? FALLBACK_ORDER).filter((k): k is SectionKey =>
    k in blocks
  );

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      <SiteCanvas />
      <div className="relative">
        <Navbar data={content} />
        {order.map((k) => (visible && visible[k] === false ? null : blocks[k]))}
        <Footer data={content} />
      </div>
    </main>
  );
}
