import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MemberForm, MemberList, MemberListSchema } from "@/zodSchema/memberSchema";
import toast from "react-hot-toast";
import { useState } from "react";

interface UseDashboardMemberProps extends MemberForm {
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

export const useMember = ({
  dashboardId,
  page = 1,
  size = 20,
  showErrorToast = true,
  customErrorMessage,
}: UseDashboardMemberProps) => {
  const queryClient = useQueryClient();
  const [totalCount, setTotalCount] = useState(0);

  // 멤버 목록 조회 쿼리
  const queryResult = useQuery<MemberList, Error>({
    queryKey: ["memberData", dashboardId, page, size],
    queryFn: async () => {
      if (dashboardId <= 0) {
        return { members: [], totalCount: 0 };
      }

      try {
        const response = await axios.get("/api/members", {
          params: { dashboardId, page, size },
        });
        const parsedData = MemberListSchema.parse(response.data);
        setTotalCount(parsedData.totalCount);
        return parsedData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = customErrorMessage || "멤버 목록을 불러오는데 실패했습니다.";
          if (showErrorToast && error.response?.status === 500) {
            toast.error(errorMessage);
            console.error("대시보드 멤버 목록 조회 실패:", error.message);
          }
        }
        return { members: [], totalCount: 0 };
      }
    },
    enabled: dashboardId > 0,
    staleTime: 1000 * 60 * 5,
  });

  // 멤버 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await axios.delete(`/api/members/${memberId}`);
      return response.data;
    },
    onSuccess: (_, memberId) => {
      const member = queryResult.data?.members.find((m) => m.userId === memberId);
      toast.success(`멤버 ${member?.nickname}가 삭제되었습니다`);
      queryClient.invalidateQueries({ queryKey: ["members", dashboardId] });
    },
    onError: (error) => {
      console.error("Error deleting member:", error);
      toast.error("삭제하는 중 오류가 발생했습니다.");
    },
  });

  // 페이지네이션 관련 계산
  const totalPage = Math.ceil(totalCount / size);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPage;

  return {
    ...queryResult,
    memberData: queryResult.data || { members: [], totalCount: 0 },
    deleteMember: deleteMutation.mutate,
    pagination: {
      currentPage: page,
      totalPages: totalPage,
      isFirstPage,
      isLastPage,
      totalCount,
    },
  };
};
