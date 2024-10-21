"use client";

import { Signup, SignupSchema } from "@/zodSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Signup> = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...signupData } = data;
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "회원가입 실패");
      }

      toast.success("회원가입 성공!");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      toast.error(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="mb-8 text-center text-xl font-medium text-black02">첫 방문을 환영합니다!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
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
            placeholder="••••••••"
          />
          <button type="button" className="absolute right-2 top-8" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Image src="/icons/visibility_on.svg" alt="visibility_on" width={24} height={24} />
            ) : (
              <Image src="/icons/visibility_off.svg" alt="visibility_off" width={24} height={24} />
            )}
          </button>
          {errors.password && <div className="mt-1 text-xs text-red01">{errors.password.message}</div>}
        </div>

        <div className="relative">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-black02">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={`mt-1 w-full rounded-md border p-2 ${
              errors.confirmPassword ? "border-red01" : "border-gray03"
            } bg-white text-black02`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-2 top-8"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? (
              <Image src="/icons/visibility_on.svg" alt="visibility_on" width={24} height={24} />
            ) : (
              <Image src="/icons/visibility_off.svg" alt="visibility_off" width={24} height={24} />
            )}
          </button>
          {errors.confirmPassword && <div className="mt-1 text-xs text-red01">{errors.confirmPassword.message}</div>}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...register("terms")}
            className="h-4 w-4 rounded border-gray03 text-purple01 focus:ring-purple01"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-black02">
            이용약관에 동의합니다.
          </label>
        </div>
        {errors.terms && <div className="mt-1 text-xs text-red01">{errors.terms.message}</div>}

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-md bg-violet01 py-2 text-white hover:bg-purple01 disabled:bg-gray03"
        >
          {isLoading ? "회원가입 중..." : "회원가입"}
        </button>

        <div className="w-full text-center">
          이미 회원이신가요?{" "}
          <Link href={"/login"} className="text-violet01 hover:underline">
            로그인하기
          </Link>
        </div>
      </form>
    </>
  );
};

export default SignupPage;
