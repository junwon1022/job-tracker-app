// Import framework and variables
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

 // Define the port number (default: 5000)
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes); // ✅ Authentication API
app.use('/api/jobs', jobRoutes); // ✅ Jobs API

// Define a basic route to check if the API is running
app.get('/', (req, res) => {
    res.send('Job Tracker API is running...');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
