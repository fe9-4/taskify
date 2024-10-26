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

interface DashboardInfoType {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  createdByMe: boolean;
}
const EditPage = () => {
  const { dashboardId } = useParams();
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoType>();
  const { user } = useAuth();

  // 대시보드 정보 가져오기 (이름, 구성원?, 초대 내역?)
  /*
{
  "id": 12067,
  "title": "수정테스트",
  "color": "#000000",
  "createdAt": "2024-10-24T19:54:48.459Z",
  "updatedAt": "2024-10-25T19:19:34.157Z",
  "userId": 4668,
  "createdByMe": true
}
  */
  const fetchDashboardInfo = async () => {
    try {
      const res = await axios.get(`/api/dashboards/dashboardId=${dashboardId}`);
      const data = res.data;
      console.log(dashboardId);
      setDashboardInfo(data.user);
      console.log(data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
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
        <EditDashboard title={dashboardInfo?.title || "TITLE"} />

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
