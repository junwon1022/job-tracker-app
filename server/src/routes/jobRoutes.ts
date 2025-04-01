import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware";
import Job from "../models/Job";

// Create a new interface extending request to include user
interface AuthenticatedRequest extends Request {
    user?: {id: string};
}

const router = Router();

// Create a New Job (Protected Route)
router.post('/', [
    body('company', 'Company is required').notEmpty(),
    body('position', 'Position is required').notEmpty(),
], async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { company, position } = req.body;

        const newJob = new Job({
            company,
            position
        });

        const job = await newJob.save();
        res.json(job);

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send('Server Error');
    }
});

// Get All Jobs for a User (Protected Route)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await Job.find({ user: req.user?.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send('Server Error');
    }
});

// Update a Job (Protected Route)
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    const { company, position, status } = req.body;

    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ msg: 'Job not found' });
            return;
        }

        job.company = company || job.company;
        job.position = position || job.position;
        job.status = status || job.status;

        await job.save();
        res.json(job);

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send('Server Error');
    }
});

// Delete a Job (Protected Route)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ msg: 'Job not found' });
            return;
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send('Server Error');
    }
});

export default router;
