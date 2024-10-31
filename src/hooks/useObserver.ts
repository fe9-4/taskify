import { MutableRefObject, useEffect, useRef, useState } from "react";

const useIntersectionObserver = (callback: () => void) => {
  const [observeTarget, setObserveTarget] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const savedCallback = useRef(callback);

  // callback이 변경될 때마다 savedCallback 업데이트
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // IntersectionObserver가 이미 없을 때만 새로 생성
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            savedCallback.current();
          }
        },
        { threshold: 1 }
      );
    }

    // 기존의 타겟이 있을 경우, 관찰 해제
    if (observeTarget) {
      observer.current.unobserve(observeTarget);
    }

    // 새로운 타겟 관찰 시작
    if (observeTarget) {
      observer.current.observe(observeTarget);
    }

    // 컴포넌트 언마운트 시 IntersectionObserver 해제
    return () => {
      if (observer.current && observeTarget) {
        observer.current.unobserve(observeTarget);
      }
    };
  }, [observeTarget]);

  return setObserveTarget;
};

export default useIntersectionObserver;
