import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import cigarsRoutes from './routes/cigars.js';
import commentsRoutes from './routes/comments.js';
import guestbookRoutes from './routes/guestbook.js';
import adminRoutes from './routes/admin.js';

const app = new Hono();

app.use('/api/*', cors());
app.use('/admin/api/*', cors());

// Health check
app.get('/api/health', (c) => c.json({ ok: true }));

// Public routes
app.route('/api/cigars', cigarsRoutes);
app.route('/api', commentsRoutes);
app.route('/api', guestbookRoutes);

// Admin routes (will be implemented in Task 4)
app.route('/admin/api', adminRoutes);

const port = parseInt(process.env.API_PORT || '3001');
serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on port ${port}`);
});

export default app;
