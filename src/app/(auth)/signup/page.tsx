"use client";

import { Signup, SignupSchema } from "@/zodSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<Signup> = async (data) => {
    try {
      const { confirmPassword, ...signupData } = data;
      const response = await axios.post("/api/auth/signup", signupData);

      toast.success("가입이 완료되었습니다");
      reset(); // 폼 초기화
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(error.response.data.message || "이미 사용중인 이메일입니다.");
        } else {
          toast.error(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <div className="mx-auto w-[351px] md:w-[520px]">
      <p className="mb-8 text-center text-xl font-medium text-black02">첫 방문을 환영합니다!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black02">
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`mt-1 w-full rounded-md border p-2 ${
              errors.email ? "border-red01" : "border-gray03"
            } bg-white text-black02`}
            placeholder="johndoe@example.com"
          />
          {errors.email && <div className="mt-1 text-xs text-red01">{errors.email.message}</div>}
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-black02">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            {...register("nickname")}
            className={`mt-1 w-full rounded-md border p-2 ${
              errors.nickname ? "border-red01" : "border-gray03"
            } bg-white text-black02`}
            placeholder="닉네임을 입력해 주세요"
          />
          {errors.nickname && <div className="mt-1 text-xs text-red01">{errors.nickname.message}</div>}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-black02">
            비밀번호
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`mt-1 w-full rounded-md border p-2 ${
              errors.password ? "border-red01" : "border-gray03"
            } bg-white text-black02`}
            placeholder="비밀번호를 입력해 주세요"
          />
          <button type="button" className="absolute right-2 top-8" onClick={togglePasswordVisibility}>
            <Image
              src={showPassword ? "/icons/visibility_on.svg" : "/icons/visibility_off.svg"}
              alt={showPassword ? "visibility_on" : "visibility_off"}
              width={24}
              height={24}
            />
          </button>
          {errors.password && <div className="mt-1 text-xs text-red01">{errors.password.message}</div>}
        </div>

        <div className="relative">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-black02">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type={showPasswordConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            className={`mt-1 w-full rounded-md border p-2 ${
              errors.confirmPassword ? "border-red01" : "border-gray03"
            } bg-white text-black02`}
            placeholder="비밀번호를 한번 더 입력해 주세요"
          />
          <button type="button" className="absolute right-2 top-8" onClick={togglePasswordConfirmVisibility}>
            <Image
              src={showPasswordConfirm ? "/icons/visibility_on.svg" : "/icons/visibility_off.svg"}
              alt={showPasswordConfirm ? "visibility_on" : "visibility_off"}
              width={24}
              height={24}
            />
          </button>
          {errors.confirmPassword && <div className="mt-1 text-xs text-red01">{errors.confirmPassword.message}</div>}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...register("terms")}
            className="h-4 w-4 cursor-pointer rounded border-gray03 text-purple01 focus:ring-purple01"
          />
          <label htmlFor="terms" className="ml-2 block cursor-pointer text-sm text-black02">
            이용약관에 동의합니다.
          </label>
        </div>
        {errors.terms && <div className="mt-1 text-xs text-red01">{errors.terms.message}</div>}

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full rounded-md bg-violet01 py-2 text-white hover:bg-purple01 disabled:bg-gray03"
        >
          {isSubmitting ? "회원가입 중..." : "회원가입"}
        </button>

        <div className="w-full text-center">
          이미 회원이신가요?{" "}
          <Link href={"/login"} className="text-violet01 underline">
            로그인하기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
