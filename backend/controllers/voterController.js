const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');
const Admin = require('../models/Admin'); // To get voting timings

exports.getApprovedCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: true }).select('-password'); // Don't send passwords
        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.castVote = async (req, res) => {
    try {
        const voterId = req.user.id; 
        const candidateId = req.params.candidateId;

        const voter = await Voter.findById(voterId);
        if (!voter) {
            return res.status(404).json({ message: 'Voter not found' });
        }
        if (voter.hasVoted) {
            return res.status(400).json({ message: 'You have already cast your vote.' });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate || !candidate.isApproved) {
            return res.status(404).json({ message: 'Candidate not found or not approved.' });
        }

        // Check voting timings
        const adminSettings = await Admin.findOne().select('votingStartTime votingEndTime');
        const now = new Date();

        if (!adminSettings || !adminSettings.votingStartTime || !adminSettings.votingEndTime) {
            return res.status(400).json({ message: 'Voting timings have not been set by the admin.' });
        }

        if (now < adminSettings.votingStartTime) {
            return res.status(400).json({ message: `Voting has not started yet. It begins on ${adminSettings.votingStartTime.toLocaleString()}.` });
        }
        if (now > adminSettings.votingEndTime) {
            return res.status(400).json({ message: `Voting has ended. It closed on ${adminSettings.votingEndTime.toLocaleString()}.` });
        }
        candidate.votes += 1;
        voter.hasVoted = true;
        voter.votedCandidate = candidate._id;

        await candidate.save();
        await voter.save();

        res.json({ message: 'Vote cast successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};