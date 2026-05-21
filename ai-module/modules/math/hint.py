import json
from google import genai

from config import GEMINI_API_KEY, GEMINI_MODEL
from db.retriever import get_exercise_by_id, get_formulas
from prompts.math.hint_prompt import build_hint_prompt

client = genai.Client(api_key=GEMINI_API_KEY)


# ================================================
# HELPER: Gemini output parse করো
# ================================================
def _parse_response(raw_text: str) -> dict:
    raw_text = raw_text.strip()

    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        raw_text = raw_text.replace("\\\\", "\\")
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"Gemini এর output parse হয়নি: {e}\n\nOutput:\n{raw_text}"
            )


# ================================================
# GET HINT
# ================================================
def get_hint(exercise_id: int, phase: int) -> dict:
    """
    Student hint চাইলে এই function call হবে।

    exercise_id → কোন exercise এর hint
    phase       → 1 থেকে 5

    Flow:
    1. Phase validate (1-5 এর মধ্যে হতে হবে)
    2. DB থেকে exercise + solution + formulas আনো
    3. Prompt বানাও
       - question_pattern দেখে tutor approach ঠিক করো
       - phase দেখে কতটুকু বলবো ঠিক করো
    4. Gemini কে দাও
    5. Parse করো

    Phase 1 → শুধু চিন্তার দিক, কোনো সূত্র না
    Phase 2 → কোন approach, কোন সূত্র — কিন্তু apply না
    Phase 3 → প্রথম step হাতে ধরে
    Phase 4 → প্রায় সব, শেষটুকু বাকি
    Phase 5 → সম্পূর্ণ solution + explanation
    """

    # Step 1: Phase validate
    if phase not in [1, 2, 3, 4, 5]:
        raise ValueError("Phase অবশ্যই 1 থেকে 5 এর মধ্যে হতে হবে")

    # Step 2: DB থেকে data আনো
    exercise = get_exercise_by_id(exercise_id)
    if not exercise:
        raise ValueError(f"Exercise {exercise_id} পাওয়া যায়নি")

    if not exercise.get("solution_steps"):
        raise ValueError("এই exercise এর solution এখনো database এ নেই")

    # "3.1" → chapter_id = 3
    ex_num = exercise.get("exercise_number", "3.1")
    chapter_id = int(ex_num.split(".")[0])
    formulas = get_formulas(chapter_id)

    # Step 3: Prompt বানাও
    prompt = build_hint_prompt(
        question_text=exercise["question_text"],
        question_pattern=exercise["question_pattern"] or "OTHER",
        exercise_number=exercise["exercise_number"],
        solution_steps=exercise["solution_steps"],
        formulas=formulas,
        phase=phase,
    )

    # Step 4: Gemini কে দাও
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

    # Step 5: Parse করো
    result = _parse_response(response.text)

    # Extra info যোগ করো
    result["exercise_id"] = exercise_id
    result["question_pattern"] = exercise["question_pattern"]
    result["has_more_hints"] = phase < 5

    return result