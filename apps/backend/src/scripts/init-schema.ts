import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeSchema() {
  console.log('🚀 Initializing database schema...\n');
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Enable pgvector
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('✅ pgvector extension enabled');

    // Create courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        tags TEXT[] DEFAULT '{}',
        embedding vector(1536),
        embedding_hash VARCHAR(64),
        embedding_updated_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Courses table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS courses_embedding_idx 
      ON courses 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);
    console.log('✅ Vector index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS courses_embedding_null_idx 
      ON courses (id) 
      WHERE embedding IS NULL
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS courses_embedding_hash_idx 
      ON courses (embedding_hash)
    `);
    console.log('✅ Additional indexes created');

    await client.query('COMMIT');
    
    // Check current state
    const count = await client.query('SELECT COUNT(*) FROM courses');
    console.log(`\n📊 Current courses in database: ${count.rows[0].count}`);
    
    console.log('\n🎉 Schema initialization complete!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeSchema();
