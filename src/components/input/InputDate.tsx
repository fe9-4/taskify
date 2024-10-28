import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef, useRef, useState } from "react";
import { cls } from "@/lib/utils";
import { InputDateProps } from "@/types/formType";
import { MdOutlineCalendarToday as CalendarIcon } from "react-icons/md";

interface ExtendedInputDateProps extends InputDateProps {
  width?: string; // 새로운 prop 추가
}

const InputDate = forwardRef(
  ({ label, id, name, value, placeholder, onChange, width }: ExtendedInputDateProps, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const datePickerRef = useRef<DatePicker>(null);

    const handleImageClick = () => {
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    };

    const handleDatePickerOpen = () => {
      datePickerRef.current?.setOpen(true);
    };

    const DateValue = value instanceof Date ? value.toLocaleString() : value || placeholder;

    return (
      <div className="flex flex-col gap-2">
        {label && <label className="text-lg font-medium text-black03">{label}</label>}

        <div className="relative flex items-center">
          <CalendarIcon
            onClick={handleImageClick}
            className={cls("absolute left-4 size-[20px] cursor-pointer", value ? "text-black03" : "text-gray02")}
          />

          <DatePicker
            id={id}
            name={name}
            ref={datePickerRef}
            className={cls(
              "flex h-[50px] cursor-pointer items-center rounded-lg pl-11 text-base placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset md:text-lg",
              value ? "text-black03" : "text-gray02",
              width ? width : "w-[287px] md:w-[520px]" // width prop이 제공되면 사용, 아니면 기본값 사용
            )}
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              if (onChange) {
                onChange(date);
              }
            }}
            showTimeSelect
            dateFormat="yyyy. MM. dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={30}
            minDate={new Date()}
            customInput={<div onClick={handleDatePickerOpen}>{DateValue}</div>}
          />
        </div>
      </div>
    );
  }
);

InputDate.displayName = "InputDate";

export default InputDate;
