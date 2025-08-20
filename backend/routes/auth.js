const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Adjust the path as necessary
const router = express.Router();
const { protect, adminOnly, managerOnly } = require('../middleware/authMiddleware');
const isProduction ="production";

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

        // Set JWT in secure HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send user info (but NOT the token)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'User registered successfully'
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

            // Send token as HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,                       
                secure: isProduction,
                sameSite: "strict",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000               
            });

            // Send user info (without token now!)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: "/",  
        
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// Generate JWT
function generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}


router.get('/admin-data', protect, adminOnly, (req, res) => {
    res.json({ message: 'Welcome Admin!', role: req.user.role });
});
router.get('/manager-data', protect, managerOnly, (req, res) => {
    res.json({ message: 'Welcome manager!', role: req.user.role });
});

router.get("/me", protect, async (req, res) => {

    try {
        res.json({
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            name: req.user.name,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
