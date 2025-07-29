const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

let client = null;
let redisConnected = false;

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
    console.log('Redis connected for link tracking');
    redisConnected = true;
  });

  client.connect().catch(() => {
    console.log('Redis connection failed, running without Redis');
    redisConnected = false;
  });
} else {
  console.log('No REDIS_URL provided, running without Redis');
}

router.get('/', async (req, res) => {
  try {
    const { url, platform } = req.query;

    if (redisConnected && client) {
      await client.zIncrBy('link_clicks', 1, `${platform}:${url}`);
      console.log(`Tracked click: ${platform}:${url}`);
    } else {
      // Log to console when Redis is not available
      console.log(`Link click tracked (no Redis): ${platform}:${url}`);
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Tracking error:', error);
    // Still return success even if tracking fails
    res.sendStatus(204);
  }
});

module.exports = router;
