import { useState } from "react";
import api from "../services/api";



function Resume(){
    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) =>{
        setFile(event.target.files[0]);
        setMessage("");
    };

    const handleUpload = async () =>{
        if (!file) {
            setMessage("Please select a resume first.");
            return;

        }

    const formData = new FormData();
    formData.append("file", file);
    
    try {
        setLoading(true);
        setMessage("");

        const response = await api.post(
            "/resumes/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                
                },
                
            }
        );
        setResume(response.data);
        setMessage(
            "Resume uploaded and text extracted successfully."
        );
    } catch (error) {
        console.log(error);

        setMessage(
            error.response?.data?.detail || "Resume upload failed."
        );
    } finally{
        setLoading(false);
    }

        
   };

   return (
    <div className="page-container">
        <h1>Resume</h1>
        <p className="page-description">
            Upload your resume for AI-powered analysis.
        </p>
        <div className="resume-upload-card">
            <h2>Upload Resume</h2>
            <input 
              type="file"
              accept=".pdf, .docx"
              onChange={handleFileChange}
              
              />

            <button 
             className="primary-button"
             onClick={handleUpload}
             disabled={loading}
             >
                {loading
                ? "Uploading..." : "Upload Resume"
                }
            </button>
            {message &&(
                <p style={{marginTop: "15px"}}>
                    {message}
                </p>
            )}
            {resume && (
                <div style={{marginTop: "25px"}}>
                    <h3>Upload Resume</h3>
                    <p>
                        <strong>File:</strong>{" "}
                        {resume.filename}
                    </p>
                    <p>
                        <strong>Type:</strong>{" "}
                        {resume.file_type}
                    </p>

                    <p>
                        <strong>Extracted Characters:</strong>{" "}
                        {resume.extracted_text?.length || 0}
                    </p>

                </div>
            )}  
        </div>

    </div>
   );
}

export default Resume;