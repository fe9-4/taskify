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
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

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
  const [isCardUpdate, setIsCardUpdate] = useAtom(dashboardCardUpdateAtom);

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

  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard, isCardUpdate]);

  const moveCard = async (cardId: number, targetColumnId: number) => {
    try {
      // 1. 먼저 카드 정보를 조회
      const cardResponse = await axios.get(`/api/cards/${cardId}`);
      const cardData = cardResponse.data;

      // 2. 카드의 컬럼 ID를 업데이트하면서 기존 데이터 유지
      const updateResponse = await axios.put(`/api/cards/${cardId}`, {
        ...cardData,
        columnId: targetColumnId,
        assigneeUserId: cardData.assignee.id,
        title: cardData.title,
        description: cardData.description,
        dueDate: cardData.dueDate,
        tags: cardData.tags,
        imageUrl: cardData.imageUrl,
      });

      if (updateResponse.status === 200) {
        toast.success("카드가 이동되었습니다.");
        // 카드 이동 후 즉시 업데이트 트리거
        setIsCardUpdate(true);
        // 업데이트 트리거 초기화
        setTimeout(() => setIsCardUpdate(false), 100);
      }
    } catch (error) {
      console.error("카드 이동 중 오류 발생:", error);
      toast.error("카드 이동에 실패했습니다.");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    const cardId = parseInt(draggableId);
    const targetColumnId = parseInt(destination.droppableId);

    if (source.droppableId !== destination.droppableId) {
      await moveCard(cardId, targetColumnId);
    }
  };

  const handleColumnBtn = () => {
    const columnTitles = columnList?.map((column) => column.title) || [];
    setColumnTitles(columnTitles);
    toggleModal("createColumn", true);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
    </DragDropContext>
  );
};

export default DashboardDetail;
