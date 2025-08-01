const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const protect = require('../middleware/authMiddleware');

router.get('/candidates', protect(['voter']), voterController.getApprovedCandidates);
router.post('/vote/:candidateId', protect(['voter']), voterController.castVote);

module.exports = router;