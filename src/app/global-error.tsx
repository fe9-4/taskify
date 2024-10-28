"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const GlobalError = ({ reset }: { reset: () => void }) => {
  return (
    <html lang="ko">
      <body className={`${montserrat.variable} font-pretendard min-h-screen text-black03`}>
        <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-5">
          <div className="flex items-center space-x-3">
            <Image src="/icons/error.png" alt="에러" width={60} height={60} />
            <div className="flex flex-col space-y-1">
              <h1 className="text-lg font-bold">웹사이트에서 알 수 없는 에러가 발생했습니다.</h1>
              <p>아래 버튼을 눌러 새로고침해주세요!</p>
            </div>
          </div>
          <button
            onClick={() => reset()}
            className="rounded-md bg-blue01 px-5 py-2 text-center text-white transition-colors hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
