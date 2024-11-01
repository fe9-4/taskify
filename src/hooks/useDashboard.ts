import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Dashboard,
  UpdateDashboard,
  DashboardList,
  DashboardListSchema,
  DashboardSchema,
} from "@/zodSchema/dashboardSchema";

interface DashboardOptions {
  dashboardId?: number;
  page?: number;
  size?: number;
  cursorId?: number;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

interface CreateDashboardData {
  title: string;
  color: string;
}

// createDashboard를 위한 별도의 hook
const useCreateDashboard = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createDashboard, isPending: isCreating } = useMutation<Dashboard, Error, CreateDashboardData>({
    mutationFn: async (data: CreateDashboardData) => {
      try {
        const response = await axios.post("/api/dashboards", data);
        console.log(response.data);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("대시보드가 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "대시보드 생성에 실패했습니다");
    },
  });

  return { createDashboard, isCreating };
};

export const useDashboard = ({
  dashboardId,
  page = 1,
  size = 10,
  cursorId,
  showErrorToast = true,
  customErrorMessage,
}: DashboardOptions = {}) => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 대시보드 목록 조회
  const { data: dashboardData } = useQuery<DashboardList>({
    queryKey: ["dashboardData", page, size, cursorId],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          params: { page, size, cursorId },
        });
        return DashboardListSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || "대시보드 목록을 불러오는데 실패했습니다.");
        }
        throw error;
      }
    },
    enabled: !!user,
    initialData: {
      dashboards: [],
      totalCount: 0,
      cursorId: null,
    },
  });

  // 대시보드 상세 조회
  const { data: dashboardInfo } = useQuery<Dashboard>({
    queryKey: ["dashboardInfo", dashboardId],
    queryFn: async () => {
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

      try {
        const response = await axios.get(`/api/dashboards/${dashboardId}`);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching dashboard info:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || "대시보드 정보를 불러오는데 실패했습니다.");
        }
        throw error;
      }
    },
    enabled: !!user && !!dashboardId,
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
      toast.success("대시보드가 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardInfo", dashboardId] });
    },
    onError: (error) => {
      toast.error(error.message || "대시보드 수정에 실패했습니다");
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
      toast.success("대시보드가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      router.push("/mydashboard");
    },
    onError: (error) => {
      toast.error(error.message || "대시보드 삭제에 실패했습니다");
    },
  });

  return {
    dashboardData,
    dashboardInfo,
    updateDashboard,
    deleteDashboard,
    isUpdating,
    isDeleting,
  };
};

// createDashboard를 별도로 export
export { useCreateDashboard };
