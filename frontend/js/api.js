// ==============================================================
// API wrapper for the FastAPI backend.
// ==============================================================

const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || "http://127.0.0.1:8000";

async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let msg = `Server error ${res.status}`;
        try {
            const errText = await res.text();
            if (errText) msg += `: ${errText}`;
        } catch (_) {}
        throw new Error(msg);
    }

    return res.json();
}

window.API = {
    startInterview: (role, experience, difficulty) =>
        apiPost("/interview/start", { role, experience, difficulty }),

    submitAnswer: (session_id, question, answer) =>
        apiPost("/interview/answer", { session_id, question, answer }),

    finishInterview: (session_id) =>
        apiPost("/interview/finish", { session_id }),
};
