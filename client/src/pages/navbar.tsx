import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css"; 
import userIcon from "../assets/user.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || userIcon);
  const [name, setName] = useState(localStorage.getItem("userName") || "User");
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Handle Profile Picture Change
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

  return (
    <div className="navbar">
      {/* Left Side - Logo Button */}
      <div className="navbar-left">
        <button className="main-button" onClick={() => navigate("/dashboard")}>Job Tracker</button>
      </div>

      {/* Right Side - User Profile & Dropdown */}
      <div className="navbar-right">
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
          <p className="name" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {name} ▼
          </p>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate("/dropdown/profile")}>Profile</button>
              <button className="dropdown-item" onClick={() => navigate("/dropdown/settings")}>Settings</button>
              <button className="dropdown-item" onClick={() => navigate("/dropdown/friends")}>Friends</button>
              <hr />
              <button className="dropdown-item logout" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
