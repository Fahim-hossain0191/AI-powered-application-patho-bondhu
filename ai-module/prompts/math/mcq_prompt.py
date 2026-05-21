import pathlib
from jinja2 import Environment, FileSystemLoader

# Template folder path
TEMPLATE_DIR = pathlib.Path(__file__).parent
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))


def build_mcq_prompt(
    chapter_name: str,
    concepts: list,
    formulas: list,
    count: int = 20,
    previously_generated: list = None
) -> str:
    template = env.get_template("mcq.txt")

    return template.render(
        chapter_name=chapter_name,
        concepts=concepts,
        formulas=formulas,
        count=count,
        previously_generated=previously_generated or []
    )