"use client";

import React from "react";
import UpdateProfile from "@/app/mypage/components/UpdateProfile";
import ChangePassword from "@/app/mypage/components/ChangePassword";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { userAtom } from "@/store/userAtoms";
import { useAtom } from "jotai";

const MyPage = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);

  if (typeof window !== "undefined" && !user) {
    router.push("/login");
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container bg-gray05">
      <div className="w-full space-y-3 p-3 md:w-[548px] xl:w-[672px]">
        <div className="flex cursor-pointer items-center" onClick={handleGoBack}>
          <Image src="/icons/previous_arrow.svg" alt="돌아가기" width={20} height={20} />
          <span className="ml-2">돌아가기</span>
        </div>
        <div className="w-full space-y-3 pt-4 md:w-[548px] xl:w-[672px]">
          <UpdateProfile />
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
