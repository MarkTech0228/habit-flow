// src/firebase/rateLimiter.ts
// Moved from App.tsx lines 565–610
// Prevents Firebase abuse by capping operations per time window.

export class RateLimiter {
  private readonly callTimestamps: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxCalls: number;

  constructor(maxCalls = 10, windowMs = 60_000) {
    this.maxCalls  = maxCalls;
    this.windowMs  = windowMs;
  }

  canProceed(key: string): boolean {
    const now        = Date.now();
    const timestamps = this.callTimestamps.get(key) ?? [];

    // Drop timestamps outside the rolling window
    const valid = timestamps.filter(ts => now - ts < this.windowMs);

    if (valid.length >= this.maxCalls) {
      console.warn(`⚠️ Rate limit exceeded for "${key}". Please slow down.`);
      return false;
    }

    valid.push(now);
    this.callTimestamps.set(key, valid);
    return true;
  }

  reset(key: string): void {
    this.callTimestamps.delete(key);
  }
}

// ── Global limiters ────────────────────────────────────────
export const firestoreWriteLimiter  = new RateLimiter(30,  60_000);  // 30 writes/min
export const firestoreReadLimiter   = new RateLimiter(100, 60_000);  // 100 reads/min
export const storageUploadLimiter   = new RateLimiter(5,   60_000);  // 5 uploads/min