import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardForm, DashboardList, DashboardListSchema } from "@/zodSchema/dashboardSchema";

export const useDashboardList = ({ cursorId, page, size }: DashboardForm) => {
  return useQuery<DashboardList, Error>({
    // 쿼리 키 설정: 페이지와 크기가 변경될 때마다 새로운 쿼리 실행
    queryKey: ["dashboardList", cursorId, page, size],
    // 대시보드 목록을 가져오는 비동기 함수
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          params: { cursorId, page, size },
        });
        return DashboardListSchema.parse(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          console.error("대시보드 목록을 불러오는 중 오류가 발생했습니다.");
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
  });
};
