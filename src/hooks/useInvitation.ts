import { InvitationList, InvitationListSchema, InvitationResponse } from "@/zodSchema/invitationSchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import toastMessages from "@/lib/toastMessage";

interface InviteEmailData {
  email: string;
}

export const useInvitation = ({ dashboardId }: { dashboardId: number }) => {
  const queryClient = useQueryClient();
  const dashboardIdString = String(dashboardId);
  const { user } = useAuth();

  // 대시보드 멤버 목록 조회
  const { memberData } = useMember({
    dashboardId,
    page: 1,
    size: 100,
    showErrorToast: true,
  });

  // 초대 목록 조회
  const { data: invitationList } = useQuery<InvitationList>({
    queryKey: ["invitations", dashboardIdString],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/dashboards/${dashboardIdString}/invitations?page=1&size=100`);

        return InvitationListSchema.parse(response.data);
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

  // 초대 가능 여부 확인 함수
  const validateInvitation = (email: string) => {
    // 본인 초대 체크
    if (email === user?.email) {
      throw new Error("본인은 초대할 수 없습니다.");
    }

    // 이미 멤버인지 체크
    if (memberData.members.some((member) => member.email === email)) {
      throw new Error("이미 대시보드의 멤버입니다.");
    }

    // 이미 초대된 사용자인지 확인
    const existingInvitation = invitationList?.invitations?.find((invitation) => invitation.invitee.email === email);

    if (existingInvitation && existingInvitation.inviteAccepted == null) {
      throw new Error("이미 초대 요청을 한 계정입니다.");
    }
  };

  // 초대하기 mutation
  const { mutateAsync: inviteMember, isPending: isInviting } = useMutation<InvitationResponse, Error, InviteEmailData>({
    mutationFn: async (data: InviteEmailData) => {
      try {
        validateInvitation(data.email);
        const response = await axios.post(`/api/dashboards/${dashboardIdString}/invitations`, data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(toastMessages.success.invitation);
      queryClient.invalidateQueries({ queryKey: ["invitations", dashboardIdString] });
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.invitation);
    },
  });

  // 초대 취소 mutation
  const { mutateAsync: cancelInvitation, isPending: isCanceling } = useMutation({
    mutationFn: async (invitationId: number) => {
      const response = await axios.delete(`/api/dashboards/${dashboardId}/invitations/${invitationId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success(toastMessages.success.cancelInvitation);
      queryClient.invalidateQueries({ queryKey: ["invitations", dashboardIdString] });
    },
    onError: () => {
      toast.error(toastMessages.error.cancelInvitation);
    },
  });

  return {
    invitationList,
    inviteMember,
    isInviting,
    cancelInvitation,
    isCanceling,
  };
};