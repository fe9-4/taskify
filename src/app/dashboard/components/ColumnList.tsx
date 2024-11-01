import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, memo, useState, useRef, useCallback } from "react";
import ColumnItem from "./ColumnItem";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CreateCardParamsAtom, DetailCardParamsAtom } from "@/store/modalAtom";
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { CardDataProps } from "@/types/cardType";

interface IProps {
  columnTitle: string;
  columnId: number;
  dragHandleProps?: any;
  cards: CardDataProps[];
}

const ColumnList = ({ columnTitle, columnId, dragHandleProps, cards }: IProps) => {
  const [cardList, setCardList] = useState<CardDataProps[]>(cards);
  const [hasMore, setHasMore] = useState(true);
  const [size, setSize] = useState(3);
  const toggleModal = useToggleModal();
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setIsCreateCardParams] = useAtom(CreateCardParamsAtom);
  const [, setIsDetailCardParams] = useAtom(DetailCardParamsAtom);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const getCardList = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/cards?size=${size}&columnId=${columnId}`);

      if (response.status === 200) {
        const newCardList: CardDataProps[] = response.data.cards;

        setCardList((prev) => {
          const existingId = new Set(prev.map((card) => card.id));
          const filteredNewCardList = newCardList.filter((card) => !existingId.has(card.id));

          if (filteredNewCardList.length === 0 || filteredNewCardList.length < size) {
            setHasMore(false);
          }

          return [...prev, ...filteredNewCardList];
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ColumnList getCardList에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [columnId, hasMore, size]);

  // 카드아이템 무한스크롤
  useEffect(() => {
    getCardList();

    observeRef.current = new IntersectionObserver((entries) => {
      const lastCardItem = entries[0];

      if (lastCardItem.isIntersecting && hasMore) {
        getCardList();
      }
    });

    const currentLoadingRef = loadingRef.current;

    if (currentLoadingRef) {
      observeRef.current.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observeRef.current?.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, size, getCardList]);

  // 카드 실시간 업데이트
  useEffect(() => {
    if (dashboardCardUpdate) {
      getCardList();

      setCardList((prev) => prev.filter((card) => card.columnId !== columnId));

      setHasMore(true);
      setDashboardCardUpdate(false);
    }
  }, [getCardList, dashboardCardUpdate, columnId, setDashboardCardUpdate]);

  // 카드 수정시 드롭다운에 보내는 데이터
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

  const handleEditModal = () => {
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("editColumn", true);
  };

  const handleCardClick = (cardId: number) => {
    setIsDetailCardParams(cardId);
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("detailCard", true);
  };

  return (
    <div className="space-y-6 px-4 pt-4 md:border-b md:border-gray04 md:pb-6 xl:flex xl:min-h-screen xl:flex-col xl:border-b-0 xl:border-r">
      <div className="flex items-center justify-between" {...dragHandleProps}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="size-2 rounded-full bg-violet01" />
            <h2 className="text-lg font-bold text-black">{columnTitle}</h2>
          </div>
          <NumChip num={cardList.length} />
        </div>
        <button onClick={handleEditModal}>
          <HiOutlineCog className="size-[22px] text-gray01" />
        </button>
      </div>
      <Droppable droppableId={`column-${columnId}`} type="CARD">
        {(provided) => (
          <div className="flex min-w-[314px] flex-col space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
            <AddTodoBtn
              onClick={() => {
                setIsCreateCardParams(columnId);
                toggleModal("createCard", true);
              }}
            />
            {cardList.map((item, index) => (
              <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <ColumnItem card={item} dragHandleProps={provided.dragHandleProps} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(ColumnList);
