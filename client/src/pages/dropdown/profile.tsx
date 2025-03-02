import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";  // Ensure correct API import
import "../../styles/dropdown/profile.css"
import userIcon from "../../assets/user.png";

// Define the expected type for your data
interface Job {
  _id: string;
  position: string;
  company: string;
  status: string;
}


const Profile = () => {
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
  
  // Handles logout
  const handleLogout = () => {
    // Remove authentication data from localStorage (or wherever you store it)
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    // Redirect to the login page
    navigate("/../");
  };

  // Handles profile picture change
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfilePic(reader.result);
          localStorage.setItem("profilePic", reader.result);
        }
      };
  
      reader.readAsDataURL(file);
    }
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
          <button className="main-button" onClick={() => navigate("../dashboard")}>Job Tracker</button>
        </div>
        {/* The navigation bar on the right side (contains user info dropdown)*/}
        <div className="navbar-right">
          {/* Profile Picture */}
          <label htmlFor="profile-upload" className="user-icon-container">
        <img src={profilePic} alt="User Icon" className="user-icon" />
      </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
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
    </div>
  );
};

export default Profile;