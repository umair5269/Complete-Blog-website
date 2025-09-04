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
// const mongoSanitize = require('express-mongo-sanitize');
const sanitize = require('mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');


const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());

// prevent noSQL injection.. removes $ and . from query
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize({ ...req.query }); // clone to bypass getter-only issue
  if (req.params) req.params = sanitize(req.params);
  next();
});
// app.use(
//   mongoSanitize({
//     onSanitize: ({ key }) => {
//       console.warn(`Sanitized key: ${key}`);
//     },
//     replaceWith: '_' // prevents overwriting req.query
//   })
// );

// setting security headers
app.use(helmet());
// limit quaries from an ip within 15 minutes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})
app.use(limiter)

// prevent param pollution
app.use(hpp()); 




// middleware
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://complete-blog-website-production.up.railway.app",
  "https://complete-blog-website.vercel.app"
], // frontend URL
  credentials: true,               // allow cookies to be sent
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
