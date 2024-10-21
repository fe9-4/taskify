import { ChangeEvent, useRef, useState } from "react";

export const useInputFile = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (file) {
      // FileReader 객체 생성
      const reader = new FileReader();
      // 파일 읽는 작업 시작
      reader.readAsDataURL(file);
      // 파일 읽는 작업 완료 후 호출될 onloadend 메서드 정의
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
    }
  };

  return { imageRef, preview, handleFileChange };
};
