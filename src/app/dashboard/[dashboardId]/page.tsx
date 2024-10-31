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
import { CardDataProps } from "@/types/cardType";

interface IColumnData {
  id: number;
  title: string;
  teamId: string;
  position: number;
  cards: CardDataProps[];
}

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const toggleModal = useToggleModal();
  const [, setColumnTitles] = useAtom(ColumnTitlesAtom);
  const updateDashBoard = useAtomValue(RefreshDashboardAtom);
  const [isCardUpdate, setIsCardUpdate] = useAtom(dashboardCardUpdateAtom);

  const [columnList, setColumnList] = useState<IColumnData[]>([]);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);

      if (response.status === 200) {
        const columns = response.data;

        const columnsWithCards = await Promise.all(
          columns.map(async (column: IColumnData) => {
            try {
              const cardsResponse = await axios.get(`/api/cards?columnId=${column.id}&size=100`);
              if (cardsResponse.status === 200) {
                return { ...column, cards: cardsResponse.data.cards };
              } else {
                return { ...column, cards: [] };
              }
            } catch (error) {
              console.error(`카드 조회 중 오류 발생 (컬럼 ID: ${column.id})`, error);
              toast.error("카드 목록 조회 중 오류가 발생했습니다.");
              return { ...column, cards: [] };
            }
          })
        );

        setColumnList(columnsWithCards);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 컬럼 목록 조회 api에서 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [dashboardId]);

  const handleColumnBtn = () => {
    const columnTitles = columnList.map((column) => column.title);
    setColumnTitles(columnTitles);
    toggleModal("createColumn", true);
  };

  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard, isCardUpdate]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      if (source.index === destination.index) return;

      const reorderedColumns = Array.from(columnList);
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      setColumnList(reorderedColumns);

      try {
        await axios.put("/api/columns/reorder", {
          reorderedColumns: reorderedColumns.map((column, index) => ({ id: column.id, position: index })),
        });
      } catch (error) {
        console.error("컬럼 순서 업데이트 오류", error);
        toast.error("컬럼 순서 업데이트 중 오류가 발생했습니다.");
      }
    }

    if (type === "CARD") {
      const cardId = parseInt(result.draggableId.split("-")[1]);
      const sourceColumnId = parseInt(source.droppableId.split("-")[1]);
      const destinationColumnId = parseInt(destination.droppableId.split("-")[1]);

      if (sourceColumnId === destinationColumnId && source.index === destination.index) {
        return;
      }

      const newColumnList = Array.from(columnList);
      const sourceColumn = newColumnList.find((column) => column.id === sourceColumnId);
      const destinationColumn = newColumnList.find((column) => column.id === destinationColumnId);

      if (!sourceColumn || !destinationColumn) return;

      const cardToMove = sourceColumn.cards[source.index];
      sourceColumn.cards.splice(source.index, 1);
      destinationColumn.cards.splice(destination.index, 0, cardToMove);

      setColumnList(newColumnList);

      try {
        await axios.put(`/api/cards/${cardId}`, {
          columnId: destinationColumnId,
          assigneeUserId: cardToMove.assignee.id,
          title: cardToMove.title,
          description: cardToMove.description,
          dueDate: cardToMove.dueDate,
          tags: cardToMove.tags,
          imageUrl: cardToMove.imageUrl,
        });
      } catch (error) {
        console.error("카드 이동 업데이트 오류", error);
        toast.error("카드 이동 중 오류가 발생했습니다.");

        setColumnList((prev) => {
          const rollbackColumnList = Array.from(prev);
          destinationColumn.cards.splice(destination.index, 1);
          sourceColumn.cards.splice(source.index, 0, cardToMove);
          return rollbackColumnList;
        });
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
                        cards={column.cards}
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
