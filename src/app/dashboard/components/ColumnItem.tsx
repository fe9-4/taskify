import { HiOutlineCalendar } from "react-icons/hi";
import Image from "next/image";
import TagChip from "@/components/chip/TagChip";
import { Draggable } from "@hello-pangea/dnd";
import { initiModalState } from "@/store/modalAtom";
import { CardResponseSchemaType } from "@/zodSchema/commonSchema";

interface IProps {
  card: CardResponseSchemaType;
  index: number;
  columnId: number;
  columnTitle: string;
  toggleModal: (modalName: keyof typeof initiModalState, isOpen: boolean) => void;
  setIsDetailCardParams: (value: number) => void;
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
  const handleCardClick = () => {
    toggleModal("detailCard", true);
    setIsDetailCardParams(card.id);
    setColumnAtom({ title: columnTitle, columnId });
  };

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? "opacity-50" : ""}`}
          onClick={handleCardClick}
        >
          <div {...provided.dragHandleProps} className="w-full">
            <section className="w-full border-b pb-6 md:border-0 md:pb-0">
              <div className="mt-4 flex flex-col space-y-2 rounded-md border border-gray03 bg-white p-3 md:flex-row md:items-center md:space-x-2 md:space-y-0 md:px-4 xl:flex-col xl:space-x-0 xl:space-y-[6px]">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt="카드 이미지1"
                    width={260}
                    height={150}
                    className="max-h-[150px] w-full rounded-md object-cover md:h-[53px] md:w-[90px] xl:h-40 xl:w-full"
                    priority={true}
                  />
                ) : (
                  <Image
                    src="/images/cardImg1.png"
                    alt="카드 이미지1"
                    width={260}
                    height={150}
                    className="w-full rounded-md object-cover md:h-[53px] md:w-[90px] xl:h-40 xl:w-full"
                    priority={true}
                  />
                )}
                <div className="flex flex-col space-y-[6px] md:w-full md:flex-row md:space-x-[6px] xl:flex-col">
                  <div className="flex w-full flex-col space-y-[6px]">
                    <h3 className="text-start font-medium">{card.title}</h3>
                    <div className="flex w-full flex-col space-y-[6px] md:flex-row md:space-x-[6px] md:space-y-0 xl:flex-col xl:space-x-0 xl:space-y-[6px]">
                      <div className="flex w-full flex-wrap items-center gap-[6px] md:w-64">
                        {card.tags?.map((tag) => <TagChip key={tag} tag={tag} />)}
                      </div>
                      <div className="flex w-full items-center justify-between md:self-end">
                        <div className="flex items-center space-x-1 text-gray01">
                          <HiOutlineCalendar />
                          <span className="text-xs font-medium text-gray01">{card.dueDate}</span>
                        </div>
                        {card.assignee && (
                          <span className="flex size-[22px] items-center justify-center rounded-full bg-[#A3C4A2] text-[10px] font-semibold text-white md:size-6 md:text-xs">
                            {card.assignee.nickname.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnItem;
