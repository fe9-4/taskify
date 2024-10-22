"use client";
import { FaCrown, FaCircle } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { useWidth } from "@/hooks/useWidth";

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

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[22px] py-5 md:w-[160px] md:gap-[57px] md:pr-6 xl:w-[300px] xl:px-6">
      <Link href="/" className="justify-centermd:justify-normal flex w-full items-center">
        {isLargeScreen ? (
          <Image src="/images/header/logo_md.svg" alt="로고" width={108} height={34} />
        ) : (
          <Image src="/images/header/logo.svg" alt="로고" width={24} height={28} />
        )}
      </Link>
      <div className="">
        <div className="m-auto flex">
          <div className="hidden w-full font-semibold text-gray01 md:block md:text-xs md:leading-5">Dash Boards</div>
          <button className="flex size-[22px] items-center justify-center">
            <CiSquarePlus className="size-[14px] text-gray01" />
          </button>
        </div>
      </div>
    </aside>
  );
};
