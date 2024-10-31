import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

interface UserMenuProps {
  isHomePage: boolean;
}

interface MenuItem {
  href: string;
  label: string;
  onClick?: () => void;
}

export const UserMenu = ({ isHomePage }: UserMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isInitialLoading } = useAuth();

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

  if (isInitialLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="hidden h-5 w-20 animate-pulse rounded bg-gray-200 md:block" />
      </div>
    );
  }

  // 로그인하지 않은 사용자를 위한 메뉴 아이템
  const authMenuItems: MenuItem[] = [
    { href: "/login", label: "로그인" },
    { href: "/signup", label: "회원가입" },
  ];

  // 로그인한 사용자를 위한 드롭다운 메뉴 아이템
  const dropdownMenuItems: MenuItem[] = [
    { href: "/mydashboard", label: "내 대시보드" },
    { href: "/mypage", label: "마이페이지" },
    { href: "#", label: "로그아웃", onClick: handleLogout },
  ];

  const menuItemClassName = `text-base font-normal transition-colors duration-300 md:text-lg ${
    isHomePage ? "text-white hover:text-gray03" : "hover:text-violet01"
  }`;

  const dropdownItemClassName = "block px-4 py-2 text-base font-semibold text-gray01 hover:bg-violet-100";

  if (!user) {
    return (
      <ul className="flex list-none space-x-4">
        {authMenuItems.map((item) => (
          <li key={item.label}>
            <Link className={menuItemClassName} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
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
          {dropdownMenuItems.map((item) => (
            <React.Fragment key={item.label}>
              {item.onClick ? (
                <button onClick={item.onClick} className={`w-full text-left ${dropdownItemClassName}`}>
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className={dropdownItemClassName} onClick={closeDropdown}>
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
