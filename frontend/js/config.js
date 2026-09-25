// ==============================================================
// CONFIG
// Change API_BASE_URL if your backend runs on a different host/port.
// The FastAPI backend in this project exposes:
//   POST /interview/start
//   POST /interview/answer
//   POST /interview/finish
// ==============================================================

window.APP_CONFIG = {
    API_BASE_URL: "https://ai-tutor-sewc.onrender.com",

    // Interview UX
    // Auto-finish after this many questions (set to 0 to disable auto-finish).
    MAX_QUESTIONS: 5,
};
