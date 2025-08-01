const Candidate = require('../models/Candidate');

exports.getCandidateProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateCandidateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pitch, tagline } = req.body;

    try {
        let candidate = await Candidate.findById(req.user.id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.pitch = pitch;
        candidate.tagline = tagline;

        await candidate.save();

        res.json({ message: 'Profile updated successfully', candidate });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};