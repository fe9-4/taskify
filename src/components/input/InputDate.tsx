import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cls } from "@/lib/utils";
import { InputDateProps } from "@/types/formType";
import { formatDateTime } from "@/utils/dateFormat";
import { MdOutlineCalendarToday as CalendarIcon } from "react-icons/md";

const InputDate = forwardRef<HTMLDivElement, InputDateProps>(({ label, id, value, placeholder, onChange }, ref) => {
  const datePickerRef = useRef<DatePicker>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleImageClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleDatePickerOpen = () => {
    datePickerRef.current?.setOpen(true);
  };

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? formatDateTime(date) : "";
    onChange(formattedDate);
  };

  const displayValue = selectedDate ? formatDateTime(selectedDate) : placeholder;

  return (
    <div className="z-10 flex flex-col gap-2" ref={ref}>
      {label && <label className="text-lg font-medium text-black03 md:text-xl">{label}</label>}

      <div className="relative flex items-center">
        <CalendarIcon
          onClick={handleImageClick}
          className={cls("absolute left-4 cursor-pointer", selectedDate ? "text-black03" : "text-gray02")}
        />

        <DatePicker
          id={id}
          ref={datePickerRef}
          className={cls(
            "flex h-[50px] w-full cursor-pointer items-center rounded-lg pl-11 text-base placeholder-gray02 ring-1 ring-inset ring-gray03 transition-all focus-within:ring-violet01 focus:outline-none focus:ring-1 focus:ring-inset md:w-[520px] md:text-lg",
            selectedDate ? "text-black03" : "text-gray02"
          )}
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          dateFormat="yyyy. MM. dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={30}
          minDate={new Date()}
          customInput={<div onClick={handleDatePickerOpen}>{displayValue}</div>}
        />
      </div>
    </div>
  );
});

InputDate.displayName = "InputDate";

export default InputDate;
