// 날짜 포맷팅 함수
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 문자열 자르기 함수
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

// 숫자에 쉼표 추가하는 함수
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

// 기타 유용한 유틸리티 함수들을 여기에 추가할 수 있습니다.
