import { z } from 'zod';

const embeddingConfigSchema = z.object({
  provider: z.enum(['openai', 'cohere', 'local']).default('openai'),
  openai: z.object({
    apiKey: z.string(),
    model: z.string().default('text-embedding-3-small'),  
    dimensions: z.number().default(1536),
  }),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.number().default(6379),
  }),
  batch: z.object({
    size: z.number().default(100),
    concurrency: z.number().default(5),
  }),
});

export type EmbeddingConfig = z.infer<typeof embeddingConfigSchema>;

export const embeddingConfig: EmbeddingConfig = embeddingConfigSchema.parse({
  provider: 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1536'),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  batch: {
    size: parseInt(process.env.EMBEDDING_BATCH_SIZE || '100'),
    concurrency: parseInt(process.env.EMBEDDING_CONCURRENCY || '5'),
  },
});