/* ============================================================
   CORVIT SYSTEMS — App logic
   Renders sections from data.js and wires up UI interactions.
   (Chatbot logic lives in chatbot.js)
   ============================================================ */

const fmtPKR = (n) => "PKR " + n.toLocaleString("en-PK");

/* ---------------- Scroll-reveal engine ----------------
   Elements opt in via data-reveal="fade-up|slide-left|slide-right|
   scale-pop|flip|drop|wipe" (see style.css for each flavor).
   Call observeReveals(container) after injecting new elements;
   optionally pass a per-item stagger in ms. ---------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);

function observeReveals(root = document, staggerMs = 0) {
  const els = root.querySelectorAll ? root.querySelectorAll("[data-reveal]") : [];
  els.forEach((el, i) => {
    if (staggerMs) el.style.transitionDelay = `${Math.min(i * staggerMs, staggerMs * 8)}ms`;
    revealObserver.observe(el);
  });
}
// Safety net: if for any reason an element's reveal never fires (edge cases in
// layout/observer timing), force it visible after a few seconds so content
// can never get stuck hidden.
setTimeout(() => {
  document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => el.classList.add("revealed"));
}, 4000);
function replayPop(el) {
  el.classList.remove("result-pop");
  void el.offsetWidth; // restart animation
  el.classList.add("result-pop");
}

/* ---------------- Top bar / hero cities ---------------- */
document.getElementById("topbar-cities").textContent = CAMPUS_CITIES.join(" | ");
document.getElementById("hero-cities").textContent = CAMPUS_CITIES.join(", ");
document.getElementById("footer-cities").textContent = CAMPUS_CITIES.join(" | ");

/* ---------------- Mobile menu ---------------- */
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
mobileBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => mobileMenu.classList.add("hidden")));

/* ---------------- Hero shortcut chips ---------------- */
const heroShortcuts = document.getElementById("hero-shortcuts");
const SHORTCUTS = [
  "Which course suits me?",
  "Compare CCNA vs CCNP",
  "NAVTTC free eligibility",
  "Fee & installment plans",
];
SHORTCUTS.forEach((label) => {
  const btn = document.createElement("button");
  btn.className = "shortcut-chip ask-ai-trigger";
  btn.dataset.prompt = label;
  btn.textContent = label;
  heroShortcuts.appendChild(btn);
});

/* ---------------- AI Wizard ---------------- */
const WIZARD_MAP = {
  "Cisco Network Engineer (CCNA/CCNP)": "ccna",
  "AI / Data Scientist": "python-ai",
  "Cloud Engineer (AWS)": "aws",
  "Cyber Security Analyst": "ceh",
  "Full-Stack Web Developer": "mern",
};
document.getElementById("wizard-btn").addEventListener("click", () => {
  const goal = document.getElementById("wizard-goal").value;
  const edu = document.getElementById("wizard-education").value;
  const course = COURSES.find((c) => c.id === WIZARD_MAP[goal]) || COURSES[0];
  const box = document.getElementById("wizard-result");
  box.classList.remove("hidden");
  replayPop(box);
  box.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-2xl">${course.icon}</div>
      <div>
        <div class="text-xs text-cyan-300 font-semibold mb-1">RECOMMENDED FOR YOU</div>
        <div class="text-white font-semibold">${course.name}</div>
        <div class="text-slate-400 text-xs mt-1">${course.duration} · ${fmtPKR(course.feeMin)}–${fmtPKR(course.feeMax)}</div>
        <button class="ask-ai-trigger mt-3 text-cyan-300 text-xs font-semibold hover:text-cyan-200" data-prompt="I have a ${edu} background and my goal is ${goal}. Tell me more about the ${course.name} course — outline, timetable, and how to apply.">Ask AI Counselor for details →</button>
      </div>
    </div>`;
});

/* ---------------- Course filters + grid ---------------- */
const filtersEl = document.getElementById("course-filters");
const gridEl = document.getElementById("course-grid");
let activeCategory = "all";

CATEGORIES.forEach((cat) => {
  const btn = document.createElement("button");
  btn.className = "filter-tab" + (cat.id === "all" ? " filter-tab-active" : "");
  btn.textContent = cat.label;
  btn.dataset.cat = cat.id;
  btn.addEventListener("click", () => {
    activeCategory = cat.id;
    filtersEl.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("filter-tab-active"));
    btn.classList.add("filter-tab-active");
    renderCourses();
  });
  filtersEl.appendChild(btn);
});

function renderCourses() {
  gridEl.innerHTML = "";
  const filtered = COURSES.filter((c) => {
    if (activeCategory === "all") return true;
    const mapped = CATEGORY_FILTER_MAP[c.category] || c.category;
    return mapped === activeCategory;
  });

  filtered.forEach((course) => {
    const style = CATEGORY_STYLE[course.category];
    const card = document.createElement("div");
    card.className = "course-card";
    card.dataset.reveal = "scale-pop";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <span class="badge-pill ${style.badge}">${course.categoryLabel.toUpperCase()}</span>
        <span class="text-xs text-slate-500">⏱ ${course.duration}</span>
      </div>
      <h3 class="font-display font-semibold text-white text-lg">${course.name}</h3>
      <p class="text-slate-400 text-sm mt-2 leading-relaxed flex-1">${course.description}</p>

      <div class="border-t border-white/8 mt-5 pt-4">
        <div class="text-[11px] font-semibold tracking-wide text-slate-500">TUITION FEE</div>
        <div class="flex items-center justify-between mt-1">
          <div class="text-white font-semibold">${fmtPKR(course.feeMin)}${course.feeMin !== course.feeMax ? " – " + fmtPKR(course.feeMax) : ""}</div>
          <span class="badge-pill border-emerald-500/30 text-emerald-300 bg-emerald-500/10">${course.installments} Installments</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2.5 mt-4">
        <button class="syllabus-btn px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition">☰ Syllabus</button>
        <button class="ask-ai-trigger px-3 py-2.5 rounded-lg ${style.btn} text-white text-sm font-semibold transition" data-prompt="Tell me everything about the ${course.name} course — outline, prerequisites, timetable and how to apply.">🤖 Ask AI</button>
      </div>
      <div class="syllabus-panel mt-0 pt-0 border-t-0 border-white/8 text-xs text-slate-400 space-y-1.5"></div>
    `;

    card.querySelector(".syllabus-btn").addEventListener("click", () => {
      const panel = card.querySelector(".syllabus-panel");
      const isOpen = panel.classList.contains("open");
      if (!isOpen && !panel.innerHTML) {
        panel.innerHTML = course.syllabus.map((s) => `<div class="flex items-start gap-2">✔ <span>${s}</span></div>`).join("");
      }
      if (isOpen) {
        panel.classList.remove("open");
        panel.style.maxHeight = null;
        panel.style.marginTop = "0";
        panel.style.paddingTop = "0";
      } else {
        panel.classList.add("open");
        panel.style.marginTop = "1rem";
        panel.style.paddingTop = "1rem";
        panel.style.borderTopWidth = "1px";
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });

    gridEl.appendChild(card);
  });

  observeReveals(gridEl, 60);
  bindAskAiTriggers();
}
renderCourses();

/* ---------------- Comparison table ---------------- */
const comparisonBody = document.getElementById("comparison-body");
COURSES.forEach((course) => {
  const style = CATEGORY_STYLE[course.category];
  const row = document.createElement("tr");
  row.dataset.reveal = "fade-up";
  row.innerHTML = `
    <td class="px-6 py-4"><span class="inline-flex items-center gap-2 font-semibold text-white"><span class="w-2 h-2 rounded-full ${style.dot}"></span>${course.name}</span></td>
    <td class="px-6 py-4 text-slate-300">${course.durationRange}</td>
    <td class="px-6 py-4 text-slate-300">${course.prerequisites}</td>
    <td class="px-6 py-4 text-cyan-300 font-semibold">${fmtPKR(course.feeMin / 1000).replace("PKR ", "PKR ")}K${course.feeMin !== course.feeMax ? " – " + (course.feeMax / 1000) + "K" : ""}</td>
    <td class="px-6 py-4 text-slate-300">${course.hardware}</td>
    <td class="px-6 py-4"><span class="text-emerald-400 font-semibold">✓ ${course.placement}</span></td>
  `;
  comparisonBody.appendChild(row);
});
observeReveals(comparisonBody, 70);

/* ---------------- Fee calculator ---------------- */
const feeCourseSelect = document.getElementById("fee-course-select");
COURSES.forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.id;
  opt.textContent = `${c.name} (${fmtPKR(c.feeMax)})`;
  feeCourseSelect.appendChild(opt);
});

let feeMode = "installments";
const feeInstBtn = document.getElementById("fee-option-installments");
const feeLumpBtn = document.getElementById("fee-option-lumpsum");
feeInstBtn.addEventListener("click", () => { feeMode = "installments"; feeInstBtn.classList.add("fee-toggle-active"); feeLumpBtn.classList.remove("fee-toggle-active"); renderFeeResult(); });
feeLumpBtn.addEventListener("click", () => { feeMode = "lumpsum"; feeLumpBtn.classList.add("fee-toggle-active"); feeInstBtn.classList.remove("fee-toggle-active"); renderFeeResult(); });
feeCourseSelect.addEventListener("change", renderFeeResult);

function renderFeeResult() {
  const course = COURSES.find((c) => c.id === feeCourseSelect.value) || COURSES[0];
  const fee = course.feeMax;
  const resultEl = document.getElementById("fee-result");
  replayPop(resultEl);

  if (feeMode === "lumpsum") {
    const discount = Math.round(fee * 0.05);
    const total = fee - discount;
    resultEl.innerHTML = `
      <div class="flex items-center gap-2 text-emerald-400 font-semibold mb-3">✓ Lump Sum Single Payment Discount</div>
      <div class="flex justify-between text-slate-300 mb-1.5"><span>Regular Tuition Fee:</span><span class="text-white font-semibold">${fmtPKR(fee)}</span></div>
      <div class="flex justify-between text-emerald-400 mb-3"><span>Special Advance Discount (5% Off):</span><span>– ${fmtPKR(discount)}</span></div>
      <div class="border-t border-white/10 pt-3 flex justify-between items-center"><span class="text-slate-300 font-semibold">Total Payable:</span><span class="text-2xl font-display font-semibold text-white">${fmtPKR(total)}</span></div>
    `;
  } else {
    const half = Math.round(fee / 2);
    resultEl.innerHTML = `
      <div class="flex items-center gap-2 text-cyan-300 font-semibold mb-3">💳 2-Month Installment Breakdown</div>
      <div class="flex justify-between text-slate-300 mb-1.5"><span>Installment 1 (at Admission):</span><span class="text-white font-semibold">${fmtPKR(half)}</span></div>
      <div class="flex justify-between text-slate-300 mb-3"><span>Installment 2 (after 30 days):</span><span class="text-white font-semibold">${fmtPKR(fee - half)}</span></div>
      <div class="border-t border-white/10 pt-3 flex justify-between items-center"><span class="text-slate-300 font-semibold">Total Payable:</span><span class="text-2xl font-display font-semibold text-white">${fmtPKR(fee)}</span></div>
    `;
  }
}
renderFeeResult();

/* ---------------- NAVTTC ---------------- */
const navttcPerks = document.getElementById("navttc-perks");
NAVTTC.perks.forEach((p) => {
  const div = document.createElement("div");
  div.className = "rounded-xl border border-white/10 bg-ink-800/50 p-4";
  div.dataset.reveal = "scale-pop";
  div.innerHTML = `<div class="font-semibold text-white flex items-center gap-2">${p.icon} ${p.title}</div><div class="text-slate-400 text-xs mt-1.5 leading-relaxed">${p.desc}</div>`;
  navttcPerks.appendChild(div);
});
observeReveals(navttcPerks, 80);

const navttcChecklist = document.getElementById("navttc-checklist");
NAVTTC.eligibility.forEach((item) => {
  const li = document.createElement("li");
  li.className = "flex items-start gap-2.5";
  li.dataset.reveal = "fade-up";
  li.innerHTML = `<span class="text-emerald-400 shrink-0">✅</span><span>${item}</span>`;
  navttcChecklist.appendChild(li);
});
observeReveals(navttcChecklist, 90);

/* ---------------- Campuses ---------------- */
const campusGrid = document.getElementById("campus-grid");
CAMPUSES.forEach((c) => {
  const card = document.createElement("div");
  card.className = "course-card";
  card.dataset.reveal = "drop";
  card.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">${c.icon}</div>
      <span class="badge-pill ${c.tagStyle}">${c.tag.toUpperCase()}</span>
    </div>
    <h3 class="font-display font-semibold text-white text-lg">${c.name}</h3>
    <div class="text-slate-400 text-sm mt-2 flex items-start gap-2">📍 <span>${c.address}</span></div>
    <div class="text-slate-400 text-sm mt-2 flex items-start gap-2">📞 <span>${c.phones.join(" / ")}</span></div>
    <div class="text-slate-400 text-sm mt-2 flex items-start gap-2">✉️ <span>${c.email}</span> | <span>🕐 ${c.hours}</span></div>
  `;
  campusGrid.appendChild(card);
});
observeReveals(campusGrid, 90);

/* ---------------- FAQ ---------------- */
const faqList = document.getElementById("faq-list");
FAQS.forEach((f) => {
  const item = document.createElement("div");
  item.className = "faq-item";
  item.dataset.reveal = "fade-up";
  item.innerHTML = `
    <button class="faq-question">
      <span>${f.q}</span>
      <span class="faq-chevron">⌄</span>
    </button>
    <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
  `;
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqList.querySelectorAll(".faq-item").forEach((i) => { i.classList.remove("open"); i.querySelector(".faq-answer").style.maxHeight = null; });
    if (!isOpen) { item.classList.add("open"); answer.style.maxHeight = answer.scrollHeight + "px"; }
  });
  faqList.appendChild(item);
});
observeReveals(faqList, 60);

/* ---------------- "Ask AI" trigger binder ----------------
   Any element with class "ask-ai-trigger" and a data-prompt
   attribute opens the chat panel and sends that prompt.
   Called after dynamic sections re-render. ---------------- */
function bindAskAiTriggers() {
  document.querySelectorAll(".ask-ai-trigger").forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = "true";
    el.addEventListener("click", () => {
      const prompt = el.dataset.prompt;
      window.openChatWithPrompt(prompt);
    });
  });
}
bindAskAiTriggers();

/* ---------------- Observe static (HTML-authored) reveal targets:
   section intros, fee-calculator columns, NAVTTC columns, etc. ---------------- */
observeReveals(document);
