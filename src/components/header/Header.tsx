"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { DashboardMemberDisplay } from "./dashboard/DashboardMemberDisplay";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isHomePage, setIsHomePage] = useState(pathname === "/");

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const showHeader = isHomePage || (!isLoading && user);

  if (!showHeader) {
    return null;
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 h-[60px] px-[12px] md:h-[70px] md:px-[40px] ${
        isHomePage ? "bg-black" : "border-b border-gray03 bg-white"
      }`}
    >
      <nav className="flex h-full items-center justify-between">
        <div className="w-[67px] md:w-[160px] xl:w-[300px]">{isHomePage && <Logo isHomePage={isHomePage} />}</div>
        {!isHomePage && user && (
          <div className="flex flex-grow items-center">
            <DashboardMemberDisplay />
          </div>
        )}
        <UserMenu isHomePage={isHomePage} />
      </nav>
    </header>
  );
}
