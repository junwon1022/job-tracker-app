import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import Login from "./login";
import Register from "./register";
import Setting from "./dropdown/settings";
import Friends from "./dropdown/friends";
import Profile from "./dropdown/profile";
import AvailableJobs from "./availableJob";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dropdown/settings" element={<Setting />} />
        <Route path="/dropdown/friends" element={<Friends />} />
        <Route path="/dropdown/profile" element={<Profile />} />
        <Route path="/available-jobs" element={<AvailableJobs />} />
      </Routes>
    </Router>
  );
}

export default App;
