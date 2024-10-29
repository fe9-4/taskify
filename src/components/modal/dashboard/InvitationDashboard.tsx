import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputItem from "../../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../../button/ButtonComponents";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import { FormData, FormSchema, Invitation } from "@/zodSchema/invitationSchema";
import { useDashboardList } from "@/hooks/useDashboardList";
import { useInvitation } from "@/hooks/useInvitation";

const InvitationDashboard = () => {
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const params = useParams();
  const router = useRouter();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  // 대시보드 정보 조회
  const {
    getDashboardById,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardList({
    page: 1,
    size: 10,
    showErrorToast: true,
    customErrorMessage: "대시보드를 찾을 수 없습니다.",
  });

  const currentDashboard = currentDashboardId ? getDashboardById(currentDashboardId) : null;

  // 대시보드 멤버 여부 확인
  const {
    memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useDashboardMember({
    dashboardId: currentDashboardId || 0,
    page: 1,
    size: 100,
    showErrorToast: true,
    customErrorMessage: "멤버 목록을 불러오는데 실패했습니다.",
  });

  // 초대 관리 커스텀 훅
  const { inviteMember, isInviting } = useInvitation({
    dashboardId: currentDashboardId || 0,
  });

  useEffect(() => {
    if (dashboardError || memberError) {
      setIsInvitationDashboardOpen(false);
      router.push("/mydashboard");
    }
  }, [dashboardError, memberError, setIsInvitationDashboardOpen, router]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await inviteMember(data);
      reset();
      setIsInvitationDashboardOpen(false);
    } catch (error) {
      console.error("초대 실패:", error);
    }
  });

  if (isDashboardLoading || !currentDashboard) {
    return null;
  }

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">초대하기</h2>
      <form onSubmit={onSubmit} noValidate>
        <InputItem
          id="email"
          type="email"
          label="이메일"
          placeholder="taskify@taskify.com"
          {...register("email")}
          errors={errors.email?.message}
        />
        <div className="mt-6 flex h-[54px] w-full gap-2">
          <CancelBtn type="button" onClick={() => setIsInvitationDashboardOpen(false)}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid || isDashboardLoading || isMemberLoading || isInviting}>
            {isInviting ? "초대중..." : "초대하기"}
          </ConfirmBtn>
        </div>
      </form>
    </div>
  );
};

export default InvitationDashboard;
