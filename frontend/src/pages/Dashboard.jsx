import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard(){
    const [resumeCount, setResumeCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [analysisCount, setAnalysisCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        loadDashboardData();
    }, []);

    const loadDashboardData = async()=>{
        try{
            setLoading(true);
            setMessage("");

            const [
                resumesResponse,
                jobsResponse,
                analysesResponse,
                applicationsResponse,
            ] = await Promise.all([
                api.get("/resumes"),
                api.get("/jobs"),
                api.get("/analysis"),
                api.get("/applications"),
            ]);

            setResumeCount(resumesResponse.data.length);
            setJobCount(jobsResponse.data.length);
            setAnalysisCount(analysesResponse.data.length);
            setApplicationCount(applicationsResponse.data.length);
        } catch(error){
            console.error(error);

            setMessage(error.response?.data?.detail || "Failed to load dashboard data.");
        } finally{
            setLoading(false)

        }
    };


    return(
        <div className="page-container">
            <h1>Dashboard</h1>
            <p className="page-description">
                Welcome to your AI-powerd Resume and Job Intelligence Plateform.
            </p>
            {loading && (
                <p>Loading dashboard...</p>
            )}
            {message && (
                <p>{message}</p>
            )}
            {!loading && !message&& (
                <>
                {/* Statistics */}
                <div className="dashboard-statistics">
                    <div className="dashboard-stat-card">
                        <h3>Total Resumes</h3>
                        <div className="dashboard-stat-number">
                            {resumeCount}
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <h3>Job Descriptions</h3>
                        <div className="dashboard-stat-number">
                            {jobCount}
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <h3>AI Analyses</h3>
                        <div className="dashboard-stat-number">
                            {analysisCount}
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <h3>Applications</h3>
                        <div className="dashboard-stat-number">
                            {applicationCount}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="dashboard-actions">
                        <a href="/resume" className="dashboard-action">
                        <h3>Upload Resume</h3>
                        <p>Upload a PDF or DOCX resume for AI analysis.</p>
                        </a>

                        <a href="/job-descriptions" className="dashboard-action">
                        <h3>Add Job Description</h3>
                        <p>Add a job description you want to analyze.</p>
                        </a>

                        <a href="/analysis" className="dashboard-action">
                        <h3>Analyze Resume</h3>
                        <p>Compare your resume with a job description.</p>
                        </a>

                        <a href="/applications" className="dashboard-action">
                        <h3>Track Applications</h3>
                        <p>Manage application status and interview progress.</p>
                        </a>
                    </div>
                </div>

                {/* Platform Flow */}
                <div className="dashboard-section">
                    <h2>How It Works</h2>
                    <div className="platform-flow">
                        <div className="flow-item">
                            <span>1</span>
                            <h3>Upload Resume</h3>
                            <p>Upload your resume and extract its text.</p>
                        </div>
                        <div className="flow-item">
                            <span>2</span>
                            <h3>Add Job</h3>
                            <p>Add the job description you're targeting.</p>
                        </div>
                        <div className="flow-item">
                            <span>3</span>
                            <h3>AI Analysis</h3>
                            <p>Analyze skills, keywords, experrince and gaps.</p>
                        </div>

                        <div className="flow-item">
                            <span>4</span>
                            <h3>Track Application</h3>
                            <p>Track applications from Applied to Selected.</p>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;