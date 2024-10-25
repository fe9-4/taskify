import { useQuery, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DashboardList, UserDashboardSchema } from "@/zodSchema/dashboardSchema";

const queryClient = new QueryClient();

export const useDashboardList = () => {
  return useQuery<DashboardList, Error>({
    queryKey: ["dashboardList"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/list");
      const parsedData = UserDashboardSchema.parse(response.data).user;
      //console.log("parsed data: ", parsedData);
      return parsedData;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 "신선"하다고 간주
    refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
  });
};

// 캐시 무효화 함수
export const invalidateDashboardList = () => {
  queryClient.invalidateQueries({ queryKey: ["dashboardList"] });
};
