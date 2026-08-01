import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import cigarsRoutes from './routes/cigars.js';
import commentsRoutes from './routes/comments.js';
import guestbookRoutes from './routes/guestbook.js';
import adminRoutes from './routes/admin.js';

const app = new Hono();

app.use('/api/*', cors());
app.use('/admin/api/*', cors({
  origin: process.env.ADMIN_ORIGIN || 'https://cigar.bixinxin.com',
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => c.json({ ok: true }));

// Public routes
app.route('/api/cigars', cigarsRoutes);
app.route('/api', commentsRoutes);
app.route('/api', guestbookRoutes);

// Admin routes
app.route('/admin/api', adminRoutes);

export default app;
