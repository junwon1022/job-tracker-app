import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";  // Ensure correct API import
import "../styles/App.css"; 
import userIcon from "../assets/user.png";

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
  const [name, setName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || userIcon); 
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date");
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
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
  });


  const handleLogout = () => {
    // Remove authentication data from localStorage (or wherever you store it)
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    // Redirect to the login page
    navigate("/");
  };

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

      {/* The navigation bar */}
      <div className="navbar">
        <div className="navbar-left">
          <h2 className="app-title">Job Tracker</h2>
        </div>

        {/* The navigation bar on the right side (contains user info dropdown)*/}
        <div className="navbar-right">
          <label htmlFor="profile-upload" className="user-icon-container">
            <img src={profilePic} alt="User Icon" className="user-icon" />
          </label>
          <div className="user-dropdown">
            {/* Displays user name*/}
            <p className="name" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {name} ▼
            </p>
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => navigate("../dropdown/profile")}>Profile</button>
                <button className="dropdown-item" onClick={() => navigate("../dropdown/settings")}> Settings </button>
                <button className="dropdown-item" onClick={() => navigate("../dropdown/friends")}>Friends</button>
                <hr />
                {/* Logout button*/}
                <button className="dropdown-item logout" onClick={handleLogout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
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
