"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import ColumnList from "@/components/dashboard/ColumnList";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";

const DashboardDetail = () => {
  const { id } = useParams();
  const dashboardId = Number(id);
  
  const [columnTitle, setColumnTitle] = useState<string[]>( []);
  const [addColumn, setAddColumn] = useState(false);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/dashboard/${dashboardId}`);

      if (response.status === 200) {
        setColumnTitle(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 컬럼 목록 조회 api에서 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [dashboardId]);

  const handleColumnBtn = () => {
    setAddColumn(!addColumn);
    console.log("컬럼 추가 모달 오픈");
  };

  useEffect(() => {
    getColumn();
  }, [getColumn]);

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