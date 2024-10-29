import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MemberForm, MemberList, MemberListSchema } from "@/zodSchema/memberSchema";
import toast from "react-hot-toast";

interface UseDashboardMemberProps extends MemberForm {
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

// 대시보드 멤버 목록을 조회하는 커스텀 훅
export const useMember = ({
  dashboardId,
  page,
  size,
  showErrorToast = true,
  customErrorMessage,
}: UseDashboardMemberProps) => {
  // 멤버 목록 조회 쿼리
  const queryResult = useQuery<MemberList, Error>({
    queryKey: ["dashboardMembers", dashboardId, page, size],
    queryFn: async () => {
      // dashboardId가 유효하지 않은 경우 빈 목록 반환
      if (dashboardId <= 0) {
        return { members: [], totalCount: 0 };
      }

      try {
        // API 요청 수행
        const response = await axios.get("/api/members", {
          params: {
            dashboardId,
            page,
            size,
          },
        });

        // 응답 데이터 검증
        return MemberListSchema.parse(response.data);
      } catch (error) {
        // 에러 처리
        if (axios.isAxiosError(error)) {
          const errorMessage = customErrorMessage || "멤버 목록을 불러오는데 실패했습니다.";
          if (showErrorToast && error.response?.status === 500) {
            toast.error(errorMessage);
            console.error("대시보드 멤버 목록 조회 실패:", error.message);
          }
        }
        // 에러 발생 시 빈 목록 반환
        return { members: [], totalCount: 0 };
      }
    },
    // dashboardId가 유효할 때만 쿼리 실행
    enabled: dashboardId > 0,
    // 5분 동안 캐시 유효
    staleTime: 1000 * 60 * 5,
  });

  // 이메일로 멤버 찾기
  const getMemberByEmail = (email: string) => {
    return queryResult.data?.members.find((member) => member.email === email);
  };

  return {
    ...queryResult,
    members: queryResult.data || { members: [], totalCount: 0 }, // 기본값 제공
    getMemberByEmail, // 이메일로 멤버 찾기
    // 편의를 위한 데이터 구조화
    memberData: {
      list: queryResult.data?.members || [], // 멤버 목록
      total: queryResult.data?.totalCount || 0, // 전체 멤버 수
    },
  };
};
