import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User"; // Import the User model

const router = express.Router();

// Define the directory where profile pictures will be stored
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Ensure "uploads" folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
  console.log("📂 Created 'uploads' folder");
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// API Endpoint to Upload Profile Picture
router.post("/upload-profile-pic", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    // Validate that a user ID is provided
    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }

    // Ensure a file was uploaded
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const filePath = `/uploads/${req.file.filename}`; // Path to store

    // Update user in the database
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
});
export default router;