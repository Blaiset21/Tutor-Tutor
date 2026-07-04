import express from 'express';

export function createApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/scryfall', async (_req, res) => {
    try {
      const response = await fetch('https://api.scryfall.com', {
        headers: {
          'User-Agent': 'TutorTutorBackend/1.0 (+https://example.com)',
          Accept: 'application/json'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Failed to fetch Scryfall API', error);
      res.status(502).json({ error: 'Failed to fetch Scryfall API' });
    }
  });

  return app;
}

export const app = createApp();
