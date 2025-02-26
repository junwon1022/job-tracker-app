import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import Login from "./login";
import Register from "./register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
