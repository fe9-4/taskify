import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Dashboard,
  UpdateDashboard,
  DashboardList,
  DashboardSchema,
  CreateDashboard,
} from "@/zodSchema/dashboardSchema";
import toastMessages from "@/lib/toastMessage";

interface DashboardOptions {
  dashboardId?: number;
  page?: number;
  size?: number;
  cursorId?: number | null;
  showErrorToast?: boolean;
  customErrorMessage?: string;
  enabled?: boolean;
}

// createDashboard를 위한 별도의 hook
const useCreateDashboard = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createDashboard, isPending: isCreating } = useMutation<Dashboard, Error, CreateDashboard>({
    mutationFn: async (data: CreateDashboard) => {
      try {
        const response = await axios.post("/api/dashboards", data);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(toastMessages.success.createDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      return data;
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.createDashboard);
    },
  });

  return { createDashboard, isCreating };
};

export const useDashboard = ({
  dashboardId,
  page,
  size,
  cursorId = null,
  showErrorToast = false,
  customErrorMessage,
  enabled = true,
}: DashboardOptions) => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 대시보드 목록 조회
  const { data: dashboardData, isLoading: isDashboardListLoading } = useQuery<DashboardList>({
    queryKey: ["dashboardData", page, size, cursorId],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          params: { page, size, cursorId },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching dashboards:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || toastMessages.error.getDashboardList);
        }
        throw error;
      }
    },
    enabled: enabled && !!user,
  });

  // 대시보드 상세 조회
  const { data: dashboardInfo, isLoading: isDashboardInfoLoading } = useQuery<Dashboard>({
    queryKey: ["dashboardInfo", dashboardId],
    queryFn: async () => {
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

      try {
        const response = await axios.get(`/api/dashboards/${dashboardId}`);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching dashboard info:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || toastMessages.error.getDashboard);
        }
        throw error;
      }
    },
    enabled: !!user && !!dashboardId && enabled,
  });

  // 대시보드 수정
  const { mutateAsync: updateDashboard, isPending: isUpdating } = useMutation<
    Dashboard,
    Error,
    { id: number; data: UpdateDashboard }
  >({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axios.put(`/api/dashboards/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(toastMessages.success.editDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardInfo", dashboardId] });
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.editDashboard);
    },
  });

  // 대시보드 삭제
  const { mutateAsync: deleteDashboard, isPending: isDeleting } = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`/api/dashboards/${id}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(toastMessages.success.deleteDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      router.push("/mydashboard");
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.deleteDashboard);
    },
  });

  return {
    dashboardData,
    dashboardInfo,
    updateDashboard,
    deleteDashboard,
    isLoading: isDashboardListLoading || isDashboardInfoLoading,
    isUpdating,
    isDeleting,
  };
};

// createDashboard를 별도로 export
export { useCreateDashboard };
