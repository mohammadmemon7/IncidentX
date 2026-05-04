const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const { getIO } = require('../sockets/server.socket');

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
    try { getIO().to('admin').emit('user:new', user); } catch (e) {}
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
    
    if (!user) {
      return res.status(401).json({ message: 'Email not registered' });
    }

    if (!user.password && user.googleId) {
      return res.status(401).json({ message: 'This account is registered via Google. Please use Google Login.' });
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

        const email = emails?.[0]?.value;
        const profilePic = photos?.[0]?.value;

        if (!email) {
            throw new Error('Google account must have an email associated with it.');
        }

        let user = await User.findOne({ email });
        
        if (!user) {
          user = await User.create({
            name: displayName,
            email: email,
            googleId: id,
            avatar: profilePic,
            role: 'viewer'
          });
          try { getIO().to('admin').emit('user:new', user); } catch (e) {}
        }

        const token = generateToken(user._id);

        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'viewer',
          token
        };

        const encodedUser = encodeURIComponent(JSON.stringify(userData));
        const frontendUrl = process.env.CLIENT_URL || '';
        res.redirect(`${frontendUrl}/login?auth_success=true&user=${encodedUser}`);

    } catch (error) {
        console.error('Google callback error:', error);
        const frontendUrl = process.env.CLIENT_URL || '';
        res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
    }
};
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleCallback
};
