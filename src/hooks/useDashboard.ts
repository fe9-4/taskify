import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Dashboard,
  UpdateDashboard,
  DashboardList,
  DashboardSchema,
  CreateDashboard,
  DashboardListSchema,
} from "@/zodSchema/dashboardSchema";
import { InvitationList, InvitationListSchema, InvitationResponse } from "@/zodSchema/invitationSchema";
import toastMessages from "@/lib/toastMessage";
import { useMember } from "@/hooks/useMember";

interface DashboardOptions {
  dashboardId?: number;
  page?: number;
  size?: number;
  cursorId?: number | null;
  showErrorToast?: boolean;
  customErrorMessage?: string;
  enabled?: boolean;
}

interface InviteEmailData {
  email: string;
}

// createDashboard를 위한 별도의 hook
const useCreateDashboard = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createDashboard, isPending: isCreating } = useMutation<Dashboard, Error, CreateDashboard>({
    mutationFn: async (data: CreateDashboard) => {
      try {
        const response = await axios.post("/api/dashboards", data);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(toastMessages.success.createDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      return data;
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.createDashboard);
    },
  });

  return { createDashboard, isCreating };
};

export const useDashboard = ({
  dashboardId,
  page = 1,
  size = 10,
  cursorId = null,
  showErrorToast = false,
  customErrorMessage,
  enabled = true,
}: DashboardOptions) => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dashboardIdString = dashboardId ? String(dashboardId) : undefined;

  // 대시보드 멤버 목록 조회
  const { memberData } = useMember({
    dashboardId: Number(dashboardId),
    page,
    size,
    showErrorToast: true,
    enabled: !!dashboardId && enabled,
  });

  // 대시보드 목록 조회
  const { data: dashboardData, isLoading: isDashboardListLoading } = useQuery<DashboardList>({
    queryKey: ["dashboardData", page, size, cursorId],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/dashboards", {
          params: { page, size, cursorId },
        });
        return DashboardListSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || toastMessages.error.getDashboardList);
        }
        throw error;
      }
    },
    enabled: !!user && !!dashboardId && enabled,
    placeholderData: {
      dashboards: [],
      totalCount: 0,
      cursorId: null,
    },
    retry: false,
  });

  // 대시보드 상세 조회
  const { data: dashboardInfo, isLoading: isDashboardInfoLoading } = useQuery<Dashboard>({
    queryKey: ["dashboardInfo", dashboardId],
    queryFn: async () => {
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

      try {
        const response = await axios.get(`/api/dashboards/${dashboardId}`);
        return DashboardSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching dashboard info:", error);
        if (showErrorToast) {
          toast.error(customErrorMessage || toastMessages.error.getDashboard);
        }
        throw error;
      }
    },
    enabled: !!user && !!dashboardId && enabled,
  });

  // 초대 목록 조회
  const { data: invitationList } = useQuery<InvitationList>({
    queryKey: ["invitations", dashboardIdString],
    queryFn: async () => {
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

      try {
        const response = await axios.get(`/api/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`);
        return InvitationListSchema.parse(response.data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }
    },
    enabled: !!dashboardId && enabled,
    placeholderData: {
      invitations: [],
      totalCount: 0,
    },
  });

  // 초대 가능 여부 확인 함수
  const validateInvitation = (email: string) => {
    if (!user || !memberData) return;

    if (email === user.email) {
      throw new Error("본인은 초대할 수 없습니다.");
    }

    if (memberData.members.some((member) => member.email === email)) {
      throw new Error("이미 대시보드의 멤버입니다.");
    }

    const existingInvitation = invitationList?.invitations?.find(
      (invitation) => invitation.invitee.email === email && invitation.inviteAccepted == null
    );

    if (existingInvitation) {
      throw new Error("이미 초대 요청을 한 계정입니다.");
    }
  };

  // 초대하기 mutation
  const { mutateAsync: inviteMember, isPending: isInviting } = useMutation<InvitationResponse, Error, InviteEmailData>({
    mutationFn: async (data: InviteEmailData) => {
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

      validateInvitation(data.email);
      const response = await axios.post(`/api/dashboards/${dashboardId}/invitations`, data);
      return response.data;
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
      if (!dashboardId) throw new Error("대시보드 ID가 필요합니다.");

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

  // 대시보드 수정
  const { mutateAsync: updateDashboard, isPending: isUpdating } = useMutation<
    Dashboard,
    Error,
    { id: number; data: UpdateDashboard }
  >({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axios.put(`/api/dashboards/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(toastMessages.success.editDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardInfo", dashboardId] });
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.editDashboard);
    },
  });

  // 대시보드 삭제
  const { mutateAsync: deleteDashboard, isPending: isDeleting } = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`/api/dashboards/${id}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(toastMessages.success.deleteDashboard);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      router.push("/mydashboard");
    },
    onError: (error) => {
      toast.error(error.message || toastMessages.error.deleteDashboard);
    },
  });

  return {
    dashboardData,
    dashboardInfo,
    invitationList,
    updateDashboard,
    deleteDashboard,
    inviteMember,
    cancelInvitation,
    isLoading: isDashboardListLoading || isDashboardInfoLoading,
    isUpdating,
    isDeleting,
    isInviting,
    isCanceling,
  };
};

// createDashboard를 별도로 export
export { useCreateDashboard };
