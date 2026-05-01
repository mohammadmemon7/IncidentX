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
    user.role = req.body.role || user.role;
    await user.save();
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
