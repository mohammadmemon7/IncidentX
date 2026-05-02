const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), async (req, res) => {
  try { res.json(await User.find({}).select('-password')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role || user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("DEBUG: User Update Error:", error);
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID' });
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID' });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
