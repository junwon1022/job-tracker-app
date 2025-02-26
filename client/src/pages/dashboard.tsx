import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";  // Ensure correct API import
import "../styles/App.css"; 

// Define the expected type for your data
interface Job {
  _id: string;
  position: string;
  company: string;
  status: string;
}

const Dashboard = () => {
  // Define correct type
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get<Job[]>("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Job List</h2>
      <ul className="job-list">
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <li key={job._id} className="job-item">
              <h3>{job.position} at {job.company}</h3>
              <p>Status: {job.status}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
