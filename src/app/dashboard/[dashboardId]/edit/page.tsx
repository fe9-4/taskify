"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import DashboardMemberList from "@/app/dashboard/[dashboardId]/edit/components/DashboardMemberList";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";

const EditPage = () => {
  // 대시보드 정보 받아오기
  const router = useRouter();
  const { dashboardid } = router.query;

  return (
    <div>
      {/* 대시보드 레이아웃에 공통 여백 줄건지 - 창기님 문의 */}
      {/* 마이 대시보드는 dashboard랑 별도 레이아웃 이유? */}
      <div className="flex items-center gap-[6px] md:gap-2">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardid}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      {/* 620 544  284 : edit 창*/}
      <div className="flex w-[620px] flex-col gap-4">
        <EditDashboard title="비브리지" />
        <DashboardMemberList />
      </div>
      {/* 대시보드 삭제하기 버튼 */}
      <DeleteDashboardBtn />
    </div>
  );
};

export default EditPage;
