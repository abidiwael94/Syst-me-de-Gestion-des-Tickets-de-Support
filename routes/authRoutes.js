const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('auth/register', { message: null });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: null });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { message: "Un utilisateur avec cet email existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.redirect('/auth/login');
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    res.render('auth/register', { message: "Erreur lors de l'inscription." });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('auth/login', { message: 'Email ou mot de passe invalide.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error("Erreur serveur lors de la connexion :", err);
    res.render('auth/login', { message: 'Erreur serveur.' });
  }
});

// Déconnexion (facultatif)
router.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/auth/login');
});

module.exports = router;
