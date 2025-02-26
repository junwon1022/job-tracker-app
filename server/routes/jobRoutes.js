const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Job = require('../models/Job');

const router = express.Router();

// 📌 Create a New Job (Protected Route)
router.post('/', authMiddleware, [
    body('company', 'Company is required').notEmpty(),
    body('position', 'Position is required').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { company, position } = req.body;

        const newJob = new Job({
            user: req.user.id, // Extracted from JWT
            company,
            position
        });

        const job = await newJob.save();
        res.json(job);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// 📌 Get All Jobs for a User (Protected Route)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// 📌 Update a Job (Protected Route)
router.put('/:id', authMiddleware, async (req, res) => {
    const { company, position, status } = req.body;

    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check if user owns the job
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        job.company = company || job.company;
        job.position = position || job.position;
        job.status = status || job.status;

        await job.save();
        res.json(job);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// 📌 Delete a Job (Protected Route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check if user owns the job
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
