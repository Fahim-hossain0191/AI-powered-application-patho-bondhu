import base64
import json
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_exercise_by_id, get_formulas
from prompts.math.answer_prompt import build_answer_prompt_text, build_answer_prompt_image

client = genai.Client(api_key=GEMINI_API_KEY)


def _get_exercise_data(exercise_id: int):
    exercise = get_exercise_by_id(exercise_id)
    if not exercise:
        raise ValueError(f"Exercise {exercise_id} পাওয়া যায়নি")
    if not exercise.get("solution_steps"):
        raise ValueError("এই exercise এর solution এখনো database এ নেই")

    ex_num = exercise.get("exercise_number", "3.1")
    chapter_id = int(str(ex_num).split(".")[0])
    formulas = get_formulas(chapter_id)
    return exercise, formulas


def _parse_response(raw_text: str) -> dict:
    raw_text = raw_text.strip()
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        raw_text = "\n".join(line for line in lines if not line.strip().startswith("```")).strip()
    return json.loads(raw_text)


def _fallback_response(exercise, message: str, is_correct: bool = False):
    return {
        "is_correct": is_correct,
        "feedback": message,
        "correct_steps": [],
        "wrong_steps": [] if is_correct else [1],
        "first_wrong_step": None if is_correct else 1,
        "what_went_wrong": None if is_correct else "AI service response was unavailable.",
        "what_should_be": None,
        "show_solution": not is_correct,
        "full_solution": exercise.get("solution_steps", ""),
        "points": 10 if is_correct else 0,
    }


def check_answer_text(exercise_id: int, student_answer: str) -> dict:
    exercise, formulas = _get_exercise_data(exercise_id)
    prompt = build_answer_prompt_text(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
        student_answer=student_answer,
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        return _parse_response(response.text)
    except Exception as e:
        print(f"Gemini error in check_answer_text: {e}. Using fallback response.")
        return _fallback_response(
            exercise,
            "AI answer check সাময়িকভাবে unavailable. সঠিক solution নিচে দেখানো হলো।",
        )


def check_answer_image(exercise_id: int, image_base64: str, image_mime: str = "image/jpeg") -> dict:
    exercise, formulas = _get_exercise_data(exercise_id)
    prompt = build_answer_prompt_image(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
    )
    image_bytes = base64.b64decode(image_base64)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                        types.Part.from_bytes(data=image_bytes, mime_type=image_mime),
                    ],
                )
            ],
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        return _parse_response(response.text)
    except Exception as e:
        print(f"Gemini error in check_answer_image: {e}. Using fallback response.")
        return _fallback_response(
            exercise,
            "ছবি বিশ্লেষণ সাময়িকভাবে unavailable. চাইলে text answer submit করুন।",
        )
