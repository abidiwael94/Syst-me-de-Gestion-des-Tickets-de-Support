const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Ticket  = require('../models/Ticket');
const auth    = require('../middleware/auth');

// Dashboard – admin only
router.get('/', auth('admin'), async (req, res) => {
  try {
    // Fetch users and tickets in parallel
    const [users, tickets] = await Promise.all([
      User.find(),
      Ticket.find().populate('createdBy assignedTo')
    ]);

    // Prepare counts
    const counts = {
      totalUsers: users.length,
      totalTickets: tickets.length
    };

    // Render dashboard.ejs
    res.render('dashboard', { users, tickets, counts });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
