const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.get('/candidates', protect(['admin']), adminController.getAllCandidates);

router.put('/candidates/:id/approve', protect(['admin']), adminController.approveCandidate);

router.post(
    '/set-voting-timings',
    [
        protect(['admin']),
        body('startTime', 'Start time is required').not().isEmpty(),
        body('endTime', 'End time is required').not().isEmpty(),
        body('endTime', 'End time must be after start time').custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startTime)) {
                throw new Error('End time must be after start time');
            }
            return true;
        }),
    ],
    adminController.setVotingTimings
);

router.get('/voting-timings', protect(['admin']), adminController.getVotingTimings);
router.get('/results', protect(['admin']), adminController.getElectionResults);
router.put('/candidates/:id/reject', protect(['admin']), adminController.rejectCandidate);


module.exports = router;