import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware";
import Job from "../models/Job";

const router = Router();


export default router;
