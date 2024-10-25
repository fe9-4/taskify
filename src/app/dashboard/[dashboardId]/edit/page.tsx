"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import DashboardMemberList from "@/app/dashboard/[dashboardId]/edit/components/DashboardMemberList";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";

const EditPage = () => {
  const { dashboardId } = useParams();

  return (
    <main className="p-5">
      <div className="flex items-center gap-[6px] md:gap-2">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardId}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      <div className="flex w-[620px] flex-col gap-4">
        <EditDashboard title="비브리지" />
        <DashboardMemberList />
        <DashboardMemberList />
      </div>
      <div className="mt-6">
        <DeleteDashboardBtn />
      </div>
    </main>
  );
};

export default EditPage;
