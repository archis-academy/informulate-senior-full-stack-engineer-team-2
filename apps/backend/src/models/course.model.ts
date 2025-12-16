import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[];
  embedding: number[] | null;
  embedding_hash: string | null;
  embedding_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CourseCreateInput {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface CourseWithEmbeddingUpdate {
  id: string;
  embedding: number[];
  embeddingHash: string;
}

export class CourseModel {
  static async initializeSchema(): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      await client.query('CREATE EXTENSION IF NOT EXISTS vector');

      await client.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(500) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      await client.query(`
        DO $$ 
        BEGIN
          -- Add embedding column (1536 dimensions for text-embedding-3-small)
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'courses' AND column_name = 'embedding'
          ) THEN
            ALTER TABLE courses ADD COLUMN embedding vector(1536);
          END IF;

          -- Add embedding hash for idempotency
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'courses' AND column_name = 'embedding_hash'
          ) THEN
            ALTER TABLE courses ADD COLUMN embedding_hash VARCHAR(64);
          END IF;

          -- Add embedding timestamp
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'courses' AND column_name = 'embedding_updated_at'
          ) THEN
            ALTER TABLE courses ADD COLUMN embedding_updated_at TIMESTAMP WITH TIME ZONE;
          END IF;
        END $$;
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS courses_embedding_idx 
        ON courses 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS courses_embedding_null_idx 
        ON courses (id) 
        WHERE embedding IS NULL;
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS courses_embedding_hash_idx 
        ON courses (embedding_hash);
      `);

      await client.query('COMMIT');
      console.log('✅ Course schema with vector support initialized');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getCoursesNeedingEmbeddings(
    limit = 100
  ): Promise<Pick<Course, 'id' | 'title' | 'description' | 'category' | 'tags' | 'embedding_hash'>[]> {
    const result = await pool.query(
      `SELECT id, title, description, category, tags, embedding_hash
       FROM courses
       WHERE embedding IS NULL OR embedding_hash IS NULL
       ORDER BY created_at ASC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getAllCoursesForEmbedding(): Promise<
    Pick<Course, 'id' | 'title' | 'description' | 'category' | 'tags' | 'embedding_hash'>[]
  > {
    const result = await pool.query(
      `SELECT id, title, description, category, tags, embedding_hash
       FROM courses
       ORDER BY created_at ASC`
    );
    return result.rows;
  }

  static async updateEmbedding(
    courseId: string,
    embedding: number[],
    embeddingHash: string
  ): Promise<void> {
    await pool.query(
      `UPDATE courses
       SET embedding = $1,
           embedding_hash = $2,
           embedding_updated_at = NOW(),
           updated_at = NOW()
       WHERE id = $3`,
      [`[${embedding.join(',')}]`, embeddingHash, courseId]
    );
  }

  static async batchUpdateEmbeddings(
    updates: CourseWithEmbeddingUpdate[]
  ): Promise<void> {
    if (updates.length === 0) return;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const update of updates) {
        await client.query(
          `UPDATE courses
           SET embedding = $1,
               embedding_hash = $2,
               embedding_updated_at = NOW(),
               updated_at = NOW()
           WHERE id = $3`,
          [`[${update.embedding.join(',')}]`, update.embeddingHash, update.id]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async semanticSearch(
    queryEmbedding: number[],
    limit = 10,
    threshold = 0.7
  ): Promise<(Course & { similarity: number })[]> {
    const result = await pool.query(
      `SELECT 
         *,
         1 - (embedding <=> $1) as similarity
       FROM courses
       WHERE embedding IS NOT NULL
         AND 1 - (embedding <=> $1) > $2
       ORDER BY embedding <=> $1
       LIMIT $3`,
      [`[${queryEmbedding.join(',')}]`, threshold, limit]
    );
    return result.rows;
  }

  static async getEmbeddingStats(): Promise<{
    total: number;
    withEmbedding: number;
    withoutEmbedding: number;
    lastUpdated: Date | null;
  }> {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(embedding) as with_embedding,
        COUNT(*) - COUNT(embedding) as without_embedding,
        MAX(embedding_updated_at) as last_updated
      FROM courses
    `);
    
    return {
      total: parseInt(result.rows[0].total),
      withEmbedding: parseInt(result.rows[0].with_embedding),
      withoutEmbedding: parseInt(result.rows[0].without_embedding),
      lastUpdated: result.rows[0].last_updated,
    };
  }
}