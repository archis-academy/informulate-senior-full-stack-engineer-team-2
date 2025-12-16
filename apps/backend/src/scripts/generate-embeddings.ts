import 'dotenv/config';
import { Pool } from 'pg';
import OpenAI from 'openai';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || '1536');

function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content.trim().toLowerCase()).digest('hex');
}

function prepareContent(course: { 
  title: string; 
  description: string | null; 
  category: string | null; 
  tags: string[] 
}): string {
  return [course.title, course.description, course.category, course.tags?.join(', ')]
    .filter(Boolean)
    .join(' | ')
    .trim();
}

async function generateEmbedding(content: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: MODEL,
    input: content,
    dimensions: DIMENSIONS,
  });
  return response.data[0].embedding;
}

async function main() {
  console.log('🚀 Starting embedding generation...\n');
  console.log(`   Model: ${MODEL}`);
  console.log(`   Dimensions: ${DIMENSIONS}\n`);

  const client = await pool.connect();

  try {
    // Get all courses
    const coursesResult = await client.query(`
      SELECT id, title, description, category, tags, embedding_hash
      FROM courses
      ORDER BY created_at ASC
    `);

    const courses = coursesResult.rows;
    console.log(`📚 Found ${courses.length} courses\n`);

    if (courses.length === 0) {
      console.log('⚠️  No courses found. Run seed script first:');
      console.log('   yarn seed:courses\n');
      return;
    }

    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const content = prepareContent(course);
      const newHash = generateContentHash(content);

      // Skip if content hasn't changed (idempotency)
      if (course.embedding_hash === newHash) {
        skipped++;
        console.log(`⏭️  [${i + 1}/${courses.length}] Skipped: ${course.title.substring(0, 40)}... (unchanged)`);
        continue;
      }

      try {
        console.log(`🔄 [${i + 1}/${courses.length}] Processing: ${course.title.substring(0, 40)}...`);
        
        // Generate embedding via OpenAI
        const embedding = await generateEmbedding(content);

        // Update database
        await client.query(
          `UPDATE courses
           SET embedding = $1,
               embedding_hash = $2,
               embedding_updated_at = NOW(),
               updated_at = NOW()
           WHERE id = $3`,
          [`[${embedding.join(',')}]`, newHash, course.id]
        );

        processed++;
        console.log(`✅ [${i + 1}/${courses.length}] Done: ${course.title.substring(0, 40)}...`);

        // Rate limiting - avoid hitting API limits
        if (i < courses.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error: any) {
        failed++;
        console.error(`❌ [${i + 1}/${courses.length}] Failed: ${course.title} - ${error.message}`);
      }
    }

    // Final stats
    console.log('\n' + '='.repeat(50));
    console.log('📊 EMBEDDING GENERATION COMPLETE');
    console.log('='.repeat(50));
    console.log(`   ✅ Processed: ${processed}`);
    console.log(`   ⏭️  Skipped:   ${skipped}`);
    console.log(`   ❌ Failed:    ${failed}`);
    console.log(`   📚 Total:     ${courses.length}`);

    // Verify in database
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(embedding) as with_embedding,
        COUNT(*) - COUNT(embedding) as without_embedding
      FROM courses
    `);
    console.log('\n📈 Database Status:');
    console.log(`   With embeddings:    ${stats.rows[0].with_embedding}`);
    console.log(`   Without embeddings: ${stats.rows[0].without_embedding}`);
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
