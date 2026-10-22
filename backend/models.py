from datetime import datetime, timezone
from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
)

from sqlalchemy.orm import Mapped, mapped_column
from database import Base


def utc_now():
    return datetime.now(timezone.utc)


#==============================================================
#RESUME TABLE
#==========================================================

class Resume(Base):
    __tablename__ = "resumes"
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    file_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    file_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

#==============================================================
#JOB DESCRIPTION TABLE
#==========================================================
class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )
    company: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

#==============================================================
#ANALYSIS TABLE
#==========================================================
class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    resume_id: Mapped[int] = mapped_column(
        ForeignKey(
            "resumes.id",
            ondelete="CASCADE"
            ),
        nullable=False
    )

    job_description_id: Mapped[int] = mapped_column(
        ForeignKey(
            "job_descriptions.id",
            ondelete="CASCADE"
            ),
        nullable=False
    )

    match_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    matched_skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    missing_skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    keyword_analysis: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    experience_alignment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    suggestions: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

#==============================================================
#APPLICATION TABLE
#==========================================================

class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    job_description_id: Mapped[int] = mapped_column(
        ForeignKey(
            "job_descriptions.id",
            
        ),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Applied"
        
    )

    applied_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )




