import { useEffect, useState } from "react";
import api from "../services/api";

function Analysis() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadResumes();
    loadJobs();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await api.get("/resumes");
      setResumes(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load resumes.");
    }
  };

  const loadJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load job descriptions.");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume) {
      setMessage("Please select a resume.");
      return;
    }

    if (!selectedJob) {
      setMessage("Please select a job description.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnalysis(null);

      const response = await api.post(
        `/analyses/${selectedResume}/${selectedJob}`
      );

      setAnalysis(response.data);

      setMessage("AI analysis completed successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail ||
          "AI analysis failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <h1>AI Analysis</h1>

      <p className="page-description">
        Compare your resume with a job description using AI.
      </p>

      {/* Selection Card */}

      <div className="analysis-card">

        <h2>Start Analysis</h2>

        <div className="form-group">

          <label>Select Resume</label>

          <select
            value={selectedResume}
            onChange={(event) =>
              setSelectedResume(event.target.value)
            }
          >
            <option value="">
              -- Select Resume --
            </option>

            {resumes.map((resume) => (
              <option
                key={resume.id}
                value={resume.id}
              >
                {resume.filename}
              </option>
            ))}
          </select>

        </div>

        <div className="form-group">

          <label>Select Job Description</label>

          <select
            value={selectedJob}
            onChange={(event) =>
              setSelectedJob(event.target.value)
            }
          >
            <option value="">
              -- Select Job Description --
            </option>

            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.id}
              >
                {job.title} - {job.company}
              </option>
            ))}
          </select>

        </div>

        <button
          className="primary-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Resume"}
        </button>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}

      </div>

      {/* Analysis Result */}

      {analysis && (

        <div className="analysis-results">

          <h2>Analysis Results</h2>

          {/* Match Score */}

          <div className="result-card">

            <h3>Match Score</h3>

            <div className="match-score">
              {analysis.match_score}%
            </div>

          </div>

          {/* Matched Skills */}

          <div className="result-card">

            <h3>Matched Skills</h3>

            {analysis.matched_skills?.length > 0 ? (

              <ul>
                {analysis.matched_skills.map(
                  (skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No matched skills found.</p>
            )}

          </div>

          {/* Missing Skills */}

          <div className="result-card">

            <h3>Missing Skills</h3>

            {analysis.missing_skills?.length > 0 ? (

              <ul>
                {analysis.missing_skills.map(
                  (skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No major missing skills found.</p>
            )}

          </div>

          {/* Experience Alignment */}

          <div className="result-card">

            <h3>Experience Alignment</h3>

            <p>
              {analysis.experience_alignment ||
                "No experience alignment information available."}
            </p>

          </div>

          {/* Keyword Analysis */}

          <div className="result-card">

            <h3>Keyword Analysis</h3>

            <h4>Matched Keywords</h4>

            {analysis.keyword_analysis
              ?.matched_keywords?.length > 0 ? (

              <ul>
                {analysis.keyword_analysis.matched_keywords.map(
                  (keyword, index) => (
                    <li key={index}>
                      {keyword}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No matched keywords found.</p>
            )}

            <h4>Missing Keywords</h4>

            {analysis.keyword_analysis
              ?.missing_keywords?.length > 0 ? (

              <ul>
                {analysis.keyword_analysis.missing_keywords.map(
                  (keyword, index) => (
                    <li key={index}>
                      {keyword}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No missing keywords found.</p>
            )}

          </div>

          {/* Suggestions */}

          <div className="result-card">

            <h3>Resume Improvement Suggestions</h3>

            {analysis.suggestions?.length > 0 ? (

              <ul>
                {analysis.suggestions.map(
                  (suggestion, index) => (
                    <li key={index}>
                      {suggestion}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No suggestions available.</p>
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Analysis;