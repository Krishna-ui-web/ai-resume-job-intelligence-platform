# AI Resume & Job Intelligence Platform

An AI-powered web application that helps job seekers compare resumes with job descriptions, review skill alignment, identify missing keywords, and track job applications.

## Project Overview

The AI Resume & Job Intelligence Platform brings resume management, job-description management, resume analysis, and application tracking together in one web application.

Users can upload resumes, save job descriptions, request an analysis for a selected resume and job, review the returned analysis, and track application statuses.

## Key Features

### Resume Management
- Upload supported resume files (PDF and DOCX, depending on the configured parser).
- Store resume metadata and extracted text.
- View saved resumes and individual resume details.

### Job Description Management
- Create and view job-description records.
- Retrieve an individual job description.
- Select a saved job description for resume analysis.

### Resume Analysis
- Request an analysis for a selected resume and job description.
- Store and retrieve analysis records.
- Display analysis information returned by the backend and AI service integration.

Depending on the analysis service configuration and response, results may include a match score, matched and missing skills, keyword analysis, experience alignment, and improvement suggestions. Actual AI-generated results depend on valid AI-service configuration and availability.

### Job Application Tracking
- Create application records.
- View applications.
- Update application status.
- Filter applications by status where supported by the API.

Statuses used by the application include `Applied`, `Interview`, `Selected`, and `Rejected`.

### Dashboard
- View job-search summary information provided by the backend.
- Navigate to the main application areas.

## Technology Stack

### Frontend
- React
- JavaScript
- Axios
- React Router
- HTML5 and CSS3
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL

### AI and Resume Processing
- OpenAI API integration
- `pypdf` for PDF text extraction
- `python-docx` for DOCX processing

The AI service and resume-processing capabilities depend on the installed dependencies and local environment configuration.

### Development Tools
- Visual Studio Code
- pgAdmin 4
- Git and GitHub
- FastAPI Swagger UI

## Architecture

```text
React Frontend
      |
      | HTTP requests (Axios)
      v
FastAPI Backend
      |
      +--------------------+
      |                    |
      v                    v
SQLAlchemy ORM         AI Service
      |                    |
      v                    v
PostgreSQL             Analysis response
      |
      v
Resumes, job descriptions,
analyses, applications
```

## Project Structure

The structure below is representative. Your local project may contain additional files or use slightly different names.

```text
AI-Resume-Job-Intelligence-Platform/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
├── backend/
│   ├── ai_service.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── resume_parser.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .gitignore
└── README.md
```

## Database

The application uses PostgreSQL to store application data. The main entities include:

- **Resumes:** uploaded resume metadata and extracted text.
- **Job descriptions:** job information used for matching.
- **Analyses:** results associated with a resume and job description.
- **Applications:** job application status, date, notes, and related job information.

The exact columns and relationships are defined in the backend SQLAlchemy models.

## API Endpoints

The following endpoints were checked in the FastAPI Swagger UI during local testing.

### Health
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Home endpoint |
| GET | `/health` | Health check |

### Resumes
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/resumes/upload` | Upload a resume file |
| GET | `/api/resumes` | List resumes |
| POST | `/api/resumes` | Create a resume record |
| GET | `/api/resumes/{resume_id}` | Retrieve a resume |

### Job Descriptions
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/jobs` | List job descriptions |
| POST | `/api/jobs` | Create a job description |
| GET | `/api/jobs/{job_id}` | Retrieve a job description |

### Analysis
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/analysis` | Retrieve analysis records |
| POST | `/api/analyses/{resume_id}/{job_id}` | Create an analysis for a resume and job |

### Applications
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/applications` | Create an application |
| GET | `/api/applications` | List applications |
| GET | `/api/applications?status=Applied` | List applications filtered by status, where supported |
| PATCH | `/api/applications/{application_id}/status` | Update an application's status |

For request schemas and interactive API testing, use the Swagger documentation at `/docs` while the backend is running.

## Local Setup

### Prerequisites
Install:
- Node.js and npm
- Python
- PostgreSQL
- Git

### 1. Clone the Repository

After creating the GitHub repository, replace the placeholder URL with your repository URL:

```bash
git clone https://github.com/Krishna-ui-web/ai-resume-job-intelligence-platform.git
cd ai-resume-job-intelligence-platform
```

### 2. Configure the Backend

Open a terminal in the project root:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure PostgreSQL

1. Start PostgreSQL.
2. Create the database used by your local project.
3. Confirm that the database name, username, password, host, and port match your backend configuration.

Use your **actual local database name**. Do not assume a database name from this README if your project uses a different one.

### 4. Configure Environment Variables

Create `backend/.env` locally if your application expects it. Add the configuration keys required by your code, for example:

```env
DATABASE_URL=postgresql+psycopg://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DATABASE_NAME
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Replace the example values with your own local settings. Use the database URL format and variable names expected by your project. If your code does not use the OpenAI API, do not add that variable unnecessarily.

**Never commit `.env` files, passwords, or API keys to GitHub.**

### 5. Start the Backend

From the `backend` directory, with the virtual environment activated:

```bash
uvicorn main:app --reload
```

Default local URLs:

- API: `http://127.0.0.1:8000`
- Swagger documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

These URLs assume the backend is running on the default local host and port.

### 6. Start the Frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite commonly serves the frontend at `http://localhost:5173`. Use the actual URL printed by the development server if it differs.

Ensure the frontend API base URL is configured to point to your local backend.

## Testing

The following checks were performed locally during project verification:

- Checked the health endpoint.
- Retrieved resume, job-description, analysis, and application records.
- Retrieved individual resume and job-description records.
- Created resume and job-description records.
- Tested resume upload.
- Created an analysis record.
- Created an application and updated an application's status.
- Viewed the database tables and records in pgAdmin.

These checks confirm that the tested API operations responded as expected in the local environment. They do not, by themselves, guarantee that every AI response, security control, or production deployment scenario has been validated.

You can also run a frontend production build:

```bash
cd frontend
npm run build
```

Run backend checks from the `backend` directory using the checks and test tools configured for your project.

## Security and Privacy

Before publishing the repository:

- Keep `.env` files out of Git.
- Never publish database passwords or API keys.
- Keep `venv/`, `node_modules/`, build output, Python cache files, and private uploaded resumes out of Git.
- Treat uploaded resumes as personal information.
- Do not expose private API keys in frontend code or Vite variables such as `VITE_*`; frontend variables can be visible to browser users.
- Review authentication and authorization before using the application with real users or sensitive data.

The login interface should not be considered production-grade authentication unless server-side authentication and authorization are implemented and verified.

## Current Limitations

- The application uses a local development setup unless separately deployed.
- Uploaded resume files are stored locally when configured that way.
- Scanned or image-only PDFs may require OCR support.
- AI analysis depends on correct API configuration, available credits, and service availability.
- Authentication and authorization must be assessed against the actual backend implementation before production use.
- The frontend API URL and database settings may need adjustment for another environment.

## Future Enhancements

- Production-ready authentication and role-based authorization.
- Cloud deployment and managed database hosting.
- OCR support for scanned resumes.
- Multiple resume versions.
- More detailed analysis history and reporting.
- Job-search API integration and job recommendations.
- Email notifications and application reminders.
- Automated tests and CI/CD.

## Skills Demonstrated

- React component development
- REST API integration with Axios
- FastAPI endpoint development
- Python
- SQLAlchemy ORM
- PostgreSQL
- File upload handling
- PDF and DOCX text processing
- AI service integration
- CRUD operations
- API testing with Swagger UI
- Database verification with pgAdmin
- Git and GitHub workflow

## License

This project was created for learning, portfolio, and interview-demonstration purposes. Add a formal license if you intend to distribute or reuse it under specific terms.
