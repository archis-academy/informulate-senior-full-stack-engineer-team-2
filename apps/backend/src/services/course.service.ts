import { CourseModel, CourseCreateInput, Course } from '../models/course.model';
import { embeddingService, EmbeddingService } from './embedding.service';
import { queueCourseEmbedding } from '../jobs/queue';
import { generateContentHash } from '../utils/content-hash';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class CourseService {
  static async createCourse(input: CourseCreateInput): Promise<Course> {
    const result = await pool.query(
      `INSERT INTO courses (title, description, category, tags)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [input.title, input.description, input.category, input.tags || []]
    );

    const course = result.rows[0];

    await queueCourseEmbedding(course.id, 'high');

    return course;
  }

  static async updateCourse(
    courseId: string,
    input: Partial<CourseCreateInput>
  ): Promise<Course> {
    const existing = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [courseId]
    );

    if (existing.rows.length === 0) {
      throw new Error('Course not found');
    }

    const oldCourse = existing.rows[0];

    const result = await pool.query(
      `UPDATE courses
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           tags = COALESCE($4, tags),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [input.title, input.description, input.category, input.tags, courseId]
    );

    const updatedCourse = result.rows[0];

    const oldContent = EmbeddingService.prepareCourseContent(oldCourse);
    const newContent = EmbeddingService.prepareCourseContent(updatedCourse);
    const oldHash = generateContentHash(oldContent);
    const newHash = generateContentHash(newContent);

    if (oldHash !== newHash) {
      await queueCourseEmbedding(courseId, 'high');
    }

    return updatedCourse;
  }

  static async searchCourses(
    query: string,
    limit = 10
  ): Promise<(Course & { similarity: number })[]> {
    const queryResult = await embeddingService.generateEmbedding(query);

    return CourseModel.semanticSearch(queryResult.vector, limit);
  }
}