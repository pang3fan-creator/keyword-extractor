import { describe, expect, it } from 'vitest';
import { POST } from './route';

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/extract/text', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/extract/text', () => {
  it('returns extraction results for valid text', async () => {
    const response = await POST(
      jsonRequest({
        text: 'HEIC JPEG JPEG image format',
        options: { includeBigrams: true },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.keywords[0]).toEqual({ word: 'jpeg', count: 2, density: 40 });
    expect(body.bigrams[0]).toEqual({ phrase: 'heic jpeg', count: 1, density: 25 });
  });

  it('rejects empty text', async () => {
    const response = await POST(jsonRequest({ text: '   ' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Text is required.' });
  });

  it('rejects oversized text', async () => {
    const response = await POST(jsonRequest({ text: 'a'.repeat(50001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Text must be 50,000 characters or fewer.',
    });
  });
});
