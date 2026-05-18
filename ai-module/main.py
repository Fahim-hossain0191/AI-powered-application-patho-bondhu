from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from config import APP_HOST, APP_PORT, DEBUG
from modules.math.mcq import generate_mcq
from modules.math.answer import check_answer_text, check_answer_image

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
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# Answer Check Routes
# ================================================
class AnswerTextRequest(BaseModel):
    exercise_id: int       # কোন exercise এর answer check করবো
    student_answer: str    # student যা টাইপ করে লিখেছে


class AnswerImageRequest(BaseModel):
    exercise_id: int                          # কোন exercise
    image_base64: str                         # ছবির base64 string
    image_mime: Optional[str] = "image/jpeg"  # image/jpeg বা image/png


@app.post("/math/answer/check-text")
def answer_check_text(req: AnswerTextRequest):
    """
    Student টাইপ করে answer দিলে।
    সঠিক হলে → শুধু feedback + points
    ভুল হলে  → feedback + কোথায় ভুল + full solution
    """
    try:
        result = check_answer_text(
            exercise_id=req.exercise_id,
            student_answer=req.student_answer
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/math/answer/check-image")
def answer_check_image(req: AnswerImageRequest):
    """
    Student ছবি তুলে answer দিলে।
    Gemini ছবি থেকে হাতের লেখা পড়বে + check করবে।
    সঠিক হলে → শুধু feedback + points
    ভুল হলে  → feedback + কোথায় ভুল + full solution
    
    """
    try:
        result = check_answer_image(
            exercise_id=req.exercise_id,
            image_base64=req.image_base64,
            image_mime=req.image_mime
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ================================================
# Run
# ================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=APP_HOST, port=APP_PORT, reload=DEBUG)