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

    if (type === "CARD") {
      const cardId = parseInt(result.draggableId.split("-")[1]);
      const sourceColumnId = parseInt(source.droppableId.split("-")[1]);
      const destinationColumnId = parseInt(destination.droppableId.split("-")[1]);

      if (sourceColumnId === destinationColumnId) {
        toast.success("컬럼 내에서의 카드 이동은 지원되지 않습니다.");
        setIsCardUpdate(true);
        return;
      }

      // 불변성을 유지하며 상태 업데이트
      setColumnList((prevColumns) => {
        const newColumns = prevColumns.map((column) => {
          if (column.id === sourceColumnId) {
            const newCards = Array.from(column.cards);
            const [movedCard] = newCards.splice(source.index, 1);
            return { ...column, cards: newCards };
          }
          if (column.id === destinationColumnId) {
            const newCards = Array.from(column.cards);
            newCards.splice(
              destination.index,
              0,
              prevColumns.find((col) => col.id === sourceColumnId)?.cards[source.index] as CardDataProps
            );
            return { ...column, cards: newCards };
          }
          return column;
        });
        return newColumns;
      });

      try {
        // 필요한 필드가 모두 있는지 확인하고, 없으면 기본값 설정
        const cardToMove = columnList.find((column) => column.id === sourceColumnId)?.cards[source.index];

        if (!cardToMove) throw new Error("이동할 카드를 찾을 수 없습니다.");
        if (!cardToMove.assignee) throw new Error("담당자 정보가 없습니다.");
        if (cardToMove.tags.length === 0) throw new Error("태그 정보가 없습니다.");

        await axios.put(`/api/cards/${cardId}`, {
          columnId: destinationColumnId,
          assigneeUserId: cardToMove.assignee?.id,
          title: cardToMove.title,
          description: cardToMove.description,
          dueDate: cardToMove.dueDate,
          tags: cardToMove.tags,
          imageUrl: cardToMove.imageUrl,
        });
      } catch (error) {
        console.error("카드 이동 업데이트 오류", error);
        toast.error("카드 이동 중 오류가 발생했습니다.");

        // 오류 발생 시 상태 롤백 (필요한 경우 구현)
        getColumn(); // 상태를 다시 불러오는 함수 호출
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
