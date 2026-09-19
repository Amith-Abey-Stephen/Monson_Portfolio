import { z } from "zod";

/**
 * Content model + validation (docs/v1.md S19-S20).
 * Every editable field has a max length; lists have maximum counts.
 * The Studio disables Add at max; the server rejects anything larger.
 */

export const LIMITS = {
  site: { name: 60, role: 80, tagline: 120, email: 120, phone: 30, url: 500, image: 1000 },
  hero: { subtitle: 500, quote: 200, name: 30, title: 80 },
  text: { heading: 200, body: 2000, title: 200, label: 80, tag: 40 },
  project: { name: 80, tag: 40, description: 200, mockTitle: 120, mockSubtitle: 120, image: 1000, accent: 16, href: 500 },
  gallery: { title: 120, image: 1000 },
  testimonial: { quote: 600, name: 80, role: 120 },
  faq: { q: 200, a: 1000 },
  social: { label: 40, href: 500 },
  nav: { label: 30, href: 60 },
  service: { title: 80, description: 500, preview: 1000 },
  stat: { label: 80, value: 16, suffix: 8 },
} as const;

export const MAX_COUNT = {
  navLinks: 8,
  clientLogos: 12,
  logoImages: 12,
  stats: 6,
  services: 6,
  tagsPerService: 8,
  projects: 12,
  galleryItems: 12,
  aboutTags: 10,
  testimonials: 12,
  faqs: 12,
  socials: 8,
} as const;

const urlOrEmpty = (max: number) =>
  z.string().max(max).refine((v) => v === "" || /^https?:\/\/|^\/#|^\/[^/]|^mailto:|^tel:|^#/.test(v), {
    message: "Must be a valid URL, anchor (#…), or empty",
  });

const imageOrEmpty = (max: number) =>
  z.string().max(max).refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "Must be an image URL, /uploads/… path, or empty",
  });

export const navLinkSchema = z.object({
  label: z.string().min(1).max(LIMITS.nav.label),
  href: z.string().min(1).max(LIMITS.nav.href),
  id: z.string().min(1).max(40),
});

export const statSchema = z.object({
  value: z.string().max(LIMITS.stat.value),
  target: z.number().int().min(0).max(100000),
  suffix: z.string().max(LIMITS.stat.suffix),
  label: z.string().min(1).max(LIMITS.stat.label),
});

export const serviceSchema = z.object({
  index: z.string().max(8),
  title: z.string().min(1).max(LIMITS.service.title),
  description: z.string().max(LIMITS.service.description),
  tags: z.array(z.string().min(1).max(LIMITS.text.tag)).max(MAX_COUNT.tagsPerService),
  preview: imageOrEmpty(LIMITS.service.preview),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(LIMITS.project.name),
  tag: z.string().max(LIMITS.project.tag),
  description: z.string().max(LIMITS.project.description),
  mockTitle: z.string().max(LIMITS.project.mockTitle),
  mockSubtitle: z.string().max(LIMITS.project.mockSubtitle),
  image: imageOrEmpty(LIMITS.project.image),
  accent: z.string().max(LIMITS.project.accent),
  href: z.string().max(LIMITS.project.href),
  behanceUrl: urlOrEmpty(LIMITS.project.href).optional().default(""),
});

export const galleryItemSchema = z.object({
  title: z.string().max(LIMITS.gallery.title),
  image: imageOrEmpty(LIMITS.gallery.image),
});

export const testimonialSchema = z.object({
  quote: z.string().min(1).max(LIMITS.testimonial.quote),
  name: z.string().min(1).max(LIMITS.testimonial.name),
  role: z.string().max(LIMITS.testimonial.role),
});

export const faqSchema = z.object({
  index: z.string().max(8),
  q: z.string().min(1).max(LIMITS.faq.q),
  a: z.string().max(LIMITS.faq.a),
});

export const socialSchema = z.object({
  label: z.string().min(1).max(LIMITS.social.label),
  href: urlOrEmpty(LIMITS.social.href),
});

/** Existing public sections. Navbar/footer are chrome (always rendered). */
export const SECTION_KEYS = [
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
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  intro: "Intro",
  projects: "Work / Projects",
  skills: "Journey / Skills",
  gallery: "Gallery",
  quote: "Quote",
  about: "About / Experience",
  testimonials: "Testimonials",
  faq: "FAQ",
  contact: "Contact",
};

export const siteContentSchema = z.object({
  site: z.object({
    name: z.string().min(1).max(LIMITS.site.name),
    role: z.string().max(LIMITS.site.role),
    tagline: z.string().max(LIMITS.site.tagline),
    email: z.string().max(LIMITS.site.email),
    phoneDisplay: z.string().max(LIMITS.site.phone),
    phoneHref: z.string().max(LIMITS.site.url),
    calendly: urlOrEmpty(LIMITS.site.url),
    resumeHref: urlOrEmpty(LIMITS.site.url),
    contraHref: urlOrEmpty(LIMITS.site.url),
    behanceUrl: urlOrEmpty(LIMITS.site.url),
    linkedinUrl: urlOrEmpty(LIMITS.site.url),
    heroImage: imageOrEmpty(LIMITS.site.image),
    aboutImage: imageOrEmpty(LIMITS.site.image),
    ogImage: imageOrEmpty(LIMITS.site.image),
  }),
  navLinks: z.array(navLinkSchema).max(MAX_COUNT.navLinks),
  hero: z.object({
    firstName: z.string().max(LIMITS.hero.name),
    lastName: z.string().max(LIMITS.hero.name),
    title: z.string().max(LIMITS.hero.title),
    subtitle: z.string().max(LIMITS.hero.subtitle),
    quote: z.string().max(LIMITS.hero.quote),
  }),
  clientLogos: z.array(z.string().max(80)).max(MAX_COUNT.clientLogos),
  logoImages: z.array(imageOrEmpty(LIMITS.site.image)).max(MAX_COUNT.logoImages),
  aboutIntro: z.object({
    heading: z.string().max(LIMITS.text.heading),
    body: z.string().max(LIMITS.text.body),
  }),
  journey: z.object({
    eyebrow: z.string().max(120),
    heading: z.string().max(LIMITS.text.heading),
  }),
  stats: z.array(statSchema).max(MAX_COUNT.stats),
  services: z.array(serviceSchema).max(MAX_COUNT.services),
  projects: z.array(projectSchema).max(MAX_COUNT.projects),
  galleryItems: z.array(galleryItemSchema).max(MAX_COUNT.galleryItems),
  quote: z.object({
    text: z.string().max(500),
    signature: z.string().max(LIMITS.site.name),
  }),
  about: z.object({
    title: z.string().max(500),
    body: z.string().max(LIMITS.text.body),
    tags: z.array(z.string().min(1).max(LIMITS.text.tag)).max(MAX_COUNT.aboutTags),
    role: z.string().max(80),
    type: z.string().max(80),
    period: z.string().max(40),
  }),
  testimonials: z.array(testimonialSchema).max(MAX_COUNT.testimonials),
  faqs: z.array(faqSchema).max(MAX_COUNT.faqs),
  socials: z.array(socialSchema).max(MAX_COUNT.socials),
  sections: z.object({
    order: z.array(z.enum(SECTION_KEYS)).max(SECTION_KEYS.length),
    visible: z.record(z.enum(SECTION_KEYS), z.boolean()),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Project = SiteContent["projects"][number];
export type Service = SiteContent["services"][number];
export type Stat = SiteContent["stats"][number];
