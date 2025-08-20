const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to req (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted');
    return  next();
  } else {
    return  res.status(403).json({ message: 'Admin access required' });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    console.log('Manager access granted');
    return  next();
  } else {
   return  res.status(403).json({ message: 'Manager access required' });
  }
};

module.exports = { protect, adminOnly, managerOnly };
