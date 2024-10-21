// 문자열 자르기 함수
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// 숫자에 쉼표 추가하는 함수
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}
