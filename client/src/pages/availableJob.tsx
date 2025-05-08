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

  // Job form opener
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Job page handle
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
 
  useEffect(() => {
    fetchAvailableJobs();
  }, []);


  // Method to fetch the jobs
  const fetchAvailableJobs = async () => {
    try {
      const res = await api.get<Job[]>(`http://localhost:5001/api/jobs/`);
      console.log("Response data:", res.data); 
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  // Method to apply to job
  const handleApply = async (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to apply.");
      return;
    }

    try {
      await api.post(
        "/jobs/apply",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application submitted successfully.");
    } catch (err) {
      console.error("Error applying to job:", err);
      alert("Failed to apply. You might have already applied.");
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

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

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

      {/* Add Job Button */}
      <div className="new-job-form-launch">
        <button className="submit-button" onClick={() => setIsFormOpen(true)}>
          + Add a Job
        </button>
      </div>

      {/* Add Job Modal */}
      {isFormOpen && (
        <div className="add-job-modal-overlay">
          <div className="add-job-modal">
            <h2>Add a New Job</h2>
            <input
              className="form-input"
              placeholder="Company"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Position"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
            />
            <input
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
            <div className="modal-buttons">
              <button
                className="submit-button"
                onClick={async () => {
                  if (!newCompany || !newPosition) {
                    alert("Please fill in required fields.");
                    return;
                  }
                  try {
                    await api.post("/jobs", {
                      company: newCompany,
                      position: newPosition,
                      location: newLocation,
                      jobType: newJobType,
                      description: newDescription,
                    });
                    setIsFormOpen(false);
                    setNewCompany("");
                    setNewPosition("");
                    setNewLocation("");
                    setNewJobType("Full-time");
                    setNewDescription("");
                    fetchAvailableJobs();
                  } catch (err) {
                    console.error("Error adding job:", err);
                    alert("Failed to add job.");
                  }
                }}
              >
                Submit
              </button>
              <button className="cancel-button" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Dropdown */}
      <div className="filter-container">
        <select className="sort-dropdown" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="date">Newest First</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Job Listings */}
      <h2 className="job-list-header">Open Jobs</h2>
      <div className="job-list">
        {currentJobs.length === 0 ? (
          <p>No jobs are open yet!</p>
        ) : (
          currentJobs.map((job) => (
            <div key={job._id} className="job-entry">
              <div className="job-header">
                {job.jobType && <span className="job-tag">{job.jobType}</span>}
                <h3>{job.position}</h3>
                <button
                  className="trash-button"
                  onClick={() => setJobIdToDelete(job._id)}
                >
                  🗑️
                </button>
                <button
                  className="apply-button"
                  onClick={() => handleApply(job._id)}
                >
                  Apply to this job
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Confirm Deletion */}
      {jobIdToDelete && (
        <div className="deletion-confirm-overlay">
          <div className="deletion-confirm-content">
            <p>Are you sure you want to delete this job?</p>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={async () => {
                  await handleDelete(jobIdToDelete);
                  setJobIdToDelete(null);
                }}
              >
                Confirm
              </button>
              <button
                className="cancel-button"
                onClick={() => setJobIdToDelete(null)}
              >
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