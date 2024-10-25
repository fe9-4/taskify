import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MemberList, MemberListSchema, MemberForm } from "@/zodSchema/memberSchema";

// 대시보드 멤버 목록을 가져오는 커스텀 훅
export const useDashboardMember = ({ dashboardId, page = 1, size = 10 }: MemberForm) => {
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
    // 응답 데이터를 MemberListSchema를 사용하여 검증 및 파싱
    const parsedData = MemberListSchema.parse(response.data);

    return parsedData;
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
    members: members || { members: [] },
    isLoading,
    error,
    refetch,
  };
};
