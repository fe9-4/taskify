import axios from "axios";
import toast from "react-hot-toast";
import ColumnItem from "./ColumnItem";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, TodoCardId } from "@/store/modalAtom";
import { ICard } from "@/types/dashboardType";
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";

interface IProps {
  columnTitle: string;
  columnId: number;
}

const ColumnList = ({ columnTitle, columnId }: IProps) => {
  const [cardList, setCardList] = useState<ICard["cards"]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [size, setSize] = useState(3);
  const toggleModal = useToggleModal();
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setDetailCardId] = useAtom(TodoCardId);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const getCardList = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/cards?size=${size}&columnId=${columnId}`);

      if (response.status === 200) {
        const newCardList: ICard["cards"] = response.data.cards;

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

  return (
    <div className="space-y-6 px-4 pt-4 md:border-b md:border-gray04 md:pb-6 xl:flex xl:min-h-screen xl:flex-col xl:border-b-0 xl:border-r">
      <div className="flex items-center justify-between">
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
      <div className="flex min-w-[314px] flex-col space-y-2">
        <AddTodoBtn
          onClick={() => {
            setColumnAtom({ title: columnTitle, columnId });
            toggleModal("createCard", true);
          }}
        />
        {cardList.length > 0 ? (
          cardList.map((item, i) => (
            <div key={item.id}>
              <button
                className="size-full"
                onClick={() => {
                  toggleModal("detailCard", true);
                  setDetailCardId(item.id);
                  setColumnAtom({ title: columnTitle, columnId });
                }}
              >
                <ColumnItem cards={item} />
                {i === cardList.length - 1 && <div ref={loadingRef} className="h-[1px]" />}
              </button>
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default memo(ColumnList);
