import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IUploadType } from "@/types/uploadType";

// 파일 업로드 응답 타입
interface UploadResponse {
  profileImageUrl?: string; // 프로필 이미지 URL
  imageUrl?: string; // 카드 이미지 URL
}

// 파일 업로드 커스텀 훅
export const useFileUpload = (uploadUrl: string, uploadType: IUploadType) => {
  // 파일 업로드 mutation 정의
  const uploadFileMutation = useMutation<string, Error, File>({
    mutationFn: async (file: File) => {
      // FormData 생성 및 이미지 파일 추가
      const formData = new FormData();
      formData.append("image", file);

      // 파일 업로드 API 요청
      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 업로드 타입에 따른 URL 반환
      if (uploadType === "profile" && response.data?.profileImageUrl) {
        return response.data.profileImageUrl;
      } else if (uploadType === "card" && response.data?.imageUrl) {
        return response.data.imageUrl;
      } else {
        throw new Error("이미지 URL을 받지 못했습니다.");
      }
    },
  });

  return {
    uploadFile: uploadFileMutation.mutateAsync, // 파일 업로드 실행 함수
    isPending: uploadFileMutation.isPending, // 업로드 진행 중 상태
    error: uploadFileMutation.error?.message || null, // 업로드 에러 메시지
  };
};
