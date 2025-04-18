const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');


router.post('/', auth(), async (req, res) => {
  const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
  await ticket.save();
  res.status(201).json(ticket);
});


router.get('/', auth(), async (req, res) => {
  const tickets = await Ticket.find().populate('createdBy assignedTo');
  res.json(tickets);
});


router.put('/:id', auth(['admin']), async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
});


router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }
    res.json({ message: 'Ticket supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du ticket', error });
  }
});


module.exports = router;
