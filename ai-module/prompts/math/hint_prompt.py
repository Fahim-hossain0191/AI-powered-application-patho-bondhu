import pathlib
from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = pathlib.Path(__file__).parent
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))


def build_hint_prompt(
    question_text: str,
    question_pattern: str,
    exercise_number: str,
    solution_steps: str,
    formulas: list,
    phase: int,
) -> str:
    """
    Hint prompt বানাও।

    phase 1-5 অনুযায়ী আলাদা tutor style hint দেবে।
    question_pattern অনুযায়ী চিন্তার approach বদলাবে:
    - PROVE    → proof এর দিকে guide করবে
    - FACTORIZE → pattern দেখতে শেখাবে
    - FIND_VALUE → সংযোগ খুঁজতে বলবে
    - SIMPLIFY  → চেনা pattern খুঁজতে বলবে
    - OTHER     → general approach
    """
    template = env.get_template("hint.txt")
    return template.render(
        question_text=question_text,
        question_pattern=question_pattern,
        exercise_number=exercise_number,
        solution_steps=solution_steps,
        formulas=formulas,
        phase=phase,
    )
