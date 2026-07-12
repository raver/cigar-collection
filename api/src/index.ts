import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import cigarsRoutes from './routes/cigars.js';
import commentsRoutes from './routes/comments.js';
import guestbookRoutes from './routes/guestbook.js';
import adminRoutes from './routes/admin.js';

// ── 启动时环境变量校验 ──
const REQUIRED_ENV_VARS = [
  'SESSION_SECRET',
  'DATABASE_URL',
] as const;

for (const name of REQUIRED_ENV_VARS) {
  if (!process.env[name]) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

// R2 相关变量：有图片上传功能时需要，启动时只 warning，运行时再严格校验
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.warn('⚠️  R2 credentials not fully configured — image upload will fail at runtime.');
}

const app = new Hono();

app.use('/api/*', cors());
app.use('/admin/api/*', cors({
  origin: process.env.ADMIN_ORIGIN || 'https://yourdomain.com',
  credentials: true,
}));

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
