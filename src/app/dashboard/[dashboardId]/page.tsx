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
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ICard } from "@/types/dashboardType";
import toastMessages from "@/lib/toastMessage";

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

  const calculateInitialCardCount = useCallback(() => {
    const BASE_CARD_COUNT = 3;
    const ADDITIONAL_CARD_COUNT = 1;
    const isXLargeScreen = window.innerWidth >= 1280;
    return isXLargeScreen ? BASE_CARD_COUNT + ADDITIONAL_CARD_COUNT : BASE_CARD_COUNT;
  }, []);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);
      if (response.status === 200) {
        const columns = response.data;
        const initialSize = calculateInitialCardCount();
        const columnsWithCards = await Promise.all(
          columns.map(async (column: IColumnData) => {
            try {
              const cardsResponse = await axios.get(`/api/cards?columnId=${column.id}&size=${initialSize}`);
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
              toast.error(toastMessages.error.getCardList);
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
  }, [dashboardId, calculateInitialCardCount]);

  const handleColumnBtn = () => {
    const columnTitles = columnList.map((column) => column.title);
    setColumnTitles(columnTitles);
    toggleModal("createColumn", true);
  };

  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard, isCardUpdate]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      toast.error(toastMessages.error.moveCard);
      return;
    }

    if (type === "CARD") {
      const cardId = parseInt(draggableId.split("-")[1]);
      const sourceColumnId = parseInt(source.droppableId.split("-")[1]);
      const destinationColumnId = parseInt(destination.droppableId.split("-")[1]);

      const sourceColumn = columnList.find((col) => col.id === sourceColumnId);
      const destColumn = columnList.find((col) => col.id === destinationColumnId);

      if (!sourceColumn || !destColumn) return;

      const cardToMove = sourceColumn.cards[source.index];
      if (!cardToMove) return;

      try {
        setColumnList((prevColumns) => {
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
        toast.error(toastMessages.error.moveCard);
        getColumn();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-[calc(100vh-64px)] w-full">
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="flex h-full w-full flex-col p-4 xl:flex-row xl:space-x-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnList.map((column) => (
                <div key={column.id} className="h-full flex-shrink-0 xl:w-80">
                  <ColumnList
                    columnId={column.id}
                    columnTitle={column.title}
                    cards={column.cards}
                    totalCount={column.totalCount}
                  />
                </div>
              ))}
              {provided.placeholder}
              {columnList.length < 10 && (
                <div className="py-4 xl:pt-[66px]">
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
