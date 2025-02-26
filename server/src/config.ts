// Import Mongoose for MongoDB connection
import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from .env file
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Export the function so that it could be used in other files
module.exports = connectDB;
