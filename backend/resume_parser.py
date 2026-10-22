from pathlib import Path
from pypdf import PdfReader
from docx import Document

def extract_text_from_pdf(file_path: Path) -> str:
    """
    Extract text from a PDF resume.
    """
    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages_text.append(text)
    return "\n".join(pages_text).strip()

def extract_text_from_docx(file_path: Path) -> str:
    """
    Extract text from a DOCX resume.
    """

    document = Document(file_path)
    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs).strip()

def extract_resume_text(
        file_path: str,
        file_type: str
) -> str:
    """
    Extract text based on the resume file type.
    """

    extension = Path(file_path).suffix.lower()

    if file_type == "pdf" or extension == ".pdf":

        return extract_text_from_pdf(file_path)

    if file_type == "docx" or extension == ".docx":

        return extract_text_from_docx(file_path)

    raise ValueError(
        "Unsupported resume file type."
        "Only PDF and DOCX are supported."
    )