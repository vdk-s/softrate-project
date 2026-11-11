const express = require('express');
const router = express.Router();

// In-memory or database newsletter subscriber handler
const subscribers = new Set();

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  subscribers.add(email.toLowerCase().trim());
  res.json({
    message: 'Thank you for subscribing to Softrate Insights!',
    email: email.toLowerCase().trim(),
  });
});

module.exports = router;

