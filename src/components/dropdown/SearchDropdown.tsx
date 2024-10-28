"use client";

import { cls } from "@/lib/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { ICurrentManager } from "@/types/currentManager";

// currentManager는 '할 일 수정'에서 이 드롭다운메뉴를 사용하실 때 현재 담당자명입니다.
interface IProps {
  inviteMemberList: ICurrentManager[];
  setManager: (manager: ICurrentManager) => void;
  currentManager?: ICurrentManager;
}

// 초대된 멤버들을 prop으로 받고 담당자명을 추출해서 사용하세요.
const SearchDropdown = ({ inviteMemberList, setManager, currentManager }: IProps) => {
  const [name, setName] = useState("");
  const [selectedMember, setSelectedMember] = useState<ICurrentManager | null>(currentManager || null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setName(value);
    setSelectedMember(null);
    setIsOpen(value.length > 0);
  };

  const handleSelectName = (manager: ICurrentManager) => {
    setSelectedMember(manager);
    setManager(manager);
    setName("");
    setIsOpen(false);
  };

  const filteredNames = inviteMemberList?.filter(
    (item) => item.nickname.includes(name) || item.email.toLowerCase().includes(name.toLowerCase())
  );

  useEffect(() => {
    if (currentManager) {
      setSelectedMember(currentManager);
      setName("");
    }
  }, [currentManager]);

  const displayValue = selectedMember ? selectedMember.nickname : name;

  return (
    <div className="flex w-full flex-col space-y-[2px] bg-white">
      <div className="flex h-[50px] w-full items-center justify-between overflow-hidden rounded-lg px-4 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset">
        <div className="flex items-center space-x-2">
          {selectedMember && (
            <span className="flex h-[26px] w-8 items-center justify-center rounded-full bg-[#A3C4A2] text-xs font-semibold text-white ring-white ring-offset-2">
              {selectedMember.email.charAt(0)}
            </span>
          )}
          <input
            type="text"
            value={displayValue}
            onChange={handleChangeName}
            className="w-full focus:outline-none"
            placeholder="이름을 입력해 주세요"
          />
        </div>
        <FaCaretDown />
      </div>
      {isOpen && filteredNames.length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-bl-md rounded-br-md rounded-tl-md rounded-tr-md border border-gray03">
          {filteredNames.map((item) => (
            <button
              key={item.userId}
              className={cls(
                "search-dropdown-custom-btn",
                selectedMember?.userId !== item.userId ? "px-0 pl-11 pr-4" : ""
              )}
              onClick={() => handleSelectName(item)}
            >
              {selectedMember?.nickname === item.nickname && <HiCheck />}
              <span
                className={`flex size-[26px] items-center justify-center rounded-full bg-[#A3C4A2] text-xs font-semibold text-white ring-white ring-offset-2`}
              >
                {item.email.charAt(0)}
              </span>
              <span className="text-lg">{item.nickname}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
