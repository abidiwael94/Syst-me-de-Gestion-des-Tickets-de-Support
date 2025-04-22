const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: `"System de gestion tickets de Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail envoyé avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email :', err);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
});

module.exports = router;
