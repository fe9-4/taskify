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
  const previousHasMore = useRef(true);
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setDetailCardId] = useAtom(TodoCardId);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const observeRef = useRef(null);
  const toggleModal = useToggleModal();
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  const dragSourceColumnRef = useRef<string | null>(null);
  const isDraggingOverRef = useRef(isDraggingOver);
  const isLargeScreen = useWidth();
  
  const getCardList = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    try {
      const lastCardId = cards[cards.length - 1]?.id;
      const currentCursorId = cursorId || lastCardId;

      const response = await axios.get<{
        cards: ICard["cards"];
      }>(`/api/cards?size=${size}&columnId=${columnId}${currentCursorId ? `&cursorId=${currentCursorId}` : ""}`);

      if (response.status === 200) {
        const newCardList = response.data.cards;

        setCardList((prev) => {
          const existingIds = new Set([...cards, ...prev].map((card) => card.id));
          const filteredNewCardList = newCardList.filter((card) => !existingIds.has(card.id));

          setHasMore(filteredNewCardList.length >= size);

          return [...prev, ...filteredNewCardList];
        });

        if (newCardList.length > 0) {
          setCursorId(newCardList[newCardList.length - 1].id);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ColumnList getCardList에 API 오류 발생", error);
        toast.error(error.response?.data || "카드 목록 조회 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [columnId, hasMore, size, cursorId, cards, isLoading]);

  useLayoutEffect(() => {
    if (isDraggingOverRef.current !== isDraggingOver) {
      isDraggingOverRef.current = isDraggingOver;
      if (isDraggingOver) {
        previousHasMore.current = hasMore;
        setHasMore(false);
        setCardList([]);
      } else {
        const timer = setTimeout(() => {
          setHasMore(previousHasMore.current);
          getCardList();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isDraggingOver, hasMore, getCardList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastCardItem = entries[0];
        if (lastCardItem.isIntersecting && hasMore && !isDraggingOver && isLargeScreen) {
          getCardList();
        }
      },
      { threshold: 0.5 }
    );

    const currentLoadingRef = observeRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, getCardList, isDraggingOver, isLargeScreen]);

  useEffect(() => {
    if (dashboardCardUpdate) {
      getCardList();
      setHasMore(true);
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
    <div className="space-y-6 px-4 pt-4 md:border-b md:border-gray04 md:pb-6 xl:flex xl:min-h-screen xl:flex-col xl:border-b-0 xl:border-r">
      <div className="flex items-center justify-between" {...dragHandleProps}>
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
            <div className="flex min-w-[314px] flex-col space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
              <AddTodoBtn
                onClick={() => {
                  setColumnAtom({ title: columnTitle, columnId });
                  toggleModal("createCard", true);
                }}
              />
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
                cardList
                  .filter((item) => !cards.some((card) => card.id === item.id))
                  .map((item, i) => (
                    <div key={item.id} onClick={() => handleCardClick(item.id)}>
                      <ColumnItem ref={i === cardList.length - 1 ? observeRef : null} card={item} />
                    </div>
                  ))}
              {cards.length > 0 && (
                <button
                  onClick={getCardList}
                  className="w-full rounded-md border border-gray03 bg-white py-2 font-bold xl:hidden"
                >
                  카드 더 보기
                </button>
              )}
              {isLoading && <p className="text-center font-bold">카드 불러오는 중...</p>}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default memo(ColumnList);
