"use client";

import InviteList from "@/app/mydashboard/components/InviteList";
import Pagination from "../../components/pagination/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddDashboardBtn, DashboardCard } from "@/components/button/ButtonComponents";
import { useToggleModal } from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import toastMessages from "@/lib/toastMessage";

const MyDashboard = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const router = useRouter();
  const toggleModal = useToggleModal();
  const { user } = useAuth();

  // useDashboard 훅 사용
  const { dashboardData, isLoading: isDashboardLoading } = useDashboard({
    page,
    size,
    showErrorToast: true,
    customErrorMessage: toastMessages.error.getDashboardList,
  });

  // 로그인 상태 체크
  useEffect(() => {
    if (!user && !isDashboardLoading) {
      router.push("/login");
    }
  }, [user, isDashboardLoading, router]);

  // 페이지네이션을 위한 총 페이지 수 계산
  const totalPage = Math.ceil((dashboardData?.totalCount || 0) / size);

  return (
    <div className="flex flex-col space-y-10 px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex flex-col space-y-6 xl:w-[1022px]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <AddDashboardBtn onClick={() => toggleModal("createDashboard", true)} />
          {dashboardData?.dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboardName={dashboard.title}
              isMine={dashboard.createdByMe}
              color={dashboard.color}
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            />
          ))}
        </div>
        {dashboardData?.dashboards.length ? (
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
      <InviteList />
    </div>
  );
};

export default MyDashboard;
