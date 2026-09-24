
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# Find .env inside backend/
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)


class AIEngine:

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("GROQ_API_KEY is not set in .env")

        self.client = Groq(api_key=api_key)

        # Current Groq production model
        self.model = "openai/gpt-oss-120b"

    def generate_first_question(self, role, experience, difficulty):

        prompt = f"""
You are an AI technical interviewer.

Generate ONE interview question for a candidate with:

Role: {role}
Experience: {experience}
Difficulty: {difficulty}

Rules:
- Ask only one question.
- Make it relevant to the role.
- Match the requested difficulty.
- Do not provide the answer.
- Return only the interview question.
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content.strip()

    def generate_next_question(
        self,
        role,
        experience,
        difficulty,
        question,
        answer
    ):

        prompt = f"""
You are an AI technical interviewer.

Candidate details:
Role: {role}
Experience: {experience}
Difficulty: {difficulty}

Previous interview question:
{question}

Candidate's answer:
{answer}

Generate ONE next interview question.

Rules:
- Ask only ONE question.
- Make it relevant to the role.
- Consider the candidate's previous answer.
- Continue the interview naturally.
- Match the requested difficulty.
- Do not provide the answer.
- Do not give feedback.
- Return only the interview question.
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content.strip()

    def generate_final_summary(self, history):

        interview_text = ""

        for i, item in enumerate(history, start=1):
            interview_text += f"""
Question {i}:
{item['question']}

Answer {i}:
{item['answer']}

"""

        prompt = f"""
You are an expert technical interviewer.

Analyze the following interview:

{interview_text}

Return ONLY valid JSON in this exact format:

{{
    "overall_score": 0,
    "technical_knowledge": 0,
    "communication": 0,
    "problem_solving": 0,
    "confidence": 0,
    "strengths": [
        "...",
        "...",
        "..."
    ],
    "weaknesses": [
        "...",
        "...",
        "..."
    ],
    "question_feedback": [
        {{
            "question": 1,
            "feedback": "..."
        }},
        {{
            "question": 2,
            "feedback": "..."
        }},
        {{
            "question": 3,
            "feedback": "..."
        }}
    ],
    "areas_to_improve": [
        "...",
        "...",
        "..."
    ],
    "final_recommendation": "..."
}}

Rules:
- Return ONLY valid JSON.
- Do not wrap the response in markdown.
- Do not use ```json.
- Scores must be integers between 1 and 10.
- Evaluate only from the candidate's answers.
- If fewer than 3 questions were asked, include feedback only for the questions that exist.
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={
                "type": "json_object"
            }
        )

        try:
            return json.loads(response.choices[0].message.content)

        except json.JSONDecodeError:
            return {
                "error": "Groq returned invalid JSON.",
                "raw_response": response.choices[0].message.content
            }
