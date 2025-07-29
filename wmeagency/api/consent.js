const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

let client = null;
let redisConnected = false;
const inMemoryConsents = new Map(); // Fallback storage

// Try to connect to Redis if URL is provided
if (process.env.REDIS_URL) {
  client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', err => {
    console.log('Redis Client Error:', err.message);
    redisConnected = false;
  });

  client.on('connect', () => {
    console.log('Redis connected for consent storage');
    redisConnected = true;
  });

  client.connect().catch(() => {
    console.log('Redis connection failed, using in-memory storage');
    redisConnected = false;
  });
} else {
  console.log('No REDIS_URL provided, using in-memory storage');
}

router.post('/', async (req, res) => {
  try {
    const { userId, consent } = req.body;

    if (redisConnected && client) {
      await client.hSet('user_consents', userId, JSON.stringify(consent));
    } else {
      // Use in-memory storage as fallback
      inMemoryConsents.set(userId, consent);
      console.log(`Consent saved in memory for user: ${userId}`);
    }

    res.json({ status: 'Consent saved' });
  } catch (error) {
    console.error('Consent error:', error);
    // Try fallback storage
    try {
      const { userId, consent } = req.body;
      inMemoryConsents.set(userId, consent);
      res.json({ status: 'Consent saved (fallback)' });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to save consent' });
    }
  }
});

// Mimic Complianz API
router.get('/v1/consent', async (req, res) => {
  try {
    const userId = req.query.user;
    let consent = null;

    if (redisConnected && client) {
      const consentData = await client.hGet('user_consents', userId);
      consent = JSON.parse(consentData || '{}');
    } else {
      // Use in-memory storage as fallback
      consent = inMemoryConsents.get(userId) || {};
      console.log(`Consent fetched from memory for user: ${userId}`);
    }

    res.json(consent);
  } catch (error) {
    console.error('Consent fetch error:', error);
    // Try fallback storage
    try {
      const userId = req.query.user;
      const consent = inMemoryConsents.get(userId) || {};
      res.json(consent);
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to fetch consent' });
    }
  }
});

module.exports = router;
