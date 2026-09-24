from fastapi import APIRouter
import uuid

from app.models.schemas import (
    InterviewRequest,
    InterviewResponse,
    AnswerRequest,
    AnswerResponse,
    FinishRequest,
    FinishResponse,
)

from app.services.ai_engine import AIEngine
from app.services.evaluator import Evaluator


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

engine = AIEngine()
evaluator = Evaluator()


# Temporary in-memory storage
# Data will disappear when the server restarts.
interviews = {}


@router.post("/start", response_model=InterviewResponse)
def start_interview(data: InterviewRequest):

    # Generate unique session ID
    session_id = str(uuid.uuid4())

    # Generate first question
    question = engine.generate_first_question(
        data.role,
        data.experience,
        data.difficulty,
    )

    # Store interview temporarily
    interviews[session_id] = {
        "role": data.role,
        "experience": data.experience,
        "difficulty": data.difficulty,
        "current_question": question,
        "history": [],
    }

    return InterviewResponse(
        message="Interview Started",
        first_question=question,
        session_id=session_id,
    )


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(data: AnswerRequest):

    # Check whether session exists
    if data.session_id not in interviews:
        raise ValueError("Invalid or expired session ID")

    interview = interviews[data.session_id]

    # Save current question and answer
    interview["history"].append({
        "question": data.question,
        "answer": data.answer,
    })

    # Evaluate answer
    score, feedback = evaluator.evaluate(data.answer)

    # Generate next question
    next_question = engine.generate_next_question(
        interview["role"],
        interview["experience"],
        interview["difficulty"],
        data.question,
        data.answer,
    )

    # Update current question
    interview["current_question"] = next_question

    return AnswerResponse(
        score=score,
        feedback=feedback,
        next_question=next_question,
    )


@router.post("/finish", response_model=FinishResponse)
def finish_interview(data: FinishRequest):

    # Check session
    if data.session_id not in interviews:
        raise ValueError("Invalid or expired session ID")

    interview = interviews[data.session_id]

    # Get complete interview history
    history = interview["history"]

    # Generate final summary
    summary = engine.generate_final_summary(history)

    # Remove session after interview ends
    del interviews[data.session_id]

    return FinishResponse(
        summary=summary
    )