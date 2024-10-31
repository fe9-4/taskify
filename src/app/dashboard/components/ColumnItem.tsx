import Image from "next/image";
import TagChip from "@/components/chip/TagChip";
import { HiOutlineCalendar } from "react-icons/hi";
import { Draggable } from "@hello-pangea/dnd";
import { CardDataProps } from "@/types/cardType";

interface IProps {
  card: CardDataProps;
  index: number;
  columnId: number;
  columnTitle: string;
  toggleModal: (modalName: string, isOpen: boolean) => void;
  setIsDetailCardParams: (cardId: number) => void;
  setColumnAtom: (value: { title: string; columnId: number }) => void;
}

const ColumnItem = ({
  card,
  index,
  columnId,
  columnTitle,
  toggleModal,
  setIsDetailCardParams,
  setColumnAtom,
}: IProps) => {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="w-full cursor-pointer rounded-lg border border-gray03 bg-white p-3 transition-shadow hover:shadow-md"
          onClick={() => {
            toggleModal("detailCard", true);
            setIsDetailCardParams(card.id);
            setColumnAtom({ title: columnTitle, columnId });
          }}
        >
          <div className="flex flex-col space-y-2">
            <Image
              src={card.imageUrl}
              alt="카드 이미지"
              width={260}
              height={150}
              className="max-h-[150px] w-full rounded-md object-cover"
              priority={true}
            />
            <div className="flex flex-col space-y-[6px]">
              <h3 className="font-medium">{card.title}</h3>
              <div className="flex flex-wrap items-center gap-[6px]">
                {card.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray01">
                  <HiOutlineCalendar />
                  <span className="text-xs font-medium">{card.dueDate}</span>
                </div>
                {card.assignee && (
                  <span className="flex size-[22px] items-center justify-center rounded-full bg-[#A3C4A2] text-[10px] font-semibold text-white">
                    {card.assignee.nickname.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnItem;
