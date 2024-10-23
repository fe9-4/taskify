import { useRef, useCallback } from "react";

// 쓰로틀 훅: 주어진 함수의 실행 빈도를 제한하는 훅
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRan = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!timeoutRef.current) {
        // 첫 실행 또는 쓰로틀 시간 이후 실행
        func(...args);
        lastRan.current = Date.now();

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, delay);
      } else {
        // 쓰로틀 시간 내 추가 호출 처리
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
};
