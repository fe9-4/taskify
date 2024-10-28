"use client";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center">
      <Image
        className="h-auto w-[287px] md:w-[537px] xl:w-[772px]"
        src="/images/landing/landing1.png"
        alt="image6"
        width={772}
        height={0}
      />
      <h1 className="mb-[100px] mt-[26px] text-center text-[40px] font-bold -tracking-[2px] text-white md:mb-[110px] md:mt-[48px] md:text-[56px] xl:text-[76px]">
        새로운 일정 관리 <br className="md:hidden" />
        <span className="font-montserrat text-[42px] -tracking-[1px] text-violet01 md:text-[70px] xl:text-[90px]">
          Taskify
        </span>
      </h1>
      <Link
        href={user ? "/mydashboard" : "/login"}
        className="mb-[76px] flex h-[46px] w-[235px] items-center justify-center rounded-lg bg-violet01 text-white md:mb-[180px] md:h-[54px] md:w-[280px]"
      >
        로그인하기
      </Link>
    </div>
  );
};

export default HeroSection;
