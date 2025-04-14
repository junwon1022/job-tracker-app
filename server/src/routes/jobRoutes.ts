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
  body("status").notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { company, position, status } = req.body;
    try {
      const newJob = new Job({
        company,
        position,
        status,
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

// POST /jobs/apply - User applies to a job
router.post("/apply", async (req: Request, res: Response) => {
  const { jobId, userId } = req.body;
  if (!jobId || !userId) {
    res.status(400).json({ message: "Missing jobId or userId" });
    return;
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    if (job.applicants.includes(userId)) {
      res.status(400).json({ message: "User has already applied to this job" });
      return;
    }

    job.applicants.push(userId);
    await job.save();

    res.status(200).json({ message: "Applied successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /jobs/applied - Get user's applied jobs (requires auth)
router.get("/applied", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const jobs = await Job.find({ applicants: userId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
