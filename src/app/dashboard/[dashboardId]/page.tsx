"use client";

import ColumnList from "@/components/dashboard/ColumnList";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AddColumnBtn } from "@/components/ButtonComponents";
import apiClient from "@/app/api/apiClient";
import { useParams } from "next/navigation";

const DUMMY_TITLE = ["새 프로젝트", "지난 프로젝트", "예정 프로젝트"];

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const [columnTitle, setColumnTitle] = useState<string[]>(DUMMY_TITLE || []);
  const [addColumn, setAddColumn] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  
  const getColumn = async () => {
    try {
      const response = await apiClient.get(`/columns?dashboardId=${dashboardId}`);

      if (response.status === 200) {
        const data = response.data.data;
        setColumnTitle(data.title);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 컬럼 목록 조회 api에서 오류 발생", error);
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleColumnBtn = () => {
    setAddColumn(!addColumn);
    console.log("컬럼 추가 모달 오픈");
  };

  return (
    <div className="flex flex-col space-y-6 pb-6 xl:flex-row xl:space-x-6 xl:space-y-0">
      <div className="flex flex-col space-y-6 xl:flex-row xl:space-y-0">
        {columnTitle.map((column) => (
          <ColumnList key={column} columnTitle={column} />
        ))}
      </div>
      <div className="flex h-fit justify-center xl:justify-start xl:pt-[66px]">
        <AddColumnBtn onClick={handleColumnBtn} />
      </div>
    </div>
  );
}

export default DashboardDetail;