import { useAtom, useSetAtom } from "jotai";
import { ColumnAtom, CardIdAtom } from "@/store/modalAtom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";
import { ICard } from "@/types/dashboardType";
import { NumChip } from "@/components/chip/PlusAndNumChip";
import { HiOutlineCog } from "react-icons/hi";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { AddTodoBtn } from "@/components/button/ButtonComponents";
import ColumnItem from "./ColumnItem";

interface IProps {
  columnTitle: string;
  columnId: number;
  dragHandleProps?: any;
  cards: ICard["cards"];
  allCards: ICard["cards"];
  totalCount: ICard["totalCount"];
}

const ColumnList = ({
  columnTitle,
  columnId,
  dragHandleProps,
  cards: initialCards = [],
  allCards = [],
  totalCount,
}: IProps) => {
  const [cards, setCards] = useState<ICard["cards"]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(initialCards.length);
  const [hasMore, setHasMore] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);
  const observeRef = useRef<HTMLDivElement | null>(null);
  const dragSourceColumnRef = useRef<string | null>(null);
  const ADDITIONAL_CARDS_SIZE = 3;
  const setColumnAtom = useSetAtom(ColumnAtom);
  const setDetailCardId = useSetAtom(CardIdAtom);
  const setCurrentColumnList = useSetAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const toggleModal = useToggleModal();
  const [isDropDisabled, setIsDropDisabled] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXLargeScreen(window.innerWidth >= 1280);
    };

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
  }, []);

  useEffect(() => {
    if (initialCards && allCards) {
      setCards(initialCards);
      setCurrentIndex(initialCards.length);
      setHasMore(initialCards.length < allCards.length);
    }
  }, [initialCards, allCards]);

  const loadMoreCards = useCallback(() => {
    if (!hasMore || isLoading || !allCards) return;
    setIsLoading(true);

    const nextCards = allCards.slice(currentIndex, currentIndex + ADDITIONAL_CARDS_SIZE);
    if (nextCards.length > 0) {
      setCards((prev) => {
        const newCards = [...prev, ...nextCards];
        const newAllCards = [...allCards];
        return newCards;
      });
      setCurrentIndex((prev) => prev + ADDITIONAL_CARDS_SIZE);
      setHasMore(currentIndex + ADDITIONAL_CARDS_SIZE < allCards.length);
    }
    setIsLoading(false);
  }, [allCards, currentIndex, hasMore, isLoading, ADDITIONAL_CARDS_SIZE]);

  useEffect(() => {
    if (!isXLargeScreen || !observeRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isDraggingOver && !isLoading) {
          loadMoreCards();
        }
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.5,
      }
    );

    const currentRef = observeRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isDraggingOver, isLoading, isXLargeScreen, loadMoreCards]);

  useLayoutEffect(() => {
    if (dashboardCardUpdate) {
      setCards(initialCards);
      setCurrentIndex(initialCards.length);
      setHasMore(currentIndex < allCards.length);
      setDashboardCardUpdate(false);
    }
  }, [dashboardCardUpdate, initialCards, allCards.length, currentIndex, setDashboardCardUpdate]);

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
    <div className="bg-gray06 flex h-full w-full flex-col rounded-lg xl:w-80">
      <div className="flex flex-shrink-0 items-center justify-between rounded-t-lg bg-white p-4" {...dragHandleProps}>
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
            <div className="flex flex-1 flex-col overflow-y-auto" ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex flex-col space-y-2 p-4">
                <AddTodoBtn
                  onClick={() => {
                    setColumnAtom({ title: columnTitle, columnId });
                    toggleModal("createCard", true);
                  }}
                />
                <div className="flex flex-col space-y-2">
                  {allCards.map((item, index) => (
                    <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? "opacity-50" : ""} ${
                            isDropDisabled && snapshot.draggingOver ? "cursor-not-allowed" : ""
                          } ${index >= cards.length ? "hidden" : ""}`}
                        >
                          <div onClick={() => !snapshot.isDragging && handleCardClick(item.id)}>
                            <ColumnItem
                              card={item}
                              dragHandleProps={provided.dragHandleProps}
                              ref={index === cards.length - 1 && isXLargeScreen ? observeRef : null}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {!isDraggingOver && hasMore && (
                    <>
                      {!isXLargeScreen && (
                        <button
                          onClick={loadMoreCards}
                          disabled={isLoading}
                          className="mt-2 w-full rounded-md border border-gray03 bg-white py-2 font-bold hover:bg-gray-50 disabled:opacity-50"
                        >
                          {isLoading ? "로딩 중..." : "카드 더 보기"}
                        </button>
                      )}
                      {isXLargeScreen && !isLoading && <div ref={observeRef} className="h-4" />}
                    </>
                  )}
                  {isLoading && (
                    <div className="py-2 text-center">
                      <p className="font-bold text-gray01">카드 불러오는 중...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default ColumnList;
