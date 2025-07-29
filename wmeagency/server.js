const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/consent', require('./api/consent').router || require('./api/consent'));
app.use('/api/metadata', require('./api/metadata').router || require('./api/metadata'));
app.use('/api/privacy-policy', require('./api/privacy-policy').router || require('./api/privacy-policy'));
app.use('/api/track-links', require('./api/track-links').router || require('./api/track-links'));
app.use('/api/instagram-error', require('./api/instagram-error').router || require('./api/instagram-error'));

// Handle 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});