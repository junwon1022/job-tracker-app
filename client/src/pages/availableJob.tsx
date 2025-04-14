// src/components/AvailableJobs.tsx
import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "./navbar";

interface Job {
  _id: string;
  company: string;
  position: string;
  createdAt: Date;
}


const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const userId = localStorage.getItem("userId");
  
  const [newCompany, setNewCompany] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newStatus, setNewStatus] = useState("");
 
  useEffect(() => {
    const fetchAvailableJobs = async () => {
        try {
          console.log("Fetching available jobs..."); 
          const res = await api.get<Job[]>("/api/jobs");
          console.log("Response data:", res.data); 
          setJobs(res.data);
        } catch (err) {
          console.error("Error fetching jobs", err);
        }
      };
    fetchAvailableJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      await api.post("/api/jobs/apply", { jobId, userId });
      alert("Applied successfully!");
    } catch (err) {
      console.error("Error applying to job", err);
      alert("Failed to apply.");
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.get<Job[]>(`http://localhost:5001/api/jobs/`);

      // const res = await api.get<Job[]>("/jobs/applied", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

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
              await api.post(`http://localhost:5001/api/jobs/`, {
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
              fetchJobs();
            } catch (err) {
              console.error("Error adding job:", err);
              alert("Failed to add job");
            }
          }}
        >
          Add Job
        </button>
      </div>


      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job._id} className="job-list">
          <h3>{job.position}</h3>
          <p>{job.company}</p>
          <p>Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
          <button className="save-job-button" onClick={() => handleApply(job._id)}>
            Apply
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableJobs;
