"use client";

import { DoneChip, ProgressChip, TodoChip } from "../chip/StatusChip";
import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cls } from "@/lib/utils";

interface IProps {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  currentValue?: string;
}

// 상태값 변경함수를 보내서 드롭다운에서 값을 받아 쓰세요.
// currentValue는 '할 일 수정' 모달에서 불러온 현재 값입니다.
// 가장 바깥쪽 div 요소의 w-[217px]을 w-full로 바꿔서 적용해야 사용하시는 곳에 맞춰질수도 있습니다.
const StatusDropdown = ({ setSelectedValue, currentValue }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(currentValue || "toDo");
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
    switch (value) {
      case "toDo":
        return <TodoChip />;
      case "progress":
        return <ProgressChip />;
      case "done":
        return <DoneChip />;
      default:
        return <TodoChip />;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const btnArr = [
    { value: "toDo", chip: <TodoChip /> },
    { value: "progress", chip: <ProgressChip /> },
    { value: "done", chip: <DoneChip /> },
  ];

  return (
    <div className="flex w-[217px] flex-col space-y-[2px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between rounded-md border px-4 py-2 focus:border-violet01"
      >
        {renderChip()}
        <HiChevronDown />
      </button>
      {isOpen && (
        <div className="flex flex-col overflow-hidden rounded-bl-md rounded-br-md rounded-tl-md rounded-tr-md border border-gray03">
          {btnArr.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelectValue(item.value)}
              className={cls("status-dropdown-custom-btn", value !== item.value ? "px-0 pl-[46px] pr-4" : "")}
            >
              {value === item.value && <HiCheck />}
              {item.chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
