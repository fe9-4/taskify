"use client";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { useWidth } from "@/hooks/useWidth";
import Pagination from "../pagination/Pagination";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const pathname = usePathname();
  const { isLargeScreen } = useWidth();
  const { user } = useAuth();
  const { dashboards } = useDashboard({ cursorId: 1, page, size });

  useEffect(() => {
    if (isLargeScreen) {
      setSize(15);
    } else {
      setSize(10);
    }
  }, [isLargeScreen]);

  const totalPage: number = Math.ceil(dashboards.total / size);

  if (!user || pathname === "/" || pathname === "/login" || pathname === "/signup") return null;

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[67px] flex-col gap-10 border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-14 xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      <div className="relative flex h-[700px] w-full shrink-0 flex-col">
        <Button />
        <DashboardList list={dashboards.all} />
        <div className="absolute bottom-0 hidden md:mt-6 md:block xl:mt-8">
          {dashboards.total > size ? <Pagination totalPage={totalPage} setPage={setPage} page={page} /> : <></>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
