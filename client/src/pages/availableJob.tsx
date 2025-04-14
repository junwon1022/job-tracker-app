import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "./navbar";

interface Job {
  _id: string;
  company: string;
  position: string;
  status: string;
  createdAt: Date;
}

const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const userId = localStorage.getItem("userId");

  // Const for ordering the jobs
  const [sortOrder, setSortOrder] = useState("date");
  
  // Fields for Job
  const [newCompany, setNewCompany] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
 
  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      console.log("Fetching available jobs..."); 
      const res = await api.get<Job[]>(`http://localhost:5001/api/jobs/`);
      console.log("Response data:", res.data); 
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

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
      <Navbar />

      {/* Add New Job */}
      <div className="new-job-form">
        <h3>Add a Job</h3>
        <input
          type="text"
          placeholder="Company"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Position"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
        />
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
        
        <button
          onClick={async () => {
            if (!newCompany || !newPosition) return alert("Please fill in both fields");
            try {
              await api.post<Job[]>(`http://localhost:5001/api/jobs/`, {
                company: newCompany,
                position: newPosition,
                status: newStatus,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              setNewCompany("");
              setNewPosition("");
              setNewStatus("");
              fetchAvailableJobs();
            } catch (err) {
              console.error("Error adding job:", err);
              alert("Failed to add job");
            }
          }}
        >
          Add Job
        </button>
      </div>

      {/* Filter & Sort */}
      <div className="filter-container">
        <select className="sort-dropdown" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="date">Newest First</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Job List */}
      <h2 className="job-list-header">Your Applications</h2>
      <div className="job-list">
        {sortedJobs.length === 0 ? (
          <p>No applications yet. Go apply to some jobs!</p>
        ) : (
          sortedJobs.map((job) => (
            <div key={job._id} className="job-entry">
              <h3>{job.position}</h3>
              <p>{job.company}</p>
              <p>Status: <strong>{job.status}</strong></p>
              <p>Applied: {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableJobs;
