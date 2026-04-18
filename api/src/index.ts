import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({ message: 'Cigar API is running' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = Number(process.env.API_PORT) || 3001;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running on http://localhost:${info.port}`);
});

export default app;
