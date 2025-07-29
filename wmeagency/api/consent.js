const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

router.post('/', async (req, res) => {
  try {
    const { userId, consent } = req.body;
    await client.hSet('user_consents', userId, JSON.stringify(consent));
    res.json({ status: 'Consent saved' });
  } catch (error) {
    console.error('Consent error:', error);
    res.status(500).json({ error: 'Failed to save consent' });
  }
});

// Mimic Complianz API
router.get('/v1/consent', async (req, res) => {
  try {
    const userId = req.query.user;
    const consent = await client.hGet('user_consents', userId);
    res.json(JSON.parse(consent || '{}'));
  } catch (error) {
    console.error('Consent fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch consent' });
  }
});

module.exports = router;