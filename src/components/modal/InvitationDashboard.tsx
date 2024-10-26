import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import InputItem from "../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { InvitationDashboardAtom } from "@/store/modalAtom";

const InvitationDashboard = () => {
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log({ ...data });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">초대하기</h2>
      <InputItem id="title" {...register("email", { required: true })} label="이메일" type="text" placeholder="email" />
      <div className="mt-6 flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setIsInvitationDashboardOpen(false)}>취소</CancelBtn>
        <ConfirmBtn disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          생성
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default InvitationDashboard;
