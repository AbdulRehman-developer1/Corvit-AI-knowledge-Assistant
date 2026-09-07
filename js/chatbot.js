/* ============================================================
   CORVIT SYSTEMS — AI Counselor Chatbot
   Talks to Groq through Netlify Function.
   - Primary model with automatic fallback model on failure
   - Full course/campus/fee/NAVTTC/FAQ dataset injected as context
   - Model returns structured JSON so we can render inline
     "recommended course" cards (icon, fee, CTA)
   ============================================================ */

(function () {
  const panel = document.getElementById("chat-panel");
  const backdrop = document.getElementById("chat-backdrop");
  const launcher = document.getElementById("chat-launcher");
  const closeBtn = document.getElementById("chat-close");
  const messagesEl = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const quickChipsEl = document.getElementById("chat-quick-chips");

  let history = [];
  let isSending = false;

  /* ---------------- System prompt built from data.js ---------------- */
  function buildSystemPrompt() {
    const courseLines = COURSES.map((c) =>
      `- id:${c.id} | ${c.name} | category:${c.categoryLabel} | duration:${c.durationRange} | prerequisites:${c.prerequisites} | fee:PKR ${c.feeMin}-${c.feeMax} (${c.installments} installments, or 5% off lump sum) | hardware:${c.hardware} | placement:${c.placement} | syllabus:${c.syllabus.join(", ")}`
    ).join("\n");

    const campusLines = CAMPUSES.map((c) =>
      `- ${c.name} (${c.tag}): ${c.address} | Phone: ${c.phones.join(" / ")} | Email: ${c.email} | Hours: ${c.hours}`
    ).join("\n");

    const faqLines = FAQS.map(
      (f) => `- Q: ${f.q}\n  A: ${f.a}`
    ).join("\n");

    return `You are the "Corvit AI Counselor" — the official AI admissions counselor for ${CONFIG.INSTITUTE_NAME}, Pakistan's IT & Cisco training institute.

YOUR JOB:
1. Guide students on which course best fits their background and career goal.
2. Answer questions about course outlines, timetables, prerequisites, fees/installments, campuses, and the NAVTTC free scheme.
3. Be warm, encouraging, and concise — this is a chat widget, not an essay. Prefer short paragraphs and bullet points.
4. Match the student's language/style — reply in English if they write in English, and in Roman Urdu if they write in Roman Urdu.
5. When you recommend one or more specific courses, include their ids in the "recommend" field so the UI can show a rich course card — don't just describe the course in text only.
6. Never invent campuses, fees, or courses beyond what is listed below. If asked something outside this knowledge, politely say you don't have that detail and suggest calling the helpline +92 303 8888555 or visiting a campus.

COURSES:
${courseLines}

CAMPUSES:
${campusLines}

NAVTTC PMYSDP FREE SCHEME:
Eligibility: ${NAVTTC.eligibility.join("; ")}
Perks: ${NAVTTC.perks.map((p) => p.title + " — " + p.desc).join("; ")}

FAQS:
${faqLines}

RESPONSE FORMAT — reply with ONLY raw JSON, no markdown fences, no commentary outside the JSON, matching exactly this shape:
{"reply": "your conversational reply text here", "recommend": ["course-id-1", "course-id-2"]}

"recommend" must be an array of course ids from the list above (use [] if no specific course applies to this reply).`;
  }

  /* ---------------- Rendering ---------------- */

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addUserBubble(text) {
    const row = document.createElement("div");
    row.className = "chat-row chat-row-user";
    row.innerHTML = `<div class="chat-bubble chat-bubble-user"></div>`;

    row.querySelector(".chat-bubble").textContent = text;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function addBotBubble(text, recommendIds) {
    const row = document.createElement("div");

    row.className =
      "chat-row chat-row-bot flex-col items-start gap-2.5";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-bubble-bot";
    bubble.textContent = text;

    row.appendChild(bubble);

    (recommendIds || []).forEach((id) => {
      const course = COURSES.find((c) => c.id === id);

      if (!course) return;

      const style = CATEGORY_STYLE[course.category];

      const card = document.createElement("div");

      card.className =
        "chat-course-card w-full max-w-[85%]";

      card.innerHTML = `
        <div class="w-11 h-11 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl">
          ${course.icon}
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-white">
            ${course.name}
          </div>

          <div class="text-xs text-slate-400 mt-0.5">
            ${course.duration} · ${fmtPKR(course.feeMin)}${
              course.feeMin !== course.feeMax
                ? "–" + fmtPKR(course.feeMax)
                : ""
            }
          </div>

          <div class="flex gap-2 mt-2">
            <a href="#courses" class="chat-quick-chip">
              View course
            </a>

            <a href="#fee-calculator" class="chat-quick-chip">
              Fee calculator
            </a>
          </div>
        </div>
      `;

      row.appendChild(card);
    });

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const row = document.createElement("div");

    row.className = "chat-row chat-row-bot";
    row.id = "typing-row";

    row.innerHTML = `
      <div class="chat-bubble chat-bubble-bot flex items-center gap-1.5">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const row = document.getElementById("typing-row");

    if (row) {
      row.remove();
    }
  }

  function addErrorBubble(text) {
    const row = document.createElement("div");

    row.className = "chat-row chat-row-bot";

    row.innerHTML = `
      <div class="chat-bubble chat-bubble-bot border-red-500/30 text-red-300"></div>
    `;

    row.querySelector(".chat-bubble").textContent = text;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  /* ---------------- Groq API calls through Netlify Function ---------------- */

  async function callGroqModel(model, messages) {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.4,
        max_tokens: 700,

        response_format: {
          type: "json_object",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");

      throw new Error(
        `Groq API error (${res.status}) on model ${model}: ${errText.slice(
          0,
          200
        )}`
      );
    }

    const data = await res.json();

    const content =
      data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Empty response from model " + model
      );
    }

    return content;
  }

  async function getAssistantReply(userMessages) {
    const payload = [
      {
        role: "system",
        content: buildSystemPrompt(),
      },

      ...userMessages,
    ];

    // Try primary model first, then fall back automatically.
    try {
      return await callGroqModel(
        CONFIG.MODEL_PRIMARY,
        payload
      );
    } catch (primaryErr) {
      console.warn(
        "Primary model failed, trying fallback:",
        primaryErr.message
      );

      try {
        return await callGroqModel(
          CONFIG.MODEL_FALLBACK,
          payload
        );
      } catch (fallbackErr) {
        console.error(
          "Fallback model also failed:",
          fallbackErr.message
        );

        throw fallbackErr;
      }
    }
  }

  function parseModelJson(raw) {
    let cleaned = raw
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    try {
      const obj = JSON.parse(cleaned);

      return {
        reply: obj.reply || cleaned,

        recommend: Array.isArray(obj.recommend)
          ? obj.recommend
          : [],
      };
    } catch (e) {
      // Model didn't return valid JSON — just show the raw text.
      return {
        reply: cleaned,
        recommend: [],
      };
    }
  }

  /* ---------------- Send flow ---------------- */

  async function sendMessage(text) {
    if (!text.trim() || isSending) return;

    addUserBubble(text);

    history.push({
      role: "user",
      content: text,
    });

    input.value = "";

    isSending = true;
    sendBtn.disabled = true;

    addTypingIndicator();

    try {
      const raw = await getAssistantReply(history);

      removeTypingIndicator();

      const {
        reply,
        recommend,
      } = parseModelJson(raw);

      addBotBubble(reply, recommend);

      history.push({
        role: "assistant",
        content: JSON.stringify({
          reply,
          recommend,
        }),
      });
    } catch (err) {
      removeTypingIndicator();

      addErrorBubble(
        "Sorry, I'm having trouble connecting right now. Please try again in a moment, or call our helpline +92 303 8888555."
      );

      console.error(err);
    } finally {
      isSending = false;
      sendBtn.disabled = false;
    }
  }

  /* ---------------- Quick chips ---------------- */

  const QUICK_PROMPTS = [
    "Which course suits me?",
    "NAVTTC free eligibility",
    "Compare CCNA vs CCNP",
    "Fee installment plans",
  ];

  QUICK_PROMPTS.forEach((p) => {
    const chip = document.createElement("button");

    chip.type = "button";
    chip.className = "chat-quick-chip";
    chip.textContent = p;

    chip.addEventListener("click", () => {
      sendMessage(p);
    });

    quickChipsEl.appendChild(chip);
  });

  /* ---------------- Panel open/close ---------------- */

  function openPanel() {
    panel.classList.add("chat-open");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      input.focus();
    }, 300);

    if (messagesEl.children.length === 0) {
      addBotBubble(
        `👋 Hi! I'm the Corvit AI Counselor. I can help you pick the right course, explain fees & installments, tell you about campuses, or check your NAVTTC free-scheme eligibility. What would you like to know?`,
        []
      );
    }
  }

  function closePanel() {
    panel.classList.remove("chat-open");

    document.body.style.overflow = "";
  }

  launcher.addEventListener(
    "click",
    openPanel
  );

  closeBtn.addEventListener(
    "click",
    closePanel
  );

  backdrop.addEventListener(
    "click",
    closePanel
  );

  document
    .getElementById("nav-ask-ai")
    .addEventListener(
      "click",
      openPanel
    );

  document
    .getElementById("mobile-ask-ai")
    .addEventListener(
      "click",
      openPanel
    );

  form.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();
      sendMessage(input.value);
    }
  );

  /* ---------------- Global hook used by "Ask AI" buttons across the page ---------------- */

  window.openChatWithPrompt = function (promptText) {
    openPanel();

    setTimeout(() => {
      sendMessage(promptText);
    }, 150);
  };
})();