"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import framework and variables
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config');
// Load environment variables from .env file
dotenv.config();
// Initialize an Express application
const app = (0, express_1.default)();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
app.use(cors());
// Define the port number (default: 5001)
const PORT = Number(process.env.PORT) || 5001;
// Connect to MongoDB
connectDB();
// API Routes
app.use('/api/auth', authRoutes_1.default); // ✅ Authentication API
app.use('/api/jobs', jobRoutes_1.default); // ✅ Jobs API
// Define a basic route to check if the API is running
app.get('/', (req, res) => {
    res.send('Job Tracker API is running...');
});
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
