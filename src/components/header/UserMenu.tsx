import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface UserMenuProps {
  isHomePage: boolean;
}

export const UserMenu = ({ isHomePage }: UserMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isUserLoading } = useAuth();
  const handleLogout = async () => {
    try {
      logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <ul className="flex list-none space-x-4">
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
      </ul>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 text-base font-normal transition-colors duration-300 md:text-lg ${
          isHomePage ? "text-white hover:text-gray03" : "text-black hover:text-violet01"
        }`}
      >
        {user.profileImageUrl ? (
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={user.profileImageUrl}
              alt="Profile"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isHomePage ? "bg-white text-black" : "bg-violet01 text-white"
            }`}
          >
            {getInitials(user.nickname)}
          </div>
        )}
        <span className="hidden md:inline">{user.nickname}</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-28 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <Link
            href="/mypage"
            className="block px-4 py-2 text-base font-semibold text-gray01 hover:bg-violet-100"
            onClick={closeDropdown}
          >
            마이페이지
          </Link>
          <Link
            href="/mydashboard"
            className="block px-4 py-2 text-base font-semibold text-gray01 hover:bg-violet-100"
            onClick={closeDropdown}
          >
            내 대시보드
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-base font-semibold text-gray01 hover:bg-violet-100"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};
