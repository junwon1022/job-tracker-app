import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed", errorData);
        alert(`Registration failed: ${errorData.msg || "Unknown error"}`);
        return;
      }

      // If successful, the server will typically return a token
      const data = await response.json();
      console.log("User registered:", data);

      // Once registered, redirect to login
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong during registration.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>

        {/* Link to go back to login */}
        <p className="login-text">
            Already have an account? <Link to="/" className="login-link">Login</Link>
        </p>
      </form>

      
    </div>
  );
};

export default Register;