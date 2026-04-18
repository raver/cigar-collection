import { describe, it, expect } from 'vitest';
import app from '../src/index.js';

describe('Admin API', () => {
  it('POST /admin/api/login with missing fields returns error', async () => {
    const res = await app.request('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  it('POST /admin/api/login with wrong credentials returns 401', async () => {
    const res = await app.request('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
    });
    expect(res.status).toBe(401);
  });

  it('GET /admin/api/comments without auth returns 401', async () => {
    const res = await app.request('/admin/api/comments');
    expect(res.status).toBe(401);
  });

  it('GET /admin/api/comments?status=pending without auth returns 401', async () => {
    const res = await app.request('/admin/api/comments?status=pending');
    expect(res.status).toBe(401);
  });

  it('PATCH /admin/api/comments/1 without auth returns 401', async () => {
    const res = await app.request('/admin/api/comments/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    expect(res.status).toBe(401);
  });
});
