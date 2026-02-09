import { useRef, useCallback } from 'react';


interface RateLimitOptions {
  maxCalls: number;
  windowMs: number;
}


interface RateLimitResult {
  isAllowed: () => boolean;
  getRemainingTime: () => number;
}


export const useRateLimit = ({ maxCalls, windowMs }: RateLimitOptions): RateLimitResult => {
  const callTimestamps = useRef<number[]>([]);


  const isAllowed = useCallback(() => {
    const now = Date.now();
   
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );


    if (callTimestamps.current.length >= maxCalls) {
      return false;
    }


    callTimestamps.current.push(now);
    return true;
  }, [maxCalls, windowMs]);


  const getRemainingTime = useCallback(() => {
    const now = Date.now();
   
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );


    if (callTimestamps.current.length < maxCalls) {
      return 0;
    }


    const oldestCall = callTimestamps.current[0];
    return Math.max(0, windowMs - (now - oldestCall));
  }, [maxCalls, windowMs]);


  return { isAllowed, getRemainingTime };
};

