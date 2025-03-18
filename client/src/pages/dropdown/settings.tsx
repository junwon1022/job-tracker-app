import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import "../../styles/dropdown/settings.css";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressHouseNr, setAddressHouseNr] = useState("");
  const [postcode, setPostcode] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [notifications, setNotifications] = useState(false);
  const [theme, setTheme] = useState("light");
  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("userId");

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

      // Reload the page
      window.location.reload();
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

        <label>Birthday:</label>
        <input 
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label>Phone:</label>
        <input
          type="text"
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />

        <label>City:</label>
        <input type="text"
          value={addressCity}
          onChange={(e) => setAddressCity(e.target.value)}
        />

        <label>Street:</label>
        <input
          type="text"
          value={addressStreet}
          onChange={(e) => 
          setAddressStreet(e.target.value)} 
        />

        <label>House Number:</label>
        <input type="text" 
          value={addressHouseNr}
          onChange={(e) => setAddressHouseNr(e.target.value)}
        />

        <label>Postcode:</label>
        <input
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />

        <label>Upload CV:</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setCv(e.target.files?.[0] || null)}
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