"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import EditSection from "@/app/dashboard/[dashboardId]/edit/components/EditSection";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardInfoType, ValueType } from "@/types/dashboardType";

const EditPage = () => {
  const { dashboardId } = useParams();
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoType>({
    id: 0,
    title: "TITLE",
    color: "#000000",
    createdAt: "2024-01-01T19:54:48.459Z",
    updatedAt: "2024-01-01T19:19:34.157Z",
    userId: 0,
    createdByMe: false,
  });
  const { user } = useAuth();

  // 대시보드 정보 요청 - 대시보드 수정하고 새로운 정보 가져오기
  const fetchDashboardInfo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/dashboards/${dashboardId}?dashboardId=${dashboardId}`);
      setDashboardInfo(res.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchDashboardInfo();
  }, [user, fetchDashboardInfo]);

  const onClickEdit = (value: ValueType) => {
    const newTitle = value.title;
    const newColor = value.color;
    setDashboardInfo((prev) => ({ ...prev, title: newTitle, color: newColor }));
  };

  return (
    <div className="flex w-[284px] flex-col p-5 md:w-[544px] xl:w-[620px]">
      <div className="flex items-center gap-[6px] md:gap-2">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardId}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      <div className="flex w-[620px] flex-col gap-4">
        <EditDashboard dashboardInfo={dashboardInfo} onClickEdit={onClickEdit} />
        <EditSection sectionTitle="구성원" />
      </div>
      <div className="mt-6">
        <DeleteDashboardBtn />
      </div>
    </div>
  );
};

export default EditPage;
