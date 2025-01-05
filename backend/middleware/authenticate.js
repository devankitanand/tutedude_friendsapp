// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     if (!token) return res.status(401).json({ message: 'Authentication error' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = authenticate;

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token is missing or malformed' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Authenticated User:', req.user); // Debug log
        next();
    } catch (error) {
        console.error('Error decoding token:', error); // Debug log
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticate;
