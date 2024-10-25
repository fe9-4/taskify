import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MemberList, MemberListSchema, MemberForm } from "@/zodSchema/memberSchema";

// 대시보드 멤버 목록을 가져오는 커스텀 훅
export const useDashboardMember = ({ dashboardId, page = 1, size = 10 }: MemberForm) => {
  // 멤버 목록을 가져오는 비동기 함수
  const fetchMembers = async (): Promise<MemberList> => {
    const response = await axios.get("/api/members", {
      params: {
        dashboardId,
        page,
        size,
      },
    });
    console.log("API Response:", response.data); // 추가된 로그
    // 응답 데이터를 MemberListSchema를 사용하여 검증 및 파싱
    const parsedData = MemberListSchema.parse(response.data);
    //console.log("Parsed Data:", parsedData); // 추가된 로그
    return parsedData;
  };

  // React Query를 사용하여 멤버 목록 데이터 관리
  const {
    data: members, // 멤버 목록 데이터
    isLoading, // 로딩 상태
    error, // 에러 상태
    refetch, // 데이터 재요청 함수
  } = useQuery<MemberList, Error>({
    queryKey: ["dashboardMembers", dashboardId, page, size], // 쿼리 키 설정
    queryFn: fetchMembers, // 데이터 가져오는 함수
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
  });

  // 훅의 반환값
  return {
    members, // 멤버 목록 데이터
    isLoading, // 로딩 상태
    error, // 에러 상태
    refetch, // 데이터 재요청 함수
  };
};
