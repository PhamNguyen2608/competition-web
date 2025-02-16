export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, {
    value: ReturnType<T>;
    timestamp: number;
    ttl?: number;
  }>();

  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    const cached = cache.get(key);

    if (cached) {
      // Kiểm tra TTL nếu có
      if (!cached.ttl || Date.now() - cached.timestamp < cached.ttl) {
        return cached.value;
      }
      cache.delete(key); // Xóa cache nếu hết hạn
    }

    const result = fn(...args);
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });
    return result;
  }) as T;
} 