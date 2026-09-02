/**
 * Monson Sunny Portfolio — Content Data Model & Types (Astro + TypeScript)
 */

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  status: string;
  bio: string;
  experienceYears: string;
  projectsCompleted: string;
  socials: SocialLink[];
}

export interface HeroContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  scrollHintText: string;
  workspaceImage: string;
  portraitImage: string;
  avatarImage: string;
}

export interface AboutContent {
  heading: string;
  subtext: string;
  imageMain: string;
  imageSmall: string;
  location: string;
  role: string;
  stats: {
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
}

export interface ProjectItem {
  id: string;
  visible: boolean;
  title: string;
  tag: string;
  year: string;
  category: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  featured: boolean;
}

export interface ServiceItem {
  id: string;
  visible: boolean;
  num: string;
  title: string;
  desc: string;
  image: string;
}

export interface PlaygroundItem {
  id: string;
  visible: boolean;
  title: string;
  category: string;
  image: string;
}

export interface JournalItem {
  id: string;
  visible: boolean;
  title: string;
  date: string;
  tag: string;
  readTime: string;
  excerpt: string;
  image: string;
  link: string;
}

export interface PhilosophyContent {
  quote: string;
  subtext: string;
  principles: {
    p1Num: string;
    p1Title: string;
    p1Desc: string;
    p2Num: string;
    p2Title: string;
    p2Desc: string;
    p3Num: string;
    p3Title: string;
    p3Desc: string;
  };
}

export interface CollabContent {
  label: string;
  heading: string;
  subtext: string;
  btnText: string;
  btnLink: string;
}

export interface ContactContent {
  label: string;
  heading: string;
  subtext: string;
  email: string;
  responseTime: string;
  locationNote: string;
}

export interface FooterContent {
  brand: string;
  summary: string;
  copyright: string;
  tagline: string;
}

export interface ArchivedImage {
  url: string;
  replacedAt: number;
  expiresAt: number;
}

export interface PortfolioContent {
  personal: PersonalInfo;
  hero: HeroContent;
  about: AboutContent;
  sections: Record<string, boolean>;
  tools: string[];
  projects: ProjectItem[];
  services: ServiceItem[];
  philosophy: PhilosophyContent;
  playground: PlaygroundItem[];
  journal: JournalItem[];
  collab: CollabContent;
  contact: ContactContent;
  footer: FooterContent;
  imageArchive: ArchivedImage[];
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  personal: {
    name: 'Monson Sunny',
    title: 'UI/UX DESIGNER · DIGITAL CREATIVE',
    location: 'India · Remote worldwide',
    status: 'Available for work',
    bio: "I'm Monson Sunny, a UI/UX designer focused on creating thoughtful digital products, websites and experiences that connect people with brands.",
    experienceYears: '5+ years',
    projectsCompleted: '124+ Projects',
    socials: [
      { id: 'soc-1', platform: 'TWITTER / X', label: 'TW', url: 'https://twitter.com' },
      { id: 'soc-2', platform: 'LINKEDIN', label: 'IN', url: 'https://linkedin.com' },
      { id: 'soc-3', platform: 'DRIBBBLE', label: 'DR', url: 'https://dribbble.com' },
      { id: 'soc-4', platform: 'BEHANCE', label: 'BE', url: 'https://behance.net' },
      { id: 'soc-5', platform: 'GITHUB', label: 'GH', url: 'https://github.com' },
      { id: 'soc-6', platform: 'INSTAGRAM', label: 'IG', url: 'https://instagram.com' }
    ]
  },

  hero: {
    eyebrow: 'UI/UX DESIGNER · DIGITAL CREATIVE',
    headingLine1: 'I design',
    headingLine2: 'experiences that',
    headingLine3: 'as good as they look.',
    description: "I'm Monson Sunny, a UI/UX designer focused on creating thoughtful digital products, websites and experiences that connect people with brands.",
    primaryCtaText: 'Explore My Work',
    primaryCtaLink: '#work',
    scrollHintText: 'Scroll to explore ↓',
    workspaceImage: '/assets/images/hero-workspace.jpg',
    portraitImage: '/assets/images/hero-portrait.jpg',
    avatarImage: '/assets/images/avatar-1.jpg'
  },

  about: {
    heading: 'Designing with clarity, craft and purpose.',
    subtext: 'I partner with founders and product teams to translate complex ideas into clear, engaging interfaces.',
    imageMain: '/assets/images/avatars/monson.jpg',
    imageSmall: '/assets/images/avatars/monson-sm.jpg',
    location: 'India · Remote worldwide',
    role: 'Product Designer · Design Engineer',
    stats: {
      stat1Number: '5+',
      stat1Label: 'Years of Experience',
      stat2Number: '120+',
      stat2Label: 'Projects Shipped',
      stat3Number: '99%',
      stat3Label: 'Client Satisfaction'
    }
  },

  sections: {
    work: true,
    philosophy: true,
    services: true,
    about: true,
    playground: true,
    marquee: true,
    journal: true,
    collab: true,
    contact: true
  },

  tools: [
    'FIGMA', 'NEXT.JS', 'FRAMER', 'REACT', 'SPLINE', 'THREE.JS', 'TAILWIND', 'UI ARCHITECTURE', 'PROTOTYPING', 'DESIGN SYSTEMS'
  ],

  projects: [
    {
      id: 'proj-1',
      visible: true,
      title: 'DeskNet',
      tag: 'Selected — 01',
      year: '2026',
      category: 'Product Design · Workspace Management',
      description: 'Comprehensive workspace reservation and resource optimization platform for modern hybrid enterprise teams.',
      image: '/assets/images/projects/desknet.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'proj-2',
      visible: true,
      title: 'MacSetup',
      tag: 'Selected — 02',
      year: '2026',
      category: 'Visual Design · Productivity Tools',
      description: 'Minimalist desktop curation tool that helps designers organize, capture, and share workspace environments.',
      image: '/assets/images/projects/macsetup.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'proj-3',
      visible: true,
      title: 'Keyvora',
      tag: 'Selected — 03',
      year: '2025',
      category: 'E-Commerce · Custom Mechanical Keyboards',
      description: 'Interactive 3D configurator and bespoke marketplace for enthusiast mechanical keyboards and accessories.',
      image: '/assets/images/projects/keyvora.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'proj-4',
      visible: true,
      title: 'RigRaid',
      tag: 'Selected — 04',
      year: '2025',
      category: 'Hardware UI · PC Builder Ecosystem',
      description: 'Real-time PC component compatibility engine with dynamic thermal simulations and power delivery calculation.',
      image: '/assets/images/projects/rigraid.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    }
  ],

  services: [
    {
      id: 'srv-1',
      visible: true,
      num: '01',
      title: 'UI/UX Design',
      desc: 'Wireframing, high-fidelity prototypes, user testing, responsive interfaces',
      image: '/assets/images/services/ui-design.jpg'
    },
    {
      id: 'srv-2',
      visible: true,
      num: '02',
      title: 'UX Strategy & Research',
      desc: 'Customer journey mapping, persona research, UX auditing, usability testing',
      image: '/assets/images/services/ux-strategy.jpg'
    },
    {
      id: 'srv-3',
      visible: true,
      num: '03',
      title: 'Interactive Prototyping',
      desc: 'Micro-interactions, motion design, interactive logic with Framer & Code',
      image: '/assets/images/services/prototyping.jpg'
    },
    {
      id: 'srv-4',
      visible: true,
      num: '04',
      title: 'Product Design',
      desc: 'End-to-end design lifecycle, SaaS platforms, design systems',
      image: '/assets/images/services/product-design.jpg'
    },
    {
      id: 'srv-5',
      visible: true,
      num: '05',
      title: 'Design Systems',
      desc: 'Reusable component libraries, design tokens, multi-platform guidelines',
      image: '/assets/images/services/design-system.jpg'
    }
  ],

  philosophy: {
    quote: 'Simplicity is not the lack of clutter, that is a consequence of simplicity. Simplicity is essentially describing the purpose and place of an object and what it does.',
    subtext: 'Great design is invisible. It removes friction, communicates intent effortlessly, and makes interaction intuitive.',
    principles: {
      p1Num: '01',
      p1Title: 'PURPOSE FIRST',
      p1Desc: 'Every component and pixel must answer a real user need before aesthetic flourishes.',
      p2Num: '02',
      p2Title: 'RADICAL CLARITY',
      p2Desc: 'Eliminate visual noise until only what is vital remains. Interfaces should breathe.',
      p3Num: '03',
      p3Title: 'CRAFT & DELIGHT',
      p3Desc: 'Subtle motion and tactile feedback transform mundane software into an unforgettable experience.'
    }
  },

  playground: [
    { id: 'pg-1', visible: true, title: '3D Glassmorphism Shader', category: 'Three.js · Shader', image: '/assets/images/playground/3d-glass.jpg' },
    { id: 'pg-2', visible: true, title: 'Generative Grid System', category: 'Creative Coding', image: '/assets/images/playground/grid.jpg' },
    { id: 'pg-3', visible: true, title: 'Mobile Banking Concept', category: 'iOS 18 · FinTech', image: '/assets/images/playground/mobile-banking.jpg' },
    { id: 'pg-4', visible: true, title: 'Kinetic Typography Engine', category: 'Motion · Canvas', image: '/assets/images/playground/typo-01.jpg' },
    { id: 'pg-5', visible: true, title: 'Fluid Gesture Navigation', category: 'SwiftUI · Prototype', image: '/assets/images/playground/motion.jpg' },
    { id: 'pg-6', visible: true, title: 'Tactile Micro-Interactions', category: 'Component · WebGL', image: '/assets/images/playground/micro.jpg' }
  ],

  journal: [
    {
      id: 'j-1',
      visible: true,
      title: 'Designing for Radical Clarity in an Era of Cognitive Overload',
      date: 'Aug 2026',
      tag: 'Design Philosophy',
      readTime: '5 min read',
      excerpt: 'How stripping away visual decoration and focusing on hierarchy creates calmer, more productive digital tools.',
      image: '/assets/images/journal/clarity.jpg',
      link: '#journal'
    },
    {
      id: 'j-2',
      visible: true,
      title: 'Building Design Systems That Engineers Actually Enjoy Using',
      date: 'Jun 2026',
      tag: 'Design Systems',
      readTime: '8 min read',
      excerpt: 'Bridging the semantic gap between Figma variants and code tokens with automated synchronization.',
      image: '/assets/images/journal/figma.jpg',
      link: '#journal'
    },
    {
      id: 'j-3',
      visible: true,
      title: 'The Nuance of Micro-Interactions in Premium Web Experiences',
      date: 'Apr 2026',
      tag: 'Craft & Motion',
      readTime: '4 min read',
      excerpt: 'Why subtle 60fps spring physics and spatial easing separate good software from iconic products.',
      image: '/assets/images/journal/premium.jpg',
      link: '#journal'
    }
  ],

  collab: {
    label: 'Open For Collaboration',
    heading: 'Have a project in mind?',
    subtext: 'I am currently booking select UI/UX and product design engagements for Q3/Q4 2026. Let us build something extraordinary together.',
    btnText: "Let's Talk ↗",
    btnLink: 'mailto:hello@monsonsunny.com'
  },

  contact: {
    label: 'Contact & Network',
    heading: "Let's make something great.",
    subtext: 'Available for selected freelance projects and creative collaborations.',
    email: 'hello@monsonsunny.com',
    responseTime: 'Response time — within 24 hours',
    locationNote: "India · Remote worldwide\nLet's talk about your next product."
  },

  footer: {
    brand: 'MONSON SUNNY®',
    summary: 'UI/UX Designer crafting thoughtful digital experiences. Focused on clarity, purpose and detail — from idea to interface.',
    copyright: '© 2026 Monson Sunny · All rights reserved.',
    tagline: 'Designed with intention · Built with care.'
  },

  imageArchive: []
};

const STORAGE_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STORAGE_KEY) || 'portfolio_content_live';
const AUTH_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_KEY) || 'portfolio_admin_auth';
const RETENTION_DAYS = parseInt((typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_RETENTION_DAYS) || '10', 10);
const TEN_DAYS_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

export function trackReplacedImage(content: PortfolioContent, oldUrl: string): void {
  if (!oldUrl || typeof oldUrl !== 'string' || oldUrl.startsWith('data:')) return;
  if (!Array.isArray(content.imageArchive)) content.imageArchive = [];

  const existing = content.imageArchive.find((item) => item.url === oldUrl);
  if (!existing) {
    content.imageArchive.push({
      url: oldUrl,
      replacedAt: Date.now(),
      expiresAt: Date.now() + TEN_DAYS_MS
    });
  }
}

export function getAllActiveImageUrls(content: PortfolioContent): Set<string> {
  const urls = new Set<string>();
  if (content.hero) {
    if (content.hero.workspaceImage) urls.add(content.hero.workspaceImage);
    if (content.hero.portraitImage) urls.add(content.hero.portraitImage);
    if (content.hero.avatarImage) urls.add(content.hero.avatarImage);
  }
  if (content.about) {
    if (content.about.imageMain) urls.add(content.about.imageMain);
    if (content.about.imageSmall) urls.add(content.about.imageSmall);
  }
  if (Array.isArray(content.projects)) {
    content.projects.forEach((p) => p.image && urls.add(p.image));
  }
  if (Array.isArray(content.services)) {
    content.services.forEach((s) => s.image && urls.add(s.image));
  }
  if (Array.isArray(content.playground)) {
    content.playground.forEach((item) => item.image && urls.add(item.image));
  }
  if (Array.isArray(content.journal)) {
    content.journal.forEach((j) => j.image && urls.add(j.image));
  }
  return urls;
}

export async function cleanupExpiredImages(content: PortfolioContent, password = ''): Promise<{ cleanedCount: number; remainingCount?: number }> {
  if (!Array.isArray(content.imageArchive) || content.imageArchive.length === 0) {
    return { cleanedCount: 0 };
  }

  const activeUrls = getAllActiveImageUrls(content);
  const now = Date.now();
  const remainingArchive: ArchivedImage[] = [];
  let cleanedCount = 0;

  for (const item of content.imageArchive) {
    const isExpired = now >= item.expiresAt;
    const isStillInUse = activeUrls.has(item.url);

    if (isExpired && !isStillInUse) {
      try {
        await deleteMediaFile(item.url, password);
        cleanedCount++;
      } catch (_e) {
        // Continue
      }
    } else {
      remainingArchive.push(item);
    }
  }

  content.imageArchive = remainingArchive;
  return { cleanedCount, remainingCount: remainingArchive.length };
}

export async function deleteMediaFile(url: string, password = ''): Promise<boolean> {
  const token = password || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_KEY) : '') || '';
  try {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ url })
    });
    return res.ok;
  } catch (_e) {
    return false;
  }
}

export async function syncAllAssetsToR2(
  content: PortfolioContent,
  password = '',
  onProgress?: (info: { current: number; total: number; url: string }) => void
): Promise<{ synced: number; total: number }> {
  const activeUrls = [...getAllActiveImageUrls(content)];
  let synced = 0;

  for (let i = 0; i < activeUrls.length; i++) {
    const url = activeUrls[i];
    if (onProgress) onProgress({ current: i + 1, total: activeUrls.length, url });

    if (url.includes('.r2.dev') || (url.startsWith('http') && typeof location !== 'undefined' && !url.includes(location.hostname))) {
      continue;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const blob = await response.blob();
      const ext = url.split('.').pop() || 'jpg';
      const file = new File([blob], `asset-${Date.now()}.${ext}`, { type: blob.type });
      const newUrl = await uploadMediaFile(file, password);

      if (newUrl && newUrl !== url) {
        replaceImageUrlInContent(content, url, newUrl);
        synced++;
      }
    } catch (_err) {
      // Continue
    }
  }

  return { synced, total: activeUrls.length };
}

function replaceImageUrlInContent(content: PortfolioContent, oldUrl: string, newUrl: string): void {
  if (content.hero) {
    if (content.hero.workspaceImage === oldUrl) content.hero.workspaceImage = newUrl;
    if (content.hero.portraitImage === oldUrl) content.hero.portraitImage = newUrl;
    if (content.hero.avatarImage === oldUrl) content.hero.avatarImage = newUrl;
  }
  if (content.about) {
    if (content.about.imageMain === oldUrl) content.about.imageMain = newUrl;
    if (content.about.imageSmall === oldUrl) content.about.imageSmall = newUrl;
  }
  if (Array.isArray(content.projects)) {
    content.projects.forEach((p) => {
      if (p.image === oldUrl) p.image = newUrl;
    });
  }
  if (Array.isArray(content.services)) {
    content.services.forEach((s) => {
      if (s.image === oldUrl) s.image = newUrl;
    });
  }
  if (Array.isArray(content.playground)) {
    content.playground.forEach((item) => {
      if (item.image === oldUrl) item.image = newUrl;
    });
  }
  if (Array.isArray(content.journal)) {
    content.journal.forEach((j) => {
      if (j.image === oldUrl) j.image = newUrl;
    });
  }
}

export async function loadPortfolioContent(): Promise<PortfolioContent> {
  try {
    const res = await fetch('/api/content', {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (isValidContent(data)) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        return mergeDeep(DEFAULT_PORTFOLIO_CONTENT, data) as PortfolioContent;
      }
    }
  } catch (_err) {
    // API not available
  }

  if (typeof localStorage !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (isValidContent(parsed)) {
          return mergeDeep(DEFAULT_PORTFOLIO_CONTENT, parsed) as PortfolioContent;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (_e) {
      // Ignore
    }
  }

  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT));
}

function isValidContent(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  return !o.error && (!!o.personal || !!o.hero || !!o.projects || !!o.sections);
}

function mergeDeep(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (Array.isArray(source[key])) {
        output[key] = source[key];
      } else if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: unknown): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`
      },
      body: JSON.stringify({ __auth_check__: true })
    });
    if (res.status === 401) return false;
    return true;
  } catch (_e) {
    return password.length >= 4;
  }
}

export async function savePortfolioContent(content: PortfolioContent, password = ''): Promise<{ success: boolean; cachedLocally?: boolean; remoteWarning?: string }> {
  await cleanupExpiredImages(content, password).catch(() => {});

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }
  const token = password || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_KEY) : '') || '';

  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(content)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `Cloudflare sync error (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      cachedLocally: true,
      remoteWarning: err.message
    };
  }
}

export async function uploadMediaFile(file: File, password = ''): Promise<string> {
  const token = password || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_KEY) : '') || '';

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) return data.url;
    }
  } catch (_e) {
    // Network error
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
