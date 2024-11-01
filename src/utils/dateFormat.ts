// YYYY-MM-DD HH:MM 형식으로 날짜를 포맷팅하는 함수
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    throw new Error("유효한 Date 객체가 아닙니다.");
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
