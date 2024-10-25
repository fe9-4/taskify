"use client";

import { Login, LoginSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { user, login } = useAuth();

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

  // 사용자가 이미 로그인한 경우 내 대시보드 페이지로 리다이렉트
  useEffect(() => {
    if (user) {
      router.push("/mydashboard");
    }
  }, [user, router]);

  const onSubmit: SubmitHandler<Login> = async (data) => {
    try {
      await login(data);
      reset();
      toast.success("로그인에 성공했습니다.");
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "로그인 중 오류가 발생했습니다."
          : "로그인 중 오류가 발생했습니다."
      );
    }
  };

  // 이미 로그인한 사용자인 경우 로딩 상태 표시
  if (user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mx-auto w-[351px] md:w-[520px]">
      <p className="mb-8 text-center text-xl font-medium text-black02">오늘도 만나서 반가워요!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <InputItem
          label="이메일"
          id="email"
          type="email"
          placeholder="johndoe@example.com"
          {...register("email")}
          errors={errors.email?.message}
        />

        <InputItem
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          {...register("password")}
          errors={errors.password?.message}
        />

        <ActiveBtn disabled={isSubmitting || !isValid} onClick={handleSubmit(onSubmit)}>
          로그인
        </ActiveBtn>

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
