<div align="center">

# 🎓 Corvit AI Knowledge Assistant

**A dark-themed, animated landing page + AI course-counselor chatbot for Corvit Systems**
Pakistan's IT & Cisco training institute — built with plain HTML, Tailwind CSS, and vanilla JS.

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Netlify Functions](https://img.shields.io/badge/Netlify_Functions-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://docs.netlify.com/functions/overview/)
[![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Repo size](https://img.shields.io/github/repo-size/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant?style=flat-square&color=blue)](https://github.com/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant)
[![Last commit](https://img.shields.io/github/last-commit/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant?style=flat-square&color=orange)](https://github.com/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant/commits/main)
[![Stars](https://img.shields.io/github/stars/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant?style=flat-square&color=yellow)](https://github.com/AbdulRehman-developer1/Corvit-AI-knowledge-Assistant/stargazers)
[![No build step](https://img.shields.io/badge/build_step-none-brightgreen?style=flat-square)]()

**No framework · No bundler · One serverless function for the AI**

[Live Demo](#) · [Features](#-features) · [Architecture](#-how-the-ai-chat-actually-works-architecture) · [Getting Started](#-getting-started) · [Deploy](#4-deploy)

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🧠 Architecture](#-how-the-ai-chat-actually-works-architecture)
- [🗂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [✏️ Editing Content](#️-editing-content)
- [🎨 Customizing Animations](#-customizing-animations)
- [🛠 Tech Stack](#-tech-stack)
- [🔒 Security Notes](#-security-notes)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 🖥️ Content Sections
- Hero + rule-based course wizard
- Filterable course catalog
- Course comparison matrix
- Interactive fee calculator
- NAVTTC/PMYSDP eligibility checker
- Campus directory
- Accordion FAQ

</td>
<td width="33%" valign="top">

### 🤖 AI Counselor
- Floating chat, site-wide "Ask AI"
- Knowledge built live from `data.js`
- Structured JSON → rich course cards
- Auto model fallback on failure
- Replies in English or Roman Urdu
- Typing indicator + graceful errors

</td>
<td width="33%" valign="top">

### 🎬 Design & Motion
- Per-section scroll-reveal animations
- `IntersectionObserver`-driven engine
- Ambient hero glow + load-in sequence
- Respects `prefers-reduced-motion`
- 4s safety-net so content never hides

</td>
</tr>
</table>

> 🔗 **NAVTTC links:** navbar, mobile menu, and top bar all deep-link to the official `https://navttc.gov.pk` in a new tab.

---

## 🧠 How the AI chat actually works (architecture)

```
┌──────────────────────┐        POST /.netlify/functions/chat        ┌───────────────────────────┐
│   Browser             │ ─────────────────────────────────────────▶ │   Netlify Function          │
│   js/chatbot.js       │        { model, messages }                 │   netlify/functions/chat.js │
└──────────────────────┘                                             └──────────────┬─────────────┘
                                                                                      │ reads GROQ_API_KEY
                                                                                      │ from server-side env var
                                                                                      ▼
                                                                       ┌───────────────────────────┐
                                                                       │        Groq API             │
                                                                       │  openai/gpt-oss-120b →      │
                                                                       │  llama-3.3-70b (fallback)    │
                                                                       └───────────────────────────┘
```

| Piece | Role |
|---|---|
| `js/chatbot.js` | Builds the system prompt from `data.js`, sends chat history to `/.netlify/functions/chat`, renders replies + course cards. **Never calls Groq directly.** |
| `netlify/functions/chat.js` | The only place the real Groq key is used. Reads `process.env.GROQ_API_KEY` (server-side, never committed) and proxies the request to Groq. |
| `js/config.js` | Holds `MODEL_PRIMARY`, `MODEL_FALLBACK`, `INSTITUTE_NAME` (all used). Its `GROQ_API_KEY` field is **legacy/unused** — safe to ignore or delete. |

✅ **Result:** the real Groq API key is never shipped to the visitor's browser, as long as you deploy on Netlify (or an equivalent that runs the function) with the key set as an environment variable — not committed to the repo.

---

## 🗂 Project Structure

```
📦 Corvit-AI-knowledge-Assistant
├── 📄 index.html                     → main page markup (all sections)
├── 📁 css/
│   ├── style.css                     → custom styles, animations, scroll-reveal system
│   └── tailwind.css                  → precompiled Tailwind build
├── 📁 js/
│   ├── config.js                     → model names + institute name (GROQ_API_KEY unused, see above)
│   ├── data.js                       → courses, campuses, FAQs, NAVTTC — single source of truth
│   ├── app.js                        → renders sections, wires up UI + reveal animations
│   └── chatbot.js                    → chat UI, system-prompt builder, calls the Netlify function
├── 📁 netlify/functions/
│   └── chat.js                       → serverless proxy: holds the real Groq key, talks to Groq
├── 📄 netlify.toml                   → build / redirect / security-header config
├── 📄 tailwind.config.js             → Tailwind theme (fonts, ink color scale, glow shadow)
├── 📄 .gitignore                     → excludes .env, js/config.local.js, editor/OS junk
└── 📄 LICENSE                        → MIT
```

---

## 🚀 Getting Started

### 1️⃣ Get a free Groq API key
Sign up at 🔑 **https://console.groq.com/keys** — the free tier is enough to run this project.

### 2️⃣ Run the frontend only (no chatbot)
```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```
> ⚠️ Full landing page works, but the chat panel will error — no function is running to talk to Groq.

### 3️⃣ Run the chatbot locally too (recommended)
```bash
npm install -g netlify-cli
netlify dev
```
Then provide the key one of two ways:
```bash
# Option A — export for the session
export GROQ_API_KEY=your_key_here

# Option B — create a .env file in the project root (already git-ignored)
echo "GROQ_API_KEY=your_key_here" > .env
```
`netlify dev` serves the site **and** runs `netlify/functions/chat.js` locally — the AI Counselor works exactly like production.

### 4️⃣ Deploy

<table>
<tr><th>Method</th><th>Steps</th><th>Chatbot works?</th></tr>
<tr>
<td><b>Netlify + GitHub</b><br>✅ recommended</td>
<td>

1. Push repo to GitHub
2. Netlify → **Add new site → Import project → GitHub**
3. Build command: *blank* · Publish dir: `.`
4. **Site settings → Environment variables** → add `GROQ_API_KEY`
5. Deploy 🚀

</td>
<td>✅ Yes</td>
</tr>
<tr>
<td>Netlify drag & drop</td>
<td>Drag the folder into <a href="https://app.netlify.com/drop">app.netlify.com/drop</a></td>
<td>⚠️ Static only — use GitHub method for the AI chat</td>
</tr>
<tr>
<td>GitHub Pages</td>
<td>Settings → Pages → deploy from <code>main</code>, root folder</td>
<td>❌ No — Pages can't run Netlify Functions</td>
</tr>
</table>

---

## ✏️ Editing Content

All course/campus/fee/FAQ data lives in **`js/data.js`** — a single source of truth. Edit it once and the course cards, comparison table, fee calculator, *and* the chatbot's knowledge all update automatically.

## 🎨 Customizing Animations

Section entrances are driven by a `data-reveal="..."` attribute in `index.html`:

| Value | Effect |
|---|---|
| `fade-up` | Fades in while sliding up |
| `slide-left` / `slide-right` | Slides in from the side |
| `scale-pop` | Scales up with a pop |
| `flip` | 3D flip reveal |
| `drop` | Drops into place |

Matched by CSS in `css/style.css`, triggered by `observeReveals()` in `js/app.js`. Change the attribute value — no JS edits needed.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) (precompiled, no CDN dependency) |
| Interactivity | Vanilla JavaScript (ES6+) — no framework |
| AI Model | [Groq](https://groq.com) — `openai/gpt-oss-120b` → `llama-3.3-70b-versatile` fallback |
| Backend | [Netlify Functions](https://docs.netlify.com/functions/overview/) (serverless proxy) |
| Hosting | [Netlify](https://netlify.com) |

## 🔒 Security Notes

- 🚫 Never commit a real API key — `js/config.js` ships a harmless, **unused** placeholder.
- ✅ The real key belongs only in a Netlify environment variable (`GROQ_API_KEY`) or a local, git-ignored `.env`.
- ♻️ If a real key is ever committed by mistake, **rotate it immediately** in the Groq dashboard — deleting it in a later commit doesn't erase it from git history.
- 🛡️ Consider setting a usage/rate limit on the key in your Groq dashboard as an extra layer of protection.

## 📄 License

Released under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

## 👨‍💻 Author

**Abdul Rehman**
*AI Engineer · Data Science & AI Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-AbdulRehman--developer1-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AbdulRehman-developer1)

### ⭐ If you found this project useful, consider giving it a star!

</div>
