import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api"; 
import "../styles/App.css"; 
import Navbar from "./navbar";

// Define the expected type for your data
interface Job {
  _id: String;
  company: string;
  position: string;
  status: string;
  createdAt: Date;
}

const Dashboard = () => {
  // Define correct type
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (!token) {
      navigate("/");
    } else {
      if (storedUserId) {
        setName(storedUserId);
      } 
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

  // Sort jobs based on sortOrder
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "alpha") {
      return a.position.localeCompare(b.position);
    }
    return 0;
  });

  return (
    <div className="dashboard-container">

      {/* The navigation bar */}
      <div className="navbar">
        <Navbar /> 
      </div>

      {/* Add job button */}
      <div className="add-job-container">
        <button className="add-job-button">+ Add Job</button>
      </div>

      {/* Job form */}
      <div className="job-form">
        <input type="text" placeholder="Job Title" />
        <input type="text" placeholder="Company" />
        <select>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="save-job-button">Save</button>
      </div>

      {/* Job stats */}
      <div className="job-stats">
        <h3>Job Application Stats</h3>
        <ul>
          <li><strong>Total Jobs:</strong> 0</li>
          <li><strong>Interviews Scheduled:</strong> 0</li>
          <li><strong>Rejected:</strong> 0</li>
        </ul>
      </div>

      {/* Filter container */}
      <div className="filter-container">
        <button className="filter-button">All</button>
        <button className="filter-button">Applied</button>
        <button className="filter-button">Interview</button>
        <button className="filter-button">Rejected</button>

        {/* Sorting the jobs */}
        <select className="sort-dropdown" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="date">Newest First</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>
      
      
      <h2 className="job-list-header">Job List</h2>
      <div className="job-list">
        <p>No jobs found. Start tracking your applications!</p>
        <button className="add-job-button">+ Add Your First Job</button>
      </div>
    </div>
  );
};

export default Dashboard;
