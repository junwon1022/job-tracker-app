import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css"; 
import userIcon from "../assets/user.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(userIcon);
  const [name, setName] = useState("User");
  const navigate = useNavigate();

  // Load profile pic and user name when component mounts
  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    const storedName = localStorage.getItem("userName");

    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
    if (storedName) {
      setName(storedName);
    }
  }, []);

  // Profile picture resizing function
  const resizeAndStoreImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        const maxWidth = 200; // Set max width (Adjust as needed)
        const maxHeight = 200; // Set max height (Adjust as needed)
        let width = img.width;
        let height = img.height;
  
        // Scale down the image while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
          localStorage.setItem("profilePic", compressedDataUrl);
          setProfilePic(compressedDataUrl);
        }
      };
    };
  };
  

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  
    setProfilePic(userIcon); // Reset profile pic to default
    setName("User"); // Reset name to default
  
    navigate("/");
  };

  // Handle Profile Picture Change
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resizeAndStoreImage(file); // Call the compression function
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
