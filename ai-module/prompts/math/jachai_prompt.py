import pathlib
from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = pathlib.Path(__file__).parent
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))


def build_jachai_solve_prompt(
    question: str,
    formulas: list = None,
) -> str:
    """
    Student শুধু প্রশ্ন দিলে — Gemini solve করবে।
    """
    template = env.get_template("jachai.txt")
    return template.render(
        mode="solve",
        question=question,
        formulas=formulas or [],
    )


def build_jachai_check_prompt(
    question: str,
    student_solution: str,
    formulas: list = None,
) -> str:
    """
    Student প্রশ্ন + নিজের solution দিলে — Gemini check করবে।
    সঠিক হলে → শুধু feedback
    ভুল হলে  → feedback + full solution
    """
    template = env.get_template("jachai.txt")
    return template.render(
        mode="check",
        question=question,
        student_solution=student_solution,
        formulas=formulas or [],
    )


def build_jachai_image_prompt() -> str:
    """
    Student ছবি দিলে — Gemini ছবি পড়ে বুঝবে।
    শুধু প্রশ্ন থাকলে → solve করবে
    প্রশ্ন + solution থাকলে → check করবে
    """
    template = env.get_template("jachai.txt")
    return template.render(
        mode="image",
    )
