"use client";

import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cls } from "@/lib/utils";
import { StatusTitleChip } from "../chip/StatusChip";
import { useAtomValue } from "jotai";
import { currentColumnTitleAtom } from "@/store/dashboardAtom";

interface IProps {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  currentValue: string[];
}

// 상태값 변경함수를 보내서 드롭다운에서 값을 받아 쓰세요.
// currentValue는 '할 일 수정' 모달에서 불러온 현재 값입니다.
const StatusDropdown = ({ setSelectedValue, currentValue }: IProps) => {
  const currentColumnTitleList = useAtomValue(currentColumnTitleAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(currentColumnTitleList[0] || "toDo");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleSelectValue = (name: string) => {
    setValue(name);
    setSelectedValue(name);
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

  // const btnArr = currentValue.map((item) => ({
  //   value: item,
  //   title: item.toUpperCase() + item.slice(1)
  // }));

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
            {currentColumnTitleList.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleSelectValue(item)}
                className={cls("status-dropdown-custom-btn", value !== item ? "px-0 pl-[46px] pr-4" : "")}
              >
                {value === item && <HiCheck />}
                <StatusTitleChip title={item} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StatusDropdown;
