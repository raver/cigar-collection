import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

let db: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
} else {
  // Fallback: use a dummy client that won't crash module imports
  // Actual DB queries will fail with a clear error if no DATABASE_URL is set
  db = drizzle(new pg.Pool(), { schema });
}

export { db, schema };
