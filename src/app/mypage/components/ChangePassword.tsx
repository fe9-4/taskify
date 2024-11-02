"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import { UpdateUserPassword, UpdateUserPasswordSchema } from "@/zodSchema/userSchema";
import toastMessages from "@/lib/toastMessage";

const ChangePassword = () => {
  const { logout } = useAuth();

  const passwordForm = useForm<UpdateUserPassword>({
    resolver: zodResolver(UpdateUserPasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmitPasswordChange: SubmitHandler<UpdateUserPassword> = async (data) => {
    try {
      await axios.put("/api/auth/changePassword", data);
      toast.success(toastMessages.success.editPassword);
      passwordForm.reset();
      logout();
    } catch (error) {
      toast.error(toastMessages.error.editPassword);
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 text-3xl font-bold">
      <h2 className="text-xl font-bold md:text-3xl">비밀번호 변경</h2>
      <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-base font-normal text-black02 md:text-lg">
            현재 비밀번호
          </label>
          <InputItem
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호 입력"
            {...passwordForm.register("currentPassword")}
          />
          {passwordForm.formState.errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-base font-normal text-black02 md:text-lg">
            새 비밀번호
          </label>
          <InputItem
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력"
            {...passwordForm.register("newPassword")}
          />
          {passwordForm.formState.errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-base font-normal text-black02 md:text-lg">
            새 비밀번호 확인
          </label>
          <InputItem
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호 확인"
            {...passwordForm.register("confirmPassword")}
          />
          {passwordForm.formState.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <ActiveBtn
          disabled={passwordForm.formState.isSubmitting || !passwordForm.formState.isValid}
          onClick={passwordForm.handleSubmit(onSubmitPasswordChange)}
        >
          변경
        </ActiveBtn>
      </form>
    </div>
  );
};

export default ChangePassword;
