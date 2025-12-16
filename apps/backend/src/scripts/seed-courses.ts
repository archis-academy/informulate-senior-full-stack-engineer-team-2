import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sampleCourses = [
  {
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and model evaluation techniques.',
    category: 'Data Science',
    tags: ['machine learning', 'AI', 'python', 'beginner'],
  },
  {
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns including compound components, render props, hooks composition, and state management strategies.',
    category: 'Web Development',
    tags: ['react', 'javascript', 'frontend', 'advanced'],
  },
  {
    title: 'PostgreSQL Performance Tuning',
    description: 'Optimize your PostgreSQL database with indexing strategies, query optimization, and configuration tuning for high-performance applications.',
    category: 'Databases',
    tags: ['postgresql', 'database', 'performance', 'sql'],
  },
  {
    title: 'Building RESTful APIs with Node.js',
    description: 'Design and build scalable RESTful APIs using Node.js, Express, and best practices for authentication, validation, and error handling.',
    category: 'Backend Development',
    tags: ['nodejs', 'api', 'express', 'backend'],
  },
  {
    title: 'Docker and Kubernetes Fundamentals',
    description: 'Learn containerization with Docker and orchestration with Kubernetes. Deploy, scale, and manage containerized applications.',
    category: 'DevOps',
    tags: ['docker', 'kubernetes', 'devops', 'containers'],
  },
];

async function seedCourses() {
  console.log('🌱 Seeding sample courses...\n');

  const client = await pool.connect();

  try {
    for (const course of sampleCourses) {
      await client.query(
        `INSERT INTO courses (title, description, category, tags)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [course.title, course.description, course.category, course.tags]
      );
      console.log(`  ✅ ${course.title}`);
    }

    const count = await client.query('SELECT COUNT(*) FROM courses');
    console.log(`\n📊 Total courses: ${count.rows[0].count}`);
    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedCourses();
