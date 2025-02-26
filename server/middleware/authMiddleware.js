const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded.user;
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};
