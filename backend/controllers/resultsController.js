const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin'); // To get voting timings

exports.getCurrentResults = async (req, res) => {
    try {
        const candidates = await Candidate.find({ isApproved: true })
                                          .select('name candidateId tagline votes')
                                          .sort({ votes: -1 }); // Sort by votes in descending order

        // Get voting end time from Admin settings
        const adminSettings = await Admin.findOne().select('votingEndTime');
        const now = new Date();
        const votingEnded = adminSettings && adminSettings.votingEndTime && now > adminSettings.votingEndTime;

        res.json({ candidates, votingEnded });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getVotingStatus = async (req, res) => {
    try {
        const adminSettings = await Admin.findOne().select('votingStartTime votingEndTime');

        if (!adminSettings) {
            return res.json({
                status: 'not_set',
                message: 'Voting timings have not been set by the admin yet.',
                votingStartTime: null,
                votingEndTime: null
            });
        }

        const now = new Date();
        const startTime = adminSettings.votingStartTime;
        const endTime = adminSettings.votingEndTime;

        let status = '';
        let message = '';

        if (!startTime || !endTime) {
            status = 'not_set';
            message = 'Voting timings have not been set.';
        } else if (now < startTime) {
            status = 'not_started';
            message = `Voting has not started yet. It begins on ${startTime.toLocaleString()}.`;
        } else if (now > endTime) {
            status = 'closed';
            message = `Voting has ended. It closed on ${endTime.toLocaleString()}.`;
        } else {
            status = 'open';
            message = 'Voting is currently open!';
        }

        res.json({
            status,
            message,
            votingStartTime: startTime,
            votingEndTime: endTime,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};