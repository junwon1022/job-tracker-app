import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import "../../styles/dropdown/friends.css";

const Friends = () => {
  /* =============================== State initializations =================================== */
  // Controls which section is displayed
  const [selectedSection, setSelectedSection] = useState("friends"); 

  // User information
  const [username, setUsername] = useState("");
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [friends, setFriends] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [myFriendCode, setMyFriendCode] = useState("");

  // Copy Friend Id to clipboard
  const [copied, setCopied] = useState(false);


  // User ID fetch from localstorage
  const userId = localStorage.getItem("userId");

  /* =============================== Effects =================================== */

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        console.error("No valid userId found in localStorage");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5001/api/auth/users/${storedUserId}`);
        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
        const data = await response.json();
  
        // Set all user state
        setUsername(data.name);
        setMyFriendCode(data.friendCode);
        setFriends(data.friends || []);
        setFriendRequests(data.friendRequests || []);
  
        // Cache it
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);

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
  

  /* ======================================== Methods ============================================== */

  // Retrieve last selected section from localStorage
  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    localStorage.setItem("selectedSection", section); 
  };

  const sendFriendRequest = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/friends/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendCode: friendCodeInput }),
      });

      const data = await res.json();
      console.log("Fetched user data:", data);
      alert(data.msg);
      setFriendCodeInput("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptRequest = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/friends/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requesterCode: code }),
      });

      const data = await res.json();
      alert(data.msg);

      // Update UI
      setFriendRequests(prev => prev.filter(c => c !== code));
      setFriends(prev => [...prev, code]);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/friends/reject-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requesterCode: code }),
      });

      const data = await res.json();
      alert(data.msg);

      // Update UI
      setFriendRequests(prev => prev.filter(c => c !== code));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleCopyFriendCode = () => {
    navigator.clipboard.writeText(myFriendCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  

  return (
  <div>
    <Navbar />
    <div className="friends-page">
      <div className="friends-sidebar">
        <h3>{username}'s Friends</h3>
        <ul className="fade-in">
          <li onClick={() => handleSectionChange("friends")} className={selectedSection === "friends" ? "active" : ""}>
            Friends
          </li>
          <li onClick={() => handleSectionChange("send")} className={selectedSection === "send" ? "active" : ""}>
            Send Friend Requests
          </li>
          <li onClick={() => handleSectionChange("incoming")} className={selectedSection === "incoming" ? "active" : ""}>
            Incoming Friend Requests
          </li>
          <li onClick={() => handleSectionChange("friend-code")} className={selectedSection === "friend-code" ? "active" : ""}>
            Friend Code
          </li>
        </ul>
      </div>

      <div className="friends-container">
        {/* Send Friend Request Section */}
        {selectedSection === "send" && (
          <div className="send-request-section">
            <h2>Send Friend Request</h2>
            <div className="section-divider"></div>
            <input
              type="text"
              placeholder="Enter friend's code"
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value)}
            />
            <button onClick={sendFriendRequest}>Send</button>
          </div>
        )}

        {/* Friend List Section */}
        {selectedSection === "friends" && (
          <div className="friend-list">
            <h2>Friends</h2>
            <div className="section-divider"></div>
            {friends.length === 0 ? (
              <p>No friends yet.</p>
            ) : (
              <ul>
                {friends.map((code, idx) => (
                  <li key={idx}>{code}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Incoming Requests */}
        {selectedSection === "incoming" && (
          <div className="friend-requests">
            <h2>Incoming Friend Requests</h2>
            <div className="section-divider"></div>
            {friendRequests.length === 0 ? (
              <p>No friend requests.</p>
            ) : (
              friendRequests.map((code, idx) => (
                <div key={idx} className="request-item">
                  <span>{code}</span>
                  <button onClick={() => acceptRequest(code)}>Accept</button>
                  <button onClick={() => rejectRequest(code)}>Reject</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Friend Code */}
        {selectedSection === "friend-code" && (
          <div className="friend-code-section">
            <h2>Your Friend Code</h2>
            <div className="section-divider"></div>
            <div className="friend-code-wrapper">
              <p className="friend-code-display">{myFriendCode}</p>
              <button className="copy-button" onClick={handleCopyFriendCode}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};


export default Friends;
