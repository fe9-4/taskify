"use client";

import axios from "axios";
import toast from "react-hot-toast";
import Invitation from "@/app/mydashboard/components/Invitation";
import Pagination from "./components/Pagination";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { AddDashboardBtn, DashboardCard } from "@/components/button/ButtonComponents";
import { IMyDashboard } from "@/types/myDashboardType";
import { CreateDashboardAtom } from "@/store/modalAtom";
import { myDashboardUpdateAtom } from "@/store/myDashboardAtom";

const MyDashboard = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [cursorId, setCursorId] = useState<number | null>(1);
  const [size, setSize] = useState(5);
  const [dashboardList, setDashboardList] = useState<IMyDashboard["dsahboards"]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isUpdatedList, setIsUpdatedList] = useAtom(myDashboardUpdateAtom);
  
  const getCurrentDashboards = useCallback(async () => {
    try {
      // 추가된 대시보드 추출
      const response = await axios.get("/api/dashboards", {
        params: {
          page,
          cursorId,
          size
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setDashboardList(data.dashboardList);
        setCursorId(data.cursorId !== null ? data.cursorId : 1);
        setTotalPage(Math.ceil(data.totalCount / size));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("myDashboard getCurrentDashboards에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [page, cursorId, size]);

  useEffect(() => {
    getCurrentDashboards();

    if (isUpdatedList) {
      getCurrentDashboards();
      setIsUpdatedList(false);
    }
  }, [isUpdatedList, getCurrentDashboards, setIsUpdatedList]);

  return (
    <div className="flex flex-col space-y-10 px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex flex-col space-y-6 xl:w-[1022px]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex justify-center md:justify-start md:w-[247px] xl:w-[332px]">
            <AddDashboardBtn onClick={() => setisCreateDashboardOpen(true)} />
          </div>
          {dashboardList?.length > 0
            ? dashboardList.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  dashboardName={dashboard.title}
                  isMine={dashboard.createdByMe}
                  color={dashboard.color}
                  onClick={() => router.push(`/dashboard/${dashboard.id}`)}
                />
              ))
            : null}
        </div>
        {dashboardList.length > 0 ? (
          <div className="flex items-center justify-end space-x-4">
            <span className="text-xs">
              {totalPage}페이지 중 {page}
            </span>
            <Pagination totalPage={totalPage} setPage={setPage} page={page} />
          </div>
        ) : (
          <span className="text-center text-gray02 md:text-xl">아직 소속된 대시보드가 없어요.</span>
        )}
      </div>
      <Invitation />
    </div>
  );
};

export default MyDashboard;
