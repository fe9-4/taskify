import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import InputItem from "../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import useLoading from "@/hooks/useLoading";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "@/zodSchema/commonSchema";
import { z } from "zod";

const InvitationDashboard = () => {
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const { dashboardId } = useParams();
  const { isLoading, withLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({ resolver: zodResolver(z.object({ email: EmailSchema })) });

  const onSubmit = async (data: any) => {
    await withLoading(async () => {
      try {
        await axios.post(`/api/dashboards/${dashboardId}/invitations`, data);
        toast.success("초대 완료");
        setIsInvitationDashboardOpen(false);
      } catch (error) {
        toast.error("초대 실패");
        setIsInvitationDashboardOpen(false);
      }
    });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">초대하기</h2>
      <InputItem
        id="email"
        type="email"
        label="이메일"
        placeholder="taskify@taskyify.com"
        {...register("email", { required: true })}
        errors={isValid ? "" : "이메일 형식으로 작성해 주세요."}
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
