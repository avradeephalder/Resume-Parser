from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from extract import extract_text_from_pdf
from llm import extract_with_openai

app = FastAPI(title="Resume Parser (OpenAI)")

@app.get("/health")
def health():
    return {"status": "Parser running with OpenAI"}

@app.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume using OpenAI GPT-3.5-turbo"""
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF is supported")

        content = await file.read()
        tmp_path = "tmp_upload.pdf"
        with open(tmp_path, "wb") as f:
            f.write(content)

        text = extract_text_from_pdf(tmp_path)
        if not text or not text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from PDF")

        print(f"[INFO] Extracted {len(text)} characters from PDF")
        print("[INFO] Sending to OpenAI for extraction...")

        result = extract_with_openai(text)
        
        print("[INFO] OpenAI extraction successful")
        return JSONResponse(content=result, status_code=200)
    
    except HTTPException as e:
        return JSONResponse(content={"detail": e.detail}, status_code=e.status_code)
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return JSONResponse(content={"detail": str(e)}, status_code=500)
