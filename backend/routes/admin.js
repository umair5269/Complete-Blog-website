// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Post = require('../models/Posts');

// @desc Get all users
// @route GET /api/adminOnly/users
// @access adminOnly only
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }) // exclude admin
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent an admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && req.user.role === 'admin' && role !== 'admin') {
      return res.status(403).json({ message: 'You cannot remove your own admin role' });
    }

    // Enforce max 4 managers rule
    if (role === 'manager' && user.role !== 'manager') {
      const managerCount = await User.countDocuments({ role: 'manager' });
      if (managerCount >= 4) {
        return res.status(400).json({ message: 'Only 4 managers are allowed. Remove one before adding a new manager.' });
      }
    }

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
;


// @desc Delete user
// @route DELETE /api/adminOnly/users/:id
// @access adminOnly only
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/posts', protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Delete a post (admin)
// @route DELETE /api/admin/posts/:id
// @access Admin only
router.delete('/posts/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
