import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "./navbar";
import "../styles/availableJob.css";
import Modal from "./modal/modal"; 

interface Job {
  _id: string;
  company: string;
  position: string;
  createdAt: Date;
  location?: string;
  jobType?: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  description?: string;
}


const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const userId = localStorage.getItem("userId");

  // State to handle modal visibility
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalCloseAction, setModalCloseAction] = useState<() => void>(() => {});

  //Job Id to delete
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);

  // Const for ordering the jobs
  const [sortOrder, setSortOrder] = useState("date");
  
  // Form fields
  const [newCompany, setNewCompany] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newJobType, setNewJobType] = useState<Job["jobType"]>("Full-time");
  const [newDescription, setNewDescription] = useState("");
 
  useEffect(() => {
    fetchAvailableJobs();
  }, []);


  // Method to fetch the jobs
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
  

  //  Method to sort the jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "alpha") {
      return a.position.localeCompare(b.position);
    }
    return 0;
  });

  // Deleting a job by id
  const handleDelete = async (jobId: string) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      alert("Job deleted successfully.");
      fetchAvailableJobs(); // Refresh the list
    } catch (err) {
      console.error("Error deleting job", err);
        alert("Failed to delete job.");
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
          className="form-input"
          placeholder="Company"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Position"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <select
          value={newJobType}
          className="form-select"
          onChange={(e) => setNewJobType(e.target.value as Job["jobType"])}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
        <textarea
          className="form-input"
          placeholder="Job Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={4}
        />
        
        <button
          className="submit-button"
          onClick={async () => {
            if (!newCompany || !newPosition) return alert("Please fill in both fields");
            try {
              await api.post<Job[]>(`http://localhost:5001/api/jobs/`, {
                company: newCompany,
                position: newPosition,
                location: newLocation,
                jobType: newJobType,
                description: newDescription,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              // Reset fields
              setNewCompany("");
              setNewPosition("");
              setNewLocation("");
              setNewJobType("Full-time");
              setNewDescription("");
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
      <h2 className="job-list-header">Open Jobs</h2>
      <div className="job-list">
        {sortedJobs.length === 0 ? (
          <p>No jobs are open yet!</p>
        ) : (
          sortedJobs.map((job) => (
            <div key={job._id} className="job-entry">
              <div className="job-header">
                {job.jobType && <span className="job-tag">{job.jobType}</span>}
                <h3>{job.position}</h3>
                <button
                  className="trash-button"
                  onClick={() => setJobIdToDelete(job._id)}
                  title="Delete job"
                >
                  🗑️
                </button>
              </div>

              <p><strong>🏢 Company:</strong> {job.company}</p>
              {job.location && <p><strong>📍 Location:</strong> {job.location}</p>}
              <p><strong>🕒 Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
              {job.description && <p>{job.description.slice(0, 100)}...</p>}
            </div>
          ))
        )}
      </div>

      {jobIdToDelete && (
        <div className="deletion-confirm-overlay">
          <div className="deletion-confirm-content">
            <p>Are you sure you want to delete this job?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={async () => {
                await handleDelete(jobIdToDelete);
                  setJobIdToDelete(null);
                }}>
                Confirm
              </button>
              <button className="cancel-button" onClick={() => setJobIdToDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default AvailableJobs;
