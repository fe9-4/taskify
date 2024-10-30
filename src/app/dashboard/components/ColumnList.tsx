import { useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CreateCardParamsAtom, DetailCardParamsAtom } from "@/store/modalAtom";
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
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const { cards, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useCard(columnId, 10);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 1.0,
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  const handleEditModal = () => {
    setColumnAtom({ title: columnTitle, columnId });
    toggleModal("editColumn", true);
  };

  return (
    <div className="w-[327px] shrink-0 space-y-6 px-4 pt-4 md:w-[378px] md:border-b md:border-gray04 md:pb-6 xl:flex xl:min-h-screen xl:flex-col xl:border-b-0 xl:border-r">
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
            {isLoading ? (
              <p className="flex items-center justify-center text-center font-bold">로딩 중...</p>
            ) : cards.length > 0 ? (
              cards.map((card, index) => (
                <ColumnItem
                  key={card.id}
                  card={card}
                  index={index}
                  columnId={columnId}
                  columnTitle={columnTitle}
                  toggleModal={toggleModal as unknown as (modalName: string, isOpen: boolean) => void}
                  setIsDetailCardParams={setIsDetailCardParams}
                  setColumnAtom={setColumnAtom}
                />
              ))
            ) : (
              <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {hasNextPage && <div ref={loadingRef} className="h-[1px]" />}
    </div>
  );
};

export default ColumnList;
