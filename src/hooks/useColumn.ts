import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ColumnSchemaType,
  ColumnListSchemaType,
  CreateColumnSchemaType,
  UpdateColumnSchemaType,
} from "@/zodSchema/columnSchema";

const MAX_COLUMNS = 10;

export const useColumn = (dashboardId?: string | number) => {
  const queryClient = useQueryClient();

  // 컬럼 목록 조회 쿼리
  const { data: columns, ...queryRest } = useQuery<ColumnListSchemaType>({
    queryKey: ["columns", dashboardId],
    queryFn: async () => {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);
      return response.data;
    },
    enabled: !!dashboardId,
  });

  // 컬럼 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: async (data: CreateColumnSchemaType) => {
      // 컬럼 개수 체크
      if ((columns?.length || 0) >= MAX_COLUMNS) {
        throw new Error("컬럼은 최대 10개까지만 생성할 수 있습니다");
      }
      const response = await axios.post("/api/columns", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("컬럼이 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["columns", dashboardId] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("컬럼 생성에 실패했습니다");
      }
    },
  });

  // 컬럼 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: async ({ columnId, data }: { columnId: number; data: UpdateColumnSchemaType }) => {
      const response = await axios.put(`/api/columns/${columnId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("컬럼이 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["columns", dashboardId] });
    },
    onError: () => {
      toast.error("컬럼 수정에 실패했습니다");
    },
  });

  // 컬럼 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: async (columnId: number) => {
      const response = await axios.delete(`/api/columns/${columnId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("컬럼이 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["columns", dashboardId] });
    },
    onError: () => {
      toast.error("컬럼 삭제에 실패했습니다");
    },
  });

  // 카드 이미지 업로드 뮤테이션
  const uploadImageMutation = useMutation({
    mutationFn: async ({ columnId, formData }: { columnId: number; formData: FormData }) => {
      const response = await axios.post(`/api/columns/${columnId}/card-image`, formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("이미지가 업로드되었습니다");
    },
    onError: () => {
      toast.error("이미지 업로드에 실패했습니다");
    },
  });

  // 컬럼 순서 변경 처리
  const reorderColumn = async (columnId: number, newOrder: number) => {
    try {
      await updateMutation.mutateAsync({
        columnId,
        data: {
          title: columns?.find((col) => col.id === columnId)?.title || "",
          order: newOrder,
        },
      });
    } catch (error) {
      console.error("컬럼 순서 변경 실패:", error);
    }
  };

  return {
    columns: columns || [],
    ...queryRest,
    createColumn: createMutation.mutate,
    updateColumn: updateMutation.mutate,
    deleteColumn: deleteMutation.mutate,
    uploadCardImage: uploadImageMutation.mutate,
    reorderColumn,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadImageMutation.isPending,
    totalColumns: columns?.length || 0,
    canAddColumn: (columns?.length || 0) < MAX_COLUMNS,
  };
};
