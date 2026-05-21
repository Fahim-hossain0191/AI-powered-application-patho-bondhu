import json
from typing import List
from pydantic import BaseModel
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_chapter, get_concepts, get_formulas
from prompts.math.mcq_prompt import build_mcq_prompt

# Pydantic schemas for structured JSON output
class MCQOptions(BaseModel):
    ক: str
    খ: str
    গ: str
    ঘ: str

class MCQItem(BaseModel):
    question: str
    options: MCQOptions
    correct: str
    explanation: str
    formula_used: str

class MCQResponse(BaseModel):
    mcqs: List[MCQItem]

# Gemini setup
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_mcq(chapter_id: int, count: int = 20, previously_generated: list = None):

    # Step 1: DB থেকে data আনো
    chapter = get_chapter(chapter_id)
    if not chapter:
        raise ValueError(f"Chapter {chapter_id} পাওয়া যায়নি")

    concepts = get_concepts(chapter_id)
    formulas = get_formulas(chapter_id)

    if not concepts and not formulas:
        raise ValueError(f"Chapter {chapter_id} এর কোনো data নেই")

    # Step 2: Prompt বানাও
    prompt = build_mcq_prompt(
        chapter_name=chapter["chapter_name"],
        concepts=concepts,
        formulas=formulas,
        count=count,
        previously_generated=previously_generated or []
    )

<<<<<<< HEAD
    # Step 3: Gemini কে দাও
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=MCQResponse,
        )
    )
    raw_text = response.text.strip()

    # Step 4: JSON parse করো
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        data = json.loads(raw_text)
        mcqs = data.get("mcqs", [])
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON parse হয়নি: {e}\n\nOutput:\n{raw_text}")
=======
    # Step 3: Gemini কে দাও & Step 4: JSON parse করো
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=MCQResponse,
            )
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            lines = raw_text.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw_text = "\n".join(lines).strip()
        data = json.loads(raw_text)
        mcqs = data.get("mcqs", [])
    except Exception as e:
        print(f"Gemini API rate limit or error in generate_mcq: {e}. Falling back to structured local MCQs.")
        mcqs = [
            {
                "question": "x + y = 5 এবং x - y = 3 হলে, x^2 - y^2 এর মান কত?",
                "options": {
                    "ক": "8",
                    "খ": "15",
                    "গ": "16",
                    "ঘ": "2"
                },
                "correct": "খ",
                "explanation": "x^2 - y^2 = (x+y)(x-y) = 5 × 3 = 15।"
            },
            {
                "question": "a + 1/a = 2 হলে, a^2 + 1/a^2 এর মান কত?",
                "options": {
                    "ক": "2",
                    "খ": "4",
                    "গ": "6",
                    "ঘ": "0"
                },
                "correct": "ক",
                "explanation": "a^2 + 1/a^2 = (a + 1/a)^2 - 2 = 2^2 - 2 = 2।"
            },
            {
                "question": "a^3 - b^3 এর সঠিক উৎপাদক বিশ্লেষণ সূত্র কোনটি?",
                "options": {
                    "ক": "(a-b)(a^2 + ab + b^2)",
                    "খ": "(a-b)(a^2 - ab + b^2)",
                    "গ": "(a+b)(a^2 - ab + b^2)",
                    "ঘ": "(a-b)^3 + 3ab(a-b)"
                },
                "correct": "ক",
                "explanation": "a^3 - b^3 এর উৎপাদক সূত্র হলো (a-b)(a^2 + ab + b^2)।"
            }
        ]
>>>>>>> origin/main

    # Step 5: Validate
    validated = []
    for mcq in mcqs:
        if not all(k in mcq for k in ["question", "options", "correct", "explanation"]):
            continue
        if not all(k in mcq["options"] for k in ["ক", "খ", "গ", "ঘ"]):
            continue
        if mcq["correct"] not in ["ক", "খ", "গ", "ঘ"]:
            continue
        validated.append(mcq)

    return {
        "chapter_id": chapter_id,
        "chapter_name": chapter["chapter_name"],
        "count": len(validated),
        "mcqs": validated
    }