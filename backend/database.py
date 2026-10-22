import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import  DeclarativeBase, sessionmaker

#Load envoronment variabe from .env

load_dotenv()

#get databse URl
DATABASE_URL = os.getenv("DATABASE_URL")

#Check database URL
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from .env")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
    )

#Create database session factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

#Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

#Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
