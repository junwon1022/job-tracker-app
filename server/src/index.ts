// Import framework and variables
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import profileRoutes from "./routes/profileRoutes";
import path from "path";

const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config');

// Load environment variables from .env file
dotenv.config();

// Initialize an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Cookie handling
  }));

 // Define the port number (default: 5001)
const PORT = Number(process.env.PORT) || 5001;

// Connect to MongoDB
connectDB();

// API Routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/api/auth', authRoutes); // Authentication API
app.use('/api/jobs', jobRoutes); // Jobs API
app.use('/api/profile', profileRoutes); // Profile API

// Define a basic route to check if the API is running
app.get('/', (req, res) => {
    res.send('Job Tracker API is running...');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
