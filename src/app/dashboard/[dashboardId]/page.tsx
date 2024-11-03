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
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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
  const setCurrentColumnList = useSetAtom(currentColumnListAtom);

  // 화면 크기 변경 감지를 위한 상태 추가
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);

  const calculateInitialCardCount = useCallback(() => {
    const BASE_CARD_COUNT = 3;
    const ADDITIONAL_CARD_COUNT = 1;

    // 화면 크기 체크
    const isXLargeScreen = window.innerWidth >= 1280;

    // XL 미만이면 무조건 3건 반환
    if (!isXLargeScreen) {
      return BASE_CARD_COUNT;
    }

    // XL 이상일 때만 화면 높이에 따른 계산 수행
    const windowHeight = window.innerHeight;
    const cardHeight = 271;
    const visibleCardCount = Math.floor(windowHeight / cardHeight);

    // 화면에 3개 이상 표시 가능하면 4개 반환, 아니면 3개 반환
    if (visibleCardCount > BASE_CARD_COUNT) {
      return BASE_CARD_COUNT + ADDITIONAL_CARD_COUNT;
    }

    return BASE_CARD_COUNT;
  }, []);

  const getColumn = useCallback(async () => {
    setCurrentColumnList([]);

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

        setCurrentColumnList(columnsWithCards);
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

  // 화면 크기 변경 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsXLargeScreen = window.innerWidth >= 1280;
      if (newIsXLargeScreen !== isXLargeScreen) {
        setIsXLargeScreen(newIsXLargeScreen);
        // 화면 크기가 변경되면 컬럼 데이터 다시 로드
        getColumn();
      }
    };

    // 초기 체크
    checkScreenSize();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(checkScreenSize, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [isXLargeScreen, getColumn]);

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
            toast.error(toastMessages.error.moveCard);
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
      <div className="h-[calc(100vh-64px)] w-full">
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="flex h-full w-full flex-col p-4 xl:flex-row xl:space-x-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnList.map((column, index) => (
                <Draggable key={column.id} draggableId={`column-${column.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="w-full flex-shrink-0 overflow-auto xl:h-full xl:w-80 [&::-webkit-scrollbar]:hidden"
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
