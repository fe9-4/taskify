"use client";

import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { DashboardMemberDisplay } from "./dashboard/DashboardMemberDisplay";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const isHomePage = pathname === "/";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 h-[60px] px-[24px] md:h-[70px] md:px-[40px] xl:px-[70px] ${
        isHomePage ? "bg-black" : "border-b border-gray03 bg-white"
      }`}
    >
      <nav className="flex h-full items-center justify-between">
        <div className="w-[140px]">{isHomePage && <Logo isHomePage={isHomePage} />}</div>
        {!isHomePage && (
          <div className="flex flex-grow items-center">
            <DashboardMemberDisplay />
            <div className="mx-4 h-8 w-px bg-gray-300"></div> {/* 구분선 추가 */}
          </div>
        )}
        <UserMenu isHomePage={isHomePage} />
      </nav>
    </header>
  );
}
