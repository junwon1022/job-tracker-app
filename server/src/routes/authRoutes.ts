import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User";

const router = express.Router();

// 📌 User Registration
router.post(
    "/register",
    [
        body("name", "Name is required").notEmpty(),
        body("email", "Please enter a valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return; // ✅ Ensure function exits after sending a response
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({ msg: "User already exists" });
                return; // ✅ Ensure function exits
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword });

            await user.save();

            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });

            res.json({ token });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);


export default router;