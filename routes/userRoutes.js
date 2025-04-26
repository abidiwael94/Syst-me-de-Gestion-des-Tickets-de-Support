const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');


router.use(methodOverride('_method'));


const roles = ['user', 'admin'];


router.get('/', auth(['admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/listUsers', { users, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});


router.get('/new', auth(['admin']), (req, res) => {
  res.render('users/new', { user: req.user, roles });
});


router.post('/', auth(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(400).send("Erreur lors de la création de l'utilisateur");
  }
});


router.get('/editUser/:id', auth(['admin']), async (req, res) => {
  try {
    const userToEdit = await User.findById(req.params.id);
    if (!userToEdit) return res.status(404).send('Utilisateur non trouvé');
    res.render('users/editUser', { userToEdit, user: req.user, roles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});


router.post('/editUser/:id', auth(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const updateFields = { name, email, role };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    await User.findByIdAndUpdate(req.params.id, updateFields);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});


router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
});


module.exports = router;
