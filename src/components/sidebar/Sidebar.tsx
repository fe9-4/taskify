"use client";

import { useParams, usePathname } from "next/navigation";
import Button from "./Button";
import DashboardList from "./DashboardList";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { useWidth } from "@/hooks/useWidth";
import Pagination from "../pagination/Pagination";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { cls } from "@/lib/utils";
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi";

const Sidebar = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  const params = useParams();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;
  const { isLargeScreen } = useWidth();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const { dashboardData, isLoading: isDashboardLoading } = useDashboard({
    dashboardId: currentDashboardId || 0,
    page,
    size,
    enabled: !!user, // user가 있을 때만 API 호출
  });

  const totalPage: number = dashboardData ? Math.ceil(dashboardData.totalCount / size) : 0;

  const onClickSidebar = () => {
    if (!isLargeScreen) {
      setIsExpanded((prev) => !prev);
    }
  };

  useEffect(() => {
    setSize(isLargeScreen ? 15 : 10);
  }, [isLargeScreen]);

  if (isLoading || isDashboardLoading || pathname === "/" || pathname === "/login" || pathname === "/signup")
    return null;

  if (!user) return null;

  return (
    <aside
      className={cls(
        "fixed left-0 top-0 z-50 flex h-screen flex-col gap-10 border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-14 xl:w-[300px] xl:pl-2 xl:pr-3",
        isExpanded ? "w-[160px]" : "w-[67px]"
      )}
    >
      <Logo isExpanded={isExpanded} />
      <div className="relative flex h-[700px] w-full shrink-0 flex-col">
        <Button isExpanded={isExpanded} />
        {dashboardData && <DashboardList list={dashboardData.dashboards} isExpanded={isExpanded} />}
        <button
          type="button"
          onClick={onClickSidebar}
          className={cls(
            "flex h-10 w-full items-center justify-start",
            isExpanded ? "justify-end" : "justify-center",
            isLargeScreen ? "hidden" : ""
          )}
        >
          <HiChevronDoubleRight className={cls("size-5 text-gray01", isExpanded ? "hidden" : "")} />
          <HiChevronDoubleLeft className={cls("size-5 text-gray01", isExpanded ? "" : "hidden")} />
        </button>
        <div className={cls("absolute bottom-0 md:mt-6 md:block xl:mt-8", isExpanded ? "" : "hidden")}>
          {dashboardData && dashboardData.totalCount > size ? (
            <Pagination totalPage={totalPage} setPage={setPage} page={page} />
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
