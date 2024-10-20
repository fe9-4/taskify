"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import type { Signup } from "@/zodSchema/userSchema";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signup>();

  const onSubmit: SubmitHandler<Signup> = (data) => {
    // TODO 회원가입 로직 구현
    console.log("회원가입 시도:", data);
  };

  // TODO CSS 변경 예정
  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-2xl font-bold">회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block">
            이메일
          </label>
          <input
            {...register("email", {
              required: "이메일은 필수입니다",
              pattern: { value: /^\S+@\S+$/i, message: "올바른 이메일 형식이 아닙니다" },
            })}
            type="email"
            id="email"
            className="w-full rounded border px-3 py-2"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block">
            비밀번호
          </label>
          <input
            {...register("password", {
              required: "비밀번호는 필수입니다",
              minLength: { value: 6, message: "비밀번호는 최소 6자 이상이어야 합니다" },
              maxLength: { value: 20, message: "비밀번호는 최대 20자 이하이어야 합니다" },
            })}
            type="password"
            id="password"
            className="w-full rounded border px-3 py-2"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="nickname" className="mb-2 block">
            닉네임
          </label>
          <input
            {...register("nickname", {
              required: "닉네임은 필수입니다",
              minLength: { value: 2, message: "닉네임은 최소 2자 이상이어야 합니다" },
              maxLength: { value: 20, message: "닉네임은 최대 20자 이하이어야 합니다" },
            })}
            type="text"
            id="nickname"
            className="w-full rounded border px-3 py-2"
          />
          {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname.message}</p>}
        </div>
        <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white">
          회원가입
        </button>
      </form>
    </div>
  );
}
