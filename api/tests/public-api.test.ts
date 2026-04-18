import { describe, it, expect, vi } from 'vitest';
import app from '../src/index.js';

describe('Public API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it('GET /api/cigars returns array', async () => {
    const res = await app.request('/api/cigars');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it('GET /api/cigars/nonexistent returns 404', async () => {
    // The slug route will try to query DB which returns [] from mock, leading to 404
    const res = await app.request('/api/cigars/nonexistent');
    expect(res.status).toBe(404);
  });

  it('GET /api/guestbook returns paginated result', async () => {
    const res = await app.request('/api/guestbook');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('comments');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('totalPages');
  });

  it('GET /api/guestbook?page=2 uses page param', async () => {
    const res = await app.request('/api/guestbook?page=2');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.page).toBe(2);
  });

  it('POST /api/comments with invalid data returns 400', async () => {
    const res = await app.request('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_name: '' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/comments with valid data returns 201', async () => {
    const res = await app.request('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_name: 'Test',
        author_email: 'test@example.com',
        content: 'Hello world',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.authorName).toBe('Test');
  });

  it('GET /admin/api returns placeholder', async () => {
    const res = await app.request('/admin/api');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Admin API placeholder');
  });
});
