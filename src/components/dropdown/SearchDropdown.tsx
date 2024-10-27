"use client";

import { cls, randomColor } from "@/lib/utils";
import { CreateCardProps, UpdateCardProps } from "@/types/cardType";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldErrors, UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import { FaCaretDown } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";

interface ICurrentManager {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

// currentManager는 '할 일 수정'에서 이 드롭다운메뉴를 사용하실 때 현재 담당자명입니다.
interface IProps {
  inviteMemberList: ICurrentManager[];
  currentManager: ICurrentManager;
  setManager: (manager: ICurrentManager) => void;
  setValue: UseFormSetValue<CreateCardProps | UpdateCardProps>;
  // value: ICurrentManager | any;
  validation: UseFormRegisterReturn;
  errors?: FieldErrors;
}

// 초대된 멤버들을 prop으로 받고 담당자명을 추출해서 사용하세요.
const SearchDropdown = ({ validation, setValue, inviteMemberList, setManager, currentManager }: IProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [selectedName, setSelectedName] = useState<ICurrentManager | null>();
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // const { value } = e.target;
    const res = inviteMemberList.filter((data) => data.nickname.includes(e.target.value));

    setName(e.target.value);
    setSelectedName(null);
    setIsOpen(e.target.value.length > 0);

    if (e.target.value === res[0]?.nickname) {
      setValue("assigneeUserId", res[0]?.id);
    }
  };

  const handleSelectName = (manager: ICurrentManager) => {
    setManager(manager);
    setName("");
    setIsOpen(false);
  };

  // 이름에 따라 필터링된 멤버 리스트 생성
  const filteredNames = inviteMemberList.filter((item) => item.nickname.toLowerCase().includes(name.toLowerCase()));

  useEffect(() => {
    if (currentManager) {
      setSelectedName(currentManager);
      setName("");
    }
  }, [currentManager]);

  return (
    <section className="flex flex-col gap-2">
      <label htmlFor="assignee" className="text-lg font-medium text-black03">
        담당자
      </label>
      <div className="flex w-full flex-col space-y-[2px] bg-white" ref={dropdownRef}>
        <div className="flex h-[50px] w-full items-center justify-between overflow-hidden rounded-lg px-4 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset">
          <div className="flex items-center space-x-2">
            {selectedName && (
              <span className="flex h-[26px] w-8 items-center justify-center rounded-full bg-[#A3C4A2] text-xs font-semibold text-white ring-white ring-offset-2">
                {selectedName.nickname.charAt(0)}
              </span>
            )}
            <input
              type="text"
              value={selectedName?.nickname || name}
              onChange={handleChangeName}
              className="w-full focus:outline-none"
              placeholder="이름을 입력해 주세요"
              {...validation?.ref}
            />
          </div>
          <FaCaretDown />
        </div>
        {isOpen && filteredNames.length > 0 && (
          <div className="flex flex-col overflow-hidden rounded-bl-md rounded-br-md rounded-tl-md rounded-tr-md border border-gray03">
            {filteredNames.map((item) => (
              <button
                key={item.id}
                className={cls("search-dropdown-custom-btn", selectedName?.id !== item.id ? "px-0 pl-11 pr-4" : "")}
                onClick={() => handleSelectName(item)}
              >
                {selectedName?.nickname === item.nickname && <HiCheck />}
                <span
                  className={`flex size-[26px] items-center justify-center rounded-full bg-[#A3C4A2] text-xs font-semibold text-white ring-white ring-offset-2`}
                >
                  {item.nickname.charAt(0)}
                </span>
                <span className="text-lg">{item.nickname}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchDropdown;
