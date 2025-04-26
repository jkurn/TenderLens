import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

neonConfig.webSocketConstructor = ws;

// Ensure database URL is available
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

async function runMigration() {
  console.log('Connecting to database...');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  console.log('Running migration...');
  
  // This will create tables if they don't exist based on schema
  try {
    await db.execute(
      /* sql */ `
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "username" text NOT NULL UNIQUE,
        "password" text NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "documents" (
        "id" serial PRIMARY KEY,
        "file_name" text NOT NULL,
        "file_type" text NOT NULL,
        "file_size" integer NOT NULL,
        "uploaded_at" timestamp DEFAULT now() NOT NULL,
        "processed" boolean DEFAULT false NOT NULL,
        "title" text,
        "agency" text,
        "rfp_number" text,
        "due_date" text,
        "estimated_value" text,
        "contract_term" text,
        "contact_person" text,
        "opportunity_score" integer,
        "key_dates" jsonb,
        "requirements" jsonb,
        "ai_analysis" jsonb,
        "full_text" text
      );
      `
    );
    
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });