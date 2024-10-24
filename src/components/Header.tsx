// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useWidth } from "@/hooks/useWidth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { isLargeScreen } = useWidth();
  const { user, setUser, loading } = useAuth();

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

  const isHomePage = pathname === "/";

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 h-[60px] px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px] ${isHomePage ? "bg-black" : "border-b border-gray03 bg-white"}`}
    >
      <nav
        className={`flex h-full items-center ${isHomePage ? "justify-between" : "justify-end"} gap-[17px] pr-[24px] md:gap-[15px]`}
      >
        {/* 로고 및 사이트 이름 */}
        {isHomePage && (
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <div className="relative flex-shrink-0">
                <Image
                  src="/images/header/logo_home.svg"
                  alt="logo"
                  width={24}
                  height={30}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              {isLargeScreen && (
                <span
                  className="font-montserrat text-lg font-semibold text-white"
                  style={{ width: "80px", height: "22px", lineHeight: "28px" }}
                >
                  Taskify
                </span>
              )}
            </Link>
          </div>
        )}
        {/* 사용자 메뉴 */}
        <ul className="flex space-x-4">
          {user && !loading ? (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`text-base font-normal transition-colors duration-300 md:text-lg ${
                  isHomePage ? "text-white hover:text-gray03" : "text-black hover:text-violet01"
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
              {/* 로그인/회원가입 링크 */}
              <li>
                <Link
                  className={`text-base font-normal transition-colors duration-300 md:text-lg ${isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"}`}
                  href="/login"
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  className={`text-base font-normal transition-colors duration-300 md:text-lg ${isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"}`}
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
