const express = require('express');
const router = express.Router();
const { signUp, signIn , sendOtp, verifyOtp, resetPassword} = require('../controllers/userController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/sendotp', sendOtp);
router.put('/newPassword', resetPassword);
router.post('/verifyotp', verifyOtp);
module.exports = router;
