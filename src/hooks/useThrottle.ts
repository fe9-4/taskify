import { useRef, useCallback } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRan = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!timeoutRef.current) {
        func(...args);
        lastRan.current = Date.now();

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, delay);
      } else {
        const remaining = delay - (Date.now() - lastRan.current);
        if (remaining <= 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          func(...args);
          lastRan.current = Date.now();

          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
          }, delay);
        }
      }
    },
    [func, delay]
  );
}
