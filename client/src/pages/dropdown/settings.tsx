import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import "../../styles/dropdown/settings.css";
import Modal from "../modal/modal"; 
import userIcon from "../../assets/user.png";

const Settings = () => {

  /* =============================== State initializations =================================== */
  // Controls which section is displayed
  const [selectedSection, setSelectedSection] = useState("user-info"); 

  // State to handle modal visibility
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalCloseAction, setModalCloseAction] = useState<() => void>(() => {});
 
  // User Information States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressHouseNr, setAddressHouseNr] = useState("");
  const [postcode, setPostcode] = useState("");

  // CV Upload State
  const [cv, setCv] = useState<File | null>(null);
  const [uploadedCv, setUploadedCv] = useState<string | null>(null);

  // Preferences States
  const [notifications, setNotifications] = useState(false);
  const [theme, setTheme] = useState("light");

  // User deletion state
  const [password, setPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Profile Picture state
  const [profilePic, setProfilePic] = useState(userIcon);


  /* ======================================= Effects ========================================== */
  useEffect(() => {
    // Restore last selected section
    const savedSection = localStorage.getItem("selectedSection");
    if (savedSection) {
      setSelectedSection(savedSection);
    }
  
    // Restore theme preference
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to light mode
    document.body.setAttribute("data-theme", savedTheme);
  
    // Cleanup: Reset selected section on page exit
    return () => {
      localStorage.removeItem("selectedSection");
    };
  }, []);

  // Change Profile Picture
  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  // Change Profile Picture immediately (wait for update events)
  useEffect(() => {
    const updateProfilePic = () => {
      const storedPic = localStorage.getItem("profilePic");
      if (storedPic) {
        setProfilePic(storedPic);
      }
    };
  
    // Listen for profile pic updates
    window.addEventListener("storage", updateProfilePic);
  
    return () => {
      window.removeEventListener("storage", updateProfilePic);
    };
  }, []);
  
  
  useEffect(() => {
    // Fetching user data
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("userId");
      const cachedUser = localStorage.getItem("userData");

      if (cachedUser) {
        //Show cached user data instantly
        const parsedUser = JSON.parse(cachedUser);
        setUsername(parsedUser.name);
        setEmail(parsedUser.email);
        setBirthday(parsedUser.birthday || "");
        setPhone(parsedUser.phone || "");
        setAddressCity(parsedUser.address?.city || "");
        setAddressStreet(parsedUser.address?.street || "");
        setAddressHouseNr(parsedUser.address?.houseNr || "");
        setPostcode(parsedUser.address?.postcode || "");
        setUploadedCv(parsedUser.cv || null);
      }

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

        setUsername(data.name);
        setEmail(data.email);
        setBirthday(data.birthday || "");
        setPhone(data.phone || "");
        setAddressCity(data.address?.city || "");
        setAddressStreet(data.address?.street || "");
        setAddressHouseNr(data.address?.houseNr || "");
        setPostcode(data.address?.postcode || "");
        setUploadedCv(data.cv || null);

        // Cache the new user data
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  /* ======================================== Methods ============================================== */

  // Retrieve last selected section from localStorage
  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    localStorage.setItem("selectedSection", section); 
  };

  // Show modals
  const showModal = (message: string, closeAction: () => void = () => setModalMessage(null)) => {
    setModalMessage(message);
    setModalCloseAction(() => closeAction);
  };
  
  // Handling Save Button
  const handleSaveSettings = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        showModal("No user ID found!");
        return;
      }
  
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", email);
      formData.append("birthday", birthday);
      formData.append("phone", phone);
      formData.append("address_city", addressCity);
      formData.append("address_street", addressStreet);
      formData.append("address_house_nr", addressHouseNr);
      formData.append("postcode", postcode);
  
      if (cv) {
        console.log("📂 Uploading CV:", cv.name);
        formData.append("cv", cv);
      }
  
      const response = await fetch(`http://localhost:5001/api/auth/users/${storedUserId}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update user in backend: ${response.status}`);
      }
      console.log("Backend updated successfully!");

      // Show modal and reload
      showModal("Settings updated successfully!", () => window.location.reload());

      // Store the selected section before reloading
      localStorage.setItem("selectedSection", selectedSection);

    } catch (error) {
      console.error("Upload error:", error);
      showModal("Failed to update settings.");
    }
  };

  // Handling Delete button
  const handleDeleteAccount = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");

      if(!storedUserId) {
        showModal("No User ID found in localStorage");
        return;
      }

      // Send password confirmation request to backend
      const response = await fetch(`http://localhost:5001/api/auth/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUserId, password }),
      });

      const responseText = await response.text();
      console.log("Password Verification Response:", responseText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Password verification failed");
      }

      // Deletion API
      const deleteResponse = await fetch(`http://localhost:5001/api/auth/users/${storedUserId}`, {
        method: "DELETE",
      });

      const deleteText = await deleteResponse.text();
      console.log("Account Deletion Response:", deleteText);

      if(!deleteResponse.ok) {
        throw new Error("Failed to delete user");
      }

      showModal("Account has been deleted!", () => {
        localStorage.clear();
        window.location.href = "/";
      });
      localStorage.clear();
      
    } catch(error) {
      console.error("User Deletion Fail:", error);
      showModal("Failed to delete user");

    }
  }

  // Handle the theme change (dark, light)
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme); // Apply theme to body
  };

  // Handle the password change
  const handlePasswordChange = async() => {
    setPasswordError("");

    
    if(!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if(newPassword != confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        setPasswordError("No user ID found.");
        return;
      }
  
      // Verify current password
      const verifyResponse = await fetch(`http://localhost:5001/api/auth/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUserId, password: currentPassword }),
      });
  
      if (!verifyResponse.ok) {
        setPasswordError("Current password is incorrect.");
        return;
      }
  
      // Update password if verification succeeds
      const updateResponse = await fetch(`http://localhost:5001/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUserId, currentPassword, newPassword }),
      });
  
      if (!updateResponse.ok) {
        throw new Error("Failed to update password.");
      }

      showModal("Password changed successfully!", () => window.location.reload());

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
  
    } catch (error) {
      setPasswordError("Error changing password. Please try again.");
    }

  }

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
        setProfilePic(newProfilePic);
      }
  
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  
  /* ========================================= HTML ========================================= */
  return (
    <div>
      <Navbar />
      <div className="settings-page">
        {/* Sidebar */}
        <div className="settings-sidebar">

          <h3>Account</h3>
          <ul className="fade-in">
            <li onClick={() => handleSectionChange("user-info")} className={selectedSection === "user-info" ? "active" : ""}>
              User Information
            </li>
            <li onClick={() => handleSectionChange("password")} className={selectedSection === "password" ? "active" : ""}>
              Change Password
            </li>
            <li onClick={() => handleSectionChange("cv-upload")} className={selectedSection === "cv-upload" ? "active" : ""}>
              Upload CV
            </li>
            <li onClick={() => handleSectionChange("preferences")} className={selectedSection === "preferences" ? "active" : ""}>
              Preferences
            </li>
            <li onClick={() => handleSectionChange("delete-account")} className={selectedSection === "delete-account" ? "active" : ""}>
              Delete Account
            </li>
          </ul>
        </div>

        {/* Settings Container */}
        <div className="settings-container">
          {selectedSection === "user-info" && (
            <div className="user-info-layout">

              <div className="user-profile-pic-box">
              <label>Profile Picture</label>
                <label htmlFor="profile-upload" className="profile-pic-label">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="user-profile-pic" />
                  ) : (
                    <div className="user-profile-placeholder">+</div>
                  )}
                  <span className="profile-tooltip">Click to change picture</span>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="user-info-fields">
                <h2>User Information</h2>
                <div className="section-divider-full"></div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label>Email:</label>
                <input type="email" value={email} disabled className="disabled-input" />

                <label>Date of Birth:</label>
                <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />

                <label>Phone:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

                <label>City:</label>
                <input type="text" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} />

                <label>Street:</label>
                <input type="text" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} />

                <label>House Number:</label>
                <input type="text" value={addressHouseNr} onChange={(e) => setAddressHouseNr(e.target.value)} />

                <label>Postcode:</label>
                <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </div>
          </div>
        )}

          {/* Password change Container */}
          {selectedSection === "password" && (
            <>
              <h2>Change Password</h2>
              <div className="section-divider"></div>
              {passwordError && <p className="error-message">{passwordError}</p>}

              <label>Current Password:</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
              />  

              <label>New Password:</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Confirm New Password:</label>
              <input
                type="password"
                placeholder="Enter Confirm password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="save-button" onClick={handlePasswordChange}>Change Password</button>
            </>
          )}

          {/* CV Upload Container */}
          {selectedSection === "cv-upload" && (
            <div className="cv-container">
              <h2>Upload CV</h2>
              <div className="section-divider"></div>
              {/* <label>Choose File:</label> */}
              <input type="file" accept=".pdf,.docx" onChange={(e) => setCv(e.target.files?.[0] || null)} />

              {uploadedCv && (
                <p>
                  Current CV:&nbsp;
                  <a href={`http://localhost:5001${uploadedCv}`} target="_blank" rel="noopener noreferrer">
                    {decodeURIComponent(uploadedCv.split("/").pop()?.replace(/^\d+-/, "") || "View CV")}
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Preferences Container */}
          {selectedSection === "preferences" && (
            <div className="preferences-container">
              <h2>Preferences</h2>
              <div className="section-divider"></div>
              <label>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                Enable Notifications
              </label>

              <label>Theme:</label>
                <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
            </div>
          )}

          {/* Account Deletion Container */}
          {selectedSection === "delete-account" && (
            <div className="delete-account-container">
              <h2>Delete Account</h2>
              <div className="section-divider"></div>
              <p><strong>Warning:</strong> This action is irreversible. Proceed with caution.</p>
              <button className="delete-button" onClick={() => setDeleteConfirm(true)}>Delete My Account</button>
            </div>
          )}

          {/* Delete Account Confirmation Modal */}
          {deleteConfirm && (
            <div className="deletion-confirm-overlay">
              <div className="deletion-confirm-content">
                <h2>Confirm Account Deletion</h2>
                <p>Please enter your password to confirm account deletion.</p>
                
                {/* Password Input Field */}
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="modal-buttons">
                  <button className="confirm-button" onClick={handleDeleteAccount}>
                    Confirm Delete
                  </button>
                  <button className="cancel-button" onClick={() => setDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedSection !== "delete-account" && 
          selectedSection !== "preferences" && 
          selectedSection !== "password" && (
            <button className="save-button" onClick={handleSaveSettings}>Save Settings</button>
            
          )}

          {/* Show the modal when settings are updated */}
          {modalMessage && <Modal message={modalMessage} onClose={modalCloseAction} />}
        </div>
      </div>
    </div>
  );
};

export default Settings;