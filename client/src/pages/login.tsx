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
        // API call to login
        const response = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
            alert(data.msg || "Login failed");
            return;
        }
  
        console.log("Logged in user data:", data);
  
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); 

        // If successful, navigate to dashboard
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
