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
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface IColumnData {
  id: number;
  title: string;
  teamId: string;
  position: number;
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

  const handleColumnBtn = () => {
    const columTitles = columnList.map((column) => column.title);
    setColumnTitles(columTitles);
    toggleModal("createColumn", true);
  };

  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard, isCardUpdate]);

  // 컬럼 순서 변경 핸들러
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // 컬럼 이동 처리
    if (type === "COLUMN") {
      if (source.index === destination.index) return;

      const reorderedColumns = Array.from(columnList);
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      setColumnList(reorderedColumns);
    }

    // 카드 이동 처리
    if (type === "CARD") {
      const cardId = parseInt(result.draggableId.split("-")[1]);
      const sourceColumnId = parseInt(source.droppableId.split("-")[1]);
      const destinationColumnId = parseInt(destination.droppableId.split("-")[1]);

      try {
        const response = await axios.get(`/api/cards?columnId=${sourceColumnId}&size=100`);
        const card = response.data.cards.find((card: { id: number }) => card.id === cardId);

        if (card) {
          await axios.put(`/api/cards/${cardId}`, {
            columnId: destinationColumnId,
            assigneeUserId: card.assigneeUserId,
            title: card.title,
            description: card.description,
            dueDate: card.dueDate,
            tags: card.tags,
            imageUrl: card.imageUrl,
          });

          // 카드 이동 후 즉시 상태 업데이트
          setIsCardUpdate(true);
        } else {
          toast.error("카드 이동 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("카드 이동 업데이트 오류", error);
        toast.error("카드 이동 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col space-y-6 overflow-auto pb-6 xl:flex-row xl:space-x-6 xl:space-y-0 xl:pr-4">
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="flex flex-col space-y-6 xl:flex-row xl:space-y-0"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnList.map((column, index) => (
                <Draggable key={column.id} draggableId={`column-${column.id}`} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="flex flex-col">
                      <ColumnList
                        key={column.id}
                        columnTitle={column.title}
                        columnId={column.id}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="px-4 xl:px-0 xl:pt-[66px]">
          {columnList.length < 10 && <AddColumnBtn onClick={handleColumnBtn} />}
        </div>
      </div>
    </DragDropContext>
  );
};

export default DashboardDetail;
