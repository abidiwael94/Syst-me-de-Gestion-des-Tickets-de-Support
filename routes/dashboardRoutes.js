const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Ticket  = require('../models/Ticket');
const auth    = require('../middleware/auth');

router.get('/', auth('admin'), async (req, res) => {
  try {
    const [users, tickets] = await Promise.all([
      User.find(),
      Ticket.find().populate('createdBy assignedTo')
    ]);

    const counts = {
      totalUsers: users.length,
      totalTickets: tickets.length,
      status: {
        open: 0,
        in_progress: 0,
        closed: 0
      }
    };

    tickets.forEach(ticket => {
      if (counts.status[ticket.status] !== undefined) {
        counts.status[ticket.status]++;
      }
    });

    res.render('dashboard', { users, tickets, counts });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
