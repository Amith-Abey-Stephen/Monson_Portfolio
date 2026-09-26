import type { SiteContent } from "@/lib/schema";

/**
 * Fallback content (Monson Sunny — UI/UX Designer).
 * The database is the source of truth at runtime; this file only seeds
 * the DB and renders a safe fallback when the DB is unreachable.
 * Unknown facts (email, phone, metrics, URLs) are left EMPTY on purpose —
 * the Studio lets the owner fill them in. Nothing here is fabricated.
 */

export const site = {
  name: "Monson Sunny",
  role: "UI/UX Designer",
  tagline: "UI/UX Designer | Figma | AI-Assisted Design",
  email: "monsonsunny2000@gmail.com",
  phoneDisplay: "+91 7907654850",
  phoneHref: "tel:+917907654850",
  calendly: "#",
  resumeHref: "#",
  contraHref: "#",
  behanceUrl: "",
  linkedinUrl: "",
  heroImage: "",
  aboutImage: "",
  ogImage: "",
  favicon: "",
  copyrightNotice: "",
};

export const navLinks = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "Work", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const hero = {
  firstName: "Monson",
  lastName: "Sunny",
  title: "UI/UX Designer",
  subtitle:
    "Creative and detail-oriented UI/UX designer with 4 years of experience, crafting intuitive interfaces with Figma and AI-powered design tools — from wireframes and prototypes to complete design systems.",
  quote: "I turn ideas into intuitive experiences",
  personImage: "",
  signatureImage: "",
};

export const clientLogos = ["Caxita Tech Solutions", "Jay4Web"];

export const logoImages: string[] = [];

export const logoMarqueeSpeed = 8;

export const aboutIntro = {
  heading: "Design that feels effortless and inspires action",
  body: "I'm Monson Sunny, a UI/UX designer with 4 years of experience, currently at Caxita Tech Solutions in Kochi. I design responsive websites and mobile apps with Figma and AI-powered tools. Previously a frontend developer at Jay4Web, I bring hands-on HTML, CSS, and JavaScript knowledge to every developer handoff.",
};

export const journey = {
  eyebrow: "Learning through every path",
  heading: "4 years of designing experiences",
};

export const stats: SiteContent["stats"] = [
  { value: "4", target: 4, suffix: "+", label: "Years Experience" },
  { value: "8", target: 8, suffix: "", label: "Design Tools" },
  { value: "2", target: 2, suffix: "", label: "Companies" },
];

export const services: SiteContent["services"] = [
  {
    index: "01",
    title: "Mobile App Design",
    description:
      "End-to-end app interfaces — user flows, wireframes, and polished UI in Figma, designed for clarity and ease of use.",
    tags: ["User flows", "Wireframes", "High-fidelity UI"],
    preview:
      "https://framerusercontent.com/images/D5to85TmmFI4rAuvfbNqLXriSc.png?width=1448&height=1086",
  },
  {
    index: "02",
    title: "Web & Dashboard Design",
    description:
      "Landing pages and dashboards with clean hierarchy, readable layouts, and consistent components.",
    tags: ["Landing pages", "Dashboards", "Web apps"],
    preview:
      "https://framerusercontent.com/images/nqWPDqP2Irs65djTJlJLtKJ5SI.webp?width=1448&height=1086",
  },
  {
    index: "03",
    title: "Design Systems & Prototyping",
    description:
      "Reusable components, styles, and interactive prototypes that keep designs consistent and handoff smooth.",
    tags: ["Components", "Prototypes", "Handoff"],
    preview:
      "https://framerusercontent.com/images/szufef32UqXtohOmXWbnPWk1RDc.webp?width=1339&height=1080",
  },
  {
    index: "04",
    title: "AI-Assisted UX",
    description:
      "Faster, sharper workflows using Figma AI, Claude, and generative design tools — from assisted research to optimized user flows.",
    tags: ["Figma AI", "Claude", "UX optimization"],
    preview:
      "https://framerusercontent.com/images/CAnTuyC7rYGbO1sbhC8LNj6E.jpg?width=1080&height=1080",
  },
];

export type Project = {
  name: string;
  tag: string;
  description: string;
  mockTitle: string;
  mockSubtitle: string;
  image: string;
  accent: string;
  href: string;
  behanceUrl: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    name: "Product Drop Experience",
    tag: "App Design",
    description: "Product discovery experience",
    mockTitle: "Product Drop Experience",
    mockSubtitle: "Mobile · Product",
    image: "",
    accent: "#7CFFB2",
    href: "#projects",
    behanceUrl: "",
    featured: true,
  },
  {
    name: "Finance Dashboard",
    tag: "Dashboard",
    description: "Personal finance overview",
    mockTitle: "Finance Dashboard",
    mockSubtitle: "Web · Fintech",
    image: "",
    accent: "#FFD84D",
    href: "#projects",
    behanceUrl: "",
    featured: true,
  },
  {
    name: "Travel Booking Platform",
    tag: "Web Design",
    description: "Trips, stays and flights",
    mockTitle: "Travel Booking Platform",
    mockSubtitle: "Web · Travel",
    image: "",
    accent: "#FFFFFF",
    href: "#projects",
    behanceUrl: "",
    featured: true,
  },
  {
    name: "AI Chatbot",
    tag: "App Design",
    description: "Conversational assistant",
    mockTitle: "AI Chatbot",
    mockSubtitle: "Mobile · AI",
    image: "",
    accent: "#FFB86B",
    href: "#projects",
    behanceUrl: "",
    featured: true,
  },
  {
    name: "Car Rental Booking App",
    tag: "App Design",
    description: "Rentals in a few taps",
    mockTitle: "Car Rental Booking App",
    mockSubtitle: "Mobile · Booking",
    image: "",
    accent: "#8EC5FF",
    href: "#projects",
    behanceUrl: "",
    featured: false,
  },
  {
    name: "Digital Marketing Landing Page",
    tag: "Web Design",
    description: "Marketing site design",
    mockTitle: "Digital Marketing Landing Page",
    mockSubtitle: "Web · Marketing",
    image: "",
    accent: "#D0A8FF",
    href: "#projects",
    behanceUrl: "",
    featured: false,
  },
];

export const galleryItems: { title: string; image: string }[] = [
  {
    title: "Build B2B growth that ends in purchase orders",
    image:
      "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852",
  },
  {
    title: "The Beyond Ordinary",
    image:
      "https://framerusercontent.com/images/4TOaudXsxkFFwu3h7hRGuBr474g.png?width=1448&height=1086",
  },
  {
    title: "Build the Next Era of Web3 Innovation",
    image:
      "https://framerusercontent.com/images/szufef32UqXtohOmXWbnPWk1RDc.webp?width=1339&height=1080",
  },
  {
    title: "Smarter Finance. Stronger Future.",
    image:
      "https://framerusercontent.com/images/CAnTuyC7rYGbO1sbhC8LNj6E.jpg?width=1080&height=1080",
  },
  {
    title: "Panasonic — Light the future",
    image:
      "https://framerusercontent.com/images/am0JIL2cCzcIYLmZLvS6WH9le3w.jpg?width=2048&height=1529",
  },
  {
    title: "Power Decisions. Drive Real Outcomes.",
    image:
      "https://framerusercontent.com/images/D5to85TmmFI4rAuvfbNqLXriSc.png?width=1448&height=1086",
  },
  {
    title: "Solar Power",
    image:
      "https://framerusercontent.com/images/nqWPDqP2Irs65djTJlJLtKJ5SI.webp?width=1448&height=1086",
  },
  {
    title: "Advanced Web3 Solutions Built for the Future",
    image:
      "https://framerusercontent.com/images/b4CY8gkPahGjizIhAciARATwzlk.png?width=1448&height=1086",
  },
  {
    title: "Work smarter, not harder. All in one workspace.",
    image:
      "https://framerusercontent.com/images/oRhHTzpqddTThlSWiKtFphEd21E.png?width=1448&height=1086",
  },
  {
    title: "Ethereal Mind",
    image:
      "https://framerusercontent.com/images/8fO9XaNyKpuVdGGfeDDRzGUgInY.png?width=1536&height=1024",
  },
];

export const quote = {
  text: "Good design is invisible — it simply feels right.",
  signature: "Monson Sunny",
};

export const about = {
  title:
    "UI/UX designer with 4 years of experience, crafting intuitive interfaces with Figma and AI-powered design tools.",
  body: "I'm Monson Sunny, a UI/UX Designer at Caxita Tech Solutions, Kochi (2023–2026), where I design responsive websites and mobile applications — developing wireframes, prototypes, user flows, and design systems while following accessibility and usability best practices. Previously a Frontend Developer at Jay4Web (2021–2022), converting UI/UX mockups into responsive interfaces with HTML, CSS, and JavaScript. Trained in Web Designing and Development at Arena Animation, with a B.Com from MG University.",
  tags: ["Figma", "UI Design", "UX Design", "Prototyping", "Design Systems", "HTML & CSS"],
  role: "UI/UX Designer",
  type: "Caxita Tech Solutions",
  period: "2023–2026",
};

export const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "LAYNE MORGAN",
    role: "COMMERCIAL DIRECTOR, SNAPPLE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "ANNA KORHONEN",
    role: "DESIGN DIRECTOR, GIGGLE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "TIMOTHY RODGERS",
    role: "HEAD OF PROJECTS, MICROSHAFT",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "RICK BELLANTE",
    role: "PRODUCT MANAGER, NEXUSGATE",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "JOSH STEVENS",
    role: "CREATIVE DIRECTOR, NETFLUX",
  },
  {
    quote:
      "Mark transformed Microshaft's brand with his visionary design. His creativity and attention to detail brought our ideas to life, exceeding all expectations.",
    name: "ANITA HOFFMANN",
    role: "LEAD UX DESIGNER, BETA",
  },
];

export const faqs = [
  {
    index: "01",
    q: "How much experience do you have?",
    a: "4 years — currently a UI/UX Designer at Caxita Tech Solutions (2023–2026), previously a Frontend Developer at Jay4Web (2021–2022), so the designs I deliver come developer-ready.",
  },
  {
    index: "02",
    q: "Which tools do you work with?",
    a: "Figma (including Figma AI) as the core tool, plus Claude and generative AI tools for research and workflow speed — with Adobe Photoshop, Illustrator, XD, Bootstrap, and HTML & CSS in the mix.",
  },
  {
    index: "03",
    q: "What does your design process look like?",
    a: "User flows and wireframes first, then interactive prototypes and scalable design systems — checked against UI/UX standards, accessibility, and usability best practices, in collaboration with developers and stakeholders.",
  },
  {
    index: "04",
    q: "How can I reach you or see more of your work?",
    a: "Use the email or phone details on this site, and ask for the Behance profile link — project links can be added here anytime through the Studio.",
  },
];

export const socials = [
  { label: "Behance", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:monsonsunny2000@gmail.com" },
  { label: "Resume", href: "#" },
];

export const seo: SiteContent["seo"] = {
  title: "",
  description: "",
  customKeywords: [],
  twitterHandle: "",
  canonicalUrl: "",
  googleSiteVerification: "",
  analyticsId: "",
  noIndex: false,
};

export const sections: SiteContent["sections"] = {
  order: [
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
  ],
  visible: {
    hero: true,
    intro: true,
    projects: true,
    skills: true,
    gallery: true,
    quote: true,
    about: true,
    testimonials: true,
    faq: true,
    contact: true,
  },
};

export const process: SiteContent["process"] = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description: "Deep dive into business goals, user personas, core pain points, and competitive architecture.",
    deliverable: "Product Brief & Roadmap",
  },
  {
    step: "02",
    title: "Wireframing & UX Architecture",
    description: "Mapping intuitive user flows, rapid low-fidelity wireframing, and validating flow hierarchy early.",
    deliverable: "Wireframe Flows & Sitemaps",
  },
  {
    step: "03",
    title: "UI Design & Design System",
    description: "Crafting accessible, modern high-fidelity UI with tokenized typography, fluid components, and sleek dark modes.",
    deliverable: "Figma Design System & Screens",
  },
  {
    step: "04",
    title: "Interactive Prototype & Dev Handoff",
    description: "Clickable micro-interactions, pixel-perfect developer handoff specifications, asset exports, and QA support.",
    deliverable: "Production Specs & Asset Pack",
  },
];

export const techstack: SiteContent["techstack"] = [
  { name: "Figma", category: "UI/UX Design", proficiency: "Expert" },
  { name: "Framer", category: "Interactive & Prototyping", proficiency: "Advanced" },
  { name: "Design Systems", category: "Architecture & Tokens", proficiency: "Expert" },
  { name: "Tailwind CSS", category: "Frontend Styling", proficiency: "Expert" },
  { name: "Next.js / React", category: "Web Engineering", proficiency: "Proficient" },
  { name: "Spline 3D", category: "3D Motion Design", proficiency: "Advanced" },
  { name: "Claude & AI UX", category: "AI-Powered Workflows", proficiency: "Expert" },
  { name: "User Research", category: "Product Strategy", proficiency: "Advanced" },
];

export const pricing: SiteContent["pricing"] = [
  {
    name: "Design Sprint",
    price: "$2,400",
    period: "1–2 weeks",
    description: "Targeted product sprint to audit UX, redesign a core feature flow, or build a proof-of-concept prototype.",
    features: ["Heuristic UX Audit", "Key User Flow Redesign", "Clickable Figma Prototype", "Design Handoff Documentation", "1 Iteration Cycle"],
    popular: false,
    ctaText: "Start Sprint",
    ctaHref: "#contact",
  },
  {
    name: "Full Product MVP",
    price: "$6,500",
    period: "4–6 weeks",
    description: "Complete design transformation from zero to launch-ready web or mobile app experience.",
    features: ["End-to-End Product Architecture", "Scalable Design System (Tokens & Components)", "Responsive Web & Mobile Layouts", "Developer Specs & Asset Export", "Weekly Strategy Syncs", "30-Day Post-Launch Support"],
    popular: true,
    ctaText: "Book MVP Project",
    ctaHref: "#contact",
  },
  {
    name: "Monthly Retainer",
    price: "$3,800",
    period: "per month",
    description: "Dedicated design partnership for scaling teams needing continuous UI/UX iterations.",
    features: ["Up to 30 hours per month", "Priority async channel", "Continuous feature design & QA", "Turnaround in 48–72 hours", "Pause or cancel anytime"],
    popular: false,
    ctaText: "Inquire Retainer",
    ctaHref: "#contact",
  },
];

export const awards: SiteContent["awards"] = [
  {
    year: "2024",
    title: "Best Mobile Experience",
    organization: "Design Innovation Awards",
    project: "Finance & Wealth App",
    link: "",
  },
  {
    year: "2023",
    title: "Featured UI Designer",
    organization: "Contra Independent Network",
    project: "Design Systems Showcase",
    link: "",
  },
  {
    year: "2022",
    title: "Excellence in Web Design",
    organization: "Arena Animation Showcase",
    project: "Portfolio & Interactive 3D",
    link: "",
  },
];

/** Whole-document fallback used when the DB is unreachable. */
export const defaultContent: SiteContent = {
  site,
  navLinks,
  hero,
  clientLogos,
  logoImages,
  logoMarqueeSpeed,
  aboutIntro,
  journey,
  stats,
  services,
  process,
  techstack,
  pricing,
  awards,
  projects,
  galleryItems,
  quote,
  about,
  testimonials,
  faqs,
  socials,
  seo,
  sections,
};
