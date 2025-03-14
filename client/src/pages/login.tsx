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
          const errorData = await response.json();
          alert(errorData.msg || "Login failed");
          return;
        }
    
        const data = await response.json();
        console.log("Login success:", data);
        console.log("User object:", data.user);

        const userId = data.user._id || data.user.id;
        if (!userId) {
          throw new Error("Invalid user data received: Missing user ID");
        }
        // Ensure `userId` is correctly stored in `localStorage`
        if (data.user && data.user.id) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("token", data.token);
        } else {
          throw new Error("Invalid user data received: Missing user ID");
        }
        
        // Navigate to the dashboard
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
