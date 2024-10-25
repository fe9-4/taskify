"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import UpdateProfile from "@/app/mypage/components/UpdateProfile";
import ChangePassword from "@/app/mypage/components/ChangePassword";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto bg-gray05">
      {loading && <div>로딩 중...</div>}
      {!loading && user && (
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
      )}
      {!loading && !user && <div>사용자 정보를 불러올 수 없습니다.</div>}
    </div>
  );
};

export default MyPage;
