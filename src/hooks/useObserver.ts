import { MutableRefObject, useEffect, useRef, useState } from "react";

const useIntersectionObserver = (callback: () => void) => {
  const [observeTarget, setObserveTarget] = useState<HTMLElement | null>(null);
  const observer = useRef<MutableRefObject<HTMLElement> | any>(null);

  useEffect(() => {
    const currentTarget = observeTarget;
    const currentObserver = observer.current;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        callback();
      },
      { threshold: 1 }
    );

    if (currentTarget) currentObserver.observe(currentTarget);

    return () => {
      if (currentTarget) {
        currentObserver.unobserve(currentTarget);
      }
    };
  }, [observeTarget, callback]);

  return setObserveTarget;
};

export default useIntersectionObserver;
