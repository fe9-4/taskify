"use client";

import axios from "axios";
import toast from "react-hot-toast";
import ColumnList from "@/app/dashboard/components/ColumnList";
import toastMessages from "@/lib/toastMessage";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ColumnTitlesAtom, RefreshDashboardAtom } from "@/store/modalAtom";
import { useToggleModal } from "@/hooks/useModal";
import {
  columnCardsAtom,
  currentColumnListAtom,
  dashboardCardUpdateAtom,
  resetColumnListAtom,
} from "@/store/dashboardAtom";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ICard } from "@/types/dashboardType";
import { PlusChip } from "@/components/chip/PlusAndNumChip";

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
  const [isCardUpdate, setIsCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const [columnList, setColumnList] = useState<IColumnData[]>([]);
  const [columnCards, setColumnCards] = useAtom(columnCardsAtom);
  const setResetColumnList = useSetAtom(resetColumnListAtom);
  const setCurrentColumnList = useSetAtom(currentColumnListAtom);

  const calculateInitialCardCount = useCallback(() => {
    const BASE_CARD_COUNT = 3;
    const ADDITIONAL_CARD_COUNT = 1;
    const isXLargeScreen = window.innerWidth >= 1280;
    return isXLargeScreen ? BASE_CARD_COUNT + ADDITIONAL_CARD_COUNT : BASE_CARD_COUNT;
  }, []);

  // 컬럼 리스트 초기화 및 설정
  useEffect(() => {
    if (dashboardId) {
      setResetColumnList(dashboardId);
    }
  }, [dashboardId, setResetColumnList]);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);

      if (response.status === 200) {
        const columns = response.data;
        setCurrentColumnList(
          columns.map((column: IColumnData) => ({
            id: column.id,
            title: column.title,
          }))
        );

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
  }, [dashboardId, calculateInitialCardCount, setCurrentColumnList]);

  const handleColumnBtn = () => {
    const columnTitles = columnList.map((column) => column.title);
    setColumnTitles(columnTitles);
    toggleModal("createColumn", true);
  };

  useEffect(() => {
    getColumn();
  }, [getColumn, updateDashBoard]);

  // 추가되면 실시간 반영되도록 하는 함수
  useEffect(() => {
    if (isCardUpdate) {
      getColumn();
      setIsCardUpdate(false);
    }
  }, [getColumn, isCardUpdate, setIsCardUpdate]);

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

      const sourceCards = columnCards[sourceColumnId]?.cards || [];
      const cardToMove = sourceCards[source.index];

      if (!cardToMove) return;

      try {
        const updatedColumnCards = { ...columnCards };
        const updatedColumnList = [...columnList];

        if (updatedColumnCards[sourceColumnId]) {
          const newSourceCards = [...updatedColumnCards[sourceColumnId].cards];
          newSourceCards.splice(source.index, 1);
          updatedColumnCards[sourceColumnId] = {
            ...updatedColumnCards[sourceColumnId],
            cards: newSourceCards,
            totalCount: updatedColumnCards[sourceColumnId].totalCount - 1,
          };
        }

        if (updatedColumnCards[destinationColumnId]) {
          const newDestCards = [...updatedColumnCards[destinationColumnId].cards];
          newDestCards.splice(destination.index, 0, cardToMove);
          updatedColumnCards[destinationColumnId] = {
            ...updatedColumnCards[destinationColumnId],
            cards: newDestCards,
            totalCount: updatedColumnCards[destinationColumnId].totalCount + 1,
          };
        }

        const sourceColumnIndex = updatedColumnList.findIndex((col) => col.id === sourceColumnId);
        const destColumnIndex = updatedColumnList.findIndex((col) => col.id === destinationColumnId);

        if (sourceColumnIndex !== -1) {
          updatedColumnList[sourceColumnIndex] = {
            ...updatedColumnList[sourceColumnIndex],
            cards: updatedColumnList[sourceColumnIndex].cards.filter((card) => card.id !== cardToMove.id),
            totalCount: updatedColumnList[sourceColumnIndex].totalCount - 1,
          };
        }

        if (destColumnIndex !== -1) {
          const newCards = [...updatedColumnList[destColumnIndex].cards];
          newCards.splice(destination.index, 0, cardToMove);
          updatedColumnList[destColumnIndex] = {
            ...updatedColumnList[destColumnIndex],
            cards: newCards,
            totalCount: updatedColumnList[destColumnIndex].totalCount + 1,
          };
        }

        setColumnCards(updatedColumnCards);
        setColumnList(updatedColumnList);

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
      <div className="h-[calc(100dvh-60px)] w-full md:h-[calc(100dvh-70px)] xl:overflow-y-hidden">
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="flex h-full w-full flex-col p-4 xl:flex-row xl:px-0"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnList.map((column) => (
                <div
                  key={column.id}
                  ref={provided.innerRef}
                  className="w-full flex-shrink-0 overflow-auto xl:h-full xl:w-80 [&::-webkit-scrollbar]:hidden"
                >
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
                <div className="my-4 xl:my-0 xl:px-4">
                  <button
                    onClick={handleColumnBtn}
                    className="mb-4 flex w-full items-center justify-center space-x-3 rounded-lg border border-gray03 bg-white py-4 xl:mt-16 xl:h-[70px] xl:min-w-[354px] xl:max-w-[354px] xl:py-0"
                  >
                    <span className="text-lg font-bold">새로운 컬럼 추가하기</span>
                    <PlusChip />
                  </button>
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
