// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const postRoutes=require ('./routes/postRoutes')
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const helmet =require('helmet');
const sanitizeHtml= require('sanitize-html');

const app = express();

app.use(helmet());

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);

// basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Optional: sanitize HTML input on specific routes
app.post('/comments', (req, res) => {
  const cleanComment = sanitizeHtml(req.body.comment, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: { 'a': ['href'] }
  });

  // save cleanComment to DB...
  res.json({ message: 'Comment saved!', comment: cleanComment });
});

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
