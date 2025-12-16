import { Worker, Job } from 'bullmq';
import { redisConnection, EmbeddingJobData } from './queue';
import { embeddingService, EmbeddingService } from '../services/embedding.service';
import { CourseModel } from '../models/course.model';
import { embeddingConfig } from '../config/embedding.config';

async function processEmbeddingJob(job: Job<EmbeddingJobData>): Promise<void> {
  const { type, courseId, batchIds } = job.data;

  console.log(`🔄 Processing embedding job: ${job.name} (${job.id})`);

  switch (type) {
    case 'course':
      await processSingleCourse(courseId!, job);
      break;

    case 'batch-courses':
      if (batchIds && batchIds.length > 0) {
        await processBatchCourses(batchIds, job);
      } else {
        await processAllCourses(job);
      }
      break;

    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

async function processSingleCourse(courseId: string, job: Job): Promise<void> {
  const courses = await CourseModel.getAllCoursesForEmbedding();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    console.log(`⚠️ Course ${courseId} not found, skipping`);
    return;
  }

  const content = EmbeddingService.prepareCourseContent({
    title: course.title,
    description: course.description,
    category: course.category,
    tags: course.tags,
  });

  const result = await embeddingService.generateEmbedding(content);

  await CourseModel.updateEmbedding(
    courseId,
    result.vector,
    result.contentHash
  );

  console.log(`✅ Generated embedding for course: ${course.title}`);
}

async function processBatchCourses(
  courseIds: string[],
  job: Job
): Promise<void> {
  const courses = await CourseModel.getAllCoursesForEmbedding();
  const filteredCourses = courses.filter((c) => courseIds.includes(c.id));

  await processCourseBatch(filteredCourses, job);
}

async function processAllCourses(job: Job): Promise<void> {
  const courses = await CourseModel.getAllCoursesForEmbedding();
  await processCourseBatch(courses, job);
}

async function processCourseBatch(
  courses: Awaited<ReturnType<typeof CourseModel.getAllCoursesForEmbedding>>,
  job: Job
): Promise<void> {
  const inputs = courses.map((course) => ({
    id: course.id,
    content: EmbeddingService.prepareCourseContent({
      title: course.title,
      description: course.description,
      category: course.category,
      tags: course.tags,
    }),
    existingHash: course.embedding_hash,
  }));

  const totalBatches = Math.ceil(
    inputs.length / embeddingConfig.batch.size
  );
  let processedBatches = 0;

  for (let i = 0; i < inputs.length; i += embeddingConfig.batch.size) {
    const batch = inputs.slice(i, i + embeddingConfig.batch.size);
    const results = await embeddingService.generateBatchEmbeddings(batch);

    const updates = results
      .filter((r) => r.success && r.result && !r.skipped)
      .map((r) => ({
        id: r.id,
        embedding: r.result!.vector,
        embeddingHash: r.result!.contentHash,
      }));

    if (updates.length > 0) {
      await CourseModel.batchUpdateEmbeddings(updates);
    }

    processedBatches++;
    const skipped = results.filter((r) => r.skipped).length;
    const failed = results.filter((r) => !r.success).length;
    
    console.log(
      `📊 Batch ${processedBatches}/${totalBatches}: ` +
      `${updates.length} updated, ${skipped} skipped, ${failed} failed`
    );

    await job.updateProgress(Math.round((processedBatches / totalBatches) * 100));

    if (i + embeddingConfig.batch.size < inputs.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  const stats = await CourseModel.getEmbeddingStats();
  console.log(`✅ Embedding generation complete:`, stats);
}

export function startEmbeddingWorker(): Worker {
  const worker = new Worker('embeddings', processEmbeddingJob, {
    connection: redisConnection,
    concurrency: embeddingConfig.batch.concurrency,
    limiter: {
      max: 10,
      duration: 1000, 
    },
  });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message);
  });

  worker.on('progress', (job, progress) => {
    console.log(`📈 Job ${job.id} progress: ${progress}%`);
  });

  console.log('🚀 Embedding worker started');
  return worker;
}