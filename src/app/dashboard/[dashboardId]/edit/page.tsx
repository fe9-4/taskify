"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import DashboardMemberList from "@/app/dashboard/[dashboardId]/edit/components/DashboardMemberList";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const EditPage = () => {
  const { dashboardId } = useParams();
  const [dashboardInfo, setDashboardInfo] = useState([]);
  const { user } = useAuth();

  // 대시보드 정보 가져오기 (이름, 구성원?, 초대 내역?)

  const fetchDashboardInfo = async () => {
    if (user) {
      try {
        const res = await axios.get(`/api`);
        const data = res.data;
        // setDashboardInfo(data.user ? data.user.dashboards : []);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
  }, [user]);

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
