import React, { useEffect, useState } from "react";
import { SelectedDashboard } from "./SelectedDashboard";
import { MemberInitials } from "./MemberInitials";
import { useDashboardList } from "@/hooks/useDashboardList";
import { Dashboard } from "@/zodSchema/dashboardSchema";
import toast from "react-hot-toast";

export const DashboardMemberDisplay = () => {
  const { data: dashboardList, isLoading, error } = useDashboardList({ page: 1, size: 10 });
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (dashboardList && dashboardList.dashboards.length > 0) {
      setSelectedDashboard(dashboardList.dashboards[0]);
    }
  }, [dashboardList]);

  useEffect(() => {
    if (error) {
      toast.error("대시보드 목록을 불러오는 중 오류가 발생했습니다");
      console.error(error.message);
    }
  }, [error]);

  if (isLoading || error) return null;

  // 대시보드가 없는 경우
  if (!dashboardList || dashboardList.dashboards.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-between">
      <div className="pl-1">
        <SelectedDashboard dashboard={selectedDashboard} />
      </div>
      <div className="flex pr-1">
        {selectedDashboard && <MemberInitials dashboardId={selectedDashboard.id} />}
        <div className="mx-4 h-8 w-px bg-gray-300"></div>
      </div>
    </div>
  );
};
