import assert from 'node:assert/strict';
import test from 'node:test';
import type { AddressInfo } from 'node:net';
import { createApp } from './app';

test('GET /api/scryfall returns JSON', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));

    const address = server.address();
    assert.ok(address && typeof address === 'object');

    const { port } = address as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}/api/scryfall`);

    assert.equal(response.status, 200);
    const data = await response.json();
    assert.ok(typeof data === 'object');
    assert.ok(data !== null);
  } finally {
    server.close();
  }
});
