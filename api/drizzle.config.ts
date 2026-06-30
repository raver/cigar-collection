import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for drizzle migrations.');
}

let databaseName = '';
try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  databaseName = dbUrl.pathname.replace(/^\//, '');
} catch {
  throw new Error('DATABASE_URL must be a valid PostgreSQL URL.');
}

if (databaseName !== 'cigar') {
  throw new Error(`Refusing migration: target database must be "cigar", got "${databaseName || '(empty)'}".`);
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
