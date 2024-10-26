import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IUploadType } from "@/types/uploadType";

interface UploadResponse {
  profileImageUrl?: string;
  imageUrl?: string;
}

export const useFileUpload = (uploadUrl: string, uploadType: IUploadType) => {
  const uploadFileMutation = useMutation<string, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    uploadFile: uploadFileMutation.mutateAsync,
    isPending: uploadFileMutation.isPending,
    error: uploadFileMutation.error?.message || null,
  };
};
