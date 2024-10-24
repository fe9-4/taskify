"use client";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";
import { BackForwardBtn } from "../button/ButtonComponents";

const Sidebar = () => {
  const onClickPrev = () => {};
  const onClickNext = () => {};
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null;
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-[57px] xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      <div className="w-full">
        <Button />
        <DashboardList />
        <div className="hidden md:mt-6 md:block xl:mt-[32px]">
          <BackForwardBtn disabled onClickPrev={onClickPrev} onClickNext={onClickNext} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
