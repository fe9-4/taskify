import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DashboardForm, DashboardList, DashboardListSchema } from "@/zodSchema/dashboardSchema";
import toast from "react-hot-toast";

interface UseDashboardListProps extends DashboardForm {
  options?: Omit<UseQueryOptions<DashboardList, Error>, "queryKey" | "queryFn">;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

// 대시보드 관련 커스텀 훅
export const useDashboard = ({
  cursorId,
  page,
  size,
  options = {},
  showErrorToast = true,
  customErrorMessage,
}: UseDashboardListProps) => {
  // 대시보드 목록 조회 쿼리
  const queryResult = useQuery<DashboardList, Error>({
    queryKey: ["dashboardList", cursorId, page, size],
    queryFn: async () => {
      try {
        // API 요청 수행
        const response = await axios.get("/api/dashboards", {
          params: { cursorId, page, size },
        });

        // 응답 데이터 검증
        return DashboardListSchema.parse(response.data);
      } catch (error) {
        // 에러 처리
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
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
    ...options, // 추가 옵션 적용
  });

  // 특정 대시보드가 존재하는지 확인
  const getDashboardById = (dashboardId: number) => {
    return queryResult.data?.dashboards.find((dashboard) => dashboard.id === dashboardId);
  };

  // 내가 생성한 대시보드 목록 필터링
  const getMyDashboards = () => {
    return queryResult.data?.dashboards.filter((dashboard) => dashboard.createdByMe) || [];
  };

  // 초대된 대시보드 목록 필터링
  const getInvitedDashboards = () => {
    return queryResult.data?.dashboards.filter((dashboard) => !dashboard.createdByMe) || [];
  };

  return {
    ...queryResult, // 기본 쿼리 결과 전달
    getDashboardById, // 특정 대시보드 조회
    getMyDashboards, // 내가 생성한 대시보드 목록
    getInvitedDashboards, // 초대된 대시보드 목록
    // 편의를 위한 데이터 구조화
    dashboards: {
      all: queryResult.data?.dashboards || [],
      mine: getMyDashboards(),
      invited: getInvitedDashboards(),
      total: queryResult.data?.totalCount || 0,
    },
  };
};
