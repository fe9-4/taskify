"use client";

import axios from "axios";
import toast from "react-hot-toast";
import ColumnList from "@/app/dashboard/components/ColumnList";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";
import { useAtom, useAtomValue } from "jotai";
import { ColumnTitlesAtom, RefreshDashboardAtom } from "@/store/modalAtom";
import { useToggleModal } from "@/hooks/useModal";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ICard } from "@/types/dashboardType";

interface IColumnData {
  id: number;
  title: string;
  teamId: string;
  position: number;
  cards: ICard["cards"];
}

const DashboardDetail = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
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
              toast.error("카드 목록 조회 중 오류가 발생했습니다.");
              return { ...column, cards: [] };
            }
          })
        );

        setColumnList(columnsWithCards);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
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

    if (type === "CARD") {
      const cardId = parseInt(result.draggableId.split("-")[1]);
      const sourceColumnId = parseInt(source.droppableId.split("-")[1]);
      const destinationColumnId = parseInt(destination.droppableId.split("-")[1]);

      if (sourceColumnId === destinationColumnId && source.index === destination.index) {
        return;
      }

      // 이동할 카드 정보를 찾고 상태 업데이트를 한 번에 처리
      setColumnList((prevColumns) => {
        const sourceColumn = prevColumns.find((col) => col.id === sourceColumnId);
        const destColumn = prevColumns.find((col) => col.id === destinationColumnId);

        if (!sourceColumn || !destColumn) return prevColumns;

        const cardToMove = sourceColumn.cards[source.index];
        if (!cardToMove || !cardToMove.assignee || cardToMove.tags.length === 0) return prevColumns;

        // API 호출
        (async () => {
          try {
            await axios.put(`/api/cards/${cardId}`, {
              columnId: destinationColumnId,
              assigneeUserId: cardToMove.assignee?.id,
              title: cardToMove.title,
              description: cardToMove.description,
              dueDate: cardToMove.dueDate,
              tags: cardToMove.tags || [],
              imageUrl: cardToMove.imageUrl,
            });
          } catch (error) {
            console.error("카드 이동 업데이트 오류", error);
            toast.error("카드 이동 중 오류가 발생했습니다.");
            getColumn(); // 에러 발생 시 상태 복구
          }
        })();

        // 상태 업데이트
        return prevColumns.map((column) => {
          if (column.id === sourceColumnId) {
            const newCards = [...column.cards];
            newCards.splice(source.index, 1);
            return { ...column, cards: newCards };
          }
          if (column.id === destinationColumnId) {
            const newCards = [...column.cards];
            newCards.splice(destination.index, 0, cardToMove);
            return { ...column, cards: newCards };
          }
          return column;
        });
      });
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
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-col"
                    >
                      <ColumnList
                        key={column.id}
                        columnTitle={column.title}
                        columnId={column.id}
                        cards={column.cards}
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
