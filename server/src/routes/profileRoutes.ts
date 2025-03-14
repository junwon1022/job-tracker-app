import express from "express";
import multer from "multer";
import User from "../models/User"; // Import the updated User model
import { Request, Response, Router, RequestHandler } from "express";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to an "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// API Endpoint to Upload Profile Picture
// Define the route with `RequestHandler`
const uploadProfilePic: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }

    // Ensure file is uploaded before accessing filename
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Update the user's profile picture in the database
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: filePath }, { new: true });

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, profilePic: filePath });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading profile picture" });
  }
};

// Use the properly typed function in the router
router.post("/upload-profile-pic", upload.single("file"), uploadProfilePic);

export default router;