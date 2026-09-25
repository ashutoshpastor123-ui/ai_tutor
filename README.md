# 🤖 AI Interview Tutor

**AI Interview Tutor** is an AI-powered interview practice platform designed to help students and job seekers prepare for technical interviews through realistic, interactive interview sessions.

Instead of relying entirely on a fixed question bank, the application uses an AI model to dynamically generate interview questions, evaluate candidate answers, provide feedback, and generate a final performance summary.

## 🚀 Live Demo

**Frontend:**
https://eclectic-croquembouche-cbf721.netlify.app/

**Backend API:**
https://ai-tutor-sewc.onrender.com/

**API Documentation:**
https://ai-tutor-sewc.onrender.com/docs

---

## ✨ Features

* 🤖 AI-generated interview questions
* 🎯 Role-based interview sessions
* 📊 Multiple difficulty levels
* 🧠 AI-based answer evaluation
* ⭐ Answer scoring and feedback
* 🔄 Dynamic follow-up interview questions
* 📋 Final interview performance report
* ⚡ FastAPI backend
* 🌐 Deployed frontend and backend
* 🔐 API key managed through environment variables
* 💾 Temporary in-memory interview sessions

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI

* Groq API
* Large Language Model for:

  * Question generation
  * Answer evaluation
  * Feedback generation
  * Interview summary

### Other Technologies

* OpenCV
* python-dotenv
* Git & GitHub

### Deployment

* **Frontend:** Netlify
* **Backend:** Render

---

## 🏗️ Project Structure

```text
AI-Interview-Tutor/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── interview.py
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── interview.html
│   ├── report.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── config.js
│       ├── api.js
│       ├── index.js
│       ├── interview.js
│       └── report.js
│
└── README.md
```

---

## 🔄 How It Works

```text
User
  │
  ▼
Select Role + Experience + Difficulty
  │
  ▼
Start Interview
  │
  ▼
AI Generates Question
  │
  ▼
User Provides Answer
  │
  ▼
AI Evaluates Answer
  │
  ├── Score
  ├── Feedback
  └── Next Question
  │
  ▼
Continue Interview
  │
  ▼
Finish Interview
  │
  ▼
Final Performance Report
```

---

## ⚙️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/ashutoshpastor123-ui/ai_tutor.git
cd ai_tutor
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

### 3. Install backend dependencies

```powershell
pip install -r backend/requirements.txt
```

### 4. Configure environment variables

Create a `.env` file for the backend.

```env
GROQ_API_KEY=your_groq_api_key
```

**Do not upload your `.env` file or API key to GitHub.**

### 5. Start the FastAPI backend

From the project root:

```powershell
uvicorn backend.app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run the frontend

From the `frontend` directory:

```powershell
cd frontend
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

---

## 🌐 Deployment

The project is deployed using:

### Frontend

Netlify:

```text
https://eclectic-croquembouche-cbf721.netlify.app/
```

### Backend

Render:

```text
https://ai-tutor-sewc.onrender.com
```

The frontend communicates with the deployed FastAPI backend through the configured API base URL.

---


## 🔌 API Endpoints

### Start Interview

```http
POST /interview/start
```

Starts a new interview session.

### Submit Answer

```http
POST /interview/answer
```

Submits the candidate's answer for AI evaluation.

### Finish Interview

```http
POST /interview/finish
```

Finishes the interview and generates the final performance summary.

### API Documentation

FastAPI automatically provides interactive API documentation at:

```text
/docs
```

---

## 🎯 Problem Statement

Many students prepare for interviews using static question lists and do not receive immediate, personalized feedback.

AI Interview Tutor addresses this by providing an interactive interview environment where questions and feedback are generated dynamically based on the interview session.

---

## 💡 Future Improvements

Some planned improvements include:

* Voice-based interview interaction
* Speech-to-text answer input
* More advanced behavioral analysis
* Improved eye-contact and attention analysis
* Personalized preparation recommendations
* Interview history and progress tracking
* User authentication
* Persistent database storage
* More detailed analytics and performance graphs

---

## 👨‍💻 Author

**Asutosh Pastor**
**Arnab Dev**

B.Tech CSE / AI-ML Student

---

## ⭐ Acknowledgements

This project was developed as a hackathon project to explore how generative AI can be used to create more interactive and personalized interview preparation experiences.
