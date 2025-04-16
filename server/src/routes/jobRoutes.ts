import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware";
import Job from "../models/Job";

const router = Router();

// POST jobs 
router.post(
  "/",
  body("company").notEmpty(),
  body("position").notEmpty(),
  body("location").notEmpty(),
  body("jobType").notEmpty(),
  body("description").notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { company, position, location, jobType, description } = req.body;
    try {
      const newJob = new Job({
        company,
        position,
        location,
        jobType,
        description,
      });
      await newJob.save();
      res.status(201).json(newJob);
    } catch (err: any) {
      console.error("Error saving job:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// GET all jobs
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE job by ID
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log("Requested delete ID:", id);

  const job = await Job.findById(id);
  if (!job) {
    console.warn("No job found with ID:", id);
  }

  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.status(200).json({ message: "Job deleted successfully", job: deletedJob });
  } catch (err: any) {
    console.error("Error deleting job:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;
