"use client";

import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cls } from "@/lib/utils";
import { StatusTitleChip } from "../chip/StatusChip";

interface IProps {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  currentValue?: string;
}

// 상태값 변경함수를 보내서 드롭다운에서 값을 받아 쓰세요.
// currentValue는 '할 일 수정' 모달에서 불러온 현재 값입니다.
// 가장 바깥쪽 div 요소의 w-[217px]을 w-full로 바꿔서 적용해야 사용하시는 곳에 맞춰질수도 있습니다. (말씀해주시면 w-full로 수정해서 올리겠습니다.)
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
    return <StatusTitleChip title={value === "toDo" ? "To Do" : value === "progress" ? "On Progress" : "Done"} />;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const btnArr = [
    { value: "toDo", title: "To Do" },
    { value: "progress", title: "On Progress" },
    { value: "done", title: "Done" },
  ];

  return (
    <div className="flex w-full flex-col space-y-[2px] md:w-[217px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[50px] w-full items-center justify-between overflow-hidden rounded-lg px-4 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset"
      >
        {renderChip()}
        <HiChevronDown />
      </button>
      {isOpen && (
        <div className="flex flex-col overflow-hidden rounded-bl-md rounded-br-md rounded-tl-md rounded-tr-md border border-gray03">
          {btnArr.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => handleSelectValue(item.value)}
              className={cls("status-dropdown-custom-btn", value !== item.value ? "px-0 pl-[46px] pr-4" : "")}
            >
              {value === item.value && <HiCheck />}
              <StatusTitleChip title={item.value} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
