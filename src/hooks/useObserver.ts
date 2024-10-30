import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = (callback: () => void) => {
  const [observeTarget, setObserveTarget] = useState<HTMLDivElement | null>(null);

  const observer = useRef(
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    const currentTarget = observeTarget;
    const currentObserver = observer.current;

    if (currentTarget) currentObserver.observe(currentTarget);

    return () => {
      if (currentTarget) {
        currentObserver.unobserve(currentTarget);
      }
    };
  }, [observeTarget]);

  return setObserveTarget;
};

export default useIntersectionObserver;
