const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const protect = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.get('/me', protect(['candidate']), candidateController.getCandidateProfile);
router.put(
    '/me',
    [
        protect(['candidate']),
        body('pitch', 'Pitch is required').not().isEmpty(),
        body('tagline', 'Tagline is required').not().isEmpty(),
    ],
    candidateController.updateCandidateProfile
);


module.exports = router;