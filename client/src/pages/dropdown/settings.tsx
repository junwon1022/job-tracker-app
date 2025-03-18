import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import "../../styles/dropdown/settings.css";

const Settings = () => {
  // Controls which section is displayed
  const [selectedSection, setSelectedSection] = useState("user-info"); 

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
  
  useEffect(() => {
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
  
  const handleSaveSettings = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
  
      if (!storedUserId) {
        alert("No user ID found!");
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
  
      alert("Settings updated successfully!");
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to update settings.");
    }
  };
  
  
  return (
    <div>
      <Navbar />
      <div className="settings-page">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <h3>Settings</h3>
          <ul>
            <li onClick={() => setSelectedSection("user-info")} className={selectedSection === "user-info" ? "active" : ""}>
              User Information
            </li>
            <li onClick={() => setSelectedSection("password")} className={selectedSection === "password" ? "active" : ""}>
              Change Password
            </li>
            <li onClick={() => setSelectedSection("cv-upload")} className={selectedSection === "cv-upload" ? "active" : ""}>
              Upload CV
            </li>
            <li onClick={() => setSelectedSection("preferences")} className={selectedSection === "preferences" ? "active" : ""}>
              Preferences
            </li>
            <li onClick={() => setSelectedSection("delete-account")} className={selectedSection === "delete-account" ? "active" : ""}>
              Delete Account
            </li>
          </ul>
        </div>

        {/* Settings Container */}
        <div className="settings-container">
          {selectedSection === "user-info" && (
            <>
              <h2>User Information</h2>
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>Birthday:</label>
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
            </>
          )}

          {selectedSection === "password" && (
            <>
              <h2>Change Password</h2>
              <label>Current Password:</label>
              <input type="password" placeholder="Enter current password" />

              <label>New Password:</label>
              <input type="password" placeholder="Enter new password" />

              <label>Confirm New Password:</label>
              <input type="password" placeholder="Confirm new password" />
            </>
          )}

          {selectedSection === "cv-upload" && (
            <div className="cv-container">
              <h2>Upload CV</h2>
              <label>Choose File:</label>
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

          {selectedSection === "preferences" && (
            <div className="preferences-container">
              <h2>Preferences</h2>
              <label>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                Enable Notifications
              </label>

              <label>Theme:</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          )}

          {selectedSection === "delete-account" && (
            <div className="delete-account-container">
              <h2>Delete Account</h2>
              <p><strong>Warning:</strong> This action is irreversible. Proceed with caution.</p>
              <button className="delete-button">Delete My Account</button>
            </div>
          )}

          {selectedSection !== "delete-account" && (
            <button className="save-button" onClick={handleSaveSettings}>Save Settings</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;