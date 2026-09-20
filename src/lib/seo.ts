import type { SiteContent } from "./schema";

/**
 * SEO helpers shared by public metadata (layout) and the Studio SEO tab.
 * Auto-derived keywords are compiled from the portfolio's own content so
 * Google, Perplexity, and AI search engines can discover the work.
 */
export function autoDerivedKeywords(content: SiteContent): string[] {
  const out: string[] = [];
  const push = (value?: string) => {
    const t = (value ?? "").trim();
    if (t && !out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t);
  };
  push(content.site.name);
  push(content.site.role);
  push(content.hero.title);
  for (const s of content.services) {
    push(s.title);
    for (const t of s.tags) push(t);
  }
  for (const p of content.projects) {
    push(p.name);
    push(p.tag);
  }
  for (const t of content.about.tags) push(t);
  for (const l of content.clientLogos) push(l);
  for (const t of content.testimonials) push(t.name);
  return out.slice(0, 60);
}

export function withAt(handle: string): string {
  const t = handle.trim();
  if (!t) return "";
  return t.startsWith("@") ? t : `@${t}`;
}

export function effectiveTitle(content: SiteContent): string {
  if (content.seo.title.trim()) return content.seo.title.trim();
  return `${content.site.name} — ${content.site.role || "Portfolio"}`;
}

export function effectiveDescription(content: SiteContent): string {
  if (content.seo.description.trim()) return content.seo.description.trim();
  return content.hero.subtitle || `${content.site.name}, ${content.site.role}`;
}

export function effectiveKeywords(content: SiteContent): string[] {
  return [...autoDerivedKeywords(content), ...content.seo.customKeywords].slice(0, 80);
}
