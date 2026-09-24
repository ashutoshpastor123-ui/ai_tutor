// ==============================================================
// START PAGE
// ==============================================================

const form = document.getElementById("interviewForm");
const startBtn = document.getElementById("startBtn");
const errorBox = document.getElementById("errorBox");

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
}

function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const role = document.getElementById("role").value.trim();
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;

    if (!role) {
        showError("Please enter a target role.");
        return;
    }

    const labelEl = startBtn.querySelector(".btn-label");
    const originalLabel = labelEl.textContent;
    startBtn.disabled = true;
    labelEl.textContent = "Starting…";

    try {
        const data = await window.API.startInterview(role, experience, difficulty);

        // Save session
        localStorage.setItem("role", role);
        localStorage.setItem("experience", experience);
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("session_id", data.session_id);
        localStorage.setItem("question", data.first_question);
        localStorage.setItem("question_index", "1");

        // Clear any previous report
        localStorage.removeItem("report");

        window.location.href = "interview.html";
    } catch (err) {
        console.error(err);
        showError(
            "Could not start the interview. Make sure the backend is running at " +
                (window.APP_CONFIG.API_BASE_URL) +
                ".\n\n" +
                err.message
        );
        startBtn.disabled = false;
        labelEl.textContent = originalLabel;
    }
});
