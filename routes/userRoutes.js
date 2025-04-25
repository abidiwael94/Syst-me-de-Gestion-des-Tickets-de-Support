const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get('/', auth(['admin']), async (req, res) => {
  try { 
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.post('/', auth(['admin']), async (req, res) => {
  const { name, email, password, role, createdAt } = req.body;
  try {
    const newUser = new User({ name, email, password, role, ...(createdAt && { createdAt }) });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', user: newUser });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur', error: err.message });
  }
});


router.put('/:id', auth(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: err.message });
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
