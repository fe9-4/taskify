"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "@/types/formType";
import Image from "next/image";
import CloseEyes from "../../../public/icons/visibility_off.svg";
import OpenEyes from "../../../public/icons/visibility_on.svg";
import { cls } from "@/lib/utils";

const InputItem = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, name, value, type, isTextArea, isButton, errors, readOnly = false, size, ...props }, ref) => {
    const [inputType, setInputType] = useState(type);
    const [password, setPassword] = useState(false);

    const handleIconClick = () => {
      setInputType(password ? "password" : "text");
      setPassword((prev) => !prev);
    };

    return (
      <div className="relative flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="flex gap-1 text-lg font-medium text-black03 md:text-xl">
            {label}
          </label>
        )}

        {isTextArea ? (
          <textarea
            className={cls(
              "relative w-full resize-none rounded-lg p-4 text-base text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-inset md:py-4 md:text-lg [&::-webkit-scrollbar]:hidden",
              size === "description" ? "h-[126px]" : "h-[70px] md:h-[110px]",
              errors ? "ring-red01 transition-all focus-within:ring-red01" : "focus-within:ring-violet01"
            )}
            id={id}
            name={name}
            defaultValue={value}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            readOnly={readOnly}
            {...props}
          />
        ) : (
          <div className="relative">
            <input
              className={cls(
                "h-[50px] w-full rounded-lg px-4 text-base text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset md:text-lg",
                errors ? "ring-red01 transition-all focus-within:ring-red01" : "focus-within:ring-violet01",
                readOnly ? "bg-gray03" : "",
                type === "password" ? "pr-10" : ""
              )}
              id={id}
              name={name}
              value={value}
              type={inputType}
              ref={ref}
              readOnly={readOnly}
              {...props}
            />
            {type === "password" && !readOnly && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={handleIconClick}>
                {password ? (
                  <Image src={OpenEyes} width={24} height={24} alt="OpenEyes" />
                ) : (
                  <Image src={CloseEyes} width={24} height={24} alt="CloseEyes" />
                )}
              </span>
            )}
          </div>
        )}

        {errors && <span className="pl-1 text-sm font-normal text-red01 md:text-base">{errors}</span>}
      </div>
    );
  }
);

InputItem.displayName = "InputItem";

export default InputItem;
