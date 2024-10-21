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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const checkAccessTokenAndFetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const cookieResponse = await fetch("/api/auth/cookie/getCookie", {
          method: "GET",
          credentials: "include",
        });

        if (cookieResponse.ok) {
          const { accessToken } = await cookieResponse.json();
          if (accessToken) {
            await fetchUserInfo();
          } else {
            setUser(null);
          }
        } else {
          console.error("쿠키 확인 중 오류 발생");
          setUser(null);
        }
      } catch (error) {
        console.error("쿠키 확인 중 오류 발생:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setUser(null);
      }
    };

    checkAccessTokenAndFetchUserInfo();

    return () => window.removeEventListener("resize", handleResize);
  }, [setUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="h-[60px] border-b border-gray03 bg-white px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px]">
      <nav className="ml-[20px] flex h-full items-center justify-between gap-[17px] pr-[24px] md:gap-[15px]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex-shrink-0">
            {isLargeScreen ? (
              <Image src="/images/header/logo_md.svg" alt="로고" width={110} height={34} />
            ) : (
              <Image src="/images/header/logo.svg" alt="로고" width={24} height={30} />
            )}
          </Link>
        </div>
        <ul className="flex space-x-4">
          {isLoading ? (
            <li>로딩 중...</li>
          ) : user ? (
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
