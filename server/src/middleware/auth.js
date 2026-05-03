const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_hackathon');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('[Auth] User not found for ID:', decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      console.log('[Auth] Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    console.log('[Auth] No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`[Auth] Role mismatch. Required: ${roles}, Found: ${req.user.role}`);
      return res.status(403).json({ message: `Role ${req.user.role} not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };
