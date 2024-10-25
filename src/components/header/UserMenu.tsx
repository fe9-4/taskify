import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardMember } from "@/hooks/useDashboardMember";

interface UserMenuProps {
  isHomePage: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isHomePage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDashboardId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { members } = useDashboardMember(
    selectedDashboardId ? { dashboardId: selectedDashboardId, page: 1, size: 10 } : { dashboardId: 0 }
  ) || { members: null };

  const handleLogout = async () => {
    try {
      await logout();
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

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className={`flex items-center space-x-2 text-base font-normal transition-colors duration-300 md:text-lg ${
            isHomePage ? "text-white hover:text-gray03" : "text-black hover:text-violet01"
          }`}
        >
          {user.profileImageUrl ? (
            <Image src={user.profileImageUrl} alt="Profile" width={32} height={32} className="rounded-full" />
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
          <div className="absolute right-0 mt-2 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <Link
              href="/mypage"
              className="block px-4 py-2 text-base font-semibold text-gray01 hover:bg-violet-100"
              onClick={closeDropdown}
            >
              마이 페이지
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-base font-semibold text-gray01 hover:bg-violet-100"
            >
              로그아웃
            </button>
          </div>
        )}
        {selectedDashboardId && members && (
          <div className="absolute right-0 mt-2 flex -space-x-2 overflow-hidden">
            {members.members.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className={`relative z-${30 - index} flex h-8 w-8 items-center justify-center rounded-full bg-violet01 text-white ring-2 ring-white`}
              >
                {getInitials(member.nickname)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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
};
