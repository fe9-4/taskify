import React, { useEffect, useState } from "react";
import { SelectedDashboard } from "./SelectedDashboard";
import { MemberInitials } from "./MemberInitials";
import { useDashboardList } from "@/hooks/useDashboardList";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const DashboardMemberDisplay = () => {
  const router = useRouter();
  const { data: dashboardList, isLoading, error } = useDashboardList({ page: 1, size: 10 });
  const [dashboardId, setDashboardId] = useState<number | null>(null);
  const [dashboardTitle, setDashboardTitle] = useState<string | null>(null);

  useEffect(() => {
    if (dashboardList && dashboardList.dashboards.length > 0) {
      setDashboardId(dashboardList.dashboards[0].id);
      setDashboardTitle(dashboardList.dashboards[0].title);
    }
  }, [dashboardList]);

  useEffect(() => {
    if (error) {
      toast.error("대시보드 목록을 불러오는 중 오류가 발생했습니다");
      console.error(error.message);
    }
  }, [error]);

  if (isLoading || error) return null;

  return (
    <div className="flex h-full w-full items-center justify-between">
      <div className="w-[100px] pl-1 md:w-[180px]">
        <SelectedDashboard title={dashboardTitle} />
      </div>

      <div className="flex items-center gap-2 pr-1">
        <div
          onClick={() => router.push("/mypage")}
          className="flex h-[30px] w-[49px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray03 md:h-[36px] md:w-[85px]"
        >
          <Image
            src="/images/header/setting.svg"
            alt="관리"
            width={20}
            height={20}
            className="hidden md:inline-block"
          />
          <span className="text-center">관리</span>
        </div>
        <div className="flex h-[30px] w-[73px] items-center justify-center gap-1 rounded-lg border border-gray03 md:h-[36px] md:w-[109px]">
          <Image
            src="/images/header/invitation.svg"
            alt="초대하기"
            width={20}
            height={20}
            className="hidden md:inline-block"
          />
          <span className="text-center">초대하기</span>
        </div>
        {dashboardId && <MemberInitials dashboardId={dashboardId} />}
        <div className="mx-4 h-8 w-px bg-gray-300"></div>
      </div>
    </div>
  );
};
