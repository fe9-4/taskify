import { format } from "date-fns";

// 날짜 시간 포맷팅 함수
export const CalendarFormatDate = (date: Date | null): string => {
  if (date) {
    return format(date, "yyyy. MM. dd HH:mm");
  }
  return "";
};
