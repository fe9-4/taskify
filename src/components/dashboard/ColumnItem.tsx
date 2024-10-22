import { HiOutlineCalendar } from "react-icons/hi";
import Image from "next/image";
import TagChip from "../chip/TagChip";
import { ICard } from "../../../types/types";

const ColumnItem = ({ cards }: ICard) => {
  return (
    <div className="border-b pb-6">
      <div className="flex flex-col space-y-2 rounded-md border border-gray03 p-3 mt-4">
        <Image src={cards.imageUrl || ""} alt="카드 이미지1" width={260} height={150} className="w-full object-cover" priority />
        <div className="flex flex-col space-y-[6px]">
          <h3 className="font-medium">{cards.title}</h3>
          <div className="flex items-center space-x-[6px]">
            {cards.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray01">
              <HiOutlineCalendar />
              <span className="text-xs font-medium text-gray01">{cards.dueDate}</span>
            </div>
            <span className="flex size-[22px] items-center justify-center rounded-full bg-[#A3C4A2] text-[10px] font-semibold text-white md:size-6 md:text-xs">
              {cards.assignee.nickname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnItem;
