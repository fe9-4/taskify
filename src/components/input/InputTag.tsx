import TagChip from "../chip/TagChip";
import { ChangeEventHandler, KeyboardEventHandler } from "react";
//import { InputTagProps } from "@/types/formType";

interface InputTagProps {
  tags: string[]; // 태그 배열
  tagInput: string; // 현재 입력 중인 태그 문자열
  onKeyDown: KeyboardEventHandler; // 키 입력 이벤트 핸들러
  onClick: (tag: string) => void; // 태그 클릭 이벤트 핸들러
  onChange: ChangeEventHandler; // 입력 변경 이벤트 핸들러
}

const InputTag = ({ tags, tagInput, onKeyDown, onClick, onChange }: InputTagProps) => {
  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor="tags" className="text-lg font-medium text-black03">
        태그
      </label>

      <div className="flex h-[50px] w-full items-center gap-2 rounded-lg px-4 text-lg text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset">
        {/* 태그가 있을 경우에만 태그 목록 렌더링 */}
        {tags.length > 0 && (
          <div className="flex gap-2">
            {/* 각 태그에 대해 TagChip 컴포넌트 렌더링 */}
            {tags.map((tag: string, index: number) => (
              <div key={index} onClick={() => onClick(tag)}>
                <TagChip tag={tag} />
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="w-full flex-grow border-none p-1 focus:outline-none"
          placeholder={tags.length === 0 ? "입력 후 Enter" : ""}
        />
      </div>
    </div>
  );
};

export default InputTag;
