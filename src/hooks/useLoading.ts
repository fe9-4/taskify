import { useState, useCallback } from "react";

// api 중복 호출을 막기 위한
const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const withLoading = useCallback(async (callback: () => Promise<void>) => {
    setLoading(true);
    try {
      await callback();
    } finally {
      setLoading(false);
    }
  }, []);

  return { isLoading, withLoading };
};

export default useLoading;
