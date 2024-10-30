// ColumnList.tsx
import { useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CreateCardParamsAtom, DetailCardParamsAtom } from "@/store/modalAtom";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { useToggleModal } from "@/hooks/useToggleModal";
import { Droppable } from "@hello-pangea/dnd";
import ColumnItem from "./ColumnItem";
import { useCard } from "@/hooks/useCard";

interface IProps {
  columnTitle: string;
  columnId: number;
}

const ColumnList = ({ columnTitle, columnId }: IProps) => {
  const toggleModal = useToggleModal();
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setIsCreateCardParams] = useAtom(CreateCardParamsAtom);
  const [, setIsDetailCardParams] = useAtom(DetailCardParamsAtom);
  const [dashboardCardUpdate, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // useCard 훅 사용
  const { cards, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage } = useCard(columnId, 10);

  // Intersection Observer 콜백
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 1.0,
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  // dashboardCardUpdate 상태가 변경될 때 카드 목록 갱신
  useEffect(() => {
    if (dashboardCardUpdate) {
      setDashboardCardUpdate(false);
    }
  }, [dashboardCardUpdate, setDashboardCardUpdate]);

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
      <AddTodoBtn
        onClick={() => {
          setIsCreateCardParams(columnId);
          toggleModal("createCard", true);
        }}
      />
      <Droppable droppableId={columnId.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col space-y-2 ${snapshot.isDraggingOver ? "bg-gray-50" : ""}`}
          >
            {cards.length > 0 ? (
              cards.map((card, index) => (
                <ColumnItem
                  key={card.id}
                  card={card}
                  index={index}
                  columnId={columnId}
                  columnTitle={columnTitle}
                  toggleModal={toggleModal}
                  setIsDetailCardParams={setIsDetailCardParams}
                  setColumnAtom={setColumnAtom}
                />
              ))
            ) : (
              <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
            )}
            {provided.placeholder}
            {hasNextPage && (
              <div ref={loadingRef} className="flex h-10 items-center justify-center">
                {isFetchingNextPage ? "로딩 중..." : ""}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ColumnList;
