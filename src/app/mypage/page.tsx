"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import UpdateProfile from "@/app/mypage/components/UpdateProfile";
import ChangePassword from "@/app/mypage/components/ChangePassword";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

const MyPage = () => {
  const { isInitialLoading } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray05 bg-opacity-50">
        <FaSpinner className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-gray05">
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
