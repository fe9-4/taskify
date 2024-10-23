"use client";

import { AddDashboardBtn, BackForwardBtn, DashboardCard } from "@/components/ButtonComponents";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IDashboardList {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  createdByMe: boolean;
}

interface IDashboard {
  dsahboards: IDashboardList[];
  totalCount: number;
}

const MyDashboard = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [dashboardList, setDashboardList] = useState<IDashboard["dsahboards"]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageBtn, setPageBtn] = useState(false);

  const handleAddDashboard = () => {
    // 모달 구현되면 연결
    console.log("대시보드 추가 모달 오픈");
  };

  const getCurrentDashboards = useCallback(async () => {
    try {
      // 추가된 대시보드 추출
      const response = await axios.get("/api/myDashboard", {
        params: {
          page,
        },
      });

      if (response.status === 200) {
        setDashboardList(response.data.dashboardList);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("myDashboard getCurrentDashboards에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, []);

  const handleClickNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleClickPrevPage = () => {
    setPage((prev) => prev - 1);

    if (page < 1) {
      setPage(1);
      toast.error("첫 번째 페이지입니다.");
      setPageBtn(true);
    }
  };

  useEffect(() => {
    getCurrentDashboards();
  }, [getCurrentDashboards]);

  return (
    <div className="flex flex-col space-y-10 px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex flex-col space-y-6 xl:w-[1022px]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:w-[247px] xl:w-[332px]">
            <AddDashboardBtn onClick={handleAddDashboard} />
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
              {page}페이지 중 {dashboardList.length}
            </span>
            <BackForwardBtn disabled={pageBtn} onClickNext={handleClickNextPage} onClickPrev={handleClickPrevPage} />
          </div>
        ) : (
          <span className="text-center text-gray02 md:text-xl">아직 소속된 대시보드가 없어요.</span>
        )}
      </div>
      <div className="flex flex-col space-y-[105px] bg-white px-5 pb-20 pt-6 xl:w-[1022px]">
        <h2 className="font-bold md:text-3xl">초대받은 대시보드</h2>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg">
          <Image
            src="/images/myDashboard/invitation.svg"
            alt="초대"
            width={60}
            height={60}
            className="md:size-[100px]"
          />
          <span className="text-xs text-gray02 md:text-xl">아직 초대받은 대시보드가 없어요</span>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;
