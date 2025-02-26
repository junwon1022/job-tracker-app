import { useState, useEffect } from "react";
import { api } from "../api/api";  // Ensure correct API import

// Define the expected type for your data
interface Job {
  _id: string;
  position: string;
  company: string;
  status: string;
}

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);  // Define correct type

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get<Job[]>("/jobs");  // Specify type here
        setJobs(res.data);  // TypeScript now knows res.data is Job[]
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            {job.position} at {job.company} - Status: {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
