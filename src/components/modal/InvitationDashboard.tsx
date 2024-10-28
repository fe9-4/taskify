import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputItem from "../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import { FormData, FormSchema } from "@/zodSchema/invitationSchema";
import { useDashboardList } from "@/hooks/useDashboardList";
import { useInvitation } from "@/hooks/useInvitation";

const InvitationDashboard = () => {
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const params = useParams();
  const router = useRouter();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;
  const { user } = useAuth();

  // 대시보드 멤버 여부 확인
  const { members } = useDashboardMember({
    dashboardId: currentDashboardId || 0,
    page: 1,
    size: 100,
  });
  const isMember = members.members.length > 0;

  // 대시보드 목록 조회
  const { data: dashboardList, error: dashboardError } = useDashboardList({ page: 1, size: 10 });

  // 대시보드 에러 처리
  useEffect(() => {
    if (dashboardError) {
      setIsInvitationDashboardOpen(false);
      router.back();
    }
  }, [dashboardError, setIsInvitationDashboardOpen, router]);

  const isOwner = dashboardList?.dashboards.some(
    (dashboard) => dashboard.id === currentDashboardId && dashboard.createdByMe
  );

  // 초대 목록 조회
  const { invitationList, inviteMember } = useInvitation({
    dashboardId: currentDashboardId || 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      FormSchema.refine((data) => data.email !== user?.email, {
        message: "본인은 초대할 수 없습니다.",
        path: ["email"],
      }).refine((data) => !members.members.some((member) => member.email === data.email), {
        message: "이미 대시보드의 멤버입니다.",
        path: ["email"],
      })
    ),
  });

  const onSubmit = async (data: FormData) => {
    // 초대 권한 확인
    if (!isOwner && !isMember) {
      toast.error("초대 권한이 없습니다.");
      return;
    }

    // 이미 초대된 사용자인지 확인
    const existingInvitation = invitationList?.invitations.find(
      (invitation) => invitation.invitee.email === data.email
    );

    if (existingInvitation && !existingInvitation.inviteAccepted) {
      toast.error("이미 초대 요청을 한 계정입니다.");
      return;
    } else if (existingInvitation && existingInvitation.inviteAccepted) {
      toast.error("이미 초대를 수락한 계정입니다.");
      return;
    }

    try {
      await inviteMember(data);
      setIsInvitationDashboardOpen(false);
    } catch (error) {
      setIsInvitationDashboardOpen(false);
    }
  };

  const email = watch("email");
  const isValid = email && !errors.email;
  const isLoading = false;

  // 초대 권한이 없는 경우 모달을 표시하지 않음
  if (!isOwner && !isMember) {
    setIsInvitationDashboardOpen(false);
    return null;
  }

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">초대하기</h2>
      <InputItem
        id="email"
        type="email"
        label="이메일"
        placeholder="taskify@taskyify.com"
        {...register("email", { required: true })}
        errors={errors.email ? (errors.email.message as string) : ""}
      />
      <div className="mt-6 flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setIsInvitationDashboardOpen(false)}>취소</CancelBtn>
        <ConfirmBtn disabled={!isValid || isLoading} onClick={handleSubmit(onSubmit)}>
          생성
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default InvitationDashboard;
