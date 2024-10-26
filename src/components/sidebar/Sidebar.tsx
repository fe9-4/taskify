"use client";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";
import { PaginationBtn } from "../button/ButtonComponents";
import { ItemType } from "@/types/dashboardType";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWidth } from "@/hooks/useWidth";
import axios, { AxiosError } from "axios";

const Sidebar = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [dashboardList, setDashboardList] = useState<ItemType[]>([]);
  const { user } = useAuth();
  const pathname = usePathname();
  const { isLargeScreen } = useWidth();

  useEffect(() => {
    if (isLargeScreen) {
      setSize(15);
    } else {
      setSize(10);
    }
  }, [isLargeScreen]);

  const totalPage: number = Math.ceil(totalCount / size);

  const fetchDashboardList = async (page: number, size: number) => {
    if (user) {
      try {
        const res = await axios.get("/api/dashboards", {
          params: {
            page,
            cursorId: 1,
            size,
          },
        });
        const data = res.data;
        setDashboardList(data.dashboards);
        setTotalCount(data.totalCount);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error.message);
      }
    }
  }; // 라우트 통일해서 다시 데이터 불러오기

  useEffect(() => {
    fetchDashboardList(page, size);
  }, [user, page, size]);

  const isFirst = page === 1;
  const isLast = page === totalPage;
  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };
  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null;
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[67px] flex-col gap-10 border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-14 xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      <div className="relative flex h-[700px] w-full shrink-0 flex-col">
        <Button />
        <DashboardList list={dashboardList} />
        <div className="absolute bottom-0 hidden md:mt-6 md:block xl:mt-8">
          {totalCount > size ? (
            <PaginationBtn
              disabledPrev={isFirst}
              disabledNext={isLast}
              onClickPrev={onClickPrev}
              onClickNext={onClickNext}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
