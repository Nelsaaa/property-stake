const emailService = require('../services/emailService');

const sendConfirmationEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const response = await emailService.sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email envoyé avec succès', response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendConfirmationEmail };
