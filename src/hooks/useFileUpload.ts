import { useState, useCallback } from "react";

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFormData = useCallback(async (file: string | File): Promise<FormData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (file instanceof File) {
        // 파일 객체인 경우 직접 FormData에 추가
        formData.append("image", file);
      } else if (typeof file === "string") {
        // URL 문자열인 경우 fetch를 사용하여 파일로 변환
        const response = await fetch(file);
        if (!response.ok) throw new Error("이미지를 가져오는데 실패했습니다");
        const blob = await response.blob();
        formData.append("image", blob, "image.jpg");
      } else {
        throw new Error("유효하지 않은 파일 형식입니다");
      }

      return formData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createFormData, isLoading, error };
};
