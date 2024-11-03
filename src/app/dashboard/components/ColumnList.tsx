import { ColumnAtom, CardIdAtom } from "@/store/modalAtom";
import { useSetAtom, useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ICard } from "@/types/dashboardType";
import { NumChip } from "@/components/chip/PlusAndNumChip";
import { HiOutlineCog } from "react-icons/hi";
import { Droppable } from "@hello-pangea/dnd";
import ColumnItem from "./ColumnItem";
import { AddTodoBtn } from "@/components/button/ButtonComponents";
import { useToggleModal } from "@/hooks/useModal";
import axios from "axios";
import { columnCardsAtom } from "@/store/dashboardAtom";
import React from "react";

interface IProps {
  columnTitle: string;
  columnId: number;
  cards: ICard["cards"];
  totalCount: ICard["totalCount"];
}

const ColumnList = ({ columnTitle, columnId, cards: initialCards = [], totalCount }: IProps) => {
  const [columnCards, setColumnCards] = useAtom(columnCardsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const observeRef = useRef<HTMLDivElement | null>(null);
  const ADDITIONAL_CARDS_SIZE = 3;
  const setColumnAtom = useSetAtom(ColumnAtom);
  const setDetailCardId = useSetAtom(CardIdAtom);
  const toggleModal = useToggleModal();

  const currentColumn = columnCards[columnId] || {
    cards: [],
    hasMore: false,
    cursorId: null,
    totalCount: 0,
  };

  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      setColumnCards((prev) => ({
        ...prev,
        [columnId]: {
          cards: initialCards,
          hasMore: initialCards.length < totalCount,
          cursorId: initialCards[initialCards.length - 1]?.id || null,
          totalCount,
        },
      }));
    }
  }, [initialCards, totalCount, columnId, setColumnCards]);

  const loadMoreCards = useCallback(async () => {
    if (!currentColumn.hasMore || isLoading || !currentColumn.cursorId) return;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `/api/cards?columnId=${columnId}&size=${ADDITIONAL_CARDS_SIZE}&cursorId=${currentColumn.cursorId}`
      );

      if (response.status === 200) {
        const newCards = response.data.cards;
        setColumnCards((prev) => ({
          ...prev,
          [columnId]: {
            ...prev[columnId],
            cards: [...prev[columnId].cards, ...newCards],
            hasMore: response.data.totalCount > prev[columnId].cards.length + newCards.length,
            cursorId: newCards[newCards.length - 1]?.id || null,
          },
        }));
      }
    } catch (error) {
      console.error("Error loading more cards:", error);
    } finally {
      setIsLoading(false);
    }
  }, [columnId, currentColumn.hasMore, currentColumn.cursorId, isLoading, setColumnCards]);

  const handleEditModal = () => {
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("editColumn", true);
  };

  const handleCardClick = (cardId: number) => {
    setDetailCardId(cardId);
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("detailCard", true);
  };

  // Intersection Observer 설정
  useEffect(() => {
    if (!observeRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && currentColumn.hasMore && !isLoading) {
          loadMoreCards();
        }
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    const currentRef = observeRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [currentColumn.hasMore, isLoading, loadMoreCards]);

  return (
    <div className="bg-gray06 flex h-full w-full flex-col rounded-lg">
      <div className="flex flex-shrink-0 items-center justify-between rounded-t-lg bg-white p-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-black">{columnTitle}</h2>
          <NumChip num={totalCount} />
        </div>
        <button
          onClick={handleEditModal}
          className="hover:bg-gray06 flex h-full w-10 items-center justify-center rounded-md"
        >
          <HiOutlineCog className="size-[22px] text-gray01" />
        </button>
      </div>
      <Droppable droppableId={`column-${columnId}`} type="CARD">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto">
            <div className="p-4">
              <AddTodoBtn
                onClick={() => {
                  setColumnAtom({ title: columnTitle, columnId });
                  toggleModal("createCard", true);
                }}
              />
              <div className="mt-2 space-y-2">
                {currentColumn.cards.map((item, index) => (
                  <ColumnItem key={item.id} card={item} index={index} onClick={() => handleCardClick(item.id)} />
                ))}
                {provided.placeholder}
                {/* 무한 스크롤을 위한 관찰 대상 요소 */}
                {currentColumn.hasMore && !isLoading && <div ref={observeRef} className="h-4 w-full" />}
                {isLoading && (
                  <div className="py-2 text-center">
                    <p className="font-bold text-gray01">카드 불러오는 중...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default React.memo(ColumnList);
