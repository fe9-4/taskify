import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = (callback: () => void) => {
  const [observeTarget, setObserveTarget] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
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

    if (observeTarget) {
      observer.current.observe(observeTarget);
    }

    return () => {
      if (observer.current && observeTarget) {
        observer.current.unobserve(observeTarget);
      }
    };
  }, [observeTarget]);

  return setObserveTarget;
};

export default useIntersectionObserver;
