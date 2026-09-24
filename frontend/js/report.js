// ==============================================================
// REPORT PAGE
// Backend returns: { "summary": { overall_score, technical_knowledge,
//   communication, problem_solving, confidence, strengths[],
//   weaknesses[], question_feedback[], areas_to_improve[],
//   final_recommendation } }
// ==============================================================

const raw = localStorage.getItem("report");
if (!raw) {
    alert("No report found. Please complete an interview first.");
    window.location.href = "index.html";
}

let report = {};
try {
    report = JSON.parse(raw) || {};
} catch (e) {
    alert("Error parsing report data: " + e.message);
    window.location.href = "index.html";
}

const summary = report.summary || {};
console.log("Report summary:", summary);

// ---------- Meta chips ----------
document.getElementById("reportRole").innerHTML =
    '<i class="fa-solid fa-briefcase"></i> ' + (localStorage.getItem("role") || "—");
document.getElementById("reportDifficulty").innerHTML =
    '<i class="fa-solid fa-gauge-high"></i> ' + (localStorage.getItem("difficulty") || "—");

// ---------- Recommendation / headline ----------
const overall = Number(summary.overall_score) || 0;
const headline =
    overall >= 8 ? "Strong performance!" :
    overall >= 6 ? "Solid attempt — nearly there." :
    overall >= 4 ? "You're on the way. Keep going." :
    "Great start. Lots to work on.";
document.getElementById("reportHeadline").textContent = headline;
document.getElementById("reportRecommendation").textContent =
    summary.final_recommendation || "No recommendation available.";

// ---------- Overall ring ----------
const CIRC = 2 * Math.PI * 52; // 326.72
const overallCircle = document.getElementById("overallRingCircle");
const overallScoreEl = document.getElementById("overallScore");

function setRing(circleEl, score) {
    const pct = Math.max(0, Math.min(10, Number(score) || 0)) / 10;
    circleEl.style.strokeDasharray = String(CIRC);
    circleEl.style.strokeDashoffset = String(CIRC * (1 - pct));
    circleEl.classList.remove("good", "ok", "weak");
    if (score >= 8) circleEl.classList.add("good");
    else if (score >= 5) circleEl.classList.add("ok");
    else circleEl.classList.add("weak");
}

setRing(overallCircle, overall);
overallScoreEl.textContent = overall || "–";

// ---------- Sub-score rings ----------
const subScores = [
    { key: "technical_knowledge", label: "Technical", icon: "fa-code" },
    { key: "communication", label: "Communication", icon: "fa-comments" },
    { key: "problem_solving", label: "Problem Solving", icon: "fa-puzzle-piece" },
    { key: "confidence", label: "Confidence", icon: "fa-hand-fist" },
];

const scoresGrid = document.querySelector(".scores-grid");
scoresGrid.innerHTML = "";

subScores.forEach((s) => {
    const val = Number(summary[s.key]);
    const score = Number.isFinite(val) ? val : 0;

    const el = document.createElement("div");
    el.className = "card score-card";
    el.setAttribute("data-testid", `score-${s.key}`);
    el.innerHTML = `
        <div class="score-top">
            <span class="score-label"><i class="fa-solid ${s.icon}"></i> ${s.label}</span>
            <span class="score-value">${score || "–"}<span class="score-max">/10</span></span>
        </div>
        <div class="score-bar-track">
            <div class="score-bar-fill ${score >= 8 ? "good" : score >= 5 ? "ok" : "weak"}"
                 style="width: ${(Math.max(0, Math.min(10, score)) / 10) * 100}%"></div>
        </div>
    `;
    scoresGrid.appendChild(el);
});

// ---------- Bullet lists ----------
function fillList(id, arr, emptyText) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    const items = Array.isArray(arr) ? arr.filter(Boolean) : [];
    if (items.length === 0) {
        const li = document.createElement("li");
        li.className = "muted";
        li.textContent = emptyText;
        ul.appendChild(li);
        return;
    }
    items.forEach((txt) => {
        const li = document.createElement("li");
        li.textContent = txt;
        ul.appendChild(li);
    });
}

fillList("strengthsList", summary.strengths, "No strengths recorded.");
fillList("weaknessesList", summary.weaknesses, "No weaknesses recorded.");
fillList("improveList", summary.areas_to_improve, "No improvement areas recorded.");

// ---------- Per-question feedback ----------
const qfWrap = document.getElementById("questionFeedback");
qfWrap.innerHTML = "";

const qf = Array.isArray(summary.question_feedback) ? summary.question_feedback : [];
if (qf.length === 0) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No per-question feedback available.";
    qfWrap.appendChild(p);
} else {
    qf.forEach((item) => {
        const card = document.createElement("div");
        card.className = "qf-item";
        const num = item.question ?? "?";
        card.innerHTML = `
            <div class="qf-num">Q${num}</div>
            <div class="qf-body">${escapeHtml(item.feedback || "No feedback.")}</div>
        `;
        qfWrap.appendChild(card);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ---------- Cleanup + navigation ----------
localStorage.removeItem("session_id");
localStorage.removeItem("question");
localStorage.removeItem("question_index");

function goHome() {
    localStorage.removeItem("report");
    window.location.href = "index.html";
}
window.goHome = goHome;
