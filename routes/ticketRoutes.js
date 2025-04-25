const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

router.get('/', auth(), async (req, res) => {
  try {
    console.log("Route /tickets atteinte ✅");
    const tickets = await Ticket.find().populate('createdBy assignedTo');
    res.render('tickets/index', { tickets });
  } catch (err) {
    console.error("Erreur lors de l'affichage des tickets :", err);
    res.status(500).send("Erreur serveur");
  }
});

router.get('/new', auth(), async (req, res) => {
  try {
    const users = await User.find();
    res.render('tickets/new', { users });
  } catch (err) {
    console.error("Erreur lors de l'affichage du formulaire de création :", err);
    res.status(500).send("Erreur serveur");
  }
});

router.post('/', auth(), async (req, res) => {
  try {
    const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
    await ticket.save();
    res.redirect('/tickets');
  } catch (err) {
    console.error("Erreur lors de la création du ticket :", err);
    res.status(500).send("Erreur serveur");
  }
});

router.get('/edit/:id', auth(), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo');
    const users = await User.find();
    const fromDashboard = req.query.fromDashboard === 'true';
    res.render('tickets/edit', { ticket, users, fromDashboard });
  } catch (err) {
    console.error("Erreur lors de l'affichage du formulaire d'édition :", err);
    res.status(500).send("Erreur serveur");
  }
});

router.put('/:id', auth(), async (req, res) => {
  try {
    const oldTicket = await Ticket.findById(req.params.id).populate('assignedTo');
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo');

    const redirectPath = req.body.fromDashboard === 'true' ? '/dashboard' : '/tickets';

    if (oldTicket.status !== updatedTicket.status && updatedTicket.assignedTo?.email) {
      await axios.post(`${req.protocol}://${req.get('host')}/api/mailer/send`, {
        to: updatedTicket.assignedTo.email,
        subject: `Mise à jour du ticket: ${updatedTicket.title}`,
        text: `Bonjour ${updatedTicket.assignedTo.name},\n\nLe ticket "${updatedTicket.title}" est maintenant "${updatedTicket.status}".`
      });
      return res.redirect(`${redirectPath}?emailSent=true`);
    }

    res.redirect(redirectPath);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du ticket :", err);
    res.status(500).send("Erreur serveur");
  }
});

router.delete('/:id', auth(), async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }
    res.json({ message: 'Ticket supprimé avec succès' });
  } catch (err) {
    console.error("Erreur lors de la suppression du ticket :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message }); 
  }
});

module.exports = router;
