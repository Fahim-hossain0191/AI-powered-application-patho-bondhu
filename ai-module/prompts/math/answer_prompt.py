import pathlib
from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = pathlib.Path(__file__).parent
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))


def build_answer_prompt_text(
    question_text: str,
    question_pattern: str,
    exercise_number: str,
    solution_steps: str,
    formulas: list,
    student_answer: str,
) -> str:
    """
    Student টাইপ করে answer দিলে এই prompt বানাও।
    """
    template = env.get_template("answer.txt")
    return template.render(
        question_text=question_text,
        question_pattern=question_pattern,
        exercise_number=exercise_number,
        solution_steps=solution_steps,
        formulas=formulas,
        student_answer=student_answer,
        input_type="text",
    )


def build_answer_prompt_image(
    question_text: str,
    question_pattern: str,
    exercise_number: str,
    solution_steps: str,
    formulas: list,
) -> str:
    """
    Student ছবি তুলে answer দিলে এই prompt বানাও।
    Gemini একই call এ ছবি পড়বে + check করবে।
    """
    template = env.get_template("answer.txt")
    return template.render(
        question_text=question_text,
        question_pattern=question_pattern,
        exercise_number=exercise_number,
        solution_steps=solution_steps,
        formulas=formulas,
        student_answer="",
        input_type="image",
    )
