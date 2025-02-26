"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
    // Get the token from the request header
    const token = req.header('Authorization');
    // Check if token exists
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        // Attach user info to request object
        req.user = decoded.user;
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
}
;
