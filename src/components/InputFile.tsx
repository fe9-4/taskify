"use client";

import Image from "next/image";
import { FaPlus as PlusImage } from "react-icons/fa6";
import { InputFileProps } from "@/types/formType";
import { useInputFile } from "@/hooks/useInputFile";
import ImageEdit from "../../public/icons/image_edit.svg";

const InputFile = ({ label, size }: InputFileProps) => {
  const { imageRef, preview, handleFileChange } = useInputFile();

  return (
    <div>
      {label && <p className="text-lg font-normal text-black03">{label}</p>}

      <div className={`relative flex ${inputFileSize.size[size]} cursor-pointer overflow-hidden rounded-md`}>
        <label htmlFor="file" className="bg-#F5F5F5 grid size-full cursor-pointer place-items-center gap-[24px]">
          <PlusImage className="size-[17px] text-violet01" />
        </label>

        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="absolute left-0 top-0 z-[1] size-full cursor-pointer opacity-0"
        />

        {preview && (
          <>
            <span className="absolute left-0 top-0 z-[2] flex size-full items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <Image src={ImageEdit} alt="이미지 수정" className="size-[30px]" />
            </span>
            <Image ref={imageRef} src={preview} fill alt="이미지 미리보기" className="z-0 object-cover" />
          </>
        )}
      </div>
    </div>
  );
};

export const inputFileSize = {
  size: {
    todo: "size-[76px]",
    profile: "size-[100px] md:size-[182px]",
  },
};

export default InputFile;
