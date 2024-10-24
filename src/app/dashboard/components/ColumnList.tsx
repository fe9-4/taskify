import axios from "axios";
import toast from "react-hot-toast";
import ColumnItem from "./ColumnItem";
import { useEffect, useRef, useState } from "react";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ICard } from "@/types/dashboardType";

interface IProps {
  columnTitle: string;
  columnId: number;
}

const ColumnList = ({ columnTitle, columnId }: IProps) => {
  const [cardList, setCardList] = useState<ICard[]>([]);
  const [cursorId, setCursorId] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const getCardList = async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/dashboard/columnList?cursorId=${cursorId}&columnId=${columnId}`);

      if (response.status === 200) {
        setCardList((prev) => [...prev, ...response.data.cards]);
        setCursorId(response.data.cursorId);
      }

      if (response.data.cards.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ColumnList getCardList에서 api 오류 발생", error);
        toast.error(error.response?.data.message);
      }
    }
  };

  // 카드아이템 무한스크롤
  useEffect(() => {
    getCardList();

    observeRef.current = new IntersectionObserver((entries) => {
      const lastCardItem = entries[0];

      if (lastCardItem.isIntersecting && hasMore) {
        getCardList();
      }
    });

    if (loadingRef.current) {
      observeRef.current.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observeRef.current?.unobserve(loadingRef.current);
      }
    };
  }, [hasMore]);

  const handleAddTodo = () => {
    // 모달 만들어지면 모달 연결
    console.log("모달 오픈");
  };

  const handleEditModal = () => {

  }

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
      <div className="flex flex-col space-y-2">
        <AddTodoBtn onClick={handleAddTodo} />
        {cardList.length > 0 ? (
          cardList.map((item, i) => (
            <div key={item.cards.id}>
              <ColumnItem cards={item.cards} />
              {i === cardList.length - 1 && <div ref={loadingRef} className="h-[1px]" />}
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ColumnList;
