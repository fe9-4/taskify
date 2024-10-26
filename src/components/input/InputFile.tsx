"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cls } from "@/lib/utils";
import { FaPlus as PlusImage } from "react-icons/fa6";
import { InputFileProps } from "@/types/formType";

const InputFile = ({ label, size, id, name, value, onChange }: InputFileProps) => {
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
          onChange(file);
        }
      };
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
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

      <div
        className={`relative flex ${inputFileSize.size[size]} cursor-pointer overflow-hidden rounded-md`}
        onClick={handleClick} // 파일 입력 창 열기
      >
        {!preview && (
          <label className="grid size-full cursor-pointer place-items-center gap-[24px] bg-[#F5F5F5]">
            <PlusImage className="size-[17px] text-violet01" />
          </label>
        )}

        {/* 파일 입력 요소 */}
        <input
          id={id}
          type="file"
          name={name}
          onChange={handleFileChange} // 파일 선택 시 호출
          accept="image/*"
          ref={inputRef}
          className="hidden"
        />

        {/* 미리보기 이미지가 있을 때 */}
        {preview && (
          <>
            <Image src={preview} fill alt="이미지 미리보기" className="z-0 object-cover" />
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
              onClick={handleRemoveImage} // 미리보기 제거 클릭 시 호출
            >
              <Image src="/icons/image_edit.svg" alt="이미지 수정" width={30} height={30} className="cursor-pointer" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 이미지 입력 크기 설정
export const inputFileSize = {
  size: {
    todo: "size-[76px]",
    profile: "size-[100px] md:size-[182px]",
  },
};

export default InputFile;
