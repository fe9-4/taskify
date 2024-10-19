"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { FaPlus as PlusImage } from "react-icons/fa6";
import { InputFileProps } from "@/types/formType";

const InputFile = ({ label, name, value, size }: InputFileProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setImagePreviewUrl(imageUrl);

    e.target.value = "";

    return () => {
      setImagePreviewUrl(value || "");
      URL.revokeObjectURL(imageUrl);
    };
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = "";
    setImagePreviewUrl("");
  };

  return (
    <div>
      {label && <label className="text-lg font-normal text-black03">{label}</label>}

      <div className={`relative flex ${inputFileSize.size[size]} cursor-pointer overflow-hidden rounded-md`}>
        <label
          htmlFor="image-upload"
          className="grid h-full w-full cursor-pointer place-items-center gap-[24px] bg-slate-200"
        >
          <PlusImage size="17px" color="#5534DA" />
        </label>

        <input
          id="image-upload"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
          ref={inputRef}
        />

        {imagePreviewUrl && (
          <Image src={imagePreviewUrl} fill alt="이미지 미리보기" className="object-cover" onClick={handleClearClick} />
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
