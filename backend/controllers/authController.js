const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin');
require('dotenv').config();

const generateToken = (id, role) => {
    return jwt.sign({ user: { id, role } }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

exports.registerVoter = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let voter = await Voter.findOne({ email });
        if (voter) {
            return res.status(400).json({ message: 'Voter with this email already exists' });
        }

        const voterId = 'VTR-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        voter = new Voter({
            voterId,
            name,
            email,
            password,
        });

        await voter.save();

        const token = generateToken(voter.id, 'voter');

        res.status(201).json({
            message: 'Voter registered successfully',
            voterId: voter.voterId,
            token,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.loginVoter = async (req, res) => {
    const { voterId, password } = req.body;
    try {
        let voter = await Voter.findOne({ voterId });
        if (!voter) {
            return res.status(400).json({ message: 'Invalid Voter ID or password' });
        }

        const isMatch = await voter.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Voter ID or password' });
        }

        const token = generateToken(voter.id, 'voter');

        res.json({ message: 'Logged in successfully', token, voterId: voter.voterId });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.registerCandidate = async (req, res) => {
    const { name, email, password, pitch, tagline } = req.body;
    try {
        let candidate = await Candidate.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: 'Candidate with this email already exists' });
        }

        const candidateId = 'CND-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        candidate = new Candidate({
            candidateId,
            name,
            email,
            password,
            pitch,
            tagline,
            isApproved: false, 
        });

        await candidate.save();

        const token = generateToken(candidate.id, 'candidate');

        res.status(201).json({
            message: 'Candidate registered successfully. Awaiting admin approval.',
            candidateId: candidate.candidateId,
            token,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.loginCandidate = async (req, res) => {
    const { candidateId, password } = req.body;
    try {
        let candidate = await Candidate.findOne({ candidateId });
        if (!candidate) {
            return res.status(400).json({ message: 'Invalid Candidate ID or password' });
        }

        const isMatch = await candidate.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Candidate ID or password' });
        }

        if (!candidate.isApproved) {
            return res.status(403).json({ message: 'Your candidate profile is pending admin approval.' });
        }

        const token = generateToken(candidate.id, 'candidate');

        res.json({ message: 'Logged in successfully', token, candidateId: candidate.candidateId });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            console.log('No admin found, creating default admin...');
            admin = new Admin({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD, 
            });
            await admin.save();
            console.log('Default admin created. Use credentials from .env file.');
        }

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Admin credentials' });
        }

        const token = generateToken(admin.id, 'admin');

        res.json({ message: 'Logged in successfully', token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMe = async (req, res) => {
    try {
        res.json(req.userObject);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};