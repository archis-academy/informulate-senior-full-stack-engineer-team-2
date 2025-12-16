import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  console.log('\n🔍 Checking configuration...\n');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
  
  if (!process.env.DATABASE_URL) {
    console.log('\n❌ Create a .env file with DATABASE_URL');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const res = await pool.query('SELECT version()');
    console.log('\n✅ PostgreSQL connected!');
    console.log('   Version:', res.rows[0].version.split(',')[0]);

    // Check pgvector
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
      console.log('✅ pgvector extension ready');
    } catch (err: any) {
      console.log('⚠️  pgvector error:', err.message);
      console.log('   Install: brew install pgvector && brew services restart postgresql');
    }

    console.log('\n🎉 Database ready!\n');
  } catch (err: any) {
    console.error('\n❌ Connection failed:', err.message);
    console.log('\nTroubleshooting:');
    console.log('1. Start PostgreSQL: brew services start postgresql');
    console.log('2. Check DATABASE_URL in .env');
  } finally {
    await pool.end();
  }
}

test();
