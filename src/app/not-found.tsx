"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-5">
      <div className="flex items-center space-x-3">
        <Image src="/icons/notFound.png" alt="404 에러" width={60} height={60} />
        <div className="flex flex-col space-y-1">
          <h2 className="text-lg font-bold">페이지를 찾을 수 없습니다.</h2>
          <p>경로를 다시 확인해주세요!</p>
        </div>
      </div>
      <button
        onClick={() => router.push("/")}
        className="rounded-md bg-green01 px-5 py-2 text-center text-white transition-colors hover:bg-green-600"
      >
        메인화면으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
