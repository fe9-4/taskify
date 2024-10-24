"use client";

import axios from "axios";
import toast from "react-hot-toast";
import ColumnList from "@/components/dashboard/ColumnList";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";

interface IColumnData {
  id: number;
  title: string;
  teamId: string;
}
interface IColumnList {
  data: IColumnData[];
}

const DashboardDetail = () => {
  const { dashboardId } = useParams();

  const [columnList, setColumnList] = useState<IColumnList["data"]>( []);
  const [addColumn, setAddColumn] = useState(false);
  
  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/dashboard/${dashboardId}`);

      if (response.status === 200) {
        setColumnList(response.data);
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
        {columnList.map((column) => (
          <ColumnList key={column.id} columnTitle={column.title} columnId={column.id} />
        ))}
      </div>
      <div className="flex h-fit justify-center xl:justify-start xl:pt-[66px]">
        <AddColumnBtn onClick={handleColumnBtn} />
      </div>
    </div>
  );
}

export default DashboardDetail;