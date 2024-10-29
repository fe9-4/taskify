import { InvitationList, InvitationListSchema, InvitationResponse } from "@/zodSchema/invitationSchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface InviteEmailData {
  email: string;
}

export const useInvitation = ({ dashboardId }: { dashboardId: number }) => {
  const queryClient = useQueryClient();
  const dashboardIdString = String(dashboardId);

  // 초대 목록 조회를 query로 변경
  const { data: invitationList, refetch } = useQuery<InvitationList>({
    queryKey: ["invitations", dashboardIdString],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/dashboards/${dashboardId}/invitations?page=1&size=100`);

        // 응답 데이터 구조 변환
        const transformedData = {
          invitations: response.data.invitations || [],
          totalCount: response.data.invitations.totalCount || 0,
        };

        // 변환된 데이터 검증
        return InvitationListSchema.parse(transformedData);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }
    },
    initialData: {
      invitations: [],
      totalCount: 0,
    },
  });

  // 초대하기 mutation
  const { mutateAsync: inviteMember, isPending: isInviting } = useMutation<InvitationResponse, Error, InviteEmailData>({
    mutationFn: async (data: InviteEmailData) => {
      const response = await axios.post(`/api/dashboards/${dashboardIdString}/invitations`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("초대 완료");
      refetch(); // 초대 목록 즉시 갱신
      queryClient.invalidateQueries({ queryKey: ["invitations", dashboardIdString] });
    },
    onError: () => {
      toast.error("초대 실패");
    },
  });

  // 초대 취소 mutation
  const { mutateAsync: cancelInvitation, isPending: isCanceling } = useMutation({
    mutationFn: async (invitationId: number) => {
      const response = await axios.delete(`/api/dashboards/${dashboardId}/invitations/${invitationId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("초대가 취소되었습니다");
      refetch(); // 초대 목록 즉시 갱신
      queryClient.invalidateQueries({ queryKey: ["invitations", dashboardIdString] });
    },
    onError: () => {
      toast.error("초대 취소에 실패했습니다");
    },
  });

  return {
    invitationList,
    inviteMember,
    isInviting,
    cancelInvitation,
    isCanceling,
    refetch,
  };
};
