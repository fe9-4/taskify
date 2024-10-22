"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { user, loading: isLoading, setUser } = useAuth();

  const handleResize = useDebounce(() => {
    setIsLargeScreen(window.innerWidth >= 768);
  }, 200);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    // mousedown 이벤트를 사용하여 드롭다운 외부 클릭 시 즉시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // mousedown 이벤트 리스너 추가
    // mousedown은 click 이벤트보다 먼저 발생하며, 마우스 버튼이 눌릴 때 즉시 트리거됩니다.
    // 이를 통해 사용자가 드롭다운 외부를 클릭하는 즉시 드롭다운을 닫을 수 있습니다.
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
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

  // 홈 페이지 여부를 확인하는 변수 추가
  const isHomePage = pathname === "/";

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header
      className={`h-[60px] px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px] ${
        isHomePage ? "bg-black" : "border-b border-gray03 bg-white"
      }`}
    >
      <nav className="ml-[20px] flex h-full items-center justify-between gap-[17px] pr-[24px] md:gap-[15px]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={isHomePage ? "/images/header/logo_home.svg" : "/images/header/logo.svg"}
                alt="logo"
                width={24}
                height={30}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            {isLargeScreen && (
              <span
                className={`font-montserrat text-lg font-semibold ${isHomePage ? "text-white" : "text-violet01"}`}
                style={{ width: "80px", height: "22px", lineHeight: "28px" }}
              >
                Taskify
              </span>
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
                className={`text-base font-normal transition-colors duration-300 md:text-lg ${
                  isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"
                }`}
              >
                {user.nickname}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-20 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray01 hover:bg-gray03"
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
                  className={`text-base font-normal transition-colors duration-300 md:text-lg ${
                    isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"
                  }`}
                  href="/login"
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  className={`text-base font-normal transition-colors duration-300 md:text-lg ${
                    isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"
                  }`}
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
