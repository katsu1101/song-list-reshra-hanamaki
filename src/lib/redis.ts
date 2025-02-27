import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default redis;

export const cacheKey = process.env.REDIS_CACHE_KEY || 'songs';
