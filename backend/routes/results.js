const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

router.get('/current', resultsController.getCurrentResults);
router.get('/voting-status', resultsController.getVotingStatus);

module.exports = router;