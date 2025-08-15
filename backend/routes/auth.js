const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Adjust the path as necessary
const router = express.Router();
const { protect, adminOnly, managerOnly } = require('../middleware/authMiddleware');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

         const user = await User.create({
      name,
      email,
      password,
      role: role || undefined 
    });
    const token = generateToken(user._id, user.role);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
             token,
            message: 'User registered successfully, please log in.'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    } 
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await user.matchPassword(password)) {
            const token = generateToken(user._id, user.role);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate JWT
function generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

router.get('/admin-data', protect, adminOnly, (req, res) => {
    res.json({ message: 'Welcome admin!' });
});
router.get('/manager-data', protect, managerOnly, (req, res) => {
    res.json({ message: 'Welcome manager!' });
});

module.exports = router;
