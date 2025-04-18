import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api"; 
import "../styles/App.css"; 
import Navbar from "./navbar";

interface Job {
  _id: string;
  company: string;
  position: string;
  status: string;
  createdAt: Date;
}

const storedUserId = localStorage.getItem("userId");

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (!token) {
      navigate("/");
    } else {
      if (storedName) {
        setName(storedName);
      }
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.get<Job[]>(`http://localhost:5001/api/jobs/`);

      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Quick stats
  const total = jobs.length;
  const interviews = jobs.filter((job) => job.status === "interview").length;
  const rejections = jobs.filter((job) => job.status === "rejected").length;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <Navbar /> 
      </div>

      {/* Navigate to Available Jobs */}
      <div className="add-job-container">
        <button className="add-job-button" onClick={() => navigate("/available-jobs")}>
          Browse Available Jobs
        </button>
      </div>

      {/* Job stats */}
      <div className="job-stats">
        <h3>Job Application Stats</h3>
        <ul>
          <li><strong>Total Jobs:</strong> {total}</li>
          <li><strong>Interviews Scheduled:</strong> {interviews}</li>
          <li><strong>Rejected:</strong> {rejections}</li>
        </ul>
      </div>


    </div>
  );
};

export default Dashboard;
