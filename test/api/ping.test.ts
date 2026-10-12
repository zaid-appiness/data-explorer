import { describe, expect, it } from 'vitest';
import { GET } from '../../api/ping';

describe('GET /api/ping', () => {
  it('returns an uncached JSON health payload', async () => {
    const response = GET(new Request('http://localhost/api/ping'));

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });
});
