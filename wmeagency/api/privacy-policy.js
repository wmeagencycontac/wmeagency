const express = require('express');
const router = express.Router();

const redirects = {
  'privacy-policy': 'https://www.wmeagency.com/privacy-policy/',
  'terms-of-use': 'https://www.wmeagency.com/terms-of-use/',
  'cookie-policy': 'https://www.wmeagency.com/cookie-policy/'
};

router.get('/:policy', (req, res) => {
  const policy = req.params.policy;
  const url = redirects[policy] || redirects['privacy-policy'];
  res.redirect(301, url);
});

module.exports = router;