"use client";

import { Login, LoginSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";
import { userAtom } from "@/store/userAtoms";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Login> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "로그인 실패");
      }

      // 변경된 setCookie API를 호출하여 accessToken을 설정합니다.
      const setCookieResponse = await fetch("/api/auth/cookie/setCookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: responseData.accessToken }),
      });

      if (!setCookieResponse.ok) {
        throw new Error("쿠키 설정 실패");
      }

      // 사용자 정보를 userAtom에 저장
      setUser({
        id: responseData.user.id,
        email: responseData.user.email,
        nickname: responseData.user.nickname,
      });

      toast.success("로그인 성공!");
      router.push("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-[351px] md:w-[520px]">
      <p className="mb-8 text-center text-xl font-medium text-black02">오늘도 만나서 반가워요!</p>
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

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-md bg-violet01 py-2 text-white hover:bg-purple01 disabled:bg-gray03"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        <div className="w-full text-center">
          회원이 아니신가요?{" "}
          <Link href={"/signup"} className="text-violet01 hover:underline">
            회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
