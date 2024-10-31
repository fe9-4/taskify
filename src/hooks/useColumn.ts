import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ColumnListSchemaType,
  CreateColumnSchemaType,
  UpdateColumnSchemaType,
  ColumnSchema,
  ColumnListSchema,
  ColumnSchemaType,
} from "@/zodSchema/columnSchema";

const MAX_COLUMNS = 10;

export const useColumn = ({
  dashboardId,
  showErrorToast = true,
  customErrorMessage,
}: {
  dashboardId: number;
  columnId?: number;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}) => {
  const queryClient = useQueryClient();
  const dashboardIdString = String(dashboardId);

  // 컬럼 목록 조회
  const { data: columnList } = useQuery<ColumnListSchemaType>({
    queryKey: ["columnList", dashboardIdString],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);
        return ColumnListSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching columns:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || "컬럼 목록을 불러오는데 실패했습니다.");
        }
        throw error;
      }
    },
    enabled: !!dashboardIdString,
  });

  // 컬럼 생성
  const { mutateAsync: createColumn, isPending: isCreating } = useMutation<
    ColumnSchemaType,
    Error,
    CreateColumnSchemaType
  >({
    mutationFn: async (data: CreateColumnSchemaType) => {
      try {
        if ((columnList?.length || 0) >= MAX_COLUMNS) {
          throw new Error("컬럼은 최대 10개까지만 생성할 수 있습니다");
        }
        const response = await axios.post(`/api/columns`, data);
        return ColumnSchema.parse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (newColumn) => {
      toast.success("컬럼이 생성되었습니다");
      queryClient.setQueryData<ColumnListSchemaType>(["columnList", dashboardIdString], (old) =>
        old ? [...old, newColumn] : [newColumn]
      );
      queryClient.invalidateQueries({
        queryKey: ["columnList", dashboardIdString],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(error.message || "컬럼 생성에 실패했습니다");
    },
  });

  // 컬럼 수정
  const { mutateAsync: updateColumn, isPending: isUpdating } = useMutation<
    ColumnSchemaType,
    Error,
    { columnId: number; data: UpdateColumnSchemaType }
  >({
    mutationFn: async ({ columnId, data }) => {
      try {
        const response = await axios.put(`/api/columns/${columnId}`, data);
        return ColumnSchema.parse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (updatedColumn) => {
      toast.success("컬럼이 수정되었습니다");
      queryClient.setQueryData<ColumnListSchemaType>(["columnList", dashboardIdString], (old) =>
        old ? old.map((col) => (col.id === updatedColumn.id ? updatedColumn : col)) : []
      );
      queryClient.invalidateQueries({
        queryKey: ["columnList", dashboardIdString],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(error.message || "컬럼 수정에 실패했습니다");
    },
  });

  // 컬럼 삭제
  const { mutateAsync: deleteColumn, isPending: isDeleting } = useMutation<void, Error, number>({
    mutationFn: async (columnId: number) => {
      try {
        await axios.delete(`/api/columns/${columnId}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (_, deletedColumnId) => {
      toast.success("컬럼이 삭제되었습니다");
      queryClient.setQueryData<ColumnListSchemaType>(["columnList", dashboardIdString], (old) =>
        old ? old.filter((col) => col.id !== deletedColumnId) : []
      );
      queryClient.invalidateQueries({
        queryKey: ["columnList", dashboardIdString],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(error.message || "컬럼 삭제에 실패했습니다");
    },
  });

  // 카드 이미지 업로드
  const { mutateAsync: uploadCardImage, isPending: isUploading } = useMutation<
    string,
    Error,
    { columnId: number; formData: FormData }
  >({
    mutationFn: async ({ columnId, formData }) => {
      try {
        const response = await axios.post(`/api/columns/${columnId}/card-image`, formData);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("이미지가 업로드되었습니다");
    },
    onError: (error) => {
      toast.error(error.message || "이미지 업로드에 실패했습니다");
    },
  });

  return {
    columnList,
    createColumn,
    updateColumn,
    deleteColumn,
    uploadCardImage,
    isCreating,
    isUpdating,
    isDeleting,
    isUploading,
    canAddColumn: (columnList?.length || 0) < MAX_COLUMNS,
  };
};
