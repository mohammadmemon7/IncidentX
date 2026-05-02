const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_hackathon', { expiresIn: '30d' });

/**
 * 
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role: 'viewer' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

/**
 * 
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

/**
 * 
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  else res.status(404).json({ message: 'User not found' });
};

const googleCallback = async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;

        const email = emails[0].value;
        const profilePic = photos[0].value;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name: displayName,
                googleId: id,
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token);
        res.redirect('http://localhost:5173/login');

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect('http://localhost:5173/login?error=auth_failed');
    }
};
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleCallback
};
