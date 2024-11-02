import React, { memo } from "react";
import Image from "next/image";
import TagChip from "@/components/chip/TagChip";
import { HiOutlineCalendar } from "react-icons/hi";
import { Iitem } from "@/types/dashboardType";

interface IProps {
  card: Iitem;
  dragHandleProps?: any;
}

const ColumnItem = ({ card, dragHandleProps }: IProps) => {
  if (!card) return null;

  return (
    <section className="w-full border-b pb-6 md:border-0 md:pb-0">
      <div
        {...dragHandleProps}
        className="mt-4 flex cursor-grab flex-col space-y-2 rounded-md border border-gray03 bg-white p-3 active:cursor-grabbing md:flex-row md:items-center md:space-x-2 md:space-y-0 md:px-4 xl:flex-col xl:space-x-0 xl:space-y-[6px]"
      >
        <Image
          src={card.imageUrl}
          alt="카드 이미지"
          width={260}
          height={150}
          className="max-h-[150px] w-full rounded-md object-cover md:h-[53px] md:w-[90px] xl:h-40 xl:w-full"
          priority={true}
        />
        <div className="flex flex-col space-y-[6px] md:w-full md:flex-row md:space-x-[6px] xl:flex-col">
          <div className="flex w-full flex-col space-y-[6px]">
            <h3 className="text-start font-medium">{card.title}</h3>
            <div className="flex w-full flex-col space-y-[6px] md:flex-row md:space-x-[6px] md:space-y-0 xl:flex-col xl:space-x-0 xl:space-y-[6px]">
              <div className="flex w-full flex-wrap items-center gap-[6px] md:w-64">
                {card.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
              <div className="flex w-full items-center justify-between md:self-end">
                <div className="flex items-center space-x-1 text-gray01">
                  <HiOutlineCalendar />
                  <span className="text-xs font-medium text-gray01">{card.dueDate}</span>
                </div>
                <span className="flex size-[22px] items-center justify-center rounded-full bg-[#A3C4A2] text-[10px] font-semibold text-white md:size-6 md:text-xs">
                  {card.assignee?.nickname.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

ColumnItem.displayName = "ColumnItem";

export default memo(ColumnItem);
