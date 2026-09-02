# Monson Sunny — Portfolio

Production-ready static portfolio for **Monson Sunny — UI/UX Designer**.

> Thoughtful digital experiences that feel as good as they look.

## Stack

- **Static** HTML + CSS + vanilla JS (no framework)
- **Build** Vite 5 — minify, hash, image optimizer, legacy support
- **Images** JPEG optimized + WebP/AVIF siblings via `sharp`
- **Deploys** Netlify / Vercel / Cloudflare Pages / any static host

## Project Structure

```
.
├── index.html              # canonical entry (semantic, SEO, a11y)
├── 404.html                # custom not-found
├── assets/
│   ├── css/style.css       # main stylesheet
│   ├── js/main.js          # portfolio interactions & animations
│   └── images/             # optimized portfolio images
├── public/                 # copied verbatim to dist/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   └── _headers
├── vite.config.js
└── vercel.json
```

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000  (HMR)
npm run build    # → dist/  (hashed, minified, optimized)
npm run preview  # preview dist/
```

## Scripts

| script | what it does |
|---|---|
| `dev` | Vite dev server |
| `build` | Production build to `dist/` |
| `preview` | Preview production build |

## Production Checklist

- [x] Semantic HTML5, landmarks, skip-link, heading hierarchy
- [x] Meta: title/description/canonical/OG/Twitter/JSON-LD/robots/theme-color
- [x] Performance: preload LCP, `fetchpriority=high`, `decoding=async`, width/height CLS, `content-visibility:auto`
- [x] Accessibility: focus-visible, keyboard nav, `aria-*`, inert trap, reduced-motion, 720p mobile menu
- [x] Security headers: CSP-ready, HSTS, X-Frame, Referrer, Permissions-Policy (via netlify/vercel/_headers)
- [x] Caching: immutable `/assets/*` 1y, HTML `must-revalidate`
- [x] SEO: sitemap.xml, robots.txt, humans.txt, security.txt, manifest, OG cover 1200×630
- [x] PWA-ready manifest, favicon SVG+PNG, apple-touch-icon
- [x] Custom 404, error fallbacks for images, toast a11y live region
- [x] Build: Vite hashing, esbuild minify, drop console, image optimizer

## Deployment

### Netlify
`netlify.toml` already configured. Connect repo, build `npm run build`, publish `dist`.

### Vercel
`vercel.json` configured. `vercel --prod` or connect repo.

### Cloudflare Pages / Static
Build `npm run build`, upload `dist/`. `_headers` in `public/` handled automatically.

### Plain static (no build)
You can also deploy repo root directly (no `npm run build`) — `index.html` + `assets/` works as static site without Vite.

## Environment

- Node ≥18
- No env vars required. To toggle verbose console checks: `localStorage.setItem('ms-verbose','1')` in devtools.

## License

All rights reserved © 2026 Monson Sunny.
