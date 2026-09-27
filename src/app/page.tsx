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
import { Quote, About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { CustomSection } from "@/components/CustomSection";
import { getPublishedContent } from "@/lib/content";
import { FALLBACK_ORDER, type SectionKey } from "@/lib/schema";

export const dynamic = "force-dynamic";

/**
 * Public site — reads PUBLISHED content only (docs/v1.md S15).
 * Section order/visibility come from the Studio; each section renders
 * the exact same component the Studio preview uses (S12).
 */
export default async function HomePage() {
  const content = await getPublishedContent();
  const visible = content.sections?.visible;
  const customMap = new Map((content.customSections ?? []).map((s) => [s.id, s]));

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
    quote: <Quote key="quote" data={content} />,
    about: <About key="about" data={content} />,
    testimonials: <Testimonials key="testimonials" data={content} />,
    faq: <Faq key="faq" data={content} />,
    contact: <Contact key="contact" data={content} />,
  };

  const order = (content.sections?.order ?? FALLBACK_ORDER).filter(
    (k) => k in blocks || customMap.has(k)
  );

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      {/* single continuous background canvas — all sections sit transparent over it */}
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
