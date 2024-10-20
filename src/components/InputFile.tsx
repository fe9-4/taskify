"use client";

import Image from "next/image";
import { FaPlus as PlusImage } from "react-icons/fa6";
import { InputFileProps } from "@/types/formType";
import { useInputFile } from "@/hooks/useInputFile";

const InputFile = ({ label, size }: InputFileProps) => {
  const { imageRef, preview, handleFileChange } = useInputFile();

  return (
    <div>
      {label && <p className="text-lg font-normal text-black03">{label}</p>}

      <div className={`relative flex ${inputFileSize.size[size]} cursor-pointer overflow-hidden rounded-md`}>
        <label htmlFor="file" className="grid h-full w-full cursor-pointer place-items-center gap-[24px] bg-slate-200">
          <PlusImage size="17px" color="#5534DA" />
        </label>

        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        {preview && (
          <>
            <Image ref={imageRef} src={preview} fill alt="이미지 미리보기" className="z-0 object-cover" />
          </>
        )}
      </div>
    </div>
  );
};

export const inputFileSize = {
  size: {
    todo: "w-[76px] h-[76px]",
    profile: "w-[100px] h-[100px] md:w-[182px] md:h-[182px]",
  },
};

export default InputFile;
