const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const tokenExpiration = '1h'; // Token expiration time

// Generate a JWT token
const generateToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};

// Verify a JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null; // Token is invalid
    }
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    const user = verifyToken(token);
    if (!user) return res.sendStatus(403); // Forbidden

    req.user = user; // Attach user info to request
    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
};