// index.ts
import 'dotenv/config';
import express from 'express';
import { CourseModel } from './src/models/course.model';
import { startEmbeddingWorker } from './src/jobs/embedding.worker';
import { CourseService } from './src/services/course.service';

const app = express();
app.use(express.json());

async function initialize(): Promise<void> {
  await CourseModel.initializeSchema();
  console.log('✅ Database initialized');

  if (process.env.ENABLE_WORKER === 'true') {
    startEmbeddingWorker();
  }
}

app.post('/api/courses', async (req, res) => {
  try {
    const course = await CourseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.get('/api/courses/search', async (req, res) => {
  try {
    const { q, limit } = req.query;
    const results = await CourseService.searchCourses(
      q as string,
      parseInt(limit as string) || 10
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/embeddings/stats', async (req, res) => {
  try {
    const stats = await CourseModel.getEmbeddingStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

initialize().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});