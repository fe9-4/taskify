"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cls } from "@/lib/utils";
import { FaPlus as PlusImage } from "react-icons/fa6";
import { InputFileProps } from "@/types/formType";
import ImageEdit from "../../../public/icons/image_edit.svg";

const InputFile = ({ label, size, id, name, value, onChange }: InputFileProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value && typeof value === "string") {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setPreview(reader.result); 
          onChange(reader.result);
        }
      };
    }

    e.currentTarget.value = "";
  };
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      {label && (
        <p
          className={cls(
            "text-lg text-black03",
            size === "profile" ? "mb-8 text-xl font-bold md:mb-5 md:text-3xl" : "font-medium"
          )}
        >
          {label}
        </p>
      )}

      <div className={`relative flex ${inputFileSize.size[size]} cursor-pointer overflow-hidden rounded-md`}>
        <label htmlFor={id} className="grid size-full cursor-pointer place-items-center gap-[24px] bg-[#F5F5F5]">
          <PlusImage className="size-[17px] text-violet01" />
        </label>

        <input
          id={id}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          ref={inputRef}
          className="absolute left-0 top-0 z-[2] size-full cursor-pointer opacity-0"
        />

        {preview && (
          <>
            <span
              className="absolute left-0 top-0 z-[3] flex size-full items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 hover:opacity-100"
              onClick={handleClick}
            >
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
