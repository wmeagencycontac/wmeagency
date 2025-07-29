async function loadMetadata() {
  try {
    const response = await fetch('/api/metadata?page=home');
    const data = await response.json();
    document.title = data.title || 'WME - Talent Agency';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', data.description || 'WME talent agency.');
  } catch (error) {
    console.error('Error loading metadata:', error);
  }
}

async function saveConsent(statistics, marketing) {
  try {
    const response = await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', consent: { statistics, marketing } })
    });
    const data = await response.json();
    console.log(data.status);
    document.getElementById('consent-banner').style.display = 'none';
  } catch (error) {
    console.error('Error saving consent:', error);
  }
}

window.onload = loadMetadata;