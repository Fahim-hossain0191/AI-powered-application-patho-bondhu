from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
<<<<<<< HEAD
=======
import traceback
>>>>>>> origin/main

from config import APP_HOST, APP_PORT, DEBUG
from modules.math.mcq import generate_mcq
from modules.math.answer import check_answer_text, check_answer_image
from modules.math.hint import get_hint
from modules.math.jachai import solve_question, check_solution, check_image

app = FastAPI(
    title="পাঠবন্ধু AI Module",
    description="পাঠবন্ধু প্ল্যাটফর্মের AI সার্ভিস",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================================
# Health Check
# ================================================
@app.get("/")
def root():
    return {"message": "পাঠবন্ধু AI Module চলছে!"}


# ================================================
# MCQ Routes
# ================================================
class MCQRequest(BaseModel):
    chapter_id: int
    count: Optional[int] = 20
    previously_generated: Optional[List[str]] = []


@app.post("/math/mcq/generate")
def mcq_generate(req: MCQRequest):
    try:
        result = generate_mcq(
            chapter_id=req.chapter_id,
            count=req.count,
            previously_generated=req.previously_generated
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# Answer Check Routes
# ================================================
class AnswerTextRequest(BaseModel):
    exercise_id: int
    student_answer: str


class AnswerImageRequest(BaseModel):
    exercise_id: int
    image_base64: str
    image_mime: Optional[str] = "image/jpeg"


@app.post("/math/answer/check-text")
def answer_check_text(req: AnswerTextRequest):
    """
    Exercise এ student টাইপ করে answer দিলে।
    সঠিক → feedback + points
    ভুল  → feedback + কোথায় ভুল + full solution
    """
    try:
        result = check_answer_text(
            exercise_id=req.exercise_id,
            student_answer=req.student_answer
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/answer/check-image")
def answer_check_image(req: AnswerImageRequest):
    """
    Exercise এ student ছবি তুলে answer দিলে।
    Gemini ছবি থেকে হাতের লেখা পড়বে + check করবে।
    সঠিক → feedback + points
    ভুল  → feedback + কোথায় ভুল + full solution
    """
    try:
        result = check_answer_image(
            exercise_id=req.exercise_id,
            image_base64=req.image_base64,
            image_mime=req.image_mime
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# Hint Routes
# ================================================
class HintRequest(BaseModel):
    exercise_id: int   # কোন exercise এর hint
    phase: int         # 1 থেকে 5


@app.post("/math/hint")
def hint(req: HintRequest):
    """
    Student hint চাইলে।
    Phase 1 → চিন্তার দিক, কোনো সূত্র না
    Phase 2 → কোন approach, কোন সূত্র
    Phase 3 → প্রথম step হাতে ধরে
    Phase 4 → প্রায় সব, শেষটুকু বাকি
    Phase 5 → সম্পূর্ণ solution + explanation
    Pattern অনুযায়ী tutor style বদলাবে।
    """
    try:
        result = get_hint(
            exercise_id=req.exercise_id,
            phase=req.phase
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# যাচাই Routes
# ================================================
class JachaiSolveRequest(BaseModel):
    question: str
    chapter_id: Optional[int] = None


class JachaiCheckRequest(BaseModel):
    question: str
    student_solution: str
    chapter_id: Optional[int] = None


class JachaiImageRequest(BaseModel):
    image_base64: str
    image_mime: Optional[str] = "image/jpeg"


@app.post("/math/jachai/solve")
def jachai_solve(req: JachaiSolveRequest):
    """Student যেকোনো math প্রশ্ন দিলে Gemini solve করবে।"""
    try:
        result = solve_question(
            question=req.question,
            chapter_id=req.chapter_id
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/jachai/check")
def jachai_check(req: JachaiCheckRequest):
    """
    Student প্রশ্ন + নিজের solution দিলে।
    সঠিক → শুধু feedback
    ভুল  → feedback + full solution
    """
    try:
        result = check_solution(
            question=req.question,
            student_solution=req.student_solution,
            chapter_id=req.chapter_id
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/jachai/image")
def jachai_image(req: JachaiImageRequest):
    """
    Student ছবি দিলে।
    শুধু প্রশ্ন → solve করবে
    প্রশ্ন + solution → check করবে
    """
    try:
        result = check_image(
            image_base64=req.image_base64,
            image_mime=req.image_mime
        )
        return result
    except ValueError as e:
<<<<<<< HEAD
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
=======
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
>>>>>>> origin/main
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# Run
# ================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=APP_HOST, port=APP_PORT, reload=DEBUG)