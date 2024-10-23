"use client";

import { Signup, SignupSchema } from "@/zodSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import InputItem from "@/components/input/InputItem";
import { ActiveBtn } from "@/components/button/ButtonComponents";

const SignupPage = () => {
  const router = useRouter();

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
      reset();
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
          : "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="mx-auto w-[351px] md:w-[520px]">
      <p className="mb-8 text-center text-xl font-medium text-black02">첫 방문을 환영합니다!</p>
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
          label="닉네임"
          id="nickname"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          {...register("nickname")}
          errors={errors.nickname?.message}
        />

        <InputItem
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          {...register("password")}
          errors={errors.password?.message}
        />

        <InputItem
          label="비밀번호 확인"
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 한번 더 입력해 주세요"
          {...register("confirmPassword")}
          errors={errors.confirmPassword?.message}
        />

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

        <ActiveBtn disabled={isSubmitting || !isValid} onClick={handleSubmit(onSubmit)}>
          회원가입
        </ActiveBtn>

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
