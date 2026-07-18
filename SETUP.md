# Excellence Biomed — Complete Setup & Deployment Guide

A static, production-ready marketing website for **Excellence Biomed**
(pharmaceutical company). This guide covers:

1. What was built and what's in the project
2. Prerequisites (accounts, software, assets)
3. Local preview
4. Configuration (contact form, branding, products)
5. Deployment (multiple host options)
6. Post-launch verification
7. Maintenance (adding products, editing content)
8. Troubleshooting

---

## 1. What was built

### Pages
- **`index.html`** — Home: hero, "Who we are" values, featured products, CTA
- **`about.html`** — Company story, mission, values
- **`products.html`** — Full product gallery with search, category filter, lightbox
- **`contact.html`** — Contact form (Full name, Email, Phone, Subject, Message)

### Shared components
- **Header** — Sticky, with logo + nav + theme toggle + mobile hamburger
- **Footer** — Address logo, quick links, category links, contact info, social
- **Modal / lightbox** — Product detail view on click

### Features
- **Light / dark theme toggle** with localStorage persistence and
  `prefers-color-scheme` detection
- **CSS filter-based logo inversion** for dark mode (no extra image files)
- **Dynamic product gallery** — drop a new JPG + add one JSON line
- **Search + category filter** on the products page
- **Contact form** with client-side validation, honeypot anti-spam,
  loading spinner, success/error states — submits via Web3Forms
- **SEO** — Per-page meta, Open Graph, Twitter cards, canonical URLs,
  Organization JSON-LD on home, sitemap.xml, robots.txt
- **Accessibility** — Semantic HTML, ARIA labels, focus rings, 44px tap
  targets, `prefers-reduced-motion` support, skip-to-content link
- **Performance** — `loading="lazy"` on images, deferred JS, async font loading

### Tech stack
- **HTML5, CSS3, vanilla JavaScript** — no framework, no build step
- **Web3Forms** for email delivery (free, unlimited, no signup)
- **Google Fonts (Inter)** for typography
- **No backend, no database, no CMS**

---

## 2. Project structure

```
EB_Pharma_Website/
├── index.html              Home page
├── about.html              About page
├── products.html           Products gallery + lightbox
├── contact.html            Contact form
├── robots.txt              Crawler rules
├── sitemap.xml             Sitemap for search engines
├── favicon.svg             Browser tab icon
├── README.md               Quick-start overview
├── SETUP.md                This file — full setup guide
│
├── css/
│   ├── variables.css       Theme tokens (light + dark) — edit colors here
│   ├── base.css            Reset, typography
│   ├── components.css      Header, nav, cards, modal, form, footer
│   └── responsive.css      Breakpoints: 480, 768, 1024, 1280 px
│
├── js/
│   ├── theme.js            Light/dark toggle + localStorage + system pref
│   ├── products.js         Dynamic gallery loader + filter + lightbox
│   ├── contact.js          Form validation + Web3Forms submit
│   └── main.js             Mobile nav, year, shared init
│
├── data/
│   └── products.json       Product manifest — edit to add/change products
│
└── assets/
    └── images/
        ├── branding/
        │   ├── logo.png            Primary logo (header)
        │   └── logo-address.png    Address logo (footer)
        └── products/               01.jpg … 27.jpg (product visual aids)
```

Total project size: **~14 MB** (dominated by 27 product JPEGs).

---

## 3. Prerequisites

### You need
- ✅ **A modern web browser** (Chrome, Firefox, Edge, or Safari) — for preview
- ✅ **A text editor** — VS Code, Sublime, Notepad++, or any plain text editor
- ✅ **A static hosting account** — pick one (free tier is fine for all):
  - **Netlify** (https://netlify.com)
  - **Vercel** (https://vercel.com)
  - **Cloudflare Pages** (https://pages.cloudflare.com)
  - **GitHub Pages** (https://pages.github.com)
  - Or any web server / S3 bucket / cPanel
- ✅ **An email address** to receive contact form submissions
- ✅ **(Optional) Git** — installed locally if you want to push to a Git-based host

### You do NOT need
- ❌ Node.js / npm
- ❌ Python or any other server runtime
- ❌ A backend / database / CMS
- ❌ A paid plan on any service

### Accounts to create
| Service | Why | Time to set up |
|---|---|---|
| **Web3Forms** (https://web3forms.com) | Receives form submissions and emails them to you | 60 seconds — no signup required |
| **Hosting account** (Netlify / Vercel / Cloudflare / GitHub) | Serves the site to the public | 2–5 minutes |

That's it. Two accounts total, both free.

---

## 4. Local preview (before deploying)

The site is plain HTML — you can open `index.html` in a browser, but
**two features won't work** from a `file://` URL:

- The product gallery (uses `fetch()` to load `data/products.json`)
- The form (uses `fetch()` to post to Web3Forms)

To preview everything, serve the folder over HTTP.

### Option A: Use Node's `http-server` (if you have Node)
```bash
cd EB_Pharma_Website
npx http-server -p 8080
```
Then open **http://localhost:8080** in your browser.

### Option B: Use VS Code "Live Server" extension
1. Install the **Live Server** extension in VS Code
2. Open the `EB_Pharma_Website` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option C: Use any other static server
- Python: `python -m http.server 8080` (if Python is installed)
- PHP: `php -S localhost:8080`
- Or drag the folder onto **Netlify Drop** (https://app.netlify.com/drop)
  for an instant public URL with no setup

---

## 5. Configuration — fill in your real info

The build is **complete and functional** with placeholder data. Before
going live, replace the following:

### A. Contact form endpoint (REQUIRED)

**File:** `js/contact.js`, line 24
```js
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY";
```

**Steps:**
1. Go to **https://web3forms.com**
2. Enter the email address that should receive form submissions
3. Click **Create Access Key**
4. Copy the key (a long string like `a1b2c3d4-e5f6-...`)
5. Paste it into `js/contact.js`, replacing `YOUR_ACCESS_KEY`
6. Save the file

The form will now send real emails to your inbox. Until you do this,
the form runs in "demo mode" — it shows a success message but doesn't
actually send email (so the build is safe to test).

### B. Contact details (REQUIRED)

Search-and-replace these placeholders across the site:

| Placeholder | Where | Replace with |
|---|---|---|
| `info@excellencebiomed.com` | All footers, `contact.html` | Your real email |
| `+91 000 000 0000` | All footers, `contact.html` | Your real phone |
| `Plot No. XX, Industrial Area, City, State, India` | `contact.html` | Your real postal address |
| `Mon – Fri, 9:00 – 18:00 IST` | `contact.html` | Your real business hours |

Easiest way: open the project folder in VS Code, press **Ctrl+Shift+F**
to search across files, search for `+91 000 000 0000`, and replace each
occurrence.

### C. Company domain (REQUIRED for SEO)

Search-and-replace `https://www.excellencebiomed.com/` with your real
domain in these files:
- `index.html` — `<link rel="canonical">` and `<meta property="og:url">`
- `about.html` — same
- `products.html` — same
- `contact.html` — same
- `sitemap.xml` — all 4 `<loc>` entries
- `robots.txt` — the Sitemap line

### D. Brand colors (OPTIONAL)

**File:** `css/variables.css`

The primary teal is `#0fb5a8` (extracted from the Excellence Biomed logo
symbol). To change the brand color site-wide:
1. Open `css/variables.css`
2. Find `--primary: #0fb5a8;` (light mode) and `--primary: #2dd4bf;` (dark mode)
3. Replace with your hex codes
4. Save — every button, link, and accent updates instantly

### E. Product catalogue (OPTIONAL — works as-is)

The build ships with all 27 product images and a matching manifest. To
customize product names, categories, or descriptions:

**File:** `data/products.json`

Each product is one object:
```json
{
  "id": 1,
  "image": "01.jpg",
  "name": "Cardiovin-50",
  "category": "Cardiology",
  "description": "Antiplatelet therapy for cardiovascular risk reduction.",
  "tags": ["cardiology", "heart"]
}
```

To **add a new product**: drop the new JPEG into `assets/images/products/`
and add a corresponding object to the `products` array. No code changes.

To **pick featured products on the home page**: add a `featured` array
to the JSON:
```json
{
  "products": [ ... ],
  "featured": [1, 3, 7, 12]
}
```

### F. Social media links (OPTIONAL)

**File:** every page's footer, look for the `<div class="social">` block.

Replace the `#` href values with your real social media URLs:
```html
<a href="https://linkedin.com/company/excellence-biomed" aria-label="LinkedIn">...</a>
<a href="https://facebook.com/excellencebiomed" aria-label="Facebook">...</a>
<a href="https://twitter.com/excellencebiomed" aria-label="Twitter">...</a>
```

### G. Tagline (OPTIONAL)

The hero tagline **"Excellence in Biomedicine, Compassion in Care"**
appears in three places. To change it, search-and-replace in:
- `index.html` — hero `<h1>`
- `index.html` — footer brand paragraph
- `about.html` — any other location where it appears

---

## 6. Deployment

Pick any host. All four options below are free for the traffic a
corporate marketing site will receive.

### Option A: Netlify (recommended — easiest)

**Drag-and-drop method (no Git required):**
1. Go to **https://app.netlify.com/drop**
2. Drag the `EB_Pharma_Website` folder onto the page
3. Wait ~10 seconds
4. You get a public URL like `https://random-name-123.netlify.app`
5. Done. Site is live.

**Git-based method (for ongoing updates):**
1. Push the project to a GitHub/GitLab/Bitbucket repo
2. In Netlify dashboard → **Add new site** → **Import existing project**
3. Select your repo
4. Build settings: leave everything blank (no build command needed)
5. Click **Deploy site**
6. Netlify gives you a URL

**Custom domain (optional):**
1. In Netlify dashboard → **Domain settings** → **Add custom domain**
2. Follow the DNS instructions (add a CNAME or use Netlify DNS)
3. HTTPS is automatic

### Option B: Vercel

1. Install Vercel CLI: `npm i -g vercel` (or use the dashboard)
2. From the `EB_Pharma_Website` folder, run: `vercel --prod`
3. Follow the prompts (accept defaults)
4. Vercel gives you a URL like `https://eb-pharma-website.vercel.app`

**Or via dashboard:**
1. Go to **https://vercel.com/new**
2. Import your Git repo (or drag-and-drop the folder)
3. Leave build settings blank, click **Deploy**

### Option C: Cloudflare Pages

1. Push the project to a GitHub repo
2. Go to **https://pages.cloudflare.com** → **Create a project**
3. Connect your GitHub account, select the repo
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/` or `.`
5. Click **Save and Deploy**

### Option D: GitHub Pages

1. Push the project to a GitHub repo
2. In the repo → **Settings** → **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main`, folder: `/ (root)`
5. Click **Save**
6. Site is live at `https://<username>.github.io/<repo-name>/`

**Note:** GitHub Pages is free but doesn't have form handling built in
— Web3Forms handles that independently, so this is fine.

### Option E: Any other static host (S3, cPanel, nginx, etc.)

Just upload the contents of `EB_Pharma_Website/` (the files and folders
inside it, not the folder itself) to your web root. The site is plain
HTML — no special configuration needed.

For Apache hosts, add this `.htaccess` to enable clean URLs and caching
(optional but recommended):
```apache
# Cache static assets for 1 year
<filesMatch "\.(jpg|jpeg|png|gif|svg|webp|css|js)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</filesMatch>

# Cache HTML for 1 hour
<filesMatch "\.(html|json|xml)$">
  Header set Cache-Control "public, max-age=3600"
</filesMatch>
```

---

## 7. Post-launch verification

After deploying, walk through this checklist:

### Functional tests
- [ ] Home page loads, hero shows correctly
- [ ] Theme toggle works (sun/moon icon, persists on reload)
- [ ] Dark mode is readable everywhere (especially the logo)
- [ ] Navigation links work (Home, About, Products, Contact)
- [ ] Mobile menu opens and closes (test at 375px width)
- [ ] Products page shows all 27 products
- [ ] Search box filters products live as you type
- [ ] Category dropdown filters products
- [ ] Clicking a product opens the lightbox modal
- [ ] Esc key closes the modal
- [ ] Clicking outside the modal closes it
- [ ] Contact form validates required fields
- [ ] Contact form validates email format
- [ ] Contact form sends a real test message → check your inbox
- [ ] Form clears after successful submission
- [ ] Honeypot field is not visible to humans (try selecting all text on the page)

### SEO checks
- [ ] Visit **https://your-domain.com/sitemap.xml** — shows 4 URLs
- [ ] Visit **https://your-domain.com/robots.txt** — shows crawl rules
- [ ] Visit **https://your-domain.com/favicon.svg** — shows the favicon
- [ ] View page source → check `<title>`, `<meta description>`, OG tags
- [ ] Test in **Google Search Console** → submit sitemap
- [ ] Test in **Google Rich Results Test** → verify Organization schema on home

### Performance checks
- [ ] Run **Google Lighthouse** in Chrome DevTools (F12 → Lighthouse tab)
- [ ] Target scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] If Performance is low, compress product JPEGs (see optimization below)

### Cross-browser checks
- [ ] Chrome (desktop + mobile emulation in DevTools)
- [ ] Firefox
- [ ] Safari (or iOS device if available)
- [ ] Edge

---

## 8. Maintenance

### Adding a new product
1. Drop the new JPEG into `assets/images/products/` (e.g. `28.jpg`)
2. Open `data/products.json`
3. Add a new object to the `products` array:
   ```json
   { "id": 28, "image": "28.jpg", "name": "NewProduct-100",
     "category": "Cardiology",
     "description": "What it does, in one sentence.",
     "tags": ["cardiology"] }
   ```
4. Commit / redeploy
5. Done — the product appears automatically

### Updating product info
1. Open `data/products.json`
2. Edit the relevant object
3. Save, commit, redeploy

### Adding a new category
Categories are auto-derived from the `category` field in each product.
Just add a new category name to a product — it will appear in the
filter dropdown on the next page load.

### Changing the logo
1. Replace `assets/images/branding/logo.png` (used in header)
2. Replace `assets/images/branding/logo-address.png` (used in footer)
3. Use the same filenames to avoid code changes
4. Or update the `<img src="...">` paths in each HTML file

### Changing brand colors
1. Open `css/variables.css`
2. Edit `--primary` and `--primary-hover` in both `:root` and `[data-theme="dark"]`
3. Save, commit, redeploy — every accent color updates site-wide

### Changing contact details
See **Section 5B** above. Search-and-replace across all HTML files.

---

## 9. Performance optimization (optional)

The build ships as-is and should score well on Lighthouse. For
extra performance, especially on slow connections:

### Compress product images
The 27 product JPEGs total ~14 MB. You can shrink this by 60–80% with
no visible quality loss:

**Using Squoosh (web-based, easiest):**
1. Go to **https://squoosh.app**
2. Drag each `01.jpg` through `27.jpg` into Squoosh
3. Set quality to 75–82, format to **MozJPEG**
4. Download and replace the original

**Using ImageMagick (command line):**
```bash
for f in assets/images/products/*.jpg; do
  convert "$f" -quality 80 -strip "$f"
done
```

**Using cjpeg (best compression):**
```bash
for f in assets/images/products/*.jpg; do
  cjpeg -quality 80 -optimize -outfile "$f.tmp" "$f" && mv "$f.tmp" "$f"
done
```

Target: get the product folder under 5 MB total.

### Inline critical CSS (advanced)
For best Lighthouse scores, extract the CSS used on the first screen
and inline it in `<head>`, deferring the rest. Tools like
**critical** (https://github.com/addyosmani/critical) automate this.
Not required for a marketing site — usually unnecessary.

### Enable Brotli/gzip compression
Most static hosts enable this by default. Verify in browser DevTools
→ Network tab → check response headers for `Content-Encoding: br` or
`Content-Encoding: gzip`.

---

## 10. Troubleshooting

### "Products don't load" / empty gallery
**Cause:** `data/products.json` is not being served, or paths are wrong.
**Fix:**
- Confirm the file is at `data/products.json` (relative to the site root)
- Open `https://your-domain.com/data/products.json` in a browser — should show JSON
- Check browser DevTools → Console for fetch errors
- Check DevTools → Network tab for the 404 (if any)

### "Form doesn't send" / no email received
**Cause:** Web3Forms access key not set, or wrong.
**Fix:**
- Open `js/contact.js` line 24 — confirm `WEB3FORMS_ACCESS_KEY` is not `YOUR_ACCESS_KEY`
- Confirm the key is wrapped in quotes
- Check browser DevTools → Console for errors
- Check DevTools → Network tab → look for the POST to `api.web3forms.com`
- Check the response — Web3Forms returns `{ success: true, message: "..." }` on success
- Check your spam folder

### "Logo is invisible in dark mode"
**Cause:** The CSS filter inversion didn't work, or the logo file is missing.
**Fix:**
- Confirm `assets/images/branding/logo.png` exists
- Open DevTools → inspect the logo element → check the computed `filter` style
- The dark-mode filter is: `invert(1) hue-rotate(180deg) brightness(1.05) saturate(0.9)`
- If the logo has transparent background and dark text, this works
- If the logo has a colored background that conflicts, you may need a hand-prepared dark variant (replace the file)

### "Theme toggle doesn't persist"
**Cause:** localStorage is disabled (private browsing in some browsers).
**Fix:**
- Test in a normal (non-private) browser window
- localStorage is per-origin — the toggle persists per domain, not globally
- This is expected browser behavior, not a bug

### "Form does a full page reload instead of AJAX"
**Cause:** JavaScript is blocked or the form's `e.preventDefault()` didn't fire.
**Fix:**
- Check that JavaScript is enabled in the browser
- Check DevTools → Console for errors
- Confirm `js/contact.js` is loading (Network tab)
- Confirm the form has `id="contactForm"` (referenced by the script)

### "Google Lighthouse flags accessibility issues"
**Common causes:**
- Missing alt text on images — all images in this build have alt text, but check new ones you add
- Low contrast text — the color tokens are tuned for AA contrast in both modes
- Missing form labels — every field in `contact.html` has a `<label>`
- Run Lighthouse, read the specific issue, fix in the relevant file

### "Sitemap or robots.txt not found"
**Cause:** File path issue, or host strips unknown extensions.
**Fix:**
- Confirm `sitemap.xml` and `robots.txt` are at the site root
- Test: `https://your-domain.com/sitemap.xml` should return XML, not 404
- On Netlify/Vercel/Cloudflare, these are served as static files automatically
- On GitHub Pages, they work but may have a brief cache delay

---

## 11. Security & privacy notes

- **Web3Forms access key is public** — it lives in client-side JS, so
  anyone who views source can see it. This is by design and safe —
  Web3Forms' free tier is meant to be used this way. The key only
  allows posting to the email you registered it with.
- **Spam protection** — the honeypot field catches most bots. For
  higher-traffic sites, enable hCaptcha from the Web3Forms dashboard.
- **HTTPS** — all recommended hosts provide free SSL. Never deploy
  without HTTPS (forms, modern browsers, and SEO all expect it).
- **No user data is stored** — the site has no database, no cookies
  (except the theme preference in localStorage), no analytics by
  default. GDPR-friendly out of the box.
- **Privacy policy** — recommended for production. Most static-site
  generators can host a `privacy.html` page; you can add one in the
  same way as `about.html`.

---

## 12. What's NOT included (and why)

The brief explicitly excluded:
- ❌ CMS integration — content is edited in code/JSON
- ❌ User authentication — not needed for a marketing site
- ❌ E-commerce / cart / checkout — out of scope
- ❌ Database — no backend
- ❌ Backend server — fully static

If you need any of these later, the most natural next step is to add a
headless CMS (Sanity, Contentful, Strapi) to manage products without
touching `data/products.json` directly. The current JSON structure is
already shaped to map cleanly to a CMS schema.

---

## 13. Quick reference — file-edit checklist

Before going live, edit these specific values:

| File | Line(s) | What to change |
|---|---|---|
| `js/contact.js` | 24 | `WEB3FORMS_ACCESS_KEY` → your Web3Forms key |
| All footers + `contact.html` | search | `info@excellencebiomed.com` → your email |
| All footers + `contact.html` | search | `+91 000 000 0000` → your phone |
| `contact.html` | search | `Plot No. XX, Industrial Area…` → your address |
| `contact.html` | search | `Mon – Fri, 9:00 – 18:00 IST` → your hours |
| All HTML files | search | `https://www.excellencebiomed.com/` → your domain |
| `sitemap.xml` | all `<loc>` | same domain replacement |
| `robots.txt` | Sitemap line | same domain replacement |
| `data/products.json` | (optional) | product names, categories, descriptions |

Once these are done, deploy. Total setup time: **~15 minutes** if
you already have a hosting account, **~30 minutes** if you don't.

---

## 14. Support & further reading

- **Web3Forms docs:** https://docs.web3forms.com
- **Netlify docs:** https://docs.netlify.com
- **Vercel docs:** https://vercel.com/docs
- **Cloudflare Pages docs:** https://developers.cloudflare.com/pages
- **Google Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Web Vitals:** https://web.dev/vitals/

---

**Built with care for Excellence Biomed.**
**Last updated: July 2026**
