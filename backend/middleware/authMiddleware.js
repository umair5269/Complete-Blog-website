const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted');
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    console.log('Manager access granted');
    next();
  } else {
    res.status(403).json({ message: 'Manager access required' });
  }
};

module.exports = { protect, adminOnly, managerOnly };
