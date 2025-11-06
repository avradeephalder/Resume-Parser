import fitz  # PyMuPDF

def extract_text_from_pdf(path: str) -> str:
    """Extract text from PDF using PyMuPDF"""
    with fitz.open(path) as doc:
        return "\n\f".join(page.get_text() for page in doc)
