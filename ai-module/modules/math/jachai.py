import json
import base64
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from prompts.math.jachai_prompt import (
    build_jachai_solve_prompt,
    build_jachai_check_prompt,
    build_jachai_image_prompt,
)

client = genai.Client(api_key=GEMINI_API_KEY)


# ================================================
# HELPER: Gemini output parse করো
# ================================================
def _parse_response(raw_text: str) -> dict:
    """
    Gemini এর output থেকে JSON parse করো।
    LaTeX backslash এবং markdown backtick clean করো।
    """
    raw_text = raw_text.strip()

    # markdown backtick clean করো
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        # LaTeX backslash fix করো
        raw_text = raw_text.replace("\\\\", "\\")
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"Gemini এর output parse হয়নি: {e}\n\nOutput:\n{raw_text}"
            )


# ================================================
# MODE 1: SOLVE
# Student শুধু প্রশ্ন দিয়েছে
# Gemini step by step solve করবে
# ================================================
def solve_question(question: str, chapter_id: int = None) -> dict:
    """
    Student যেকোনো math প্রশ্ন দিলে Gemini solve করবে।

    question   → student এর প্রশ্ন
    chapter_id → optional, দিলে সেই chapter এর formulas context হিসেবে দেওয়া হবে

    Flow:
    1. chapter_id দিলে DB থেকে formulas আনো
    2. Solve prompt বানাও
    3. Gemini কে দাও
    4. Parse করো
    """
    formulas = []
    if chapter_id:
        from db.retriever import get_formulas
        formulas = get_formulas(chapter_id)

    prompt = build_jachai_solve_prompt(
        question=question,
        formulas=formulas,
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

    return _parse_response(response.text)


# ================================================
# MODE 2: CHECK
# Student প্রশ্ন + নিজের solution দিয়েছে
# Gemini check করবে
# সঠিক → শুধু feedback
# ভুল  → feedback + full solution
# ================================================
def check_solution(
    question: str,
    student_solution: str,
    chapter_id: int = None
) -> dict:
    """
    Student নিজের solution check করাতে চাইলে।

    question         → math প্রশ্ন
    student_solution → student যা করেছে
    chapter_id       → optional, formulas context এর জন্য

    Flow:
    1. chapter_id দিলে DB থেকে formulas আনো
    2. Check prompt বানাও
    3. Gemini কে দাও
    4. Parse করো
    """
    formulas = []
    if chapter_id:
        from db.retriever import get_formulas
        formulas = get_formulas(chapter_id)

    prompt = build_jachai_check_prompt(
        question=question,
        student_solution=student_solution,
        formulas=formulas,
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

    return _parse_response(response.text)


# ================================================
# MODE 3: IMAGE
# Student ছবি দিয়েছে
# Gemini ছবি দেখে বুঝবে:
#   - শুধু প্রশ্ন → solve করবে
#   - প্রশ্ন + solution → check করবে
# ================================================
def check_image(
    image_base64: str,
    image_mime: str = "image/jpeg"
) -> dict:
    """
    Student ছবি তুলে দিলে।

    image_base64 → ছবির base64 string
    image_mime   → image/jpeg বা image/png

    Flow:
    1. Image prompt বানাও
    2. Gemini Vision কে prompt + ছবি একসাথে দাও
       Gemini নিজেই বুঝবে:
         - শুধু প্রশ্ন আছে → solve করবে
         - প্রশ্ন + solution আছে → check করবে
    3. Parse করো
    """
    prompt = build_jachai_image_prompt()
    image_bytes = base64.b64decode(image_base64)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=image_mime
                    ),
                ]
            )
        ]
    )

    return _parse_response(response.text)