"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // 화면 크기를 감지하여 md 이상인지 확인하는 함수
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    // 초기 실행 및 리스너 추가
    handleResize();
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="h-[60px] border-b border-gray-300 bg-white px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px]">
      <nav className="ml-[20px] flex h-full items-center justify-between gap-[17px] pr-[24px] md:gap-[15px]">
        {/* 로고와 Taskify 텍스트를 감싸는 컨테이너 */}
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {isLargeScreen ? (
              <Image src="/images/header/logo_md.svg" alt="로고" width={110} height={34} />
            ) : (
              <Image src="/images/header/logo.svg" alt="로고" width={24} height={30} />
            )}
          </div>
        </div>
        {/* 로그인/회원가입 메뉴 */}
        <ul className="flex space-x-4">
          <li>
            <Link className="text-base font-normal md:text-lg" href="/auth/login">
              로그인
            </Link>
          </li>
          <li>
            <Link className="text-base font-normal md:text-lg" href="/auth/signup">
              회원가입
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
