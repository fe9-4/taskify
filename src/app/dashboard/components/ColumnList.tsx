import axios from "axios";
import toast from "react-hot-toast";
import ColumnItem from "./ColumnItem";
import { useAtom, useSetAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CardIdAtom } from "@/store/modalAtom";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setColumnAtom = useSetAtom(ColumnAtom);
  const setDetailCardId = useSetAtom(CardIdAtom);
  const setCurrentColumnList = useSetAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const observeRef = useRef<HTMLDivElement | null>(null);
  const toggleModal = useToggleModal();
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  const dragSourceColumnRef = useRef<string | null>(null);
  const isLargeScreen = useWidth();
  const ADDITIONAL_CARDS_SIZE = 3; // 추가 로드 시 고정 크기
  const isInitialLoadingRef = useRef(true);

  // XLarge 화면 크기 체크
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXLargeScreen(window.innerWidth >= 1280);
    };

    // 초기 체크
    checkScreenSize();

    // resize 이벤트에 throttle 적용
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

  // isXLargeScreen 변경 시 초기화 로직 수정
  useEffect(() => {
    // 컬럼 초기화
    setCardList([]);
    setCursorId(cards.length > 0 ? cards[cards.length - 1].id : undefined);
    setHasMore(cards.length < totalCount);

    // setTimeout을 사용하여 다음 tick에서 초기화 완료 처리
    setTimeout(() => {
      isInitialLoadingRef.current = false;
    }, 0);
  }, [isXLargeScreen, cards, totalCount]);

  // 초기 데이터 설정
  useEffect(() => {
    if (isInitialLoadingRef.current) {
      setCardList([]);
      setCursorId(cards.length > 0 ? cards[cards.length - 1].id : undefined);
      setHasMore(cards.length < totalCount);
      isInitialLoadingRef.current = false;
    }
  }, [cards, totalCount]);

  // getCardList 함수를 먼저 선언
  const getCardList = useCallback(async () => {
    if (!hasMore || isLoading || isInitialLoadingRef.current) return;
    setIsLoading(true);

    try {
      const lastCardId = cursorId;

      const response = await axios.get<{
        cards: ICard["cards"];
      }>(`/api/cards?size=${ADDITIONAL_CARDS_SIZE}&columnId=${columnId}${lastCardId ? `&cursorId=${lastCardId}` : ""}`);

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
  }, [columnId, hasMore, cursorId, isLoading, cards, totalCount]);

  // 그 다음 무한 스크롤 useEffect 선언
  useEffect(() => {
    if (!isXLargeScreen || !observeRef.current || isInitialLoadingRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        // 초기 로딩 시 즉시 트리거되는 것을 방지
        if (target.isIntersecting && hasMore && !isDraggingOver && !isLoading) {
          // 현재 보이는 카드의 총 개수 확인
          const totalVisibleCards = cards.length + cardList.length;
          const minimumCardsBeforeLoad = 3; // 최소 3개의 카드가 있어야 추가 로드

          // 최소 카드 개수 이상일 때만 추가 로드
          if (totalVisibleCards >= minimumCardsBeforeLoad) {
            getCardList();
          }
        }
      },
      {
        root: null,
        rootMargin: "50px", // 감지 영역 축소
        threshold: 0.5, // 임계값 증가
      }
    );

    const currentRef = observeRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isDraggingOver, isLoading, isXLargeScreen, getCardList, cardList.length, cards.length]);

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
    <div className="h-full space-y-6 border-b py-4 md:border-gray04 md:pb-6 xl:flex xl:flex-col xl:border-b-0 xl:border-r xl:py-0 xl:pr-4 xl:pt-4 bg-gray05">
      <div className="flex flex-shrink-0 items-center justify-between rounded-t-lg" {...dragHandleProps}>
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
            <div className="flex flex-col space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex flex-col space-y-2">
                <AddTodoBtn
                  onClick={() => {
                    setColumnAtom({ title: columnTitle, columnId });
                    toggleModal("createCard", true);
                  }}
                />
                <div className="flex h-full flex-col space-y-4">
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
                    cardList.map((item, i) => (
                      <div key={item.id} onClick={() => handleCardClick(item.id)}>
                        <ColumnItem ref={i === cardList.length - 1 ? observeRef : null} card={item} />
                      </div>
                    ))}
                </div>
                {!isDraggingOver && hasMore && (
                  <>
                    {!isDraggingOver && hasMore && !isXLargeScreen && (
                      <button
                        onClick={getCardList}
                        disabled={isLoading}
                        className="mt-2 w-full rounded-md border border-gray03 bg-white py-2 font-bold hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isLoading ? "로딩 중..." : "카드 더 보기"}
                      </button>
                    )}
                    {!isLoading && (
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
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default memo(ColumnList);
