const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/voter/register', authController.registerVoter);
router.post('/voter/login', authController.loginVoter);
router.post('/candidate/register', authController.registerCandidate);
router.post('/candidate/login', authController.loginCandidate);
router.post('/admin/login', authController.loginAdmin);
router.get('/me', protect(), authController.getMe);

module.exports = router;