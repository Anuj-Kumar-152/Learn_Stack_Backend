const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/refresh', authController.refreshToken);
router.get('/me', protect, authController.getCurrentUser);

router.put('/toggle-mfa', protect, authController.toggleMFA);

module.exports = router;