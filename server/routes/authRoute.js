const express = require('express');
const { signup } = require('../controllers/authCtrl');
const { signin } = require('../controllers/authCtrl');
const { signout } = require('../controllers/authCtrl');
const {sendVerifyOtp} = require('../controllers/authCtrl');
const {verifyOtp} = require('../controllers/authCtrl');
const { isAuthenticated } = require('../controllers/authCtrl');
const { sendResetPasswordOtp } = require('../controllers/authCtrl');
const { resetPassword } = require('../controllers/authCtrl');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

router.post('/register', signup);
router.post('/login', signin);
router.get('/signout',signout );
router.post('/send-verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-otp', userAuth, verifyOtp);
router.post('/is-authenticated', userAuth, isAuthenticated);
router.post('/send-reset-password-otp', sendResetPasswordOtp);
router.post('/reset-password', resetPassword);


module.exports = router;