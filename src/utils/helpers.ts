import { format } from "date-fns";

// 날짜 시간 포맷팅 함수
export const CalendarFormatDate = (date: Date | null): string => {
  if (date) {
    return format(date, "yyyy. MM. dd HH:mm"); // 원하는 형식으로 포맷
  }
  return "";
};

// 날짜 포맷팅 함수
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 문자열 자르기 함수
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// 숫자에 쉼표 추가하는 함수
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}
