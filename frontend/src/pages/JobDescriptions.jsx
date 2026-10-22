import {useEffect, useState } from "react";
import api from "../services/api";


function JobDescription(){
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");

    useEffect(()=>{
        loadJobs();
    }, []);

    const loadJobs = async () =>{
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch(error) {
            console.error(error);
            setMessage("Failed to load job descriptions.");
        }
    };

    const handleCreateJob = async () =>{
        if(!title.trim()){
            setMessage("Please enter the job title.");
            return;
        }

        if(!company.trim()){
            setMessage("Please enter the company name.");
            return;
        }

        if(!description.trim()){
            setMessage("Please enter the job description.");
            return;
        }

        try{
            setLoading(true);
            setMessage("");

            await api.post("/jobs", {
                title,
                company,
                description,
                location,
            });
            setTitle("");
            setCompany("");
            setDescription("");
            setLocation("");

            setMessage("Job description added successully.");
            loadJobs();
        } catch(error){
            console.error(error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to create job description."
            );
        } finally{
            setLoading(false);
        }
    };


    return (
        <div className="page-container">
            <h1>Job Descriptions</h1>
            <p className="page-description">
                Add and manage job description for AI resume analysis.
            </p>
            {/* Add Job */}
            <div className="analysis-card">
                <h2>Add Job Description</h2>
                <div className="form-group">
                    <label>Job Title</label>
                    <input 
                      type="text"
                      placeholder="Example: React Developer"
                      value={title}
                      onChange={(event) => 
                        setTitle(event.target.value)
                      } 
                      />
                </div>
                <div className="form-group">
                    <label>Company</label>
                    <input 
                      type="text" 
                      placeholder="Example: ABC Technologies"
                      value={company}
                      onChange={(event) => 
                        setCompany(event.target.value)
                      }
                      />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="Example: Hyderabad"
                      value={location}
                      onChange={(event) =>{
                        setLocation(event.target.value)
                      }}
                    />
                </div>

                <div className="form-group">
                    <label>Job Description</label>
                    <textarea
                      rows="8"
                      placeholder="Paste the complete job description here..."
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                    />
                </div>
                 <button
                   className="primary-button"
                   onClick={handleCreateJob}
                   disabled={loading}
                >
                    {
                        loading
                        ? "Saving..."
                        : "Add Job Description"
                    }
                </button>
                    {
                        message && (
                            <p style={{marginTop: "15px"}}>
                                {message}
                            </p>
                        )
                    }
                
            </div>

            {/* Existing Jobs */}
            <div className="analysis-results">
                <h2>Saved Job Descriptions</h2>
                {
                    jobs.length === 0 ? (
                        <p>No job descriptions available.</p>
                    ) : (
                        jobs.map((job) => (
                            <div className="result-card" key={job.id}>
                                <h3>{job.title}</h3>
                                <p>
                                    <strong>Company:</strong>{" "}
                                    {job.company}
                                </p>

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {job.location || "Not specified"}
                                </p>

                                <p>
                                    {job.description}
                                </p>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default JobDescription;