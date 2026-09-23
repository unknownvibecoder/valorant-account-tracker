import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env ở thư mục cha hoặc thư mục hiện tại
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  VALORANT_API_BASE_URL: z.string().default('https://valorant-api.com/v1'),
  HENRIK_DEV_API_BASE_URL: z.string().default('https://api.henrikdev.xyz/valorant'),
  HENRIK_API_KEY: z.string().optional(),

  // Session
  SESSION_SECRET: z.string().default('valorant_tracker_secret_key_2026'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),

  // Discord OAuth
  DISCORD_CLIENT_ID: z.string().default(''),
  DISCORD_CLIENT_SECRET: z.string().default(''),

  // Facebook OAuth
  FACEBOOK_APP_ID: z.string().default(''),
  FACEBOOK_APP_SECRET: z.string().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = _env.data;