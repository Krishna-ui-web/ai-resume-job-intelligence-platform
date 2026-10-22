from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

#==============================================================
#RESUME SCHEMAS
#==========================================================
class ResumeCreate(BaseModel):
    filename: str = Field(
        min_length=1,
        max_length=255,
    )

    file_type: Literal["pdf", "docx", "txt"]

class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_path: str | None
    extracted_text: str | None
    uploaded_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )    

#==============================================================
#JOB DESCRIPTION SCHEMAS
#==========================================================
class JobDescriptionCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150
    )

    company: str = Field(
        min_length=1,
        max_length=150
    )

    description: str = Field(
        min_length=1
    )

    location: str | None = Field(
        default=None,
        max_length=150
    )

class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    company: str
    description: str
    location: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )  

#==============================================================
#ANALYSIS SCHEMA
#==========================================================
class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_description_id: int
    match_score: float | None
    matched_skills: list | None
    missing_skills: list | None
    keyword_analysis: dict | None
    experience_alignment: str | None
    suggestions: list | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

#============================================================
#APPLICATION SCHEMAS
#========================================================== 
class ApplicationCreate(BaseModel):
    job_description_id: int
    status: str = "Applied"

    applied_date: datetime | None = None
    notes: str | None = None

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationResponse(BaseModel):
    id: int
    job_description_id: int
    status: str
    applied_date: datetime
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )        


       

