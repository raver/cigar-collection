import { Hono } from 'hono';

const app = new Hono();

// Placeholder — will be implemented in Task 4
app.get('/', (c) => c.json({ message: 'Admin API placeholder' }));

export default app;
