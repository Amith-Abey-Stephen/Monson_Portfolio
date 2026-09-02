/**
 * Monson Sunny Portfolio — Central Content Model & API Client
 * Enterprise-grade, scalable schema supporting dynamic sections, item visibility,
 * custom career timelines, dynamic tools, and extensible links.
 */

export const DEFAULT_PORTFOLIO_CONTENT = {
  version: '2.5.0',

  // Section Visibility Toggles (allows toggling entire sections on/off)
  sections: {
    hero: true,
    intro: true,
    work: true,
    philosophy: true,
    services: true,
    about: true,
    playground: true,
    tools: true,
    journal: true,
    collab: true,
    contact: true
  },

  personal: {
    name: 'Monson Sunny',
    brandName: 'MONSON SUNNY®',
    role: 'UI/UX Designer · Digital Creative',
    tagline: 'Thoughtful digital experiences that feel as good as they look.',
    email: 'hello@monsonsunny.com',
    location: 'India · Remote worldwide',
    statusText: 'Available for work',
    statusBadge2: '124+ Projects',
    statusBadge2Sub: 'Shipped & live',
    socials: [
      { id: 'linkedin', platform: 'LinkedIn', label: 'in', url: 'https://linkedin.com/in/monsonsunny' },
      { id: 'behance', platform: 'Behance', label: 'Bē', url: 'https://behance.net/monsonsunny' },
      { id: 'dribbble', platform: 'Dribbble', label: 'Dr', url: 'https://dribbble.com/monsonsunny' },
      { id: 'instagram', platform: 'Instagram', label: 'Ig', url: 'https://instagram.com/monsonsunny' }
    ]
  },

  hero: {
    eyebrow: 'UI/UX DESIGNER · DIGITAL CREATIVE',
    h1Line1: 'I design digital',
    h1Line2: 'experiences that feel',
    h1Line3: 'as good as they look.',
    description: "I'm Monson Sunny, a UI/UX designer focused on creating thoughtful digital products, websites and experiences that connect people with brands.",
    ctaText: 'Explore My Work',
    ctaLink: '#work',
    workspaceImage: 'assets/images/hero-workspace.jpg',
    workspaceTitle: 'DeskNet — Community Workspace',
    portraitImage: 'assets/images/hero-portrait.jpg',
    avatarImage: 'assets/images/avatar-1.jpg',
    systemBadgeTitle: 'Design System',
    systemBadgeValue: '124 components',
    systemBadgeSub: 'Tokens · Guidelines · Scale'
  },

  intro: {
    label: 'A Little About Me',
    heading: 'I turn complex problems into simple, meaningful digital experiences.',
    description: 'I work across UX strategy, interface design and visual systems to create products that are clear, useful and visually distinctive. My approach combines structured thinking with a strong attention to detail.',
    buttonText: 'More About Me',
    buttonLink: '#about'
  },

  projects: [
    {
      id: 'desknet',
      visible: true,
      title: 'DeskNet',
      tag: 'DeskNet — #01',
      year: '2025',
      category: 'E-commerce · Community · UX/UI',
      description: 'A community-driven workspace platform designed to help people discover, share and build better desk setups.',
      image: 'assets/images/projects/desknet.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'macsetup',
      visible: true,
      title: 'MacSetup',
      tag: 'MacSetup — #02',
      year: '2024',
      category: 'E-commerce · Product Discovery · UX/UI',
      description: 'A premium platform for discovering Mac workspaces, accessories and carefully curated desk inspiration.',
      image: 'assets/images/projects/macsetup.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'keyvora',
      visible: true,
      title: 'KeyVora',
      tag: 'KeyVora — #03',
      year: '2025',
      category: 'E-commerce · Mechanical Keyboards · UX/UI',
      description: 'A modern product discovery experience built around mechanical keyboard enthusiasts and customization.',
      image: 'assets/images/projects/keyvora.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    },
    {
      id: 'rigraid',
      visible: true,
      title: 'RIGRAID',
      tag: 'RIGRAID — #04',
      year: '2026',
      category: 'Gaming · E-commerce · UX/UI',
      description: 'A bold digital experience designed for gamers exploring PC builds, gaming setups and battle stations.',
      image: 'assets/images/projects/rigraid.jpg',
      link: '#work',
      linkText: 'View Case Study',
      featured: true
    }
  ],

  philosophy: {
    label: 'How I Think',
    quote: "Good design isn't about adding more. It's about making the right things matter.",
    subtext: 'I believe great experiences come from understanding people first, simplifying complexity and creating visual systems that make products easier and more enjoyable to use.',
    principles: [
      {
        num: '01',
        title: 'Clarity',
        desc: 'Make complex experiences feel simple.'
      },
      {
        num: '02',
        title: 'Purpose',
        desc: 'Every element should have a reason to exist.'
      },
      {
        num: '03',
        title: 'Detail',
        desc: 'Small decisions create memorable experiences.'
      }
    ]
  },

  services: [
    {
      id: 'ux-strategy',
      visible: true,
      num: '01',
      title: 'UX Strategy',
      desc: 'Research · User Flows · Information Architecture',
      image: 'assets/images/services/ux-strategy.jpg'
    },
    {
      id: 'ui-design',
      visible: true,
      num: '02',
      title: 'UI Design',
      desc: 'Visual Systems · Design Systems · Responsive Interfaces',
      image: 'assets/images/services/ui-design.jpg'
    },
    {
      id: 'prototyping',
      visible: true,
      num: '03',
      title: 'Prototyping',
      desc: 'Interaction Design · Motion · High-Fidelity Prototypes',
      image: 'assets/images/services/prototyping.jpg'
    },
    {
      id: 'product-design',
      visible: true,
      num: '04',
      title: 'Product Design',
      desc: 'Web Apps · E-commerce · Digital Products',
      image: 'assets/images/services/product-design.jpg'
    },
    {
      id: 'design-systems',
      visible: true,
      num: '05',
      title: 'Design Systems',
      desc: 'Components · Tokens · Guidelines · Scalability',
      image: 'assets/images/services/design-system.jpg'
    }
  ],

  about: {
    label: 'The Person Behind The Pixels',
    heading: 'Designer by profession. Problem solver by nature.',
    bio: "I'm Monson Sunny, a UI/UX designer who enjoys turning ideas into intuitive digital experiences. I love exploring the space between visual design, usability and technology — creating interfaces that are both beautiful and useful.",
    basedIn: 'India — working worldwide',
    availability: 'Available for freelance & collaborations',
    experienceYears: '5+ years',
    imageMain: 'assets/images/avatars/monson.jpg',
    imageSmall: 'assets/images/avatars/monson-sm.jpg',
    stats: [
      { value: '50+', label: 'Projects shipped' },
      { value: '5+', label: 'Years crafting' },
      { value: '100%', label: 'Intentional design' }
    ],
    experienceTimeline: [
      {
        role: 'Senior Product Designer',
        company: 'Freelance & Studio',
        period: '2023 — Present',
        description: 'Leading design strategy, design systems, and mobile/web interfaces for high-growth startups globally.'
      },
      {
        role: 'UI/UX Designer',
        company: 'Digital Product Agency',
        period: '2021 — 2023',
        description: 'Crafted multi-brand e-commerce platforms, visual identity guidelines, and SaaS dashboards.'
      }
    ]
  },

  playground: [
    {
      id: 'typo-01',
      visible: true,
      title: 'Typography Study 01',
      category: 'Editorial · 2025',
      image: 'assets/images/playground/typo-01.jpg'
    },
    {
      id: 'motion',
      visible: true,
      title: 'Motion Concept',
      category: 'Interaction · 2025',
      image: 'assets/images/playground/motion.jpg'
    },
    {
      id: '3d-glass',
      visible: true,
      title: '3D Glass Study',
      category: '3D · 2026',
      image: 'assets/images/playground/3d-glass.jpg'
    },
    {
      id: 'mobile-banking',
      visible: true,
      title: 'Mobile Banking',
      category: 'Concept · 2024',
      image: 'assets/images/playground/mobile-banking.jpg'
    },
    {
      id: 'grid',
      visible: true,
      title: 'Grid Experiment',
      category: 'Layout · 2025',
      image: 'assets/images/playground/grid.jpg'
    },
    {
      id: 'micro',
      visible: true,
      title: 'Micro-interactions',
      category: 'Motion · 2026',
      image: 'assets/images/playground/micro.jpg'
    }
  ],

  tools: ['FIGMA', 'FRAMER', 'FIGJAM', 'PHOTOSHOP', 'ILLUSTRATOR', 'AFTER EFFECTS', 'NOTION', 'WEBFLOW'],

  journal: [
    {
      id: 'clarity',
      visible: true,
      title: 'Designing for clarity, not complexity',
      date: 'Mar 12, 2026',
      tag: 'Design',
      readTime: '4 min',
      excerpt: "Thoughts on creating simpler digital experiences that respect people's time and attention.",
      image: 'assets/images/journal/clarity.jpg',
      link: '#journal'
    },
    {
      id: 'premium',
      visible: true,
      title: 'What makes an interface feel premium?',
      date: 'Feb 28, 2026',
      tag: 'Craft',
      readTime: '6 min',
      excerpt: 'Exploring typography, spacing, motion and visual hierarchy in high-end digital products.',
      image: 'assets/images/journal/premium.jpg',
      link: '#journal'
    },
    {
      id: 'figma',
      visible: true,
      title: 'From Figma to the real world',
      date: 'Jan 18, 2026',
      tag: 'Process',
      readTime: '5 min',
      excerpt: 'Lessons from designing and shipping digital products with real constraints and real users.',
      image: 'assets/images/journal/figma.jpg',
      link: '#journal'
    }
  ],

  collab: {
    heading: 'Have an idea worth designing?',
    description: "Whether it's a new digital product, website or an experience that needs a fresh perspective, let's build something meaningful together.",
    ctaText: 'Start a Conversation',
    ctaLink: '#contact'
  },

  contact: {
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
  }
}

const STORAGE_KEY = 'portfolio_content_live'
const AUTH_KEY = 'portfolio_admin_auth'

/**
 * Loads current portfolio content from API, LocalStorage, or Fallback
 */
export async function loadPortfolioContent() {
  try {
    const res = await fetch('/api/content', {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    })
    if (res.ok) {
      const data = await res.json()
      if (isValidContent(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return mergeDeep(DEFAULT_PORTFOLIO_CONTENT, data)
      }
    }
  } catch (_err) {
    // API not available
  }

  // Check LocalStorage cache
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (isValidContent(parsed)) {
        return mergeDeep(DEFAULT_PORTFOLIO_CONTENT, parsed)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  } catch (_e) {
    // Ignore JSON parse errors
  }

  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT))
}

function isValidContent(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !obj.error &&
    (obj.personal || obj.hero || obj.projects || obj.sections)
  )
}

/**
 * Deep merge helper to prevent missing fields when schema expands
 */
function mergeDeep(target, source) {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (Array.isArray(source[key])) {
        output[key] = source[key]
      } else if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Validates password with the backend
 */
export async function verifyPassword(password) {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`
      },
      body: JSON.stringify({ __auth_check__: true })
    })
    if (res.status === 401) return false
    return true
  } catch (_e) {
    // In local mode without backend running, allow non-empty passwords
    return password.length >= 4
  }
}

/**
 * Saves updated content to Cloudflare KV API and local cache
 */
export async function savePortfolioContent(content, password = '') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  const token = password || localStorage.getItem(AUTH_KEY) || ''

  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(content)
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || errData.message || `Cloudflare sync error (${res.status})`)
    }

    return await res.json()
  } catch (err) {
    return {
      success: true,
      cachedLocally: true,
      remoteWarning: err.message
    }
  }
}

/**
 * Uploads media file to Cloudflare R2 or converts to data URL
 */
export async function uploadMediaFile(file, password = '') {
  const token = password || localStorage.getItem(AUTH_KEY) || ''

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.url) return data.url
    }
  } catch (_e) {
    // Network error or local mode
  }

  // Fallback: Convert to Base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}
