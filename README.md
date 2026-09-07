# 🎓 Corvit AI Knowledge Assistant

A dark-themed, animated landing page + AI course-counselor chatbot for **Corvit Systems** — Pakistan's IT & Cisco training institute. Built with plain HTML, Tailwind CSS, and vanilla JS (no framework, no build step). The chatbot is powered by [Groq](https://groq.com) (`openai/gpt-oss-120b`, with automatic fallback to `llama-3.3-70b-versatile`).

> Static site — open `index.html` and it just works. No Node, no bundler, no backend required.

---

## ✨ Features

**Content sections**
- Hero with an instant, rule-based course-recommendation wizard
- Featured course catalog with category filters and expandable syllabi
- Side-by-side course comparison matrix
- Interactive fee calculator (2-month installments vs. 5% lump-sum discount)
- NAVTTC / PMYSDP free-training scheme section with an eligibility checklist
- Campus directory across Corvit's nationwide locations
- Accordion-style FAQ

**AI Counselor chatbot**
- Floating chat launcher, available on every section
- Full knowledge of courses, fees, campuses, and the NAVTTC scheme (built from `js/data.js`, so it never goes out of sync with the page)
- Structured JSON replies so the bot can render rich, clickable course-recommendation cards inline — not just plain text
- Automatic fallback to a second model if the primary Groq model call fails
- Every "Ask AI" button across the site (hero shortcuts, course cards, NAVTTC card) opens the chat pre-filled with a relevant question and gets an instant answer
- Replies in English or Roman Urdu depending on how the visitor writes

**Design & motion**
- Each section has its own distinct, scroll-triggered reveal animation (fade, slide, scale-pop, 3D flip, drop-in) via a lightweight `IntersectionObserver`-based engine — see `observeReveals()` in `js/app.js`
- Orchestrated hero load-in sequence and an ambient background glow drift
- Smooth open/close transition and animated message bubbles for the chat panel
- Respects `prefers-reduced-motion`
- A safety-net timer guarantees content is never left invisible even if an animation fails to trigger

**NAVTTC links**
- The navbar, mobile menu, and top utility bar all link straight to the official NAVTTC site (`https://navttc.gov.pk`) in a new tab

---

## 🗂 Project structure
```
index.html        → main page markup (all sections)
css/style.css      → custom styles, animations, and the scroll-reveal system (on top of Tailwind)
css/tailwind.css   → precompiled Tailwind build (see tailwind.config.js)
js/config.js       → 🔑 paste your Groq API key here
js/data.js         → courses, campuses, FAQs, NAVTTC info — single source of truth
js/app.js          → renders sections, wires up UI (wizard, filters, calculator, FAQ, reveal animations)
js/chatbot.js      → Groq chat logic, fallback model, inline course-recommendation cards
netlify.toml       → Netlify deploy config
```

---

## 🚀 Getting started

### 1. Add your Groq API key
1. Get a free key at https://console.groq.com/keys
2. Open `js/config.js`
3. Replace `PASTE_YOUR_GROQ_API_KEY_HERE` with your key
4. Save — that's it, no build step needed.

> ⚠️ **Security note:** this is a static site with no backend, so the key runs in the visitor's browser and is visible in devtools/network requests. For a public production deployment, set usage limits on the key in your Groq dashboard, or proxy requests through a small serverless function (e.g. a Netlify Function) instead of calling Groq directly from the client.

### 2. Run locally
Just open `index.html` in a browser, or serve it so relative paths behave the same as in production:
```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

### 3. Deploy

**Netlify — drag & drop:** zip this folder (or drag the folder) into https://app.netlify.com/drop

**Netlify — GitHub (recommended):**
1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build command: *(leave blank)* — Publish directory: `.`
4. Deploy. Netlify will give you a live `https://your-site.netlify.app` link.

**GitHub Pages:** enable Pages on this repo (Settings → Pages → deploy from `main` branch, root folder) — works as-is since there's no build step.

---

## ✏️ Editing content
All course/campus/fee/FAQ data lives in `js/data.js`. Edit that file to add real course details, more campuses, or update fees — the course cards, comparison table, fee calculator, and the chatbot's knowledge all read from it automatically, so you only ever edit data in one place.

## 🎨 Customizing animations
Section entrance animations are driven by a `data-reveal="..."` attribute in `index.html` (values: `fade-up`, `slide-left`, `slide-right`, `scale-pop`, `flip`, `drop`), matched to CSS rules in `css/style.css` and triggered by the `observeReveals()` helper in `js/app.js`. To change how a section animates in, just change its `data-reveal` value — no JS changes needed.

## Tech stack
- HTML5 + [Tailwind CSS](https://tailwindcss.com) (precompiled, no CDN dependency)
- Vanilla JavaScript (ES6+), no framework
- [Groq](https://groq.com) OpenAI-compatible chat completions API

## License
MIT — see [LICENSE](./LICENSE).

## ⚠️ Before you push to a public GitHub repo
`js/config.js` is committed with a **placeholder** key (`PASTE_YOUR_GROQ_API_KEY_HERE`) — safe to push as-is. **Do not replace it with your real Groq key and then push to a public repo** — anyone browsing the repo (or its history, even after you remove it later) would be able to copy and use your key.

Recommended workflow:
1. Keep `js/config.js` in git with the placeholder, exactly as it is now.
2. For local testing, either edit it temporarily and avoid committing that change, or copy it to `js/config.local.js` (already covered by `.gitignore`) and load that script instead in `index.html` while testing.
3. For a real deployment, set a request/rate limit on the key in your Groq dashboard, or better, proxy the API call through a small serverless function so the key never reaches the browser at all.
