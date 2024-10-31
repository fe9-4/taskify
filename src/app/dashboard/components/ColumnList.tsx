import { useEffect, memo } from "react";
import ColumnItem from "./ColumnItem";
import { useAtom } from "jotai";
import { HiOutlineCog } from "react-icons/hi";
import { NumChip } from "../../../components/chip/PlusAndNumChip";
import { AddTodoBtn } from "../../../components/button/ButtonComponents";
import { ColumnAtom, CreateCardParamsAtom, DetailCardParamsAtom } from "@/store/modalAtom";
import { currentColumnListAtom } from "@/store/dashboardAtom";
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
  const toggleModal = useToggleModal();
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setIsCreateCardParams] = useAtom(CreateCardParamsAtom);
  const [, setIsDetailCardParams] = useAtom(DetailCardParamsAtom);
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);

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
          <NumChip num={cards.length} />
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
            {cards.map((item, index) => (
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
