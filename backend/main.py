from ai_service import analyze_resume_against_job
import os
import shutil
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import (
    Depends,
    FastAPI,
    File,
    HTTPException, 
    Query,
    UploadFile
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import (
    Base,
    engine,
    get_db,
)

from resume_parser import extract_resume_text

from schemas import (
    AnalysisResponse,
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
    JobDescriptionCreate,
    JobDescriptionResponse,
    ResumeResponse,
    ResumeCreate,
)
#==============================================================
#DATABASE STARTUP
#==========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

#==============================================================
#FASTAPI APPLICATION SETUP
#==========================================================

app = FastAPI(
    title="Job Intelligence API",
    description="Backend for AI Resume and Job Description Analyer",
    version="1.0.0",
    lifespan=lifespan
)


UPLOAD_DIR = Path("upload/resumes")
UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)
#==============================================================
#CORS MIDDLEWARE
#==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173 "],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#==============================================================
#HOME ROUTE
#==========================================================

@app.get("/")
def home():
    return {"message": "Job Intelligence API is running."}


#==============================================================
#HEALTH CHECK ROUTE
#==========================================================
@app.get("/health")
def health_check():
    return {"status": "healthy"}

#==============================================================
#ADD UPLOAD ENDPOINT
#==========================================================
@app.post(
        "/api/resumes/upload",
        response_model=ResumeResponse,
        status_code=201
)

def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    allowed_extensions = {
        ".pdf",
        ".docx"
    }

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX are supported."
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required."
        )

    safe_filename = Path(
        file.filename
    ).name

    file_path = (
        UPLOAD_DIR / safe_filename
    )

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:
        extracted_text = extract_resume_text(
            str(file_path),
            extension.replace(".", "")
        )

    except Exception as error:
        if file_path.exists():
            file_path.unlink()

            raise HTTPException(
                status_code=400,
                detail=f"Resume text extraction failed: {error}"
            )

    if not extracted_text.strip():
        if file_path.exists():
            file_path.unlink()

            raise HTTPException(
                status_code=400,
                detail="No readable text was found in the resume."
            )

    resume = models.Resume(
        filename=safe_filename,
        file_type=extension.replace(".", ""),
        file_path=str(file_path),
        extracted_text=extracted_text
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume               

#==============================================================
#CREATE RESUME
#==========================================================
@app.post(
    "/api/resumes", 
    response_model=ResumeResponse,
    status_code=201
)
def create_resume(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db)
):
    resume = models.Resume(
        filename=resume_data.filename,
        file_type=resume_data.file_type
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

#=======================================================
# GET ALL RESUMES
#========================================================
@app.get(
    "/api/resumes",
    response_model=list[ResumeResponse]
)
def get_resumes(
    db: Session = Depends(get_db)
):
    statement = select(models.Resume).order_by(models.Resume.id.desc())

    return db.scalars(statement).all()


#=======================================================
# GET SINGLE RESUME
#========================================================
@app.get(
    "/api/resumes/{resume_id}",
    response_model=ResumeResponse
)

def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    resume = db.get(models.Resume, resume_id)
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


#=======================================================
# CREATE JOB DESCRIPTION
#========================================================
@app.post(
    "/api/jobs",
    response_model=JobDescriptionResponse,
    status_code=201
)
def create_job(
    job_data: JobDescriptionCreate,
    db: Session = Depends(get_db)
):
    job = models.JobDescription(
        title=job_data.title,
        company=job_data.company,
        description=job_data.description,
        location=job_data.location
    )

    db.add(job)
    db.commit()
    db.refresh(job)
    return job


#=======================================================
# GET ALL JOB DESCRIPTIONS
#========================================================
@app.get(
    "/api/jobs",
    response_model=list[JobDescriptionResponse]
)
def get_jobs(
    db: Session = Depends(get_db)
):
    statement = select(
        models.JobDescription
    ).order_by(
        models.JobDescription.id.desc()
    )

    return db.scalars(
        statement
    ).all()

#=======================================================
# GET SINGLE JOB DESCRIPTION
#========================================================
@app.get(
    "/api/jobs/{job_id}",
    response_model=JobDescriptionResponse
)

def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.get(
        models.JobDescription,
        job_id
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job description not found"
        )
    return job

#=======================================================
# GET ANALYSIS
#========================================================
@app.get(
    "/api/analysis",
    response_model=list[AnalysisResponse]
)
def get_analyses(
    db: Session = Depends(get_db)
):
    statement = select(
        models.Analysis
    ).order_by(
        models.Analysis.id.desc()
    )

    return db.scalars(
        statement
    ).all()



#=======================================================
# ADD AI ANALYSIS ENDPOINT
#========================================================
@app.post(
    "/api/analyses/{resume_id}/{job_id}",
    response_model=AnalysisResponse,
    status_code=201
)
def create_analysis(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    resume = db.get(
        models.Resume,
        resume_id
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    job = db.get(
        models.JobDescription,
        job_id
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job descripton not found"
        )

    if not resume.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="Resume text has not been extracted."
        )

    try:
        ai_result = analyze_resume_against_job(
            resume.extracted_text,
            job.description
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {error}"
        )

    analysis = models.Analysis(
        resume_id=resume_id,
        job_description_id=job_id,
        match_score=ai_result.get(
            "match_score"
        ),
        matched_skills=ai_result.get(
            "matched_skills"
        ),
        missing_skills=ai_result.get(
            "missing_skills"
        ),
        keyword_analysis=ai_result.get(
            "keyword_analysis"
        ),
        experience_alignment=ai_result.get(
            "experience_alignment"
        ),
        suggestions=ai_result.get(
            "suggestions"
        )
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis    

#=======================================================
# CRAETE APPLICATION
#========================================================
@app.post(
    "/api/applications",
    response_model=ApplicationResponse,
    status_code=201
)

def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
):
    job = db.get(
        models.JobDescription,
        application_data.job_description_id
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job description not found"
        )

    application = models.Application(
        job_description_id=application_data.job_description_id,
        status=application_data.status,
        applied_date=application_data.applied_date,
        notes=application_data.notes
    )

    db.add(application)
    db.commit()
    db.refresh(application)
    return application

#=======================================================
# GET APPLICATIONS
#========================================================
@app.get(
    "/api/applications",
    response_model=list[ApplicationResponse]
)
def get_applications(
    status: str | None = Query(
        default=None
        
    ),
    db: Session = Depends(get_db)
):
    statement = select(
        models.Application
    )
    if status is not None:
        allowed_statuses = {
            "Applied", 
            "Interview", 
            "Rejected", 
            "Selected"
        }

        if status not in allowed_statuses:
            raise HTTPException(
                status_code=422,
                detail="Invalid application status"
            )
        statement = statement.where(
            models.Application.status == status
        )

        statement = statement.order_by(
            models.Application.id.desc()
        )

    return db.scalars(statement).all()


# ==========================================
# UPDATE APPLICATION STATUS
# ========================================== 
@app.patch(
    "/api/applications/{application_id}/status",
    response_model=ApplicationResponse
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db)
):
    application = db.get(
        models.Application,
        application_id
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    application.status = status_data.status
    db.commit()
    db.refresh(application)
    return application
