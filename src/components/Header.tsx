"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtoms";

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    // 화면 크기를 감지하여 md 이상인지 확인하는 함수
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    // 초기 실행 및 리스너 추가
    handleResize();
    window.addEventListener("resize", handleResize);

    // userAtom이 비어있을 때 쿠키 초기화 로직 추가
    const checkUserAndClearCookie = async () => {
      if (!user) {
        try {
          const response = await fetch("/api/auth/setCookie", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "clear" }),
          });

          if (!response.ok) {
            throw new Error("쿠키 초기화 실패");
          }

          console.log("쿠키가 성공적으로 초기화되었습니다.");
        } catch (error) {
          console.error("쿠키 초기화 중 오류 발생:", error);
        }
      }
    };

    checkUserAndClearCookie();

    // 컴포넌트 언마운트 시 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, [user]); // user 의존성 추가

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // userAtom 초기화
      setUser(null);
      // 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  // 로그인 또는 회원가입 페이지일 경우 Header를 렌더링하지 않음
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="h-[60px] border-b border-gray03 bg-white px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px]">
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
        {/* 로그인/회원가입 또는 로그아웃 메뉴 */}
        <ul className="flex space-x-4">
          {user ? (
            <li>
              <button
                onClick={handleLogout}
                className="text-base font-normal transition-colors duration-300 hover:text-violet01 md:text-lg"
              >
                로그아웃
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  className="text-base font-normal transition-colors duration-300 hover:text-violet01 md:text-lg"
                  href="/login"
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  className="text-base font-normal transition-colors duration-300 hover:text-violet01 md:text-lg"
                  href="/signup"
                >
                  회원가입
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
