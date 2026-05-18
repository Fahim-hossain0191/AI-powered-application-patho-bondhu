import mysql.connector
from config import DB_CONFIG


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


# ================================================
# CHAPTER
# ================================================
def get_chapter(chapter_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM chapters WHERE chapter_id = %s",
        (chapter_id,)
    )
    result = cursor.fetchone()

    cursor.close()
    conn.close()
    return result


# ================================================
# CONCEPTS
# ================================================
def get_concepts(chapter_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT concept_id, module_title, content, examples, importance_rank
           FROM math_concepts
           WHERE chapter_id = %s
           ORDER BY display_order ASC""",
        (chapter_id,)
    )
    result = cursor.fetchall()

    cursor.close()
    conn.close()
    return result


# ================================================
# FORMULAS
# ================================================
def get_formulas(chapter_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT formula_id, formula_text, when_to_use, variables_explanation, importance_rank
           FROM math_formulas
           WHERE chapter_id = %s
           ORDER BY display_order ASC""",
        (chapter_id,)
    )
    result = cursor.fetchall()

    cursor.close()
    conn.close()
    return result


# ================================================
# EXERCISES
# ================================================
def get_exercises(chapter_id: int, exercise_number: str = None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if exercise_number:
        cursor.execute(
            """SELECT exercise_id, exercise_number, question_text, 
                      question_pattern, solution_steps, frequency_module
               FROM math_exercises
               WHERE chapter_id = %s AND exercise_number = %s
               ORDER BY display_order ASC""",
            (chapter_id, exercise_number)
        )
    else:
        cursor.execute(
            """SELECT exercise_id, exercise_number, question_text,
                      question_pattern, solution_steps, frequency_module
               FROM math_exercises
               WHERE chapter_id = %s
               ORDER BY exercise_number ASC, display_order ASC""",
            (chapter_id,)
        )

    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result


def get_exercise_by_id(exercise_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT exercise_id, exercise_number, question_text,
                  question_pattern, solution_steps, frequency_module
           FROM math_exercises
           WHERE exercise_id = %s""",
        (exercise_id,)
    )
    result = cursor.fetchone()

    cursor.close()
    conn.close()
    return result


# ================================================
# SRIJONSHIL
# ================================================
def get_srijonshil(chapter_id: int, source_type: str = None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if source_type:
        cursor.execute(
            """SELECT srijonshil_id, category, uddipok_text, 
                      question_text, solution, board_id, 
                      exam_year, source_name, source_type
               FROM math_srijonshil
               WHERE chapter_id = %s AND source_type = %s
               ORDER BY display_order ASC""",
            (chapter_id, source_type)
        )
    else:
        cursor.execute(
            """SELECT srijonshil_id, category, uddipok_text,
                      question_text, solution, board_id,
                      exam_year, source_name, source_type
               FROM math_srijonshil
               WHERE chapter_id = %s
               ORDER BY source_type ASC, display_order ASC""",
            (chapter_id,)
        )

    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result


# ================================================
# SHORT QUESTIONS
# ================================================
def get_short_questions(chapter_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT short_q_id, question_text, solution
           FROM math_short_questions
           WHERE chapter_id = %s
           ORDER BY created_at ASC""",
        (chapter_id,)
    )
    result = cursor.fetchall()

    cursor.close()
    conn.close()
    return result


# ================================================
# MCQ
# ================================================
def get_board_mcq(chapter_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT mcq_id, question_text, option_a, option_b,
                  option_c, option_d, correct_option,
                  explanation_steps, formula_used,
                  board_id, exam_year
           FROM math_mcq_board
           WHERE chapter_id = %s
           ORDER BY exam_year DESC""",
        (chapter_id,)
    )
    result = cursor.fetchall()

    cursor.close()
    conn.close()
    return result


def get_practice_mcq(chapter_id: int, set_number: int = 1):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """SELECT mcq_id, question_text, option_a, option_b,
                  option_c, option_d, correct_option,
                  explanation_steps, formula_used
           FROM math_mcq_practice
           WHERE chapter_id = %s AND set_number = %s
           ORDER BY display_order ASC""",
        (chapter_id, set_number)
    )
    result = cursor.fetchall()

    cursor.close()
    conn.close()
    return result