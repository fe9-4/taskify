import ColumnItem from "./ColumnItem";
import { AddTodoBtn } from "@/components/button/ButtonComponents";
import { useToggleModal } from "@/hooks/useModal";
import { ColumnAtom, TodoCardId } from "@/store/modalAtom";
import { ICard } from "@/types/dashboardType";
import { Draggable, DroppableProvided } from "@hello-pangea/dnd";
import { useAtom } from "jotai";
import { useRef, useState } from "react";

interface IProps {
  columnTitle: string;
  columnId: number;
  cards: ICard["cards"];
  cardList: ICard["cards"];
  provided: DroppableProvided;
}

const CardList = ({ columnTitle, columnId, cards, cardList, provided }: IProps) => {
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setColumnAtom] = useAtom(ColumnAtom);
  const [, setDetailCardId] = useAtom(TodoCardId);
  const toggleModal = useToggleModal();
  const observeRef = useRef(null);

  const handleCardClick = (cardId: number) => {
    toggleModal("detailCard", true);
    setDetailCardId(cardId);
    setColumnAtom({ title: columnTitle, columnId });
  };

  return (
    <>
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
      {isLoading && <p className="flex items-center justify-center font-bold">불러오는 중</p>}
    </>
  );
};

export default CardList;
