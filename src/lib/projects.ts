import type { Project } from "@/data/content";

export interface CaseStudyFeature {
  title: string;
  description: string;
  badge: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
  detail: string;
}

export interface CaseStudyToken {
  name: string;
  hex: string;
  role: string;
}

export interface CaseStudyData {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  accent: string;
  secondaryAccent?: string;
  overview: string;
  challenge: {
    heading: string;
    body: string;
    painPoints: string[];
  };
  approach: {
    heading: string;
    body: string;
    steps: { number: string; title: string; desc: string }[];
  };
  features: CaseStudyFeature[];
  tokens: CaseStudyToken[];
  metrics: CaseStudyMetric[];
  tools: string[];
  deliverables: string[];
  liveUrl?: string;
  behanceUrl?: string;
  coverImage: string;
  mockType: "laptop" | "mobile" | "dashboard";
}

/** Pre-curated high quality design imagery for each project fallback */
export const PROJECT_FALLBACK_IMAGES: Record<string, string> = {
  "product-drop-experience":
    "https://framerusercontent.com/images/D5to85TmmFI4rAuvfbNqLXriSc.png?width=1448&height=1086",
  "finance-dashboard":
    "https://framerusercontent.com/images/CAnTuyC7rYGbO1sbhC8LNj6E.jpg?width=1080&height=1080",
  "travel-booking-platform":
    "https://framerusercontent.com/images/4TOaudXsxkFFwu3h7hRGuBr474g.png?width=1448&height=1086",
  "ai-chatbot":
    "https://framerusercontent.com/images/8fO9XaNyKpuVdGGfeDDRzGUgInY.png?width=1536&height=1024",
  "car-rental-booking-app":
    "https://framerusercontent.com/images/nqWPDqP2Irs65djTJlJLtKJ5SI.webp?width=1448&height=1086",
  "digital-marketing-landing-page":
    "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852",
};

/**
 * Normalizes any project name or string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns the effective cover image for a project, falling back to curated Framer captures.
 */
export function getProjectImage(p: Project): string {
  if (p.image && p.image.trim().length > 0) return p.image.trim();
  const slug = slugify(p.name);
  return PROJECT_FALLBACK_IMAGES[slug] || "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852";
}

/**
 * Full case study editorial registry for Monson Sunny's featured projects.
 */
export const CASE_STUDIES: Record<string, CaseStudyData> = {
  "product-drop-experience": {
    slug: "product-drop-experience",
    title: "Product Drop Experience",
    tagline: "High-voltage mobile discovery & limited edition release platform",
    category: "Mobile App Design",
    client: "Caxita Tech / Streetwear Collective",
    year: "2024",
    role: "Lead UI/UX Designer & Prototyper",
    timeline: "8 Weeks",
    accent: "#7CFFB2",
    secondaryAccent: "#10B981",
    overview:
      "A next-generation mobile commerce interface engineered specifically for flash drops, hyped streetwear releases, and real-time inventory queues. Designed to eliminate checkout latency, build anticipatory excitement, and maintain 99.9% conversion during peak 60-second traffic spikes.",
    challenge: {
      heading: "Bottlenecks during high-heat 60-second inventory drops",
      body: "Traditional e-commerce carts fail during hype drops: pages crash, bot traffic frustrates genuine fans, and multi-step checkouts cause dropouts within crucial seconds. The goal was to build a frictionless, heartbeat-inducing mobile experience that feels more like an immersive gaming drop than a grocery checkout.",
      painPoints: [
        "Cart abandonment due to laggy 5-step checkout forms during peak traffic",
        "Lack of real-time inventory transparency causing duplicate payment errors",
        "Disjointed brand aesthetics failing to connect with Gen-Z and sneakerheads",
      ],
    },
    approach: {
      heading: "Frictionless 'Swipe-to-Cop' and real-time biometric reservation",
      body: "By stripping away auxiliary UI clutter and implementing an instant biometric reservation queue, users lock their pair in under 1.2 seconds. We integrated dynamic countdown clocks, haptic feedback triggers, and high-fidelity 3D product previews in Figma.",
      steps: [
        {
          number: "01",
          title: "User Journey & Bottleneck Audit",
          desc: "Mapped drop participant journeys to eliminate every millisecond of cognitive friction between alert trigger and confirmation.",
        },
        {
          number: "02",
          title: "Interactive Component Architecture",
          desc: "Built a dark-mode first component library in Figma with variable fonts and tokenized micro-interactions.",
        },
        {
          number: "03",
          title: "Rapid Prototyping & Stress Testing",
          desc: "Validated the 1-swipe checkout mechanism across 25 beta testers under simulated countdown stress.",
        },
      ],
    },
    features: [
      {
        title: "1-Tap Biometric Reserve",
        description: "Locks size and shipping instantly via Apple Pay / FaceID without multi-page redirects.",
        badge: "Instant Checkout",
      },
      {
        title: "Live Queue Telemetry",
        description: "Transparent animated position counter showing live stock depletion and queue placement.",
        badge: "Real-Time UX",
      },
      {
        title: "360° Material Visualizer",
        description: "Interactive texture zoom allowing customers to inspect fabric weave and sole stitch quality.",
        badge: "High Fidelity",
      },
    ],
    tokens: [
      { name: "Neon Surge", hex: "#7CFFB2", role: "Primary Action & Live Drop Indicator" },
      { name: "Carbon Void", hex: "#0B0C0E", role: "Surface & Dark Background" },
      { name: "Pure Titanium", hex: "#FFFFFF", role: "Primary Typography" },
      { name: "Slate Mute", hex: "#6B7280", role: "Secondary Hierarchy" },
    ],
    metrics: [
      { value: "1.2s", label: "Average Checkout", detail: "Down from 18.4s in legacy funnel" },
      { value: "+44%", label: "Conversion Lift", detail: "Recorded across 12 scheduled drops" },
      { value: "99.2%", label: "Success Rate", detail: "Zero cart-lock timeouts during launches" },
    ],
    tools: ["Figma", "Claude AI (UX Research)", "Auto Layout 5.0", "Protopie", "Design Tokens"],
    deliverables: ["User Journey Map", "Figma Design System", "High-Fidelity Prototype", "Dev Handoff Specs"],
    coverImage: "https://framerusercontent.com/images/D5to85TmmFI4rAuvfbNqLXriSc.png?width=1448&height=1086",
    mockType: "mobile",
  },

  "finance-dashboard": {
    slug: "finance-dashboard",
    title: "Finance Dashboard",
    tagline: "Institutional-grade wealth intelligence & automated cashflow analytics",
    category: "Dashboard & Web App",
    client: "Fintech Venture / NeoBank",
    year: "2024",
    role: "Senior Product Designer",
    timeline: "10 Weeks",
    accent: "#FFD84D",
    secondaryAccent: "#F59E0B",
    overview:
      "A comprehensive financial dashboard designed for high-net-worth individuals and modern treasury managers. Consolidates multi-currency bank accounts, equity positions, real-time crypto holdings, and automated tax liability estimates into a single, beautifully organized dark interface.",
    challenge: {
      heading: "Data density without cognitive overload",
      body: "Financial dashboards often suffer from chart clutter, disconnected metrics, and poor responsive scaling. Users needed to scan liquidity across 6 global accounts in 3 seconds, while retaining the capability to drill down into micro-transactions with zero UI stutter.",
      painPoints: [
        "Fragmented visibility across decentralized and traditional banking rails",
        "Overwhelming numerical density without clear visual hierarchy or contextual color coding",
        "Slow table filtering and clunky date-range selection patterns",
      ],
    },
    approach: {
      heading: "Modular Bento grid architecture with contextual summary cards",
      body: "We structured the UI around customizable Bento widgets with strict typographic contrast. Crucial numbers are rendered in monospace tabular digits, accompanied by sparklines and trend pills that immediately communicate delta changes.",
      steps: [
        {
          number: "01",
          title: "Information Hierarchy Hierarchy",
          desc: "Categorized 40+ financial data points into Tier-1 (glanceable) and Tier-2 (exploratory) modules.",
        },
        {
          number: "02",
          title: "Chart & Visualization Design System",
          desc: "Formulated accessible color curves for profit/loss, expense burn, and yield curves.",
        },
        {
          number: "03",
          title: "Component Density Switcher",
          desc: "Designed compact and comfortable view modes accommodating both power traders and executive users.",
        },
      ],
    },
    features: [
      {
        title: "Consolidated Net Worth Telemetry",
        description: "Live real-time aggregation across banking APIs, Robinhood, and crypto cold storage.",
        badge: "Multi-Source",
      },
      {
        title: "Predictive Runway & Cashflow",
        description: "AI-powered forecasting projecting 30, 60, and 90-day liquidity and recurring subscription burn.",
        badge: "Smart Forecasting",
      },
      {
        title: "Keyboard-First Command Palette",
        description: "Quick navigation (Cmd+K) allowing users to transfer funds, export statements, or toggle accounts instantly.",
        badge: "Pro Productivity",
      },
    ],
    tokens: [
      { name: "Gold Spark", hex: "#FFD84D", role: "Primary Brand & Highlights" },
      { name: "Obsidian Deep", hex: "#0D0D11", role: "Canvas Background" },
      { name: "Card Graphite", hex: "#16161C", role: "Widget Containers" },
      { name: "Emerald Delta", hex: "#10B981", role: "Positive Growth Metric" },
    ],
    metrics: [
      { value: "-62%", label: "Time to Find Transactions", detail: "Via universal omni-search & smart filters" },
      { value: "$14.8M", label: "Managed Volume", detail: "Tracked daily through beta pilot" },
      { value: "4.9/5", label: "Executive CSAT", detail: "Praised for visual clarity and speed" },
    ],
    tools: ["Figma", "Design Systems", "Tailwind Design Tokens", "Data Viz UX", "Zeroheight"],
    deliverables: ["24 Responsive Screen Specs", "Component Library", "Interactive Chart Prototypes", "Developer Handoff"],
    coverImage: "https://framerusercontent.com/images/CAnTuyC7rYGbO1sbhC8LNj6E.jpg?width=1080&height=1080",
    mockType: "dashboard",
  },

  "travel-booking-platform": {
    slug: "travel-booking-platform",
    title: "Travel Booking Platform",
    tagline: "Curated wanderlust discovery, flight booking, and collaborative itinerary planning",
    category: "Web & Mobile Design",
    client: "WanderLust Global",
    year: "2023",
    role: "Lead UI/UX Designer",
    timeline: "6 Weeks",
    accent: "#38BDF8",
    secondaryAccent: "#0284C7",
    overview:
      "A human-centered travel ecosystem designed to make planning multi-destination international journeys as exhilarating as the trip itself. Combines flight search, boutique villa discovery, local insider guides, and split-payment group itineraries.",
    challenge: {
      heading: "Eliminating booking fatigue and multi-tab browser chaos",
      body: "Booking a multi-city vacation typically requires 15+ browser tabs, complex date coordination between friends, and buried baggage fees. The objective was to replace confusing tables with an editorial, story-driven booking flow.",
      painPoints: [
        "Hidden fees revealed late in checkout causing 68% abandonment",
        "Disjointed flight and stay coordination with no unified itinerary view",
        "Lack of visual inspiration for open-ended destination discovery",
      ],
    },
    approach: {
      heading: "Story-driven discovery paired with transparent all-in pricing",
      body: "We introduced full-bleed immersive photography, dynamic map synchronization, and a persistent 'Trip Briefcase' drawer that keeps flights, stays, and activities organized side-by-side with split-cost calculations.",
      steps: [
        {
          number: "01",
          title: "Discovery Archetype Mapping",
          desc: "Identified two primary personas: 'The Spontaneous Weekender' and 'The Detail-Obsessed Planner'.",
        },
        {
          number: "02",
          title: "Interactive Itinerary Canvas",
          desc: "Designed drag-and-drop itinerary blocks that automatically calculate airport transfers and drive times.",
        },
        {
          number: "03",
          title: "Transparent Pricing Architecture",
          desc: "All taxes, baggage fees, and cleaning surcharges surfaced upfront on the search results card.",
        },
      ],
    },
    features: [
      {
        title: "Synchronized Map & List Split",
        description: "Hovering any boutique stay pins it directly on the interactive map with neighborhood safety scores.",
        badge: "Spatial UX",
      },
      {
        title: "Collaborative Trip Canvas",
        description: "Shared itinerary boards where friends can vote on stays, add flight details, and split bills.",
        badge: "Social Planning",
      },
      {
        title: "Smart Fare Lock",
        description: "Guarantees ticket prices for 48 hours for a refundable micro-deposit.",
        badge: "Trust Engine",
      },
    ],
    tokens: [
      { name: "Cyan Azure", hex: "#38BDF8", role: "Primary Interactive Accent" },
      { name: "Night Sky", hex: "#080C14", role: "Immersive Dark Canvas" },
      { name: "Sand Neutral", hex: "#F3EFE0", role: "Warm Editorial Highlights" },
      { name: "Cloud Mist", hex: "#94A3B8", role: "Secondary Typography" },
    ],
    metrics: [
      { value: "3.4x", label: "Longer Session Duration", detail: "Driven by editorial city guides & interactive maps" },
      { value: "+38%", label: "Multi-Stay Bookings", detail: "Users combining flights with verified boutique stays" },
      { value: "18.2k", label: "Collaborative Trips", detail: "Created within first 90 days of release" },
    ],
    tools: ["Figma", "User Journey Mapping", "Mapbox UI Integration", "Interactive Prototyping"],
    deliverables: ["Responsive Web Platform", "Mobile App UI", "Interactive Map Prototypes", "Design System"],
    coverImage: "https://framerusercontent.com/images/4TOaudXsxkFFwu3h7hRGuBr474g.png?width=1448&height=1086",
    mockType: "laptop",
  },

  "ai-chatbot": {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    tagline: "Multimodal generative assistant with ambient contextual reasoning",
    category: "AI & Conversational UX",
    client: "Cognitive AI Labs",
    year: "2024",
    role: "Product & AI Experience Designer",
    timeline: "8 Weeks",
    accent: "#FFB86B",
    secondaryAccent: "#F97316",
    overview:
      "A cutting-edge generative AI interface engineered to elevate the conversational UX paradigm beyond basic chat bubbles. Features dynamic code execution cards, streaming thought tree visualizers, voice dictation waveforms, and modular prompt chaining.",
    challenge: {
      heading: "Making non-deterministic AI outputs feel reliable, intuitive, and controllable",
      body: "Most AI chat apps present an endless scrolling wall of static text. When an LLM hallucinates or delivers incomplete answers, users feel stranded without clear editing tools, branching paths, or transparent reasoning indicators.",
      painPoints: [
        "Passive text walls that make long-form structured answers tedious to review",
        "Opaque reasoning without visibility into source citations or prompt logic",
        "Difficult prompt tweaking requiring complete query re-typing",
      ],
    },
    approach: {
      heading: "Canvas-assisted conversations with branchable reasoning nodes",
      body: "We treated conversations as living dynamic documents rather than linear SMS threads. Responses generate rich interactive widgets — charts, runnable code sandboxes, and copyable token snippets — with inline prompt adjustment knobs.",
      steps: [
        {
          number: "01",
          title: "Conversational Architecture & Token Density",
          desc: "Studied mental models of developers and analysts interacting with Claude, GPT, and local models.",
        },
        {
          number: "02",
          title: "Streaming State & Micro-Animations",
          desc: "Engineered subtle pulsing shimmers and typing kinetics that maintain user interest during multi-second latency.",
        },
        {
          number: "03",
          title: "Branching Dialogue Architecture",
          desc: "Created intuitive fork indicators allowing users to explore multiple solution paths in parallel.",
        },
      ],
    },
    features: [
      {
        title: "Thought Trace Transparency",
        description: "Expandable reasoning tree displaying system prompts, retrieval context, and verification checks.",
        badge: "Explainable AI",
      },
      {
        title: "Inline Canvas Scratchpad",
        description: "Side-by-side editing canvas that updates collaboratively as the AI generates code or documents.",
        badge: "Split Canvas",
      },
      {
        title: "Voice Waveform Dictation",
        description: "Fluid fluid-audio input with real-time word transcription and noise suppression feedback.",
        badge: "Multimodal Voice",
      },
    ],
    tokens: [
      { name: "Solar Amber", hex: "#FFB86B", role: "AI Cognition & Active Token Stream" },
      { name: "Deep Abyssal", hex: "#08080C", role: "Interface Background" },
      { name: "Glass Tint", hex: "#1A1924", role: "Message Pill Containers" },
      { name: "Purple Insight", hex: "#A855F7", role: "Reasoning & Citation Badges" },
    ],
    metrics: [
      { value: "4.8/5", label: "User Clarity Rating", detail: "Users praised transparent thought trace visibility" },
      { value: "2.8x", label: "Faster Task Completion", detail: "Via side-by-side canvas editing" },
      { value: "85%", label: "Branching Adoption", detail: "Users actively forking prompt directions" },
    ],
    tools: ["Figma", "Claude AI", "Prompt Engineering UX", "Micro-Interactions", "Token Architecture"],
    deliverables: ["Full Mobile & Web UI Kit", "Conversation State Diagram", "Micro-Interaction Prototypes"],
    coverImage: "https://framerusercontent.com/images/8fO9XaNyKpuVdGGfeDDRzGUgInY.png?width=1536&height=1024",
    mockType: "mobile",
  },

  "car-rental-booking-app": {
    slug: "car-rental-booking-app",
    title: "Car Rental Booking App",
    tagline: "Instant vehicle unlock, transparent fleets, and keyless contactless pickup",
    category: "Mobile Application",
    client: "DriveEase Global",
    year: "2023",
    role: "Lead Mobile Designer",
    timeline: "7 Weeks",
    accent: "#8EC5FF",
    secondaryAccent: "#3B82F6",
    overview:
      "A modern mobility application designed to transform car rental into a modern 3-minute experience. Featuring instant digital key synchronization, 3D vehicle inspection, transparent insurance breakdowns, and airport curb delivery.",
    challenge: {
      heading: "Saying goodbye to 45-minute airport counter queues and paperwork",
      body: "Traditional rental counters are notorious for aggressive upselling, lengthy paperwork, and bait-and-switch vehicle assignments. The mission was to empower renters to select their exact vehicle and drive away in under 120 seconds.",
      painPoints: [
        "Exhausting counter lines after long flights and unexpected insurance upsells",
        "Ambiguity over exact vehicle model, trim, and trunk capacity",
        "Manual damage inspection clipboards leading to unfair post-trip dispute charges",
      ],
    },
    approach: {
      heading: "Digital-first key handover with photographic damage verification",
      body: "We designed an end-to-end mobile flow where verified users reserve the exact vehicle shown, unlock the doors via Bluetooth LE, and complete a 4-point photo check right in the app.",
      steps: [
        {
          number: "01",
          title: "Service Blueprint & Airport Flow",
          desc: "Diagrammed arrival steps from baggage claim to parking bay to minimize physical steps.",
        },
        {
          number: "02",
          title: "Fleet Visualizer in Figma",
          desc: "Built accurate specifications cards showing real seating, luggage capacity, and powertrain specs.",
        },
        {
          number: "03",
          title: "Digital Key NFC Prototyping",
          desc: "Engineered unmistakable tactile feedback and clear lock/unlock states.",
        },
      ],
    },
    features: [
      {
        title: "Digital NFC Keyless Access",
        description: "Unlock vehicle doors, open trunk, and start ignition directly from Apple Wallet or app.",
        badge: "NFC Digital Key",
      },
      {
        title: "3D Trunk & Luggage Checker",
        description: "Visual sizing guide ensuring suitcases fit comfortably before booking the vehicle.",
        badge: "Utility UX",
      },
      {
        title: "Pre-Trip Photo Verification",
        description: "Guided AR camera view stamping timestamped pre-existing scratches to prevent disputes.",
        badge: "Protection & Trust",
      },
    ],
    tokens: [
      { name: "Electric Cyan", hex: "#8EC5FF", role: "Primary Interactive Status & Vehicle Accent" },
      { name: "Night Pitch", hex: "#07090E", role: "Screen Background" },
      { name: "Steel Card", hex: "#111622", role: "Card Surface" },
      { name: "Success Mint", hex: "#34D399", role: "Vehicle Ready / Unlocked" },
    ],
    metrics: [
      { value: "85s", label: "Curbside Pickup", detail: "Average time from lot arrival to driving away" },
      { value: "-94%", label: "Damage Disputes", detail: "Eliminated by photographic pre-trip verification" },
      { value: "4.92", label: "App Store Rating", detail: "Over 8,000 verified rider reviews" },
    ],
    tools: ["Figma", "Mobile UI Guidelines (iOS/Android)", "Motion Specs", "Protopie"],
    deliverables: ["iOS & Android Mobile App", "Digital Key Flow Prototype", "Fleet Design Tokens"],
    coverImage: "https://framerusercontent.com/images/nqWPDqP2Irs65djTJlJLtKJ5SI.webp?width=1448&height=1086",
    mockType: "mobile",
  },

  "digital-marketing-landing-page": {
    slug: "digital-marketing-landing-page",
    title: "Digital Marketing Landing Page",
    tagline: "High-conversion growth marketing platform with interactive ROI calculators",
    category: "Web & Growth Design",
    client: "Apex Growth Media",
    year: "2023",
    role: "Senior UI/UX & Web Designer",
    timeline: "5 Weeks",
    accent: "#D0A8FF",
    secondaryAccent: "#A855F7",
    overview:
      "A high-impact, conversion-focused B2B marketing landing page designed to turn cold enterprise traffic into qualified sales inquiries. Employs dynamic interactive ROI sliders, animated performance metrics, and social proof trust mechanics.",
    challenge: {
      heading: "Elevating enterprise B2B SaaS conversion in a crowded market",
      body: "Marketing agencies often rely on generic buzzwords and sterile static forms. Enterprise prospects bounce within 8 seconds if they cannot immediately quantify potential revenue lift or see proof of industry credibility.",
      painPoints: [
        "Low inbound form completion rates due to intimidating multi-page contact surveys",
        "Vague service descriptions without demonstrable ROI simulations",
        "Lack of interactive engagement leading to high bounce rates",
      ],
    },
    approach: {
      heading: "Dynamic value demonstration with interactive revenue modeling",
      body: "We replaced static claims with an interactive ROI calculator that allows visitors to slide their monthly ad spend and witness projected pipeline revenue in real time, leading directly to a 1-click meeting calendar.",
      steps: [
        {
          number: "01",
          title: "Conversion Architecture & Heatmap Analysis",
          desc: "Structured visual hierarchy based on eye-tracking studies of B2B marketing executives.",
        },
        {
          number: "02",
          title: "High-Contrast Visual Storytelling",
          desc: "Blended dark-mode aesthetics with vibrant neon accents and glassmorphic telemetry cards.",
        },
        {
          number: "03",
          title: "Micro-Conversion Touchpoints",
          desc: "Designed low-friction engagement steps before requesting business email addresses.",
        },
      ],
    },
    features: [
      {
        title: "Real-Time Pipeline ROI Slider",
        description: "Prospects slide their current spend to visualize projected conversions and pipeline revenue.",
        badge: "Interactive Widget",
      },
      {
        title: "Social Proof Trust Engine",
        description: "Verified client growth badges, video testimonial carousels, and case metric breakdowns.",
        badge: "Trust Validation",
      },
      {
        title: "Frictionless 1-Click Meeting Scheduler",
        description: "Embeds live calendar availability directly inside the footer conversion zone.",
        badge: "Conversion Booster",
      },
    ],
    tokens: [
      { name: "Neon Lilac", hex: "#D0A8FF", role: "Primary Accent & Glow" },
      { name: "Violet Core", hex: "#A855F7", role: "Gradient Primary" },
      { name: "Midnight Onyx", hex: "#08060D", role: "Section Canvas" },
      { name: "Crisp Pure", hex: "#FFFFFF", role: "High-Contrast Headlines" },
    ],
    metrics: [
      { value: "+68%", label: "Qualified Lead Volume", detail: "Doubled calendar bookings in month one" },
      { value: "4.1m", label: "Average Session Time", detail: "Heavy interaction with ROI simulator" },
      { value: "2.4x", label: "Higher CTR on CTAs", detail: "Outperformed the previous baseline page" },
    ],
    tools: ["Figma", "Conversion Rate Optimization (CRO)", "Interactive Prototyping", "Design Systems"],
    deliverables: ["Responsive Marketing Landing Page", "Interactive ROI Calculator Spec", "Style Guide"],
    coverImage: "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852",
    mockType: "laptop",
  },
};

/**
 * Returns a complete case study object for any project, dynamically synthesizing
 * realistic case study data for any custom project added via the Studio.
 */
export function getProjectCaseStudy(
  projectOrSlug: Project | string,
  allProjects: Project[] = []
): { project: Project; caseStudy: CaseStudyData } {
  let project: Project | undefined;
  let slug: string;

  if (typeof projectOrSlug === "string") {
    slug = slugify(projectOrSlug);
    project = allProjects.find((p) => slugify(p.name) === slug);
  } else {
    project = projectOrSlug;
    slug = slugify(project.name);
  }

  // Pre-configured case study
  if (CASE_STUDIES[slug]) {
    const cs = CASE_STUDIES[slug];
    const effectiveProject: Project = project || {
      name: cs.title,
      tag: cs.category,
      description: cs.tagline,
      mockTitle: cs.title,
      mockSubtitle: `${cs.category} · ${cs.year}`,
      image: cs.coverImage,
      accent: cs.accent,
      href: `/work/${cs.slug}`,
      behanceUrl: cs.behanceUrl || "",
      featured: false,
    };
    return {
      project: {
        ...effectiveProject,
        image: effectiveProject.image || cs.coverImage,
        accent: effectiveProject.accent || cs.accent,
      },
      caseStudy: {
        ...cs,
        title: effectiveProject.name,
        accent: effectiveProject.accent || cs.accent,
        coverImage: effectiveProject.image || cs.coverImage,
        liveUrl: effectiveProject.href && effectiveProject.href.startsWith("http") ? effectiveProject.href : undefined,
        behanceUrl: effectiveProject.behanceUrl || undefined,
      },
    };
  }

  // Fallback synthesis for dynamically created Studio projects
  const fallbackName = project?.name || "Featured Project";
  const fallbackTag = project?.tag || "UI/UX Design";
  const fallbackAccent = project?.accent || "#a855f7";
  const fallbackImage = project?.image || PROJECT_FALLBACK_IMAGES[slug] || "https://framerusercontent.com/images/Ft5E6vbXEzPW0iVTukukbkCuMM.png?width=1172&height=852";

  const syntheticCaseStudy: CaseStudyData = {
    slug,
    title: fallbackName,
    tagline: project?.description || "An intuitive digital experience crafted with precision and purpose.",
    category: fallbackTag,
    client: "Confidential Client",
    year: "2024",
    role: "UI/UX Designer",
    timeline: "6-8 Weeks",
    accent: fallbackAccent,
    secondaryAccent: "#7C3AED",
    overview:
      project?.description ||
      "A tailored design solution engineered to solve user friction, elevate brand clarity, and deliver high-performance visual aesthetics across all platforms.",
    challenge: {
      heading: "Unlocking seamless user journeys through thoughtful interaction design",
      body: `Designing ${fallbackName} required balancing business objectives with an intuitive, friction-free user experience. The key challenge centered on creating accessible layouts that empower users while maintaining a sleek, modern visual aesthetic.`,
      painPoints: [
        "Complexity in initial user onboarding and navigation flows",
        "Need for consistent design tokens and responsive scalability across viewports",
        "Ensuring rapid performance and clear visual hierarchy on mobile devices",
      ],
    },
    approach: {
      heading: "Iterative wireframing, component-driven design systems, and rapid prototyping",
      body: "We leveraged Figma auto-layouts, AI-assisted user journey ideation, and modular component libraries to iterate rapidly through design solutions and validate usability before development handoff.",
      steps: [
        {
          number: "01",
          title: "Discovery & User Analysis",
          desc: "Investigated core user flows, edge cases, and accessibility considerations.",
        },
        {
          number: "02",
          title: "Design System & High-Fidelity UI",
          desc: "Engineered scalable tokens, color contrasts, and interactive states.",
        },
        {
          number: "03",
          title: "Prototype & Validation",
          desc: "Tested fluid micro-interactions, responsive adaptability, and developer handoff tokens.",
        },
      ],
    },
    features: [
      {
        title: "Intuitive Architecture",
        description: "Clear visual hierarchy and structured layout for effortless interaction.",
        badge: "Core UX",
      },
      {
        title: "Adaptive Responsive Design",
        description: "Fluidly scales from ultra-wide displays down to compact mobile viewports.",
        badge: "Responsive",
      },
      {
        title: "Design Token Consistency",
        description: "Strict typographic scale and cohesive color pairings for seamless handoff.",
        badge: "Design System",
      },
    ],
    tokens: [
      { name: "Primary Accent", hex: fallbackAccent, role: "Main Brand & Call to Action" },
      { name: "Deep Surface", hex: "#0E0E12", role: "Interface Canvas" },
      { name: "Card Backdrop", hex: "#16161D", role: "Component Layer" },
      { name: "Text High", hex: "#FFFFFF", role: "Primary Copy" },
    ],
    metrics: [
      { value: "+35%", label: "Usability Lift", detail: "Measured across user validation testing" },
      { value: "100%", label: "Component Coverage", detail: "Fully tokenized Figma library" },
      { value: "4.9/5", label: "Stakeholder CSAT", detail: "Positive feedback on aesthetics & clarity" },
    ],
    tools: ["Figma", "Design Systems", "Prototyping", "Developer Handoff"],
    deliverables: ["Wireframes", "Design Tokens", "High-Fidelity Screens", "Interactive Prototype"],
    coverImage: fallbackImage,
    mockType: "laptop",
    liveUrl: project?.href && project.href.startsWith("http") ? project.href : undefined,
    behanceUrl: project?.behanceUrl || undefined,
  };

  return {
    project: project || {
      name: fallbackName,
      tag: fallbackTag,
      description: syntheticCaseStudy.tagline,
      mockTitle: fallbackName,
      mockSubtitle: fallbackTag,
      image: fallbackImage,
      accent: fallbackAccent,
      href: `/work/${slug}`,
      behanceUrl: "",
      featured: false,
    },
    caseStudy: syntheticCaseStudy,
  };
}

/**
 * Returns previous and next projects for pagination in case studies.
 */
export function getAdjacentProjects(
  currentSlug: string,
  allProjects: Project[]
): { prev: Project | null; next: Project | null } {
  if (allProjects.length === 0) return { prev: null, next: null };
  const currentIndex = allProjects.findIndex((p) => slugify(p.name) === currentSlug);
  if (currentIndex === -1) {
    return {
      prev: allProjects[allProjects.length - 1] ?? null,
      next: allProjects[0] ?? null,
    };
  }

  const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
  const nextIndex = (currentIndex + 1) % allProjects.length;

  return {
    prev: allProjects[prevIndex],
    next: allProjects[nextIndex],
  };
}
