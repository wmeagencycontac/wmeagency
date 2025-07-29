const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const page = req.query.page || 'home';
  
  const metadata = {
    home: {
      title: 'WME - Talent Agency',
      description: 'WME is the original talent agency representing artists across entertainment',
      og_image: 'https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp',
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WME",
        "url": "https://www.wmeagency.com",
        "logo": "https://dsqvyt2qb7cgs.cloudfront.net/logo.webp"
      }
    }
  };

  res.json(metadata[page] || metadata.home);
});

module.exports = router;
