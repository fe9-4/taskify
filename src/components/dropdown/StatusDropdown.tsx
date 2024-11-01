"use client";

import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cls } from "@/lib/utils";
import { StatusTitleChip } from "../chip/StatusChip";
import { useAtomValue } from "jotai";
import { currentColumnListAtom } from "@/store/dashboardAtom";
import { ColumnAtom } from "@/store/modalAtom";

interface IProps {
  setSelectedValueId: Dispatch<SetStateAction<number>>;
}

// 현재 열린 모달의 컬럼정보는 받아오고 있습니다. 
// 드롭다운에서 값을 선택하면 해당 컬럼의 title은 화면에 표시되는 용도로 쓰이고, id는 updateCard로 전달됩니다.
const StatusDropdown = ({ setSelectedValueId }: IProps) => {
  const currentColumnList = useAtomValue(currentColumnListAtom);
  const column = useAtomValue(ColumnAtom);
  
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(column.title);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleSelectValue = (title: string, id: number) => {
    setValue(title);
    setSelectedValueId(id);
    setIsOpen(false);
  };

  const renderChip = () => {
    return <StatusTitleChip title={value} />;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <label htmlFor="assignee" className="text-lg font-medium text-black03">
        상태
      </label>
      <div className="relative flex w-full flex-col space-y-[2px] md:w-[217px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[50px] w-full items-center justify-between overflow-hidden rounded-lg px-4 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset"
        >
          {renderChip()}
          <HiChevronDown />
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 top-[50px] z-10 flex flex-col overflow-hidden rounded-bl-md rounded-br-md rounded-tl-md rounded-tr-md border border-gray03 bg-white">
            {currentColumnList.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleSelectValue(item.title, item.id)}
                className={cls("status-dropdown-custom-btn", value !== item.title ? "px-0 pl-[46px] pr-4" : "")}
              >
                {value === item.title && <HiCheck />}
                <StatusTitleChip title={item.title} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StatusDropdown;
