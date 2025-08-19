// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const postRoutes=require ('./routes/postRoutes')
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());


// middleware
app.use(cors({
  origin: "http://localhost:5173", // ✅ your frontend URL
  credentials: true,               // ✅ allow cookies to be sent
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
