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
import { cls } from "@/lib/utils";
import { HiChevronDoubleRight } from "react-icons/hi";
import { HiChevronDoubleLeft } from "react-icons/hi";

const Sidebar = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  const pathname = usePathname();
  const { isLargeScreen } = useWidth();
  const { user } = useAuth();
  const { dashboards } = useDashboard({ cursorId: 1, page, size });

  const totalPage: number = Math.ceil(dashboards.total / size);

  const onClickSidebar = () => {
    if (!isLargeScreen) {
      setIsExpanded((prev) => !prev);
    }
  };

  useEffect(() => {
    setSize(isLargeScreen ? 15 : 10);
  }, [isLargeScreen]);

  if (!user || pathname === "/" || pathname === "/login" || pathname === "/signup") return null;

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
        <DashboardList list={dashboards.all} isExpanded={isExpanded} />
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
          {dashboards.total > size ? <Pagination totalPage={totalPage} setPage={setPage} page={page} /> : <></>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
