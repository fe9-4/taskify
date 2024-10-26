import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MemberForm, MemberList, MemberListSchema } from "@/zodSchema/memberSchema";

// 대시보드 멤버 목록을 가져오는 커스텀 훅
export const useDashboardMember = ({ dashboardId, page, size }: MemberForm) => {
  // 멤버 목록을 가져오는 비동기 함수
  const fetchMembers = async (): Promise<MemberList> => {
    if (dashboardId <= 0) {
      return { members: [], totalCount: 0 };
    }

    const response = await axios.get("/api/members", {
      params: {
        dashboardId,
        page,
        size,
      },
    });

    return MemberListSchema.parse(response.data);
  };

  // React Query를 사용하여 멤버 목록 데이터 관리
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useQuery<MemberList, Error>({
    queryKey: ["dashboardMembers", dashboardId, page, size],
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
    enabled: !!dashboardId && dashboardId > 0, // dashboardId가 유효할 때만 쿼리 실행
  });

  return {
    members: members || { members: [], totalCount: 0 },
    isLoading,
    error,
    refetch,
  };
};
