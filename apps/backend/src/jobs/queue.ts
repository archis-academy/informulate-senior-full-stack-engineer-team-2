import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { embeddingConfig } from '../config/embedding.config';

export const redisConnection = new IORedis({
  host: embeddingConfig.redis.host,
  port: embeddingConfig.redis.port,
  maxRetriesPerRequest: null,
});

export const embeddingQueue = new Queue('embeddings', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 24 * 3600, 
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, 
    },
  },
});

export const embeddingQueueEvents = new QueueEvents('embeddings', {
  connection: redisConnection,
});

export interface EmbeddingJobData {
  type: 'course' | 'transcript' | 'batch-courses';
  courseId?: string;
  transcriptId?: string;
  batchIds?: string[];
  priority?: 'high' | 'normal' | 'low';
}

export async function queueCourseEmbedding(
  courseId: string,
  priority: 'high' | 'normal' | 'low' = 'normal'
): Promise<void> {
  const priorityMap = { high: 1, normal: 5, low: 10 };
  
  await embeddingQueue.add(
    'course-embedding',
    { type: 'course', courseId, priority },
    {
      priority: priorityMap[priority],
      jobId: `course-${courseId}`,  
    }
  );
}

export async function queueBatchCourseEmbeddings(
  courseIds: string[]
): Promise<void> {
  await embeddingQueue.add(
    'batch-course-embeddings',
    { type: 'batch-courses', batchIds: courseIds },
    { priority: 10 }
  );
}

export async function queueAllCoursesForEmbedding(): Promise<void> {
  await embeddingQueue.add(
    'generate-all-embeddings',
    { type: 'batch-courses' },
    { 
      priority: 10,
      jobId: 'generate-all-embeddings', // Singleton job
    }
  );
}