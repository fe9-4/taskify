import React, { useState } from "react";
import { SelectedDashboard } from "./SelectedDashboard";
import { MemberInitials } from "./MemberInitials";
import { useDashboardList } from "@/hooks/useDashboardList";

export const DashboardMemberDisplay: React.FC = () => {
  const { data: dashboardList, isLoading, error } = useDashboardList();
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(null);

  if (isLoading) return <div className="flex h-full items-center justify-center">로딩 중...</div>;
  if (error) return <div className="flex h-full items-center justify-center">에러 발생: {error.message}</div>;

  // 대시보드가 없는 경우
  if (!dashboardList || dashboardList.dashboards.length === 0) {
    return null;
  }

  // 선택된 대시보드가 없으면 첫 번째 대시보드를 선택
  if (!selectedDashboardId) {
    setSelectedDashboardId(dashboardList.dashboards[0].id);
  }

  return (
    <div className="flex h-full w-full items-center justify-between">
      <div className="pl-1">
        <SelectedDashboard
          selectedDashboardId={selectedDashboardId}
          dashboards={dashboardList.dashboards}
          onDashboardSelect={setSelectedDashboardId}
        />
      </div>
      <div className="pr-1">{selectedDashboardId && <MemberInitials dashboardId={selectedDashboardId} />}</div>
    </div>
  );
};
