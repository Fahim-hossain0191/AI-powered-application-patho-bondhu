import json
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_chapter, get_concepts, get_formulas
from prompts.math.mcq_prompt import build_mcq_prompt

client = genai.Client(api_key=GEMINI_API_KEY)


def _clean_json(raw_text: str) -> dict:
    raw_text = raw_text.strip()
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        raw_text = "\n".join(line for line in lines if not line.strip().startswith("```")).strip()
    return json.loads(raw_text)


def _fallback_mcqs():
    return [
        {
            "question": "x + y = 5 এবং x - y = 3 হলে, x^2 - y^2 এর মান কত?",
            "options": {"ক": "8", "খ": "15", "গ": "16", "ঘ": "2"},
            "correct": "খ",
            "explanation": "x^2 - y^2 = (x+y)(x-y) = 5 × 3 = 15।",
            "formula_used": "a^2-b^2=(a+b)(a-b)",
        },
        {
            "question": "a + 1/a = 2 হলে, a^2 + 1/a^2 এর মান কত?",
            "options": {"ক": "2", "খ": "4", "গ": "6", "ঘ": "0"},
            "correct": "ক",
            "explanation": "a^2 + 1/a^2 = (a + 1/a)^2 - 2 = 2^2 - 2 = 2।",
            "formula_used": "(a+b)^2",
        },
        {
            "question": "a^3 - b^3 এর সঠিক উৎপাদক কোনটি?",
            "options": {
                "ক": "(a-b)(a^2 + ab + b^2)",
                "খ": "(a-b)(a^2 - ab + b^2)",
                "গ": "(a+b)(a^2 - ab + b^2)",
                "ঘ": "(a-b)^3 + 3ab(a-b)",
            },
            "correct": "ক",
            "explanation": "a^3 - b^3 = (a-b)(a^2 + ab + b^2)।",
            "formula_used": "a^3-b^3",
        },
    ]


def generate_mcq(chapter_id: int, count: int = 20, previously_generated: list = None):
    chapter = get_chapter(chapter_id)
    if not chapter:
        raise ValueError(f"Chapter {chapter_id} পাওয়া যায়নি")

    concepts = get_concepts(chapter_id)
    formulas = get_formulas(chapter_id)
    if not concepts and not formulas:
        raise ValueError(f"Chapter {chapter_id} এর কোনো data নেই")

    prompt = build_mcq_prompt(
        chapter_name=chapter["chapter_name"],
        concepts=concepts,
        formulas=formulas,
        count=count,
        previously_generated=previously_generated or [],
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        data = _clean_json(response.text)
        mcqs = data.get("mcqs", [])
    except Exception as e:
        print(f"Gemini error in generate_mcq: {e}. Falling back to local MCQs.")
        mcqs = _fallback_mcqs()

    validated = []
    for mcq in mcqs:
        if not all(key in mcq for key in ["question", "options", "correct", "explanation"]):
            continue
        if not all(key in mcq["options"] for key in ["ক", "খ", "গ", "ঘ"]):
            continue
        if mcq["correct"] not in ["ক", "খ", "গ", "ঘ"]:
            continue
        validated.append(mcq)

    return {
        "chapter_id": chapter_id,
        "chapter_name": chapter["chapter_name"],
        "count": len(validated),
        "mcqs": validated[:count],
    }
