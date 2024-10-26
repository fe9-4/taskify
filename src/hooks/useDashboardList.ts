import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardForm, DashboardList, UserDashboardSchema } from "@/zodSchema/dashboardSchema";

export const useDashboardList = ({ page, size }: DashboardForm) => {
  return useQuery<DashboardList, Error>({
    // 쿼리 키 설정: 페이지와 크기가 변경될 때마다 새로운 쿼리 실행
    queryKey: ["dashboardList", page, size],
    // 대시보드 목록을 가져오는 비동기 함수
    queryFn: async () => {
      const response = await axios.get("/api/dashboards", {
        params: { page, size },
      });
      // 응답 데이터를 UserDashboardSchema를 사용하여 검증 및 파싱
      return UserDashboardSchema.parse(response.data).user;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
  });
};
