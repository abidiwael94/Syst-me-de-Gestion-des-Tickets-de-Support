const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
