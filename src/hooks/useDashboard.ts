import { useQuery, useMutation, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DashboardForm, DashboardList, DashboardListSchema } from "@/zodSchema/dashboardSchema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DashboardInfoType, ValueType } from "@/types/dashboardType";
import { useAuth } from "@/hooks/useAuth";

interface UseDashboardListProps extends DashboardForm {
  options?: Omit<UseQueryOptions<DashboardList, Error>, "queryKey" | "queryFn">;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

interface CreateDashboardForm {
  title: string;
  color: string;
}

export const useDashboard = ({
  cursorId,
  page = 1,
  size = 10,
  options = {},
  showErrorToast = true,
  customErrorMessage,
  dashboardId,
}: UseDashboardListProps & { dashboardId?: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 대시보드 상세 정보 조회 쿼리
  const dashboardInfoQuery = useQuery<DashboardInfoType>({
    queryKey: ["dashboardInfo", dashboardId],
    queryFn: async () => {
      const response = await axios.get(`/api/dashboards/${dashboardId}`);
      return response.data;
    },
    enabled: !!dashboardId,
  });

  // 대시보드 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: async (data: CreateDashboardForm) => {
      const response = await axios.post("/api/dashboards", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("대시보드 생성 완료");
      const dashboardId = data.user.id;
      router.push(`dashboard/${dashboardId}`);
    },
    onError: () => {
      toast.error("대시보드 생성 실패");
    },
  });

  // 대시보드 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: async (data: ValueType) => {
      const response = await axios.put(`/api/dashboards/${dashboardId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("대시보드 정보가 수정되었습니다");
      // 즉시 캐시 업데이트
      queryClient.setQueryData(["dashboardInfo", dashboardId], (oldData: any) => ({
        ...oldData,
        ...data,
      }));
      // 대시보드 목록도 업데이트
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
    onError: (error) => {
      console.error("Error updating dashboard:", error);
      toast.error("대시보드 변경에 실패했습니다");
    },
  });

  // 대시보드 목록 조회 쿼리
  const queryResult = useQuery<DashboardList, Error>({
    queryKey: ["dashboards", cursorId, page, size],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          params: { cursorId, page, size },
        });
        return DashboardListSchema.parse(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 500) {
            const errorMessage = customErrorMessage || "해당 대시보드 아이디는 존재하지 않습니다.";
            if (showErrorToast) {
              toast.error(errorMessage);
            }
          }
        }
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    ...options,
  });

  const getDashboardById = (dashboardId: number) => {
    return queryResult.data?.dashboards.find((dashboard) => dashboard.id === dashboardId);
  };

  const getMyDashboards = () => {
    return queryResult.data?.dashboards.filter((dashboard) => dashboard.createdByMe) || [];
  };

  const getInvitedDashboards = () => {
    return queryResult.data?.dashboards.filter((dashboard) => !dashboard.createdByMe) || [];
  };

  return {
    ...queryResult,
    createDashboard: createMutation.mutate,
    updateDashboard: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    dashboardInfo: dashboardInfoQuery.data,
    isDashboardLoading: dashboardInfoQuery.isLoading,
    dashboardError: dashboardInfoQuery.error,
    getDashboardById,
    getMyDashboards,
    getInvitedDashboards,
    dashboards: {
      all: queryResult.data?.dashboards || [],
      mine: getMyDashboards(),
      invited: getInvitedDashboards(),
      total: queryResult.data?.totalCount || 0,
    },
  };
};
