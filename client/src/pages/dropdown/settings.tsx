import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import "../../styles/dropdown/settings.css";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [theme, setTheme] = useState("light");
  const [_, setStoredName] = useState("");
  
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedUsername) {
      setUsername(storedUsername);
      setStoredName(storedUsername);
    }
    if (storedEmail) setEmail(storedEmail);
  }, []);
  
  const handleSaveSettings = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");

      if (!storedUserId) {
        alert("No user ID found!");
        return;
      }

       // Save new name to the database
      const response = await fetch(`http://localhost:5001/api/auth/users/${storedUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user in backend: ${response.status}`);
      }

      console.log("Backend updated successfully!");


      localStorage.setItem("userName", username);
      localStorage.setItem("userEmail", email);
      
      window.dispatchEvent(new Event("storage"));
      
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings.");
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="settings-container">
        <h2>Account Settings</h2>
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <h3>Preferences</h3>
        <label>
          <input 
            type="checkbox" 
            checked={notifications} 
            onChange={() => setNotifications(!notifications)}
          />
          Enable Notifications
        </label>

        <label>Theme:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button className="save-button" onClick={handleSaveSettings}>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;