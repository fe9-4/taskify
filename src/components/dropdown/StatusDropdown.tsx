"use client";

import { HiChevronDown } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { Dispatch, SetStateAction, useEffect, useRef, useState, useMemo } from "react";
import { cls } from "@/lib/utils";
import { StatusTitleChip } from "../chip/StatusChip";
import { useAtomValue } from "jotai";
import { currentColumnListAtom, currentDashboardIdAtom } from "@/store/dashboardAtom";
import { ColumnAtom } from "@/store/modalAtom";
import { useParams } from "next/navigation";

interface IProps {
  setSelectedValueId: Dispatch<SetStateAction<number>>;
}

const StatusDropdown = ({ setSelectedValueId }: IProps) => {
  const currentColumnList = useAtomValue(currentColumnListAtom);
  const column = useAtomValue(ColumnAtom);
  const { dashboardId } = useParams();
  const currentDashboardId = useAtomValue(currentDashboardIdAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(column.title);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredColumnList = useMemo(() => {
    if (currentDashboardId === dashboardId) {
      return currentColumnList;
    }
    return [];
  }, [currentColumnList, currentDashboardId, dashboardId]);

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
            {filteredColumnList.map((item) => (
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
