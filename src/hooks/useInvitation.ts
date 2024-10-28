import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Invitation, InvitationList, InvitationListSchema, InvitationSchema } from "@/zodSchema/invitationSchema";
import toast from "react-hot-toast";

interface UseInvitationProps {
  dashboardId: string | number; // string | number 타입으로 받아서 내부에서 처리
}

interface InviteEmailData {
  email: string;
}

export const useInvitation = ({ dashboardId }: UseInvitationProps) => {
  const queryClient = useQueryClient();
  const dashboardIdString = String(dashboardId); // 내부에서 string으로 변환

  // 초대 목록 조회
  const {
    data: invitationList,
    isLoading,
    error,
  } = useQuery<InvitationList>({
    queryKey: ["invitations", dashboardIdString],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/dashboards/${dashboardIdString}/invitations`);
        return InvitationListSchema.parse(response.data);
      } catch (error) {
        console.error("초대 목록을 불러오는데 실패했습니다.", error);
        throw error;
      }
    },
    enabled: !!dashboardId,
  });

  // 초대하기 mutation
  const { mutateAsync: inviteMember, isPending: isInviting } = useMutation<Invitation, Error, InviteEmailData>({
    mutationFn: async (data: InviteEmailData) => {
      const response = await axios.post(`/api/dashboards/${dashboardIdString}/invitations`, data);
      return InvitationSchema.parse(response.data);
    },
    onSuccess: () => {
      toast.success("초대 완료");
      queryClient.invalidateQueries({ queryKey: ["invitations", dashboardIdString] });
    },
    onError: () => {
      toast.error("초대 실패");
    },
  });

  // 이미 초대된 이메일인지 확인하는 함수
  const isAlreadyInvited = (email: string) => {
    return invitationList?.invitations.some((invitation) => invitation.invitee.email === email) ?? false;
  };

  return {
    invitationList, // 초대 목록 데이터
    isLoading, // 초대 목록 로딩 상태
    error, // 초대 목록 조회 에러
    inviteMember, // 초대하기 함수
    isInviting, // 초대 진행 중 상태
    isAlreadyInvited, // 이미 초대된 이메일인지 확인하는 함수
  };
};
