"use client";
import { FaCrown, FaCircle } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { useWidth } from "@/hooks/useWidth";
import { usePathname } from "next/navigation";

// 회원이 가입한 대시보드 리스트 [] 받아서 map((listiem)=><DashboardItem />)으로 쭉 나열하기
export const DashboardItem = ({ name, color, isMine }: { name: string; color: string; isMine: boolean }) => {
  return (
    <div className="w-full p-4">
      <FaCircle fill={color} />
      <div className="hidden md:block">{name}</div>
      <div className="hidden md:block">{isMine ? <FaCrown /> : <></>}</div>
    </div>
  );
};

export const Sidebar = () => {
  const { isLargeScreen } = useWidth();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }
  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-[67px] border-r border-gray03 bg-white md:w-[160px] xl:w-[300px]">
      <div className="mt-5 md:mx-[13px] xl:ml-2 xl:mr-3">
        <Link href="/" className="flex w-full items-center justify-center md:justify-normal">
          {isLargeScreen ? (
            <Image src="/images/header/logo_md.svg" alt="로고" width={108} height={34} />
          ) : (
            <Image src="/images/header/logo.svg" alt="로고" width={24} height={28} />
          )}
        </Link>
        <div className="m-auto flex w-10 items-center justify-between">
          <button className="">
            <span className="hidden leading-5 text-gray01 md:block md:text-xs">Dash Boards</span>
            <CiSquarePlus className="size-[14px] text-gray03" />
          </button>
        </div>
      </div>
    </aside>
  );
};
