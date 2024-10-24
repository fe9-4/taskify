"use client";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";

const Sidebar = () => {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null;
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-[57px] xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      <div className="w-full">
        <Button />
        <DashboardList />
      </div>
    </aside>
  );
};

export default Sidebar;
