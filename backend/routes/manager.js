// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { protect, managerOnly } = require('../middleware/authMiddleware');
const Post = require('../models/Posts');

// @desc Get all users
// @route GET /api/adminOnly/users
// @access manager only
router.get('/users', protect, managerOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/posts', protect, managerOnly, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Delete a post (manager)
// @route DELETE /api/manager/posts/:id
// @access Manager only
// router.delete('/posts/:id', protect, managerOnly, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate('user', 'role name'); 
    

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     // Check if the author is an admin
//     if (post.user && post.user.role === 'admin') {
//       return res.status(403).json({ message: 'Managers cannot delete admin posts' });
//     }

//     await post.deleteOne();
//     res.json({ message: 'Post deleted successfully' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


module.exports = router;
