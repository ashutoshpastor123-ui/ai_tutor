from pydantic import BaseModel
from typing import Any, Dict



class InterviewRequest(BaseModel):
    role: str
    experience: str
    difficulty: str


class InterviewResponse(BaseModel):
    message: str
    first_question: str
    session_id: str


class AnswerRequest(BaseModel):
    session_id: str
    question: str
    answer: str


class AnswerResponse(BaseModel):
    score: int
    feedback: str
    next_question: str


class FinishRequest(BaseModel):
    session_id: str


class FinishResponse(BaseModel):
    summary: Dict[str, Any]