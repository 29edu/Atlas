import Redis from "ioredis";

const redis = new Redis({ host: "localhost", port: 6379 });

const rateLimit = (limit = 100, windowMs = 60_000) => async (req, res, next) => {
  const key = `rl:${req.ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.pexpire(key, windowMs);

  const total = await redis.zcard(key);

  res.set({
    "X-RateLimit-Limit": limit,
    "X-RateLimit-Remaining": Math.max(0, limit - total),
  });

  if (total > limit) {
    return res.status(429).json({ success: false, message: "Too many requests" });
  }

  next();
};

export default rateLimit;
