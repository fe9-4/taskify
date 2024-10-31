"use client";

import axios from "axios";
import toast from "react-hot-toast";
import ColumnList from "@/app/dashboard/components/ColumnList";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";
import { useAtom, useAtomValue } from "jotai";
import { ColumnTitlesAtom, RefreshDashboardAtom } from "@/store/modalAtom";
import { useToggleModal } from "@/hooks/useToggleModal";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";

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
  const toggleModal = useToggleModal();
  const [, setColumnTitles] = useAtom(ColumnTitlesAtom);
  const updateDashBoard = useAtomValue(RefreshDashboardAtom);
  const isCardUpdate = useAtomValue(dashboardCardUpdateAtom);

  const [columnList, setColumnList] = useState<IColumnList["data"]>([]);
  
  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);

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
    const columTitles = columnList.map((column) => column.title);
    setColumnTitles(columTitles);
    toggleModal("createColumn", true);
  };
  
  // 모달 창이 닫힐때 마다 대시보드 새로 불러오기
  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard, isCardUpdate]);

  return (
    <div className="flex flex-col space-y-6 overflow-auto pb-6 xl:flex-row xl:space-x-6 xl:space-y-0 xl:pr-4">
      <div className="flex flex-col space-y-6 xl:flex-row xl:space-y-0">
        {columnList.map((column) => (
          <ColumnList key={column.id} columnTitle={column.title} columnId={column.id} />
        ))}
      </div>
      <div className="px-4 xl:px-0 xl:pt-[66px]">
        {columnList.length < 10 && <AddColumnBtn onClick={handleColumnBtn} />}
      </div>
    </div>
  );
};

export default DashboardDetail;
