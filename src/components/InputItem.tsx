"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "@/types/formType";
import Image from "next/image";
import CloseEyes from "../../public/icons/visibility_off.svg";
import OpenEyes from "../../public/icons/visibility_on.svg";

const InputItem = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, name, value, type, isTextArea, inputButton, errors, ...props }, ref) => {
    const [inputType, setInputType] = useState(type);
    const [password, setPassword] = useState(false);

    const handleIconClick = () => {
      setInputType(password ? "password" : "text");
      setPassword((prev) => !prev);
    };

    return (
      <div className="relative flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-lg font-normal text-black03">
            {label}
          </label>
        )}

        {isTextArea ? (
          <>
            <textarea
              className="relative h-[70px] w-full rounded-lg border border-solid border-gray03 px-3 py-4 text-xs text-black03 placeholder-gray02 focus:outline-none md:h-[110px] md:text-base"
              id={id}
              value={value}
              {...props}
            />
            {inputButton && (
              <button className="absolute bottom-3 right-3 h-[28px] rounded border border-solid border-gray03 px-[31px] text-xs font-medium text-violet01 md:h-[32px]">
                입력
              </button>
            )}
          </>
        ) : (
          <>
            <input
              className={`h-[50px] w-full rounded-lg px-3 text-lg text-black03 placeholder-gray02 ring-1 ring-inset ring-gray03 focus:outline-none focus:ring-1 focus:ring-inset ${errors ? "ring-red01 focus:ring-red01" : "focus:ring-violet01"}`}
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
