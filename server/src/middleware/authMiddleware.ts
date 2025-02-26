import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET as string);
        // Attach user info to request object
        req.user = (decoded as {user : {id: string} }).user;
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};