"use client";

import axios from "axios";
import toast from "react-hot-toast";
import ColumnList from "@/app/dashboard/components/ColumnList";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ColumnTitlesAtom, RefreshDashboardAtom } from "@/store/modalAtom";
import { useToggleModal } from "@/hooks/useModal";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ICard } from "@/types/dashboardType";

interface IColumnData {
  id: number;
  title: string;
  cards: ICard["cards"];
  totalCount: ICard["totalCount"];
}

const DashboardDetail = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const toggleModal = useToggleModal();
  const setColumnTitles = useSetAtom(ColumnTitlesAtom);
  const updateDashBoard = useAtomValue(RefreshDashboardAtom);
  const [isCardUpdate] = useAtom(dashboardCardUpdateAtom);

  const [columnList, setColumnList] = useState<IColumnData[]>([]);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);

      if (response.status === 200) {
        const columns = response.data;

        const columnsWithCards = await Promise.all(
          columns.map(async (column: IColumnData) => {
            try {
              const cardsResponse = await axios.get(`/api/cards?columnId=${column.id}&size=3`);
              if (cardsResponse.status === 200) {
                return {
                  ...column,
                  cards: cardsResponse.data.cards,
                  totalCount: cardsResponse.data.totalCount,
                };
              } else {
                return { ...column, cards: [], totalCount: 0 };
              }
            } catch (error) {
              toast.error("카드 목록 조회 중 오류가 발생했습니다.");
              return { ...column, cards: [], totalCount: 0 };
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

      setColumnList((prevColumns) => {
        const sourceColumn = prevColumns.find((col) => col.id === sourceColumnId);
        const destColumn = prevColumns.find((col) => col.id === destinationColumnId);

        if (!sourceColumn || !destColumn) return prevColumns;

        const cardToMove = sourceColumn.cards[source.index];
        if (!cardToMove || !cardToMove.assignee || cardToMove.tags.length === 0) return prevColumns;

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
            getColumn();
          }
        })();

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
      <div className="h-[calc(100vh-64px)] w-full overflow-hidden">
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="flex h-full w-full flex-col gap-6 overflow-y-auto p-4 xl:flex-row xl:overflow-x-auto xl:overflow-y-hidden"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnList.map((column, index) => (
                <Draggable key={column.id} draggableId={`column-${column.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="w-full flex-shrink-0 xl:h-full xl:w-80"
                    >
                      <ColumnList
                        key={column.id}
                        columnTitle={column.title}
                        columnId={column.id}
                        dragHandleProps={provided.dragHandleProps}
                        cards={column.cards}
                        totalCount={column.totalCount}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {columnList.length < 10 && (
                <div className="flex-shrink-0 self-start p-4">
                  <AddColumnBtn onClick={handleColumnBtn} />
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DashboardDetail;
