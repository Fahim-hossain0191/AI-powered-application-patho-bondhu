import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from config import APP_HOST, APP_PORT, DEBUG
from modules.math.mcq import generate_mcq
from modules.math.answer import check_answer_text, check_answer_image
from modules.math.hint import get_hint
from modules.math.jachai import solve_question, check_solution, check_image

app = FastAPI(
    title="Pathobondhu AI Module",
    description="Pathobondhu platform AI service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Pathobondhu AI Module is running!"}


class MCQRequest(BaseModel):
    chapter_id: int
    count: Optional[int] = 20
    previously_generated: Optional[List[str]] = []


@app.post("/math/mcq/generate")
def mcq_generate(req: MCQRequest):
    try:
        return generate_mcq(
            chapter_id=req.chapter_id,
            count=req.count,
            previously_generated=req.previously_generated,
        )
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


class AnswerTextRequest(BaseModel):
    exercise_id: int
    student_answer: str


class AnswerImageRequest(BaseModel):
    exercise_id: int
    image_base64: str
    image_mime: Optional[str] = "image/jpeg"


@app.post("/math/answer/check-text")
def answer_check_text(req: AnswerTextRequest):
    try:
        return check_answer_text(
            exercise_id=req.exercise_id,
            student_answer=req.student_answer,
        )
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/answer/check-image")
def answer_check_image(req: AnswerImageRequest):
    try:
        return check_answer_image(
            exercise_id=req.exercise_id,
            image_base64=req.image_base64,
            image_mime=req.image_mime,
        )
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


class HintRequest(BaseModel):
    exercise_id: int
    phase: int


@app.post("/math/hint")
def hint(req: HintRequest):
    try:
        return get_hint(exercise_id=req.exercise_id, phase=req.phase)
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


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
    try:
        return solve_question(question=req.question, chapter_id=req.chapter_id)
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/jachai/check")
def jachai_check(req: JachaiCheckRequest):
    try:
        return check_solution(
            question=req.question,
            student_solution=req.student_solution,
            chapter_id=req.chapter_id,
        )
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/jachai/image")
def jachai_image(req: JachaiImageRequest):
    try:
        return check_image(image_base64=req.image_base64, image_mime=req.image_mime)
    except ValueError as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=APP_HOST, port=APP_PORT, reload=DEBUG)
