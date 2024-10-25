"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { DashboardMemberDisplay } from "./dashboard/DashboardMemberDisplay";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await fetchUser();
        if (pathname === "/" && user) {
          router.push("/mydashboard");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (!user) {
      checkAuthStatus();
    } else if (pathname === "/") {
      // httpOnly cookie 에 accessToken 이 있다면 checkAuthStatus 를 통해 사용자 정보를 불러오고 mydashboard 로 이동
      router.push("/mydashboard");
    }
  }, [user, fetchUser, pathname, router]);

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
        <div className="w-[67px] md:w-[160px] xl:w-[300px]">{isHomePage && <Logo isHomePage={isHomePage} />}</div>
        {!isHomePage && (
          <div className="flex flex-grow items-center">
            <DashboardMemberDisplay />
            <div className="mx-4 h-8 w-px bg-gray-300"></div>
          </div>
        )}
        <UserMenu isHomePage={isHomePage} />
      </nav>
    </header>
  );
}
