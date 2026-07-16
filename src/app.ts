import express from 'express';
import fs from 'fs';

const cardTemplate = fs.readFileSync(new URL('./templates/card.html', import.meta.url), 'utf8');

export function createApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/scryfall', async (req, res) => {
    const cardName = req.query.name ? String(req.query.name) : 'Black Lotus';
    const encodedName = encodeURIComponent(cardName);

    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodedName}`, {
        headers: {
          'User-Agent': 'TutorTutorBackend/1.0 (+https://example.com)',
          Accept: 'application/json'
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Failed to fetch Scryfall API', error);
      res.status(502).json({ error: 'Failed to fetch Scryfall API' });
    }
  });

  app.get('/card-image', async (req, res) => {
    const cardName = req.query.name ? String(req.query.name) : 'Black Lotus';
    const encodedName = encodeURIComponent(cardName);

    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodedName}`, {
        headers: {
          'User-Agent': 'TutorTutorBackend/1.0 (+https://example.com)',
          Accept: 'application/json'
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      const imageUrl =
        data.image_uris?.normal ||
        data.image_uris?.large ||
        data.card_faces?.[0]?.image_uris?.normal ||
        data.card_faces?.[0]?.image_uris?.large;

      if (!imageUrl) {
        return res.status(502).json({ error: 'No image available for this card' });
      }

      res.redirect(imageUrl);
    } catch (error) {
      console.error('Failed to fetch card image', error);
      res.status(502).json({ error: 'Failed to fetch card image' });
    }
  });

  app.get('/card', (req, res) => {
    const cardName = req.query.name ? String(req.query.name) : 'Black Lotus';
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const safe = esc(cardName);
    const imgSrc = `/card-image?name=${encodeURIComponent(cardName)}`;

    const html = cardTemplate
      .replaceAll('{{title}}', safe)
      .replaceAll('{{value}}', safe)
      .replaceAll('{{imgSrc}}', imgSrc);

    res.type('html').send(html);
  });

  return app;
}

export const app = createApp();
