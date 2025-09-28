const express = require('express');
const { signup, signin, signout, sendVerifyOtp, verifyOtp, isAuthenticated, sendResetPasswordOtp, verifyResetPasswordOtp, resetPassword } = require('../controllers/authCtrl');
const { userAuth } = require('../middleware/userAuth');
const { validateRegister, validateLogin, validateSendResetPasswordOtp, validateVerifyResetPasswordOtp, validateResetPasswordWithToken } = require('../middleware/validation');

const router = express.Router();

// Authentication routes
router.post('/register', validateRegister, signup);
router.post('/login', validateLogin, signin);
router.get('/signout', signout);

// Account verification routes
router.post('/send-verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-otp', userAuth, verifyOtp);
router.post('/is-authenticated', userAuth, isAuthenticated);

// Password reset routes (Two-step process)
router.post('/send-reset-password-otp', validateSendResetPasswordOtp, sendResetPasswordOtp);
router.post('/verify-reset-password-otp', validateVerifyResetPasswordOtp, verifyResetPasswordOtp);
router.post('/reset-password', validateResetPasswordWithToken, resetPassword);

module.exports = router;