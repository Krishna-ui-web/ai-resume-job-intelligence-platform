import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import JobDescription from './pages/JobDescriptions';
import Analysis from './pages/Analysis';
import Applications from './pages/Applications';

import './App.css'

function NotFound(){
  return(
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/dashboard" className='not-found-button'>Go to Dashboard</a>
    </div>
  );
}

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path= "/" element={<Login />} />
      <Route path= "/dashboard" element={<Dashboard />}  />
      <Route path= "/resume" element = {<Resume />} />
      <Route path= "/job-descriptions" element = {<JobDescription />} />
      <Route path = "/analysis" element = {<Analysis />} />
      <Route path = "/applications" element = {<Applications />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    
    </BrowserRouter>
  )
}


export default App;
