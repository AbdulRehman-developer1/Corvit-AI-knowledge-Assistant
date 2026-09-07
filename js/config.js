/* ============================================================
   CORVIT SYSTEMS — AI Counselor Configuration
   ------------------------------------------------------------
   1) Get a free Groq API key: https://console.groq.com/keys
   2) Paste it below between the quotes.
   3) Save this file and reload index.html — the chatbot goes live.

   ⚠️ SECURITY NOTE: this key runs in the visitor's browser (this is
   a static site with no backend), so it IS visible to anyone who
   opens devtools/network tab. For a public production deployment,
   set the key as usage-limited in your Groq dashboard, or better,
   proxy requests through a small serverless function (e.g. a
   Netlify Function) instead of calling Groq directly from the
   client. This file keeps the client-side approach for simplicity.
   ============================================================ */

const CONFIG = {
  GROQ_API_KEY: "PASTE_YOUR_GROQ_API_KEY_HERE",

  // Primary model — used first for every chat request.
  MODEL_PRIMARY: "openai/gpt-oss-120b",

  // Fallback model — used automatically if the primary model call
  // fails (rate limit, timeout, model unavailable, etc).
  MODEL_FALLBACK: "llama-3.3-70b-versatile",

  GROQ_ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",

  // Institute display info used in the chatbot greeting.
  INSTITUTE_NAME: "Corvit Systems",
};
