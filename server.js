const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

dotenv.config();

const connectDB = require('./config/db'); // <--- import DB
const app = express();


connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- essentiel pour lire les données de formulaires HTML
app.use(cookieParser());
app.use(methodOverride('_method'));
// CSP avec Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"]
    }
  })
);

// Dossier public (pour CSS, images, etc.)
app.use(express.static('public'));

// Config EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mailer', require('./routes/mailerRoutes'));
app.use('/tickets', require('./routes/ticketRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
