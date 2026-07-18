# Excellence Biomed — Marketing Website

A static, production-ready marketing site for Excellence Biomed.

- **Pages:** Home, About, Products, Contact
- **Theme:** Light / dark with system preference + localStorage persistence
- **Product gallery:** Dynamic — add a JPG + one JSON line, no code change
- **Contact form:** Posts to Web3Forms (free, unlimited submissions, no signup)
- **Stack:** Plain HTML, CSS, vanilla JS — no build step, no framework

---

## Project layout

```
EB_Pharma_Website/
├── index.html              Home (hero + featured products + CTA)
├── about.html              Company story, mission, values
├── products.html           Full product gallery + search/filter + lightbox
├── contact.html            Contact form
├── robots.txt
├── sitemap.xml
├── favicon.svg
├── README.md
├── css/
│   ├── variables.css       Theme tokens (light + dark)
│   ├── base.css            Reset, typography
│   ├── components.css      Header, nav, cards, modal, form, footer
│   └── responsive.css      480 / 768 / 1024 / 1280 breakpoints
├── js/
│   ├── theme.js            Light/dark toggle + persistence
│   ├── products.js         Dynamic product gallery + lightbox
│   ├── contact.js          Form validation + Web3Forms submit
│   └── main.js             Nav, year, shared init
├── data/
│   └── products.json       Product manifest (edit me to add products)
└── assets/
    └── images/
        ├── branding/
        │   ├── logo.png            Primary logo (header)
        │   └── logo-address.png    Address logo (footer)
        └── products/               01.jpg … 27.jpg (product images)
```

---

## 1. Set up the contact form (Web3Forms)

The form on `contact.html` is wired to **Web3Forms** — a free, no-signup
email relay designed for static sites. Unlimited submissions on the
free tier. Setup takes about 60 seconds.

1. Go to [web3forms.com](https://web3forms.com) and enter the email
   address that should receive contact-form submissions.
2. Click **Create Access Key** — the key appears on screen and is also
   emailed to you. No account, no password, no dashboard required.
3. Open `js/contact.js` and replace the placeholder:
   ```js
   const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY";
   ```
4. Save and redeploy. Test by sending a message — it should land in the
   inbox you registered with Web3Forms.

**Notes**
- Until you replace `YOUR_ACCESS_KEY` the form is in "demo mode" — it
  shows a success message locally but does not actually send email.
  This keeps the demo safe and the form testable.
- The form includes a **honeypot field** (`botcheck`) for spam
  protection. Web3Forms' free tier also has its own built-in
  anti-spam — your submissions get filtered automatically.
- For stronger anti-spam you can enable hCaptcha or reCAPTCHA from the
  Web3Forms dashboard (free, optional).
- All submissions show up in your Web3Forms dashboard history if you
  later create an account at that email — useful for tracking.

### Alternative: Netlify Forms (only if deploying to Netlify)

If you deploy to Netlify, you can switch to Netlify Forms with two small
changes:

1. In `contact.html`, add `netlify` and `netlify-honeypot="botcheck"` to the
   `<form>` tag, e.g.:
   ```html
   <form class="form" id="contactForm" name="contact"
         method="POST" netlify netlify-honeypot="botcheck" novalidate>
   ```
2. Add a hidden input inside the form:
   ```html
   <input type="hidden" name="form-name" value="contact">
   ```
3. Remove or comment out the `WEB3FORMS_ACCESS_KEY` fetch logic in
   `js/contact.js` (or keep the JS as a progressive enhancement — Netlify
   will handle the actual submission natively).

---

## 2. Add a new product

The site does not hardcode product filenames. Adding a product is a
two-step, no-code operation:

1. **Drop the image** into `assets/images/products/`
   (e.g. `28.jpg`, `my-new-product.jpg`).

2. **Add one line to `data/products.json`:**
   ```json
   { "id": 28, "image": "28.jpg", "name": "NewProduct-100",
     "category": "Cardiology",
     "description": "What it does, in one sentence.",
     "tags": ["cardiology", "tag2"] }
   ```

3. Refresh the page. The new product appears in the gallery and (if in
   the first 4 by default order) on the home page.

To pick **which products are featured on the home page**, add a `featured`
array to `data/products.json`:
```json
{
  "products": [ ... ],
  "featured": [1, 3, 7, 12]
}
```

---

## 3. Customize brand details

- **Phone, email, postal address** — currently placeholders in
  `contact.html` and every page's footer. Search for
  `+91 000 000 0000`, `info@excellencebiomed.com`, and the
  `Plot No. XX, Industrial Area` block; replace with your real details.
- **Real address** — the address text is also baked into
  `assets/images/branding/logo-address.png`. If you need to change the
  address on the logo itself, edit the PNG in your design tool and
  re-export.
- **Tagline** — currently *"Excellence in Biomedicine, Compassion in Care"*
  in the hero on `index.html`. Change it where it appears.
- **Colors** — primary teal `#0fb5a8` is defined in `css/variables.css`
  under `--primary`. Change one value, it propagates everywhere.

---

## 4. Local preview

No build step. Just serve the folder over HTTP (browsers refuse
`fetch()` from `file://`).

```bash
# Python
python -m http.server 8080

# Node (if you have npx)
npx serve .
```

Then open <http://localhost:8080>.

---

## 5. Deploy

This site works on any static host. Drop the contents of the
`EB_Pharma_Website/` folder onto:

- **Netlify** — drag-and-drop, or connect a Git repo. Free SSL + form
  handling built-in (see Netlify Forms note above).
- **Vercel** — `vercel --prod` from the project folder, or import via the
  dashboard.
- **GitHub Pages** — push to a repo, enable Pages on `main` / root.
- **Cloudflare Pages** — connect repo, build command empty, output dir `/`.
- **Any S3 + CloudFront / nginx / cPanel** bucket — upload the folder.

After deploying, update the `https://www.excellencebiomed.com/` URLs
in the following places to your real domain:
- `robots.txt`
- `sitemap.xml`
- `<link rel="canonical">` and `<meta property="og:url">` in each HTML page

---

## 6. Testing checklist

- [x] Chrome (desktop + mobile emulation)
- [x] Firefox
- [x] Edge
- [x] Safari (including iOS)
- [x] Light + dark modes, including logo legibility
- [x] Form validation, loading state, success and error alerts
- [x] Honeypot silently swallows bot submissions
- [x] Product gallery filter by category
- [x] Product gallery free-text search
- [x] Lightbox / modal — click card, Esc to close, click backdrop to close
- [x] Keyboard navigation: Tab through header, form, footer
- [x] Focus rings visible on all interactive elements
- [x] Tap targets ≥ 44px
- [x] Mobile hamburger menu
- [x] Reduced-motion preference respected

---

## 7. Performance notes

- Product images use `loading="lazy"` and `decoding="async"`.
- Fonts load asynchronously (`media="print" onload` swap).
- JS is `defer`-loaded — no render-blocking scripts.
- CSS is split into four files for cacheability; production deployments
  can concatenate and minify.
- For best Lighthouse scores, run JPGs through a compressor (e.g.
  `cjpeg -quality 82` or `squoosh.app`) before deployment. The current
  product JPEGs total ~14MB.

---

## 8. Accessibility

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Theme toggle is a `<button>` with `aria-pressed`.
- Skip-to-content link for keyboard users.
- All form fields have labels; errors are announced via `aria-live`.
- Color contrast is AA in both light and dark modes.
- `prefers-reduced-motion` disables transitions and smooth scroll.

---

## License & assets

All product images and brand logos are property of Excellence Biomed.
Sample product names, categories, and descriptions in
`data/products.json` are illustrative — replace with your real catalogue
data before going live.
