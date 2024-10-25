"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import DashboardMemberList from "@/app/dashboard/[dashboardId]/edit/components/DashboardMemberList";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";

const EditPage = () => {
  const { dashboardId } = useParams();

  // 대시보드 정보 가져오기 (이름, 구성원?, 초대 내역?)

  return (
    <div className="flex w-[284px] flex-col p-5 md:w-[544px] xl:w-[620px]">
      <div className="flex items-center gap-[6px] md:gap-2">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardId}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      <div className="flex w-[620px] flex-col gap-4">
        <EditDashboard title="비브리지" />

        <DashboardMemberList sectionTitle="구성원" />
        <DashboardMemberList sectionTitle="초대 내역" />
      </div>
      <div className="mt-6">
        <DeleteDashboardBtn />
      </div>
    </div>
  );
};

export default EditPage;
