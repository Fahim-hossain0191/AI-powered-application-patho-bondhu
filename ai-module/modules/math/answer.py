import json
import base64
from typing import List, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_exercise_by_id, get_formulas
from prompts.math.answer_prompt import (
    build_answer_prompt_text,
    build_answer_prompt_image,
)

# Pydantic schema for structured output validation
class AnswerCheckResponse(BaseModel):
    is_correct: bool
    feedback: str
    correct_steps: List[int]
    wrong_steps: List[int]
    first_wrong_step: Optional[int] = None
    what_went_wrong: Optional[str] = None
    what_should_be: Optional[str] = None
    show_solution: bool
    full_solution: Optional[str] = None
    points: int

client = genai.Client(api_key=GEMINI_API_KEY)


# ================================================
# HELPER: DB থেকে exercise data আনো
# ================================================
def _get_exercise_data(exercise_id: int):
    """
    DB থেকে exercise + formulas আনো।

    exercise_number "3.1" থেকে chapter_id বের করে
    সেই chapter এর formulas আনে।
    """
    exercise = get_exercise_by_id(exercise_id)
    if not exercise:
        raise ValueError(f"Exercise {exercise_id} পাওয়া যায়নি")

    if not exercise.get("solution_steps"):
        raise ValueError("এই exercise এর solution এখনো database এ নেই")

    # "3.1" → 3 → chapter_id = 3
    ex_num = exercise.get("exercise_number", "3.1")
    chapter_id = int(ex_num.split(".")[0])
    formulas = get_formulas(chapter_id)

    return exercise, formulas


# ================================================
# HELPER: Gemini output parse করো
# ================================================
def _parse_response(raw_text: str) -> dict:
    """
    Gemini এর output থেকে JSON parse করো।
    মাঝে মাঝে ```json``` দিয়ে wrap করে, সেটা clean করো।
    """
    raw_text = raw_text.strip()

    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini এর output parse হয়নি: {e}\n\nOutput:\n{raw_text}"
        )


# ================================================
# TEXT ANSWER CHECK
# ================================================
def check_answer_text(exercise_id: int, student_answer: str) -> dict:
    """
    Student টাইপ করে answer দিলে এই function call হবে।

    Flow:
    1. DB থেকে exercise + solution + formulas আনো
    2. Text prompt বানাও (answer.txt template)
    3. Gemini কে শুধু text দাও
    4. Response parse করো

    সঠিক হলে → feedback + points (solution দেখাবে না)
    ভুল হলে  → feedback + কোথায় ভুল + full_solution
    """

    # Step 1: DB থেকে data আনো
    exercise, formulas = _get_exercise_data(exercise_id)

    # Step 2: Prompt বানাও
    prompt = build_answer_prompt_text(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
        student_answer=student_answer,
    )

    # Step 3: Gemini কে দাও (শুধু text)
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AnswerCheckResponse,
        )
    )

    # Step 4: Parse করো
    return _parse_response(response.text)


# ================================================
# IMAGE ANSWER CHECK
# ================================================
def check_answer_image(
    exercise_id: int,
    image_base64: str,
    image_mime: str = "image/jpeg"
) -> dict:
    """
    Student ছবি তুলে answer দিলে এই function call হবে।

    Flow:
    1. DB থেকে exercise + solution + formulas আনো
    2. Image prompt বানাও (ছবি থেকে পড়তে বলা হয়)
    3. Gemini Vision কে prompt + ছবি একসাথে দাও
       Gemini একই call এ:
         a) ছবি থেকে হাতের লেখা পড়বে (বাংলা + math notation)
         b) correct solution এর সাথে compare করবে
         c) feedback + solution দেবে (ভুল হলে)
    4. Response parse করো

    সঠিক হলে → feedback + points (solution দেখাবে না)
    ভুল হলে  → feedback + কোথায় ভুল + full_solution
    """

    # Step 1: DB থেকে data আনো
    exercise, formulas = _get_exercise_data(exercise_id)

    # Step 2: Image prompt বানাও
    prompt = build_answer_prompt_image(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
    )

    # Step 3: Gemini Vision কে prompt + image একসাথে দাও
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
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AnswerCheckResponse,
        )
    )

    # Step 4: Parse করো
    return _parse_response(response.text)