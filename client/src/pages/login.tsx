  import { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import "../styles/login.css";

  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:5001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          // The server returned an error status (like 400)
          const errorData = await response.json();
          alert(errorData.msg || "Login failed");
          return;
        }
  
        // Login successful; parse the JSON response
        const data = await response.json();
        console.log("Login success:", data);
  
        // data.token will contain the JWT. Store it somewhere (e.g., localStorage).
        localStorage.setItem("token", data.token);
  
        // Now navigate to the dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    };

    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <p className="register-text">
            No account yet? <Link to="/register" className="register-link">Register</Link>
          </p>
        </form>
      </div>
    );
  };

  export default Login;
