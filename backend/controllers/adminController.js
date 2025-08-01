const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');
const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}).sort({ registeredAt: -1 });
        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.approveCandidate = async (req, res) => {
    try {
        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.isApproved = true;
        candidate.isRejected = false;
        await candidate.save();

        res.json({ message: 'Candidate approved successfully', candidate });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.setVotingTimings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { startTime, endTime } = req.body;

    try {
        let adminSettings = await Admin.findOne(); // Finds the first admin

        if (!adminSettings) {
            return res.status(404).json({ message: 'Admin settings not found. Please ensure admin user exists.' });
        }

        adminSettings.votingStartTime = new Date(startTime);
        adminSettings.votingEndTime = new Date(endTime);

        await adminSettings.save();

        res.json({ message: 'Voting timings set successfully', adminSettings });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getVotingTimings = async (req, res) => {
    try {
        // Retrieve timings from the Admin model or a dedicated settings model
        const adminSettings = await Admin.findOne().select('votingStartTime votingEndTime');

        if (!adminSettings) {
            return res.status(404).json({ message: 'Voting timings not set yet.' });
        }

        res.json(adminSettings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getElectionResults = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: true })
                                          .select('name candidateId tagline votes')
                                          .sort({ votes: -1 }); 

        const adminSettings = await Admin.findOne().select('votingEndTime');
        const now = new Date();
        const votingEnded = adminSettings && adminSettings.votingEndTime && now > adminSettings.votingEndTime;

        res.json({ candidates, votingEnded });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.rejectCandidate = async (req, res) => {
    try {
        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Set isRejected to true and isApproved to false
        candidate.isRejected = true;
        candidate.isApproved = false;
        await candidate.save();

        res.json({ message: 'Candidate rejected successfully', candidate });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};