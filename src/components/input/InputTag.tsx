import { cls } from "@/lib/utils";
import TagChip from "../chip/TagChip";
import React from "react";
import { InputTagProps } from "@/types/formType";

const InputTag = ({ cardData, tagInput, onKeyDown, onClick, onChange }: InputTagProps) => {
  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor="tags" className="text-lg font-medium text-black03">
        태그
      </label>

      <div className="flex h-[50px] w-full items-center gap-2 rounded-lg border px-4 text-lg text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset focus:ring-violet01">
        {cardData.tags.length > 0 && (
          <div className="flex gap-2">
            {[...cardData.tags].map((tag) => (
              <div onClick={() => onClick(tag)}>
                <TagChip tag={tag} key={tag} />
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
        />
      </div>
    </div>
  );
};

export default InputTag;
