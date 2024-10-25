import { useQuery, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DashboardList, UserDashboardSchema } from "@/zodSchema/dashboardSchema";

const queryClient = new QueryClient();

export const useDashboardList = () => {
  return useQuery<DashboardList, Error>({
    queryKey: ["dashboardList"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/list");
      // 응답 데이터를 UserDashboardSchema를 사용하여 검증 및 파싱
      const parsedData = UserDashboardSchema.parse(response.data).user;

      return parsedData;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
  });
};

// 캐시 무효화 함수
export const invalidateDashboardList = () => {
  queryClient.invalidateQueries({ queryKey: ["dashboardList"] });
};
