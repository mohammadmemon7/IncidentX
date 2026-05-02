const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/auth');
const { registerUser, loginUser, getUserProfile, googleCallback } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login', 
}), googleCallback);

module.exports = router;