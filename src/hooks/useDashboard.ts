import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dashboard, UpdateDashboard } from "@/zodSchema/dashboardSchema";

interface DashboardResponse {
  dashboards: Dashboard[];
  totalCount: number;
}

export const useDashboard = (dashboardId?: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 대시보드 목록 조회
  const { data: dashboardData, ...queryRest } = useQuery<DashboardResponse>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboards");
      const { dashboards, totalCount } = response.data;
      return { dashboards, totalCount };
    },
  });

  // 대시보드 상세 조회
  const { data: dashboardInfo } = useQuery<Dashboard>({
    queryKey: ["dashboardInfo", dashboardId],
    queryFn: async () => {
      const response = await axios.get(`/api/dashboards/${dashboardId}`);
      return response.data;
    },
    enabled: !!dashboardId,
  });

  // 대시보드 생성
  const createMutation = useMutation({
    mutationFn: async (data: { title: string; color: string }) => {
      const response = await axios.post("/api/dashboards", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("대시보드가 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
    onError: () => {
      toast.error("대시보드 생성에 실패했습니다");
    },
  });

  // 대시보드 수정
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDashboard }) => {
      const response = await axios.put(`/api/dashboards/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("대시보드가 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardInfo", dashboardId] });
    },
    onError: () => {
      toast.error("대시보드 수정에 실패했습니다");
    },
  });

  // 대시보드 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/dashboards/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("대시보드가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      router.push("/mydashboard");
    },
    onError: () => {
      toast.error("대시보드 삭제에 실패했습니다");
    },
  });

  return {
    dashboardData,
    totalCount: dashboardData?.totalCount || 0,
    dashboardInfo,
    getDashboardById: (dashboardId: number) =>
      dashboardData?.dashboards.find((dashboard: Dashboard) => dashboard.id === dashboardId),
    ...queryRest,
    createDashboard: createMutation.mutate,
    updateDashboard: updateMutation.mutate,
    deleteDashboard: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
