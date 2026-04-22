from docx import Document
from PIL import Image
import pytesseract
import os
from pypdf import PdfReader


# -------------------------
# DOCX
# -------------------------
def extract_docx(path):
    doc = Document(path)
    return "\n".join([p.text for p in doc.paragraphs])


# -------------------------
# IMAGE OCR
# -------------------------
def extract_image(path):
    img = Image.open(path)
    return pytesseract.image_to_string(img)


# -------------------------
# PDF TEXT
# -------------------------
def extract_pdf(path):
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return text


# -------------------------
# ROUTER
# -------------------------
def extract_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()

    if ext == ".docx":
        return extract_docx(path)

    elif ext in [".png", ".jpg", ".jpeg"]:
        return extract_image(path)

    elif ext == ".pdf":
        return extract_pdf(path)

    elif ext == ".txt":
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    else:
        raise ValueError(f"Unsupported file type: {ext}")


# -------------------------
# INGESTION NODE
# -------------------------
def ingestion_node(state):
    file_path = state["file_path"]

    raw_text = extract_text(file_path)

    return {
        **state,
        "raw_text": raw_text
    }