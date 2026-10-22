import json
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client  = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def analyze_resume_against_job(
        resume_text: str,
        job_description: str
) -> dict:
    """
    Analyze a resume againsr a job description using the OpenAI Responses API.
    """

    prompt = f"""
You are an technical recruiter and analyzer.
Analyze the candidate resume against the job description.
Return ONLY valid JSON.

The JSON must contain exaclty these fields:

{{
"match_score": 0,
"matched_skills": [],
"missing_skills": [],
"experience_alignment": "",
"keyword_analysis": {{
"matched_keywords": [],
"missing_keywords": []
}},
"suggestions": []
}}

Rules:
1. match_score must be a number from 0 to 100.
2. matched_skills must containe skills that are present in both the resume and job description.
3. missing_skills must contain important job-related skills required ny the job description but not clearly demonstrated in the resume.
4. experience_alignment must explain whether the candidate's demonstrated experience aligns with the job requirements.
5. keyword_analysis must identify important job-description keywords that appear and do not appear in the resume.
6. suggestions must containe practical resume improvement suggestions based only on the provided resume and job description.
7. Do not invent experience, skill, certifications, projects, companies or education.
8. If information is unclear, say that it is unclear.

RESUME:
{
    resume_text
}
JOB DESCRIPTION:
{job_description}
"""

    response = client.responses.create(
        model="gpt-6-luna",
        input=prompt
    )

    output_text = response.output_text.strip()

    try:
        return json.loads(output_text)
    except json.JSONDecodeError:
        raise ValueError(
            "AI returned an invalid JSON response."
        )

