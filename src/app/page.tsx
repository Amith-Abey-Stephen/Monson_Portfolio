import { Navbar } from "@/components/Navbar";
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
import { getPublishedContent } from "@/lib/content";
import type { SectionKey } from "@/lib/schema";

export const dynamic = "force-dynamic";

const FALLBACK_ORDER: SectionKey[] = [
  "hero",
  "intro",
  "projects",
  "skills",
  "gallery",
  "quote",
  "about",
  "testimonials",
  "faq",
  "contact",
];

/**
 * Public site — reads PUBLISHED content only (docs/v1.md S15).
 * Section order/visibility come from the Studio; each section renders
 * the exact same component the Studio preview uses (S12).
 */
export default async function HomePage() {
  const content = await getPublishedContent();
  const order = (content.sections?.order ?? FALLBACK_ORDER).filter((k): k is SectionKey =>
    FALLBACK_ORDER.includes(k)
  );
  const visible = content.sections?.visible;

  const blocks: Record<SectionKey, React.ReactNode> = {
    hero: <Hero key="hero" data={content} />,
    intro: <AboutIntro key="intro" data={content} />,
    projects: <Projects key="projects" data={content} />,
    skills: <Journey key="skills" data={content} />,
    gallery: <Gallery key="gallery" data={content} />,
    quote: <Quote key="quote" data={content} />,
    about: <About key="about" data={content} />,
    testimonials: <Testimonials key="testimonials" data={content} />,
    faq: <Faq key="faq" data={content} />,
    contact: <Contact key="contact" data={content} />,
  };

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      {/* single continuous background canvas — all sections sit transparent over it */}
      <SiteCanvas />
      <div className="relative">
        <Navbar data={content} />
        {order.map((k) => (visible && visible[k] === false ? null : blocks[k]))}
        <Footer data={content} />
      </div>
    </main>
  );
}
