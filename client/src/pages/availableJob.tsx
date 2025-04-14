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

  return (
    <div className="dashboard-container">
      <Navbar />
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
