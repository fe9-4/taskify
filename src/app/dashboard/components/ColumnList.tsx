import axios from "axios";
import toast from "react-hot-toast";
import ColumnItem from "./ColumnItem";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, TodoCardId } from "@/store/modalAtom";
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ICard } from "@/types/dashboardType";
import { useWidth } from "@/hooks/useWidth";

interface IProps {
  columnTitle: string;
  columnId: number;
  dragHandleProps?: any;
  cards: ICard["cards"];
  totalCount: ICard["totalCount"];
}

const ColumnList = ({ columnTitle, columnId, dragHandleProps, cards, totalCount }: IProps) => {
  const [cardList, setCardList] = useState<ICard["cards"]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [size] = useState(3);
  const [cursorId, setCursorId] = useState<number | undefined>();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setDetailCardId] = useAtom(TodoCardId);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const observeRef = useRef<HTMLDivElement | null>(null);
  const toggleModal = useToggleModal();
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  const dragSourceColumnRef = useRef<string | null>(null);
  const isLargeScreen = useWidth();

  const isInitialLoadingRef = useRef(true);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setCardList([]);
      setCursorId(cards.length > 0 ? cards[cards.length - 1].id : undefined);
      setHasMore(cards.length < totalCount);
      isInitialLoadingRef.current = false;
    }
  }, [cards, totalCount]);

  const getCardList = useCallback(async () => {
    if (!hasMore || isLoading || isInitialLoadingRef.current) return;
    setIsLoading(true);

    try {
      const lastCardId = cursorId;

      const response = await axios.get<{
        cards: ICard["cards"];
      }>(`/api/cards?size=${size}&columnId=${columnId}${lastCardId ? `&cursorId=${lastCardId}` : ""}`);

      if (response.status === 200) {
        const newCardList = response.data.cards;

        setCardList((prev) => {
          const existingIds = new Set([...cards, ...prev].map((card) => card.id));
          const filteredNewCardList = newCardList.filter((card) => !existingIds.has(card.id));

          if (filteredNewCardList.length > 0) {
            setCursorId(filteredNewCardList[filteredNewCardList.length - 1].id);
          }

          setHasMore(
            filteredNewCardList.length > 0 && prev.length + filteredNewCardList.length + cards.length < totalCount
          );

          return [...prev, ...filteredNewCardList];
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("카드 목록 조회 중 오류 발생", error);
        toast.error(error.response?.data || "카드 목록 조회 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [columnId, hasMore, size, cursorId, isLoading, cards, totalCount]);

  useLayoutEffect(() => {
    if (dashboardCardUpdate) {
      setCardList([]);
      setCursorId(undefined);
      setHasMore(true);
      getCardList();
      setDashboardCardUpdate(false);
    }
  }, [dashboardCardUpdate, getCardList, setDashboardCardUpdate]);

  useEffect(() => {
    if (columnTitle && columnId) {
      setCurrentColumnList((prev) => {
        const newColumn = { id: columnId, title: columnTitle };
        const checkList = prev.some((column) => column.id === columnId);
        if (!checkList) {
          return [...prev, newColumn];
        }
        return prev;
      });
    }
  }, [columnTitle, columnId, setCurrentColumnList]);

  // **xl 이상에서의 무한 스크롤 구현**
  useEffect(() => {
    if (!isLargeScreen) {
      return;
    }

    if (!observeRef.current) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isDraggingOver && !isLoading) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            getCardList();
          }, 300);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const currentRef = observeRef.current;
    observer.observe(currentRef);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, getCardList, isDraggingOver, isLoading, isLargeScreen]);

  // **드래그 앤 드롭 핸들러**
  useEffect(() => {
    const handleDragStart = (event: any) => {
      if (event.type === "card") {
        const sourceColumnId = event.source.droppableId.split("-")[1];
        dragSourceColumnRef.current = sourceColumnId;
        setIsDropDisabled(sourceColumnId === columnId.toString());
      }
    };

    const handleDragEnd = () => {
      dragSourceColumnRef.current = null;
      setIsDropDisabled(false);
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [columnId]);

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
    <div className="bg-gray06 flex w-full flex-col rounded-lg xl:h-full xl:w-80">
      <div className="flex items-center justify-between rounded-t-lg bg-white p-4" {...dragHandleProps}>
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
      <Droppable droppableId={`column-${columnId}`} type="CARD" isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => {
          if (snapshot.isDraggingOver !== isDraggingOver) {
            setIsDraggingOver(snapshot.isDraggingOver);
          }

          return (
            <div
              className="flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto p-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <AddTodoBtn
                onClick={() => {
                  setColumnAtom({ title: columnTitle, columnId });
                  toggleModal("createCard", true);
                }}
              />
              <div className="flex flex-col space-y-2">
                {cards.map((item, index) => (
                  <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? "opacity-50" : ""} ${
                          isDropDisabled && snapshot.draggingOver ? "cursor-not-allowed" : ""
                        }`}
                      >
                        <div onClick={() => !snapshot.isDragging && handleCardClick(item.id)}>
                          <ColumnItem card={item} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {!isDraggingOver &&
                  cardList.map((item) => (
                    <div key={item.id} onClick={() => handleCardClick(item.id)}>
                      <ColumnItem card={item} />
                    </div>
                  ))}
              </div>
              {!isDraggingOver && hasMore && (
                <>
                  {!isLargeScreen && (
                    <button
                      onClick={getCardList}
                      disabled={isLoading}
                      className="mt-2 w-full rounded-md border border-gray03 bg-white py-2 font-bold hover:bg-gray-50 disabled:opacity-50"
                    >
                      {isLoading ? "로딩 중..." : "카드 더 보기"}
                    </button>
                  )}
                  {isLargeScreen && !isLoading && (
                    <div
                      ref={observeRef}
                      className="h-4 w-full"
                      style={{ display: isLargeScreen ? "block" : "none" }}
                    />
                  )}
                </>
              )}
              {isLoading && (
                <div className="py-2 text-center">
                  <p className="font-bold text-gray01">카드 불러오는 중...</p>
                </div>
              )}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default memo(ColumnList);
