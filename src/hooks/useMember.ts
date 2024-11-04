import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MemberForm, MemberList, MemberListSchema } from "@/zodSchema/memberSchema";
import { useState } from "react";
import toast from "react-hot-toast";
import toastMessages from "@/lib/toastMessage";

interface UseDashboardMemberProps {
  dashboardId: number;
  page: number;
  size: number;
  enabled?: boolean;
  staleTime?: number;
  showErrorToast?: boolean;
}

export const useMember = ({
  dashboardId,
  page = 1,
  size = 20,
  enabled = true,
  staleTime,
  showErrorToast = true,
}: UseDashboardMemberProps) => {
  const queryClient = useQueryClient();
  const [totalCount, setTotalCount] = useState(0);

  // 멤버 목록 조회 쿼리
  const {
    data: memberData,
    isLoading,
    error,
  } = useQuery<MemberList, Error>({
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
        if (showErrorToast) {
          toast.error(toastMessages.error.getMemberList);
        }
        throw error;
      }
    },
    enabled: enabled && dashboardId > 0,
    staleTime: staleTime || 1000 * 60 * 5,
  });

  // 멤버 삭제 뮤테이션
  const { mutate: deleteMember, error: deleteError } = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await axios.delete(`/api/members/${memberId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberData", dashboardId, page, size] });
    },
  });

  // 페이지네이션 관련 계산
  const totalPage = Math.ceil(totalCount / size);

  return {
    memberData: memberData || { members: [], totalCount: 0 },
    isLoading,
    error,
    deleteError,
    deleteMember,
    pagination: {
      currentPage: page,
      totalPages: totalPage,
      totalCount,
    },
  };
};