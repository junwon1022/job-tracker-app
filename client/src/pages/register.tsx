import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulating registration (replace with actual API call)
    const user = { name, email, password };
    console.log("User registered:", user);

    // Redirect to login page
    navigate("/");
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