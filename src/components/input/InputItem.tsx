"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "@/types/formType";
import Image from "next/image";
import CloseEyes from "../../../public/icons/visibility_off.svg";
import OpenEyes from "../../../public/icons/visibility_on.svg";
import { cls } from "@/lib/utils";
import { InsertBtn } from "../button/ButtonComponents";

const InputItem = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, name, value, type, isTextArea, isButton, errors, size, ...props }, ref) => {
    const [inputType, setInputType] = useState(type);
    const [password, setPassword] = useState(false);

    const handleIconClick = () => {
      setInputType(password ? "password" : "text");
      setPassword((prev) => !prev);
    };

    return (
      <div className="relative flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-lg font-medium text-black03 md:text-xl">
            {label}
          </label>
        )}

        {isTextArea ? (
          <>
            <textarea
              className={cls(
                "relative w-full resize-none rounded-lg border border-solid border-gray03 p-4 text-xs text-black03 placeholder-gray02 focus:outline-none md:py-4 md:text-base",
                size === "description" ? "h-[126px]" : "h-[70px] md:h-[110px]"
              )}
              id={id}
              name={name}
              value={value}
              {...props}
            />
            {isButton && (
              <div className="absolute bottom-3 right-3">
                <InsertBtn onClick={() => ""}>입력</InsertBtn>
              </div>
            )}
          </>
        ) : (
          <>
            <input
              className={cls(
                "h-[50px] w-full rounded-lg px-4 text-lg text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset",
                errors ? "ring-red01 transition-all focus:ring-red01" : "focus:ring-violet01"
              )}
              id={id}
              name={name}
              value={value}
              type={inputType}
              ref={ref}
              {...props}
            />
            {type === "password" && (
              <span className="absolute right-3 top-[47px] cursor-pointer" onClick={handleIconClick}>
                {password ? (
                  <Image src={OpenEyes} width={24} height={24} alt="OpenEyes" />
                ) : (
                  <Image src={CloseEyes} width={24} height={24} alt="CloseEyes" />
                )}
              </span>
            )}
          </>
        )}

        {errors && <span className="pl-1 text-base font-normal text-red01">{errors}</span>}
      </div>
    );
  }
);

export default InputItem;
