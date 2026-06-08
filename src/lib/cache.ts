import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  redis ??= new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  return redis;
}
