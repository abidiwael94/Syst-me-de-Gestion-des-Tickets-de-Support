// server.js
const express        = require("express");
const dotenv         = require("dotenv");
const path           = require("path");
const cookieParser   = require('cookie-parser');
const methodOverride = require('method-override');

// Load .env
dotenv.config();
// Connect DB (assumes ./config/db.js exports a function)
require('./config/db')();

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Static & view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make `user` available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// === MOUNT ROUTES ===
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/auth',      require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/tickets',   require('./routes/ticketRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
