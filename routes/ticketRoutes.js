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

module.exports = router;
