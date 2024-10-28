import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardForm, DashboardList, DashboardListSchema } from "@/zodSchema/dashboardSchema";
import toast from "react-hot-toast";

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
          toast.error("해당 대시보드 아이디는 존재하지 않습니다.");
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
  });
};
