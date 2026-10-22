import { useEffect, useState } from "react";
import api from "../services/api";

function Applications(){
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const totalApplications = applications.length;

    const appliedCount = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const interviewCount = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    const selectedCount = applications.filter(
        (application) => application.status === "Selected"
    ).length;

    const rejectedCount = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    const [selectedJob, setSelectedJob] = useState("");
    const [notes, setNotes] = useState("");

    const [filterStatus, setFilterStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        loadJobs();
        loadApplications();
    }, []);

    const loadJobs = async () =>{
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch(error){
            console.log(error);
            setMessage("Failed to load jobs.");
        }
    };

    const loadApplications = async (status = "")=>{
        try {
            let url = "/applications";
            if(status){
                url = `/applications?status=${status}`;
            }
            const resppnse = await api.get(url);

            setApplications(resppnse.data);
        } catch (error){
            console.error(error);
            setMessage("Failed to load applications.");
        }
    };

    const handleApply = async () =>{
        if(!selectedJob){
            setMessage("Please select a job.");
            return;
        }
        try{
            setLoading(true);
            setMessage("");

            await api.post("/applications", {
                job_description_id: Number(selectedJob),
                status: "Applied",
                notes: notes,
            });

            setSelectedJob("");
            setNotes("");

            setMessage("Job application added successfully.");

            loadApplications(filterStatus);
        } catch(error){
            console.log(error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to add application."
            );
        } finally{
            setLoading(false);
        }
    };

    const handleStatusChange = async(
        applicationId,
        newStatus
    ) => {
        try{
            await api.patch(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus,
                }
            );
            loadApplications(filterStatus);
        } catch(error){
            console.log(error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to update application status."
            );
        }
    };

    const handleFilterChange = (event)=>{
        const status = event.target.value;

        setFilterStatus(status);
        loadApplications(status);
    };

    const getJobDetails = (jobId) =>{
        return jobs.find(
            (job) => job.id === jobId
        );
    };

    return(
        <div className="page-container">
            <h1>Applications</h1>
            <p className="page-description">
                Track and manage your job applications.
            </p>
            {/* Add Application */}
            <div className="analysis-card">
                <h2>Add Job Application</h2>
                <div className="form-group">
                    <label>Select Job</label>
                    <select
                     value={selectedJob}
                     onChange={(event)=>
                        setSelectedJob(event.target.value)
                     }
                    >
                        <option value="">-- Select Job --</option>
                        {jobs.map((job)=>(
                            <option key={job.id} value={job.id}>
                                {job.title} - {job.company}
                            </option>
                        ))}

                    </select>
                </div>
                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      rows="4" 
                      placeholder="Add notes about this application..."
                      value={notes}
                      onChange={(event)=>
                        setNotes(event.target.value)
                      }
                      />
                </div>
                <button 
                  className="primary-button"
                  onClick={handleApply}
                  disabled={loading}
                  >
                    {
                        loading ? "Saving..." : "Add Application"
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

            {/* Application Statitcs */}
            <div className="application-statistics">
                <div className="stat-card">
                    <h3>Total Applications</h3>
                    <div className="stat-number">
                        {totalApplications}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Applied</h3>
                    <div className="stat-number">
                        {appliedCount}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Interviews</h3>
                    <div className="stat-number">
                        {interviewCount}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Selected</h3>
                    <div className="stat-number">
                        {selectedCount}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Rejected</h3>
                    <div className="stat-number">
                        {rejectedCount}
                    </div>
                </div>

            </div>



            {/* Filter */}
            <div className="analysis-card">
                <h2>Application Tracker</h2>
                <div className="form-group">
                    <label>Filter by Status</label>
                    <select
                      value={filterStatus}
                      onChange={handleFilterChange}
                       >
                        <option value="">
                            All Applications
                        </option>
                        <option value="Applied">
                            Applied
                        </option>
                        <option value="Interview">
                            Interview
                        </option>
                        <option value="Selected">
                            Selected
                        </option>
                        <option value="Rejected">
                            Rejected
                        </option>
                       </select>
                </div>
            </div>
            {/* Applications */}
            <div className="analysis-results">
                <h2>My Applications</h2>
                {applications.length === 0 ? (
                    <div className="result-card">
                        <p>
                            No aplications found.
                        </p>
                    </div>
                ) : (
                    applications.map((applications) =>{
                        const job = getJobDetails(
                            applications.job_description_id
                        );

                        return(
                            <div
                              className="result-card"
                              key = {applications.id}
                            >
                                <h3>
                                    {job
                                    ? job.title : `Job #${applications.job_description_id}`}
                                </h3>
                                {
                                    job && (
                                        <p>
                                            <strong>Company:</strong>{" "}
                                            {job.company}
                                        </p>
                                    )
                                }
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span 
                                      className={`application-status ${applications.status.toLowerCase()}`}
                                    >
                                        {applications.status}
                                    </span>
                                    
                                </p>

                                <p>
                                    <strong>Applied Date:</strong>{" "}
                                    {new Date(
                                        applications.applied_date
                                    ).toLocaleDateString()}
                                </p>
                                {
                                    applications.notes && (
                                        <p>
                                            <strong>Notes:</strong>{" "}
                                            {applications.notes}
                                        </p>
                                    )
                                }

                                <div className="form-group">
                                    <label>Update Status</label>
                                    <select
                                      value={applications.status}
                                      onChange={(event)=>
                                        handleStatusChange(
                                            applications.id,
                                            event.target.value
                                        )
                                      }
                                    >
                                        <option value="Applied">
                                            Applied
                                        </option>

                                        <option value="Interview">
                                            Interview
                                        </option>
                                        <option value="Selected">
                                            Selected
                                        </option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>

                                    </select>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Applications;