"use client";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";
import { PaginationBtn } from "../button/ButtonComponents";
import { ItemType } from "@/types/dashboardType";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10); // 기본 값으로 10
  const [totalCount, setTotalCount] = useState<number>();
  const pathname = usePathname();

  const [dashboardList, setDashboardList] = useState<ItemType[]>([]);
  const { user } = useAuth();
  const fetchDashboardList = async (page: number, size: number) => {
    if (user) {
      try {
        const res = await fetch(`/api/dashboard/list?page=${page}&size=${size}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch data : ${res.status}`);
        }
        const data = await res.json();
        setDashboardList(data.user ? data.user.dashboards : []);
        setTotalCount(data.user.totalCount);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchDashboardList(page, size);
    console.log(dashboardList);
  }, [user]);

  const onClickPrev = () => {};
  const onClickNext = () => {};
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null;
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-[57px] xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      <div className="w-full">
        <Button />
        <DashboardList list={dashboardList} />
        <div className="hidden md:mt-6 md:block xl:mt-[32px]">
          {/* 1페이지면 disabledPrev = true, 마지막 페이지면 disabledNext=true */}
          <PaginationBtn disabledPrev disabledNext onClickPrev={onClickPrev} onClickNext={onClickNext} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
