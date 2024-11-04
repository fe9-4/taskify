"use client";

import Image from "next/image";

const Error = ({ reset }: { reset: () => void }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-5">
      <div className="flex items-center space-x-3">
        <Image src="/icons/error.png" alt="에러 아이콘" width={60} height={60} />
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold text-lg">현재 페이지에서 알 수 없는 오류가 발생했습니다.</h1>
          <p>아래 버튼을 눌러 새로고침해주세요!</p>
        </div>
      </div>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue01 px-5 py-2 text-center text-white transition-colors hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
};

export default Error;