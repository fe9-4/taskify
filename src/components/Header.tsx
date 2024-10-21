"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtoms";

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

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

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      setIsDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="text-base font-normal transition-colors duration-300 hover:text-violet01 md:text-lg"
              >
                {user.nickname}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
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
