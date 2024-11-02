import TagChip from "../chip/TagChip";
import { InputTagProps } from "@/types/formType";

const InputTag = ({ tags, tagInput, onKeyDown, onClick, onChange }: InputTagProps) => {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden">
      <label htmlFor="tags" className="text-lg font-medium text-black03 md:text-xl">
        태그
      </label>

      <div className="flex h-[50px] w-full items-center gap-2 overflow-x-scroll rounded-lg px-4 text-base text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset md:text-lg [&::-webkit-scrollbar]:hidden">
        {tags && tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <div onClick={() => onClick(tag)} key={`${tag}-${index + 1}`}>
                <TagChip tag={tag} tagDelete />
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
          minLength={1}
          maxLength={10}
          className="w-full flex-grow border-none p-1 focus:outline-none"
          placeholder={Array.isArray(tags) && tags.length === 0 ? "입력 후 Enter" : ""}
        />
      </div>
    </div>
  );
};

export default InputTag;
