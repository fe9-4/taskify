import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import InputItem from "../../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../../button/ButtonComponents";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMember } from "@/hooks/useMember";
import { FormData, FormSchema } from "@/zodSchema/invitationSchema";
import { useInvitation } from "@/hooks/useInvitation";
import { useToggleModal } from "@/hooks/useModal";
import toast from "react-hot-toast";
import axios from "axios";
import toastMessages from "@/lib/toastMessage";

const InvitationDashboard = () => {
  const toggleModal = useToggleModal();
  const params = useParams();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;
  const router = useRouter();

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

  // 대시보드 멤버 여부 확인
  const { isLoading: isMemberLoading, error: memberError } = useMember({
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

  // 에러 발생 시 처리
  if (memberError) {
    toast.error(toastMessages.error.getMemberList);
    toggleModal("invitationDashboard", false);
    router.push("/mydashboard");
    return null;
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!currentDashboardId) {
      toast.error(toastMessages.error.isValidDashboard);
      toggleModal("invitationDashboard", false);
      router.push("/mydashboard");
      return;
    }

    try {
      await inviteMember(data);
      reset();
      toggleModal("invitationDashboard", false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || toastMessages.error.invitation);
      }
    }
  });

  if (isMemberLoading) {
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
          <CancelBtn type="button" onClick={() => toggleModal("invitationDashboard", false)}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid || isMemberLoading || isInviting}>
            {isInviting ? "초대중..." : "초대하기"}
          </ConfirmBtn>
        </div>
      </form>
    </div>
  );
};

export default InvitationDashboard;
