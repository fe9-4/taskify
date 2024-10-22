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
import axios from "axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 로그인 폼 제출 핸들러
  const onSubmit: SubmitHandler<Login> = async (data) => {
    try {
      const response = await axios.post("/api/auth/login", data);

      if (response.data.user) {
        setUser(response.data.user);
        reset();
        router.push("/");
      } else {
        throw new Error("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "로그인 중 오류가 발생했습니다."
          : "로그인 중 오류가 발생했습니다."
      );
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
            placeholder="비밀번호를 입력해 주세요"
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
          disabled={isSubmitting || !isValid}
          className="w-full rounded-md bg-violet01 py-2 text-white hover:bg-purple01 disabled:bg-gray03"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>

        <div className="w-full text-center">
          회원이 아니신가요?{" "}
          <Link href={"/signup"} className="text-violet01 underline">
            회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
