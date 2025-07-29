const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { error, widgetId, account } = req.body;
  console.error(`Instagram Widget Error (${widgetId} for @${account}):`, error);
  res.sendStatus(200);
});

module.exports = router;