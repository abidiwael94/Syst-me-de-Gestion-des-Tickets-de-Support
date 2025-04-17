  const express = require('express');
  const router = express.Router();
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');


  router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
      res.status(201).json({ message: 'User ok' });
    } catch (err) {
      console.log("Erreur lors de l'enregistrement :", err);
      res.status(500).json({ message: 'server nok' });
    }
  });


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'user nok' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'server nok' });
  }
});

module.exports = router;
