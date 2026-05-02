const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try { res.json(await User.find({}).select('-password')); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
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
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID' });
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};
