const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin');
require('dotenv').config();

const protect = (roles = []) => async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        let user;
        switch (req.user.role) {
            case 'voter':
                user = await Voter.findById(req.user.id).select('-password');
                break;
            case 'candidate':
                user = await Candidate.findById(req.user.id).select('-password');
                break;
            case 'admin':
                user = await Admin.findById(req.user.id).select('-password');
                break;
            default:
                return res.status(401).json({ message: 'Invalid token role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: You do not have the required role.' });
        }

        req.userObject = user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = protect;