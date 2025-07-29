const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

router.get('/', async (req, res) => {
  try {
    const { url, platform } = req.query;
    await client.zIncrBy('link_clicks', 1, `${platform}:${url}`);
    res.sendStatus(204);
  } catch (error) {
    console.error('Tracking error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;