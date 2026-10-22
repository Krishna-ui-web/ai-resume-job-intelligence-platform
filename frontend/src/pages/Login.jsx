import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = (e)=>{
        e.preventDefault();

        if(!email || !password){
            alert("Please enter email and password");
            return;
        }
        navigate("/dashboard");
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Job Intelligence</h1>
                <p className="login-subtitle">
                    Ai Resume & Job Description Analyzer
                </p>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                    <label>Email</label>
                    <input 
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    
                    />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                        type="text"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                         />
                    </div>
                    <button type="submit" className="primary-button">Login</button>
                    
                </form>
            </div>
        </div>
    );
}
export default Login;