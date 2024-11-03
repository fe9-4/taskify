import axios from "axios";
import ColumnItem from "./ColumnItem";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { ColumnAtom, CardIdAtom } from "@/store/modalAtom";
import { columnCardsAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";
import { ICard } from "@/types/dashboardType";
import { NumChip } from "@/components/chip/PlusAndNumChip";
import { HiOutlineCog } from "react-icons/hi";
import { Droppable } from "@hello-pangea/dnd";
import { AddTodoBtn } from "@/components/button/ButtonComponents";

interface IProps {
  columnTitle: string;
  columnId: number;
  cards: ICard["cards"];
  totalCount: ICard["totalCount"];
}

const ColumnList = ({ columnTitle, columnId, cards: initialCards = [], totalCount }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const observeRef = useRef<HTMLDivElement | null>(null);
  const [columnCards, setColumnCards] = useAtom(columnCardsAtom);
  const setColumnAtom = useSetAtom(ColumnAtom);
  const setDetailCardId = useSetAtom(CardIdAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const toggleModal = useToggleModal();
  const ADDITIONAL_CARDS_SIZE = 3; // 추가 로드 시 고정 크기

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

  // loadMoreCards 함수를 먼저 선언
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

  // 수정, 삭제 시 업데이트함수 
  useEffect(() => {
    if (dashboardCardUpdate) {
      loadMoreCards();
      setDashboardCardUpdate(false);
    }
  }, [dashboardCardUpdate, loadMoreCards, setDashboardCardUpdate]);

  const handleEditModal = () => {
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("editColumn", true);
  };

  const handleCardClick = (cardId: number) => {
    toggleModal("detailCard", true);
    setDetailCardId(cardId);
    setColumnAtom({ title: columnTitle, columnId });
  };

  return (
    <div className="h-full space-y-6 border-b bg-gray05 py-4 md:border-gray04 md:pb-6 xl:flex xl:flex-col xl:border-b-0 xl:border-r xl:pr-4">
      <div className="flex flex-shrink-0 items-center justify-between rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="size-2 rounded-full bg-violet01" />
            <h2 className="text-lg font-bold text-black">{columnTitle}</h2>
          </div>
          <NumChip num={totalCount} />
        </div>
        <button onClick={handleEditModal}>
          <HiOutlineCog className="size-[22px] text-gray01" />
        </button>
      </div>
      <Droppable droppableId={`column-${columnId}`} type="CARD">
        {(provided) => (
          <div
            className="flex flex-col space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="flex flex-col space-y-2">
              <AddTodoBtn
                onClick={() => {
                  setColumnAtom({ title: columnTitle, columnId });
                  toggleModal("createCard", true);
                }}
              />
              <div className="flex flex-col space-y-4">
                {currentColumn.cards.map((item, index) => (
                  <ColumnItem key={item.id} card={item} index={index} onClick={() => handleCardClick(item.id)} />
                ))}
                {provided.placeholder}
                {/* 무한 스크롤을 위한 관찰 대상 요소 */}
                {currentColumn.hasMore && !isLoading && <div ref={observeRef} className="h-4 w-full hidden xl:block" />}
                {isLoading && (
                  <div className="py-2 text-center">
                    <p className="font-bold text-gray01">카드 불러오는 중...</p>
                  </div>
                )}
              </div>
              {currentColumn.hasMore && (
                <button
                  onClick={loadMoreCards}
                  disabled={isLoading}
                  className="mt-2 w-full rounded-md border border-gray03 bg-white py-2 font-bold hover:bg-gray-50 disabled:opacity-50 xl:hidden"
                >
                  {isLoading ? "로딩 중..." : "카드 더 보기"}
                </button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(ColumnList);
