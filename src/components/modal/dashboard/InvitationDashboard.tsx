import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
  const { memberData, isLoading, error } = useMember({
    dashboardId: Number(currentDashboardId),
    page: 1,
    size: 100,
    enabled: !!currentDashboardId,
  });

  useEffect(() => {
    if (error) {
      toggleModal("invitationDashboard", false);
    }
  }, [error, toggleModal]);

  // 초대 관리 커스텀 훅
  const { inviteMember, isInviting } = useInvitation({
    dashboardId: currentDashboardId || 0,
  });

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

  if (isLoading) {
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
          <ConfirmBtn type="submit" disabled={!isValid || isLoading || isInviting}>
            {isInviting ? "초대중..." : "초대하기"}
          </ConfirmBtn>
        </div>
      </form>
    </div>
  );
};

export default InvitationDashboard;
