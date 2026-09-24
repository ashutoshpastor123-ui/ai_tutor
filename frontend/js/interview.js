// ==============================================================
// INTERVIEW PAGE
// ==============================================================

// ---------- Elements ----------
const questionBox = document.getElementById("questionBox");
const answerBox = document.getElementById("answer");
const nextBtn = document.getElementById("nextBtn");
const finishBtn = document.getElementById("finishBtn");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const questionNumberEl = document.getElementById("questionNumber");
const wordCountEl = document.getElementById("wordCount");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackText = document.getElementById("feedbackText");
const feedbackScore = document.getElementById("feedbackScore");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const voiceBtn = document.getElementById("voiceBtn");
const voiceLabel = document.getElementById("voiceLabel");
const voiceStatus = document.getElementById("voiceStatus");
const metaRole = document.getElementById("metaRole");
const metaExperience = document.getElementById("metaExperience");
const metaDifficulty = document.getElementById("metaDifficulty");

// ---------- Config / State ----------
const MAX_QUESTIONS = (window.APP_CONFIG && window.APP_CONFIG.MAX_QUESTIONS) || 5;

let currentQuestion = localStorage.getItem("question") || "";
const sessionId = localStorage.getItem("session_id");
let questionIndex = parseInt(localStorage.getItem("question_index") || "1", 10);

// ---------- Session guard ----------
if (!sessionId) {
    alert("Interview session not found. Please start a new interview.");
    window.location.href = "index.html";
}

// ---------- Meta chips ----------
metaRole.innerHTML =
    '<i class="fa-solid fa-briefcase"></i> ' + (localStorage.getItem("role") || "—");
metaExperience.innerHTML =
    '<i class="fa-solid fa-user-clock"></i> ' + (localStorage.getItem("experience") || "—");
metaDifficulty.innerHTML =
    '<i class="fa-solid fa-gauge-high"></i> ' + (localStorage.getItem("difficulty") || "—");

// ---------- Question / progress ----------
function renderQuestion() {
    questionBox.textContent = currentQuestion || "Question not found.";
    questionNumberEl.textContent = String(questionIndex);
    const pct = Math.min(100, Math.round(((questionIndex - 1) / MAX_QUESTIONS) * 100));
    progressFill.style.width = pct + "%";
    progressLabel.textContent = `Question ${questionIndex} of ${MAX_QUESTIONS}`;
}
renderQuestion();

// ---------- Timer (per question) ----------
let timerSeconds = 0;
let timerInterval = null;

function pad(n) {
    return n < 10 ? "0" + n : "" + n;
}

function tickTimer() {
    timerSeconds += 1;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timerEl.textContent = `${pad(m)}:${pad(s)}`;
}

function startTimer() {
    stopTimer();
    timerSeconds = 0;
    timerEl.textContent = "00:00";
    timerInterval = setInterval(tickTimer, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

startTimer();

// ---------- Word count ----------
function updateWordCount() {
    const words = answerBox.value.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = `${words} word${words === 1 ? "" : "s"}`;
}
answerBox.addEventListener("input", updateWordCount);
updateWordCount();

// ---------- Camera ----------


// ---------- Voice input (browser Web Speech API) ----------
let recognition = null;
let recognizing = false;

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onstart = () => {
        recognizing = true;
        voiceBtn.classList.add("recording");
        voiceLabel.textContent = "Stop";
        voiceStatus.textContent = "Listening…";
        finalTranscript = answerBox.value ? answerBox.value + " " : "";
    };

    recognition.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript;
            if (e.results[i].isFinal) finalTranscript += t + " ";
            else interim += t;
        }
        answerBox.value = (finalTranscript + interim).replace(/\s+/g, " ").trimStart();
        updateWordCount();
    };

    recognition.onerror = (e) => {
        console.warn("Voice error:", e.error);
        voiceStatus.textContent = "Voice: " + e.error;
    };

    recognition.onend = () => {
        recognizing = false;
        voiceBtn.classList.remove("recording");
        voiceLabel.textContent = "Speak";
        voiceStatus.textContent = "";
    };

    voiceBtn.addEventListener("click", () => {
        if (recognizing) recognition.stop();
        else recognition.start();
    });
} else {
    voiceBtn.disabled = true;
    voiceBtn.title = "Voice input not supported in this browser";
    voiceStatus.textContent = "Voice not supported";
}

// ---------- Loading overlay ----------
function showLoading(msg) {
    loadingText.textContent = msg || "Working…";
    loadingOverlay.hidden = false;
}
function hideLoading() {
    loadingOverlay.hidden = true;
}

// ---------- Next question ----------
nextBtn.addEventListener("click", async () => {
    const answer = answerBox.value.trim();

    if (!answer) {
        answerBox.focus();
        answerBox.classList.add("shake");
        setTimeout(() => answerBox.classList.remove("shake"), 400);
        return;
    }
    if (!currentQuestion) {
        alert("Current question is missing.");
        return;
    }

    // Stop voice recognition if running
    if (recognizing && recognition) recognition.stop();

    nextBtn.disabled = true;
    finishBtn.disabled = true;
    const label = nextBtn.querySelector(".btn-label");
    label.textContent = "Evaluating…";

    try {
        const data = await window.API.submitAnswer(sessionId, currentQuestion, answer);

        // Show inline feedback for this answer
        feedbackText.textContent = data.feedback || "No feedback.";
        feedbackScore.textContent = `${data.score}/10`;
        feedbackScore.className =
            "score-pill " +
            (data.score >= 8 ? "good" : data.score >= 5 ? "ok" : "weak");
        feedbackBox.hidden = false;

        // Advance
        questionIndex += 1;
        currentQuestion = data.next_question || "";
        localStorage.setItem("question", currentQuestion);
        localStorage.setItem("question_index", String(questionIndex));

        answerBox.value = "";
        updateWordCount();
        renderQuestion();
        startTimer();

        // Auto-finish if reached MAX
        if (MAX_QUESTIONS > 0 && questionIndex > MAX_QUESTIONS) {
            await finishFlow(false);
            return;
        }
    } catch (err) {
        console.error(err);
        alert("Failed to submit answer.\n\n" + err.message);
    } finally {
        nextBtn.disabled = false;
        finishBtn.disabled = false;
        label.textContent = "Next Question";
        hideLoading();
    }
});

// ---------- Finish ----------
async function finishFlow(confirmFirst) {
    if (confirmFirst) {
        const ok = confirm("Finish the interview and see your report?");
        if (!ok) return;
    }

    // Save the current draft answer if any
    const answer = answerBox.value.trim();

    finishBtn.disabled = true;
    nextBtn.disabled = true;
    const label = finishBtn.querySelector(".btn-label");
    label.textContent = "Finishing…";

    try {
        if (answer !== "" && currentQuestion) {
            try {
                await window.API.submitAnswer(sessionId, currentQuestion, answer);
            } catch (e) {
                console.warn("Could not save the last answer, continuing:", e);
            }
        }

        const report = await window.API.finishInterview(sessionId);

        localStorage.setItem("report", JSON.stringify(report));

        stopTimer();
        if (recognizing && recognition) recognition.stop();

        window.location.href = "report.html";
    } catch (err) {
        console.error(err);
        alert("Failed to finish interview.\n\n" + err.message);
        finishBtn.disabled = false;
        nextBtn.disabled = false;
        label.textContent = "Finish & See Report";
        hideLoading();
    }
}

finishBtn.addEventListener("click", () => finishFlow(true));

// ---------- Cleanup ----------
window.addEventListener("beforeunload", () => {
    stopTimer();
});
