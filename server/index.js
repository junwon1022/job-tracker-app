const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Job Tracker API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const connectDB = require('./config');

dotenv.config();
connectDB();