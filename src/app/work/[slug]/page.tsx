import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteCanvas } from "@/components/SiteCanvas";
import { getPublishedContent } from "@/lib/content";
import {
  slugify,
  getProjectCaseStudy,
  getAdjacentProjects,
  CASE_STUDIES,
} from "@/lib/projects";
import { CaseStudyView } from "./CaseStudyView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublishedContent();
  const projects = content.projects ?? [];
  const project = projects.find((p) => slugify(p.name) === slug);

  if (!project && !CASE_STUDIES[slug]) {
    return { title: "Case Study Not Found" };
  }

  const { caseStudy } = getProjectCaseStudy(project || slug, projects);
  const siteName = content.site.name || "Monson Sunny";

  return {
    title: `${caseStudy.title} — UI/UX Case Study by ${siteName}`,
    description: caseStudy.tagline || caseStudy.overview,
    openGraph: {
      title: `${caseStudy.title} — UI/UX Case Study`,
      description: caseStudy.tagline || caseStudy.overview,
      images: caseStudy.coverImage ? [caseStudy.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${caseStudy.title} — UI/UX Case Study`,
      description: caseStudy.tagline || caseStudy.overview,
      images: caseStudy.coverImage ? [caseStudy.coverImage] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const content = await getPublishedContent();
  const projects = content.projects ?? [];

  const project = projects.find((p) => slugify(p.name) === slug);
  if (!project && !CASE_STUDIES[slug]) {
    notFound();
  }

  const { project: effectiveProject, caseStudy } = getProjectCaseStudy(
    project || slug,
    projects
  );
  const { prev, next } = getAdjacentProjects(slug, projects);

  return (
    <main className="relative min-h-screen bg-[#070708] text-white">
      {/* Visual Canvas background */}
      <SiteCanvas />

      <div className="relative">
        <Navbar data={content} />

        <CaseStudyView
          caseStudy={caseStudy}
          project={effectiveProject}
          prevProject={prev}
          nextProject={next}
        />

        <Footer data={content} />
      </div>
    </main>
  );
}
