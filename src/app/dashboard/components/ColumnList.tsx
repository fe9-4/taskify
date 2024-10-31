import axios from "axios";
import toast from "react-hot-toast";
import ColumnItem from "./ColumnItem";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CreateCardParamsAtom, DetailCardParamsAtom } from "@/store/modalAtom";
import { ICard } from "@/types/dashboardType";
import { currentColumnListAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useModal";

interface IProps {
  columnTitle: string;
  columnId: number;
  dashboardId: string | string[];
}

const ColumnList = ({ columnTitle, columnId, dashboardId }: IProps) => {
  const [cardList, setCardList] = useState<ICard["cards"]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [size] = useState(3);
  const [cursorId, setCursorId] = useState<ICard["cursorId"]>();
  const [totalCount, setTotalCount] = useState<ICard["totalCount"]>(0);
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setIsCreateCardParams] = useAtom(CreateCardParamsAtom);
  const [, setIsDetailCardParams] = useAtom(DetailCardParamsAtom);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const toggleModal = useToggleModal();
  const observeRef = useRef<HTMLDivElement | null>(null);
  
  const getCardList = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/cards?size=${size}&columnId=${columnId}&cursorId=${cursorId}`);
      
      if (response.status === 200) {
        const newCardList: ICard["cards"] = response.data.cards;
        setTotalCount(response.data.totalCount);

        setCardList((prev) => {
          const existingId = new Set(prev.map((card) => card.id));
          const filteredNewCardList = newCardList.filter((card) => !existingId.has(card.id));
          
          if (filteredNewCardList.length === 0 || filteredNewCardList.length < size) {
            setHasMore(false);
          }

          return [...prev, ...filteredNewCardList];
        });

        if (newCardList.length >= size) {
          setCursorId(newCardList[newCardList.length - 1].id);
        } 
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ColumnList getCardList에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [columnId, hasMore, size, cursorId]);

  // 카드아이템 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const lastCardItem = entries[0];

      if (lastCardItem.isIntersecting && hasMore) {
        getCardList();
      }
    }, { threshold: 1 });

    const currentLoadingRef = observeRef.current;

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer?.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, getCardList]);

  // 카드 실시간 업데이트
  useEffect(() => {
    if (dashboardCardUpdate) {
      getCardList();
      setHasMore(true);
      setDashboardCardUpdate(false);
    }
  }, [dashboardCardUpdate, getCardList, setDashboardCardUpdate]);

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
          <NumChip num={totalCount} />
        </div>
        <button onClick={handleEditModal}>
          <HiOutlineCog className="size-[22px] text-gray01" />
        </button>
      </div>
      <div className="flex min-w-[314px] flex-col space-y-2">
        <AddTodoBtn
          onClick={() => {
            setIsCreateCardParams(columnId);
            toggleModal("createCard", true);
          }}
        />
        {cardList.length > 0 ? (
          cardList.map((item) => (
            <div key={item.id}>
              <button
                className="size-full"
                onClick={() => {
                  toggleModal("detailCard", true);
                  setIsDetailCardParams(item.id);
                  setColumnAtom({ title: columnTitle, columnId });  
                }}
              >
                <ColumnItem cards={item} />
              </button>
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
        )}
        {hasMore && <div ref={observeRef} className="flex items-center justify-center font-bold">카드 더 보기</div>}
      </div>
    </div>
  );
};

export default memo(ColumnList);
