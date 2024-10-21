import DatePicker from "react-datepicker";
import { useRef } from "react";
import { cls } from "@/lib/utils";
import { InputDateProps } from "@/types/formType";
import { MdOutlineCalendarToday as CalendarIcon } from "react-icons/md";

const InputDate = ({ label, value, placeholder, onChange }: InputDateProps) => {
  const datePickerRef = useRef<DatePicker>(null);

  const handleImageClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleDatePickerOpen = () => {
    datePickerRef.current?.setOpen(true);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-lg font-medium text-black03">{label}</label>}

      <div className="relative flex items-center">
        <CalendarIcon
          onClick={handleImageClick}
          className={cls("absolute left-4 size-[20px] cursor-pointer", value ? "text-black03" : "text-gray02")}
        />

        <DatePicker
          ref={datePickerRef}
          className={cls(
            "flex h-[50px] w-[287px] cursor-pointer items-center rounded-lg border border-solid border-gray03 pl-11 text-base placeholder-gray02 transition-all md:w-[520px] md:text-lg",
            value ? "text-black03" : "text-gray02"
          )}
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date)}
          showTimeSelect // 시간 선택 기능 활성화
          dateFormat="yyyy. MM. dd HH:mm" // 날짜 형식 및 시간 형식 설정
          timeFormat="HH:mm" // 시간 형식 (24시간 형식)
          timeIntervals={30} // 30분 단위로 시간 선택
          minDate={new Date()} // 현재 날짜 이전은 선택 불가
          customInput={<div onClick={handleDatePickerOpen}>{value ? value : placeholder}</div>}
        />
      </div>
    </div>
  );
};

export default InputDate;
