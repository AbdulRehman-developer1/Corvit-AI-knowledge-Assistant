# 🎓 Corvit AI Knowledge Assistant

A dark-themed, animated marketing landing page + AI course-counselor chatbot for **Corvit Systems** — Pakistan's IT & Cisco training institute. Built with plain HTML, Tailwind CSS, and vanilla JavaScript (no framework, no build step for the frontend). The AI Counselor is powered by [Groq](https://groq.com) (`openai/gpt-oss-120b`, with automatic fallback to `llama-3.3-70b-versatile`), called securely through a **Netlify serverless function** so the API key never reaches the browser.

> Static frontend, one backend function. Open `index.html` to browse the site; deploy to Netlify to get a working AI chatbot.

---

## ✨ Features

**Content sections** (`index.html`)
- Hero with an instant, rule-based course-recommendation wizard
- Featured course catalog with category filters and expandable syllabi
- Side-by-side course comparison matrix
- Interactive fee calculator (installment plan vs. 5% lump-sum discount)
- NAVTTC / PMYSDP free-training scheme section with an eligibility checklist
- Campus directory across Corvit's nationwide locations
- Accordion-style FAQ

**AI Counselor chatbot**
- Floating chat launcher available on every section, plus "Ask AI" shortcuts (hero chips, course cards, NAVTTC card, nav/mobile menu) that open the chat pre-filled with a relevant question
- Full knowledge of courses, fees, campuses, and the NAVTTC scheme — built at runtime from `js/data.js`, so it can never drift out of sync with what's on the page
- Model replies with structured JSON (`{"reply": "...", "recommend": ["course-id", ...]}`) so the UI can render rich, clickable course-recommendation cards inline instead of plain text
- Automatic fallback to a second Groq model if the primary model call fails
- Replies in English or Roman Urdu depending on how the visitor writes
- Typing indicator, scroll-to-bottom, and a friendly error bubble (with the helpline number) if both models fail

**Design & motion**
- Each section has its own distinct, scroll-triggered reveal animation (fade, slide, scale-pop, 3D flip, drop-in) via a lightweight `IntersectionObserver`-based engine — see `observeReveals()` in `js/app.js`
- Orchestrated hero load-in sequence and an ambient background glow drift
- Smooth open/close transition and animated message bubbles for the chat panel
- Respects `prefers-reduced-motion`
- A 4-second safety-net timer force-reveals any section whose animation never fired, so content can never get stuck invisible

**NAVTTC links**
- The navbar, mobile menu, and top utility bar all link straight to the official NAVTTC site (`https://navttc.gov.pk`) in a new tab

---

## 🧠 How the AI chat actually works (architecture)

```
Browser (chatbot.js)
   │  POST /.netlify/functions/chat  { model, messages }
   ▼
Netlify Function (netlify/functions/chat.js)
   │  reads GROQ_API_KEY from Netlify environment variable (server-side only)
   │  POST https://api.groq.com/openai/v1/chat/completions
   ▼
Groq API → JSON reply → forwarded back to the browser
```

- `js/chatbot.js` never talks to Groq directly. It calls the same-origin `/.netlify/functions/chat` endpoint.
- `netlify/functions/chat.js` is the only place the real Groq key is used, and it reads it from `process.env.GROQ_API_KEY` — a Netlify environment variable, never committed to the repo.
- **`js/config.js`'s `GROQ_API_KEY` field is not used by the code today** — the chat flow ships secure-by-default through the function above. That field is legacy/optional; you can safely ignore or delete it. `CONFIG.MODEL_PRIMARY`, `CONFIG.MODEL_FALLBACK`, and `CONFIG.INSTITUTE_NAME` *are* used (by `chatbot.js`).

This means: **the Groq API key is never exposed to visitors' browsers**, as long as you deploy on Netlify (or an equivalent platform that runs the function) and set the key as an environment variable there — not in a committed file.

---

## 🗂 Project structure
```
index.html                     → main page markup (all sections)
css/style.css                  → custom styles, animations, and the scroll-reveal system (on top of Tailwind)
css/tailwind.css               → precompiled Tailwind build (see tailwind.config.js)
js/config.js                   → model names + institute display name (GROQ_API_KEY field is unused, see above)
js/data.js                     → courses, campuses, FAQs, NAVTTC info — single source of truth
js/app.js                      → renders sections, wires up UI (wizard, filters, calculator, FAQ, reveal animations)
js/chatbot.js                  → chat UI, system-prompt builder, calls the Netlify function, renders course cards
netlify/functions/chat.js      → serverless proxy: holds the real Groq API key, forwards chat requests to Groq
netlify.toml                   → Netlify build/redirect/security-header config
tailwind.config.js             → Tailwind theme (fonts, ink color scale, glow shadow)
.gitignore                     → excludes .env, js/config.local.js, editor/OS junk
LICENSE                        → MIT
```

---

## 🚀 Getting started

### 1. Get a free Groq API key
Sign up and create a key at https://console.groq.com/keys — Groq's free tier is enough to run this project.

### 2. Run the frontend locally (no chatbot)
Just open `index.html` in a browser, or serve it so relative paths behave the same as in production:
```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```
This shows the full landing page, but the chat panel will error out because there's no serverless function running to talk to Groq.

### 3. Run the chatbot locally too (recommended)
The Netlify Function needs the [Netlify CLI](https://docs.netlify.com/cli/get-started/):
```bash
npm install -g netlify-cli
netlify dev
```
Then, either:
- set the key for the session: `export GROQ_API_KEY=your_key_here` before running `netlify dev`, or
- create a `.env` file in the project root with `GROQ_API_KEY=your_key_here` (already covered by `.gitignore`, so it's never committed).

`netlify dev` serves `index.html` **and** runs `netlify/functions/chat.js` locally, so the AI Counselor works exactly as it will in production.

### 4. Deploy

**Netlify — GitHub (recommended):**
1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build command: *(leave blank)* — Publish directory: `.`
4. **Site settings → Environment variables** → add `GROQ_API_KEY` with your real key.
5. Deploy. Netlify will give you a live `https://your-site.netlify.app` link, and the AI Counselor will work out of the box.

**Netlify — drag & drop:** works for the static page, but drag-and-drop deploys don't run functions/env vars the same way — use the GitHub method above if you want the chatbot working.

**GitHub Pages:** fine for the landing page only. GitHub Pages can't run the Netlify Function, so the chatbot won't work there without pointing it at a Groq proxy hosted elsewhere.

---

## ✏️ Editing content
All course/campus/fee/FAQ data lives in `js/data.js`. Edit that file to add real course details, more campuses, or update fees — the course cards, comparison table, fee calculator, and the chatbot's knowledge all read from it automatically, so you only ever edit data in one place.

## 🎨 Customizing animations
Section entrance animations are driven by a `data-reveal="..."` attribute in `index.html` (values: `fade-up`, `slide-left`, `slide-right`, `scale-pop`, `flip`, `drop`), matched to CSS rules in `css/style.css` and triggered by the `observeReveals()` helper in `js/app.js`. To change how a section animates in, just change its `data-reveal` value — no JS changes needed.

## Tech stack
- HTML5 + [Tailwind CSS](https://tailwindcss.com) (precompiled, no CDN dependency)
- Vanilla JavaScript (ES6+), no framework
- [Groq](https://groq.com) OpenAI-compatible chat completions API, called from a Netlify serverless function
- [Netlify Functions](https://docs.netlify.com/functions/overview/) for the secure backend proxy

## License
MIT — see [LICENSE](./LICENSE).

## 🔒 Security notes
- Never commit a real API key. `js/config.js` ships with a harmless, unused placeholder (`PASTE_YOUR_GROQ_API_KEY_HERE`) — safe to keep as-is.
- The real key belongs **only** in a Netlify environment variable (`GROQ_API_KEY`) or a local, git-ignored `.env` file — never in a file that gets committed.
- If you ever did commit a real key by mistake, rotate/revoke it in the Groq dashboard immediately — removing it from a later commit does not remove it from git history.
- Consider setting a usage/rate limit on the key in your Groq dashboard as a second layer of protection.

---

👨‍💻 **Author**

**Abdul Rehman** — AI Engineer | Data Science & AI Enthusiast

GitHub: [@AbdulRehman-developer1](https://github.com/AbdulRehman-developer1)

⭐ If you found this project useful, consider giving it a star!
