/**
 * 简单的内存限流中间件 — 基于 IP
 * 无需外部依赖，适合个人项目的小流量场景
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// 每 60 秒最多 5 次写入
const WINDOW_MS = 60_000;
const MAX_WRITES = 5;

// 定期清理过期 bucket，避免内存泄漏
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref();

function getClientIp(c: any): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    || c.req.header('x-real-ip')
    || c.env?.remote?.address
    || 'unknown';
}

export function rateLimit() {
  return async (c: any, next: () => Promise<void>) => {
    // 只限制写操作
    if (c.req.method !== 'POST') return next();

    const ip = getClientIp(c);
    const now = Date.now();
    let bucket = buckets.get(ip);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + WINDOW_MS };
      buckets.set(ip, bucket);
    }

    bucket.count += 1;

    if (bucket.count > MAX_WRITES) {
      return c.json({
        error: `操作过于频繁，请 ${Math.ceil((bucket.resetAt - now) / 1000)} 秒后再试。`,
      }, 429);
    }

    await next();
  };
}
