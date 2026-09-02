# ✨ Monson Sunny — Designer Portfolio & Visual CMS

> A high-end, responsive portfolio template for Product Designers, UI/UX Creatives, and Developers — featuring an integrated, password-protected visual CMS backed by **Cloudflare KV & R2**.

---

## 🌟 Highlights & Features

- 🎨 **Luxury Dark Aesthetic**: Handcrafted typography, smooth parallax, custom magnetic cursor, and frosted glassmorphism.
- ⚡ **Blazing Fast Performance**: Zero-framework vanilla HTML/CSS/JS with Vite 5, sub-second LCP preload, and automated asset optimization.
- 🎛️ **Password-Protected Visual CMS (`/edit`)**:
  - Live in-browser editing of all texts, descriptions, and media.
  - **Section Visibility Switches**: Toggle any section (*Hero, Projects, Services, About, Playground, Tools, Journal, Collab, Contact*) on/off with clean navigation sync.
  - **Collection Controls**: Reorder items (`▲`/`▼`), toggle draft visibility (`👁️`/`🚫`), duplicate (`📋`), and delete items.
  - **Extensible Socials & Tools**: Add custom platforms (*GitHub, 𝕏/Twitter, Substack, Medium*) and live marquee skill tags.
- ☁️ **Cloudflare Native Storage**:
  - **Cloudflare KV** (`/api/content`): Live JSON content sync.
  - **Cloudflare R2** (`/api/upload`): Direct image uploads and CDN serving.
  - **Zero-Config Local Fallback**: Seamlessly works out-of-the-box using local browser storage when running offline or without credentials.
- 📱 **100% Mobile & Accessible**: Focus trapping, screen-reader friendly landmarks, ARIA dialogs, and reduced-motion support.
- 🔍 **SEO & PWA Ready**: OpenGraph cards, Twitter preview, JSON-LD structured schema, manifest, robots.txt, and sitemap.

---

## 📁 Clean Project Structure

```
.
├── index.html                  # Main portfolio entry (SEO, semantic HTML5)
├── 404.html                    # Custom branded 404 page
├── assets/
│   ├── css/
│   │   ├── style.css           # Portfolio styling & animations
│   │   └── admin.css           # CMS dashboard styling
│   ├── js/
│   │   ├── main.js             # Portfolio interactions & content hydration
│   │   ├── admin.js            # CMS state management & binding engine
│   │   └── content-model.js    # Central schema, defaults, & Cloudflare client
│   └── images/                 # Canonical portfolio media & icons
├── edit/
│   └── index.html              # Protected CMS Visual Editor route
├── api/
│   ├── content.js              # Vercel Serverless Function (Cloudflare KV sync)
│   └── upload.js               # Vercel Serverless Function (Cloudflare R2 sync)
├── functions/
│   └── api/
│       ├── content.js          # Cloudflare Pages Function (KV sync)
│       └── upload.js           # Cloudflare Pages Function (R2 sync)
├── public/                     # Static files copied verbatim to dist/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   └── _headers                # Security & caching headers
├── .env.example                # Local environment variables template (Vercel)
├── .dev.vars.example           # Local secrets template (Cloudflare Wrangler)
├── vercel.json                 # Vercel deployment configuration
├── wrangler.toml               # Cloudflare Pages / KV / R2 deployment config
├── vite.config.js              # Multi-page bundler & image optimizer
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Amith-Abey-Stephen/Monson_Portfolio.git
cd Monson_Portfolio
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
- **Live Portfolio**: [http://localhost:3000/](http://localhost:3000/)
- **Visual CMS Editor**: [http://localhost:3000/edit/](http://localhost:3000/edit/)

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Managing the CMS Password

### Local Development
Copy `.dev.vars.example` to `.dev.vars`:
```bash
cp .dev.vars.example .dev.vars
```
Set your password inside `.dev.vars`:
```env
ADMIN_PASSWORD="your-strong-password"
```

### Production (Cloudflare Pages)
1. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** → Your Project.
2. Go to **Settings** → **Environment Variables** → **Production**.
3. Add a variable named `ADMIN_PASSWORD` as an **Encrypted Secret**.

---

## 🚀 Deployment Guides

### Option A: Deploy to Vercel (Recommended if hosting on Vercel)

1. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new) → Select `Monson_Portfolio` repository.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
2. **Environment Variables**:
   In Vercel **Settings** → **Environment Variables**, add:
   - `ADMIN_PASSWORD`: Your password (e.g. `admin123`)
   - *(Optional for Cloudflare KV sync)*: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_ID`, `CLOUDFLARE_API_TOKEN`
   - *(Optional for Cloudflare R2 sync)*: `CLOUDFLARE_R2_BUCKET`, `R2_PUBLIC_URL`
3. Click **Deploy**. Both the portfolio and `/edit` CMS with Vercel serverless API routes work instantly!

---

### Option B: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Bind Storage & Secrets**:
   - In Pages **Settings** → **Functions** → **KV namespace bindings**, bind `PORTFOLIO_KV`.
   - In Pages **Settings** → **Functions** → **R2 bucket bindings**, bind `PORTFOLIO_R2`.
   - In Pages **Settings** → **Environment variables**, set `ADMIN_PASSWORD` as encrypted secret.
4. Deploy!

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
