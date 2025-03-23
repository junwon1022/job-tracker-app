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
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("userId");
      const cachedName = localStorage.getItem("userName");
      const cachedProfilePic = localStorage.getItem("profilePic");

      if (cachedName) setName(cachedName);
      if (cachedProfilePic) setProfilePic(cachedProfilePic);
  
      if (!storedUserId) {
        console.error("No valid userId found in localStorage");
        return;
      }
  
      try {
        console.log(`Fetching user data from: http://localhost:5001/api/auth/users/${storedUserId}`);
  
        const response = await fetch(`http://localhost:5001/api/auth/users/${storedUserId}`);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched user data:", data);
  
        setName(data.name);
        setProfilePic(data.profilePic ? `http://localhost:5001${data.profilePic}` : userIcon);

        localStorage.setItem("userName", data.name);
        localStorage.setItem("profilePic", data.profilePic ? `http://localhost:5001${data.profilePic}` : userIcon);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();

    // Listen for localStorage updates (triggered from settings page)
    const handleStorageChange = () => {
      setName(localStorage.getItem("userName") || "User");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
  
        const maxWidth = 200;
        const maxHeight = 200;
        let width = img.width;
        let height = img.height;
  
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
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
  
          // Store image with the username as a key
          const storedUserId = localStorage.getItem("userId");
          if (storedUserId) {
              localStorage.setItem(`profilePic_${storedUserId}`, compressedDataUrl);
              setProfilePic(compressedDataUrl);
          }
        }
      };
    };
  };
  
  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Handle Profile Picture Change
  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("No valid userId found");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", storedUserId); 
  
    try {
      const response = await fetch("http://localhost:5001/api/profile/upload-profile-pic", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.profilePic) {
        const newProfilePic = `http://localhost:5001${data.profilePic}`;
        localStorage.setItem("profilePic", newProfilePic);
        window.dispatchEvent(new Event("storage"));
        setProfilePic(newProfilePic); // Update UI immediately
      }
  
    } catch (error) {
      console.error("Error uploading profile picture:", error);
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
              <button className="dropdown-item" onClick={() => navigate("/dropdown/settings")}>Account</button>
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
