"use client";
import { FaCrown, FaCircle } from "react-icons/fa";
import { Logo } from "./Logo";
import { Button } from "./button";

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
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[22px] py-5 md:w-[160px] md:gap-[57px] md:pr-6 xl:w-[300px] xl:px-6">
      <Logo />
      {/* Dashboard[+] + 대시보드 리스트 */}
      <div className="">
        <Button />
      </div>
    </aside>
  );
};
