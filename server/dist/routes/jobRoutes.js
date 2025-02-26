"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const Job_1 = __importDefault(require("../models/Job"));
const router = (0, express_1.Router)();
// 📌 Create a New Job (Protected Route)
router.post('/', authMiddleware_1.default, [
    (0, express_validator_1.body)('company', 'Company is required').notEmpty(),
    (0, express_validator_1.body)('position', 'Position is required').notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { company, position } = req.body;
        const newJob = new Job_1.default({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            company,
            position
        });
        const job = yield newJob.save();
        res.json(job);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
// 📌 Get All Jobs for a User (Protected Route)
router.get('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jobs = yield Job_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }).sort({ createdAt: -1 });
        res.json(jobs);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
// 📌 Update a Job (Protected Route)
router.put("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { company, position, status } = req.body;
    try {
        let job = yield Job_1.default.findById(req.params.id);
        if (!job) {
            res.status(404).json({ msg: 'Job not found' });
            return;
        }
        // Check if user owns the job
        if (job.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }
        job.company = company || job.company;
        job.position = position || job.position;
        job.status = status || job.status;
        yield job.save();
        res.json(job);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
// 📌 Delete a Job (Protected Route)
router.delete('/:id', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let job = yield Job_1.default.findById(req.params.id);
        if (!job) {
            res.status(404).json({ msg: 'Job not found' });
            return;
        }
        // Check if user owns the job
        if (job.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }
        yield job.deleteOne();
        res.json({ msg: 'Job removed' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
exports.default = router;
