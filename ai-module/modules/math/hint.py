import json
from google import genai

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_exercise_by_id, get_formulas
from prompts.math.hint_prompt import build_hint_prompt

client = genai.Client(api_key=GEMINI_API_KEY)


def _parse_response(raw_text: str) -> dict:
    raw_text = raw_text.strip()
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        raw_text = "\n".join(line for line in lines if not line.strip().startswith("```")).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        raw_text = raw_text.replace("\\\\", "\\")
        return json.loads(raw_text)


def _fallback_hint(exercise: dict, phase: int) -> dict:
    solution_steps = exercise.get("solution_steps", "")
    lines = [line.strip() for line in solution_steps.split("\n") if line.strip()]
    phase_names = {
        1: "চিন্তার দিক",
        2: "ব্যবহার্য টুল",
        3: "প্রথম পদক্ষেপ",
        4: "প্রায় সম্পূর্ণ পথ",
        5: "সম্পূর্ণ সমাধান",
    }

    if lines:
        idx = min(int((phase - 1) * (len(lines) / 5)), len(lines) - 1)
        hint = f"{phase_names[phase]}: {lines[idx]}"
    else:
        hint = f"{phase_names[phase]}: প্রশ্নের pattern এবং দেওয়া তথ্য থেকে শুরু করো।"

    return {"hint": hint}


def get_hint(exercise_id: int, phase: int) -> dict:
    if phase not in [1, 2, 3, 4, 5]:
        raise ValueError("Phase অবশ্যই 1 থেকে 5 এর মধ্যে হতে হবে")

    exercise = get_exercise_by_id(exercise_id)
    if not exercise:
        raise ValueError(f"Exercise {exercise_id} পাওয়া যায়নি")
    if not exercise.get("solution_steps"):
        raise ValueError("এই exercise এর solution এখনো database এ নেই")

    ex_num = exercise.get("exercise_number", "3.1")
    chapter_id = int(str(ex_num).split(".")[0])
    formulas = get_formulas(chapter_id)

    prompt = build_hint_prompt(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
        phase=phase,
    )

    try:
        response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        result = _parse_response(response.text)
    except Exception as e:
        print(f"Gemini error in get_hint: {e}. Falling back to database hint.")
        result = _fallback_hint(exercise, phase)

    result["exercise_id"] = exercise_id
    result["question_pattern"] = exercise["question_pattern"]
    result["has_more_hints"] = phase < 5
    return result
