// tailwind 동적 스타일을 위한 함수
export const cls = (...cls: string[]) => {
  return cls.join(" ");
};

// 랜덤 색상을 추출할 수 있는 함수
interface IColorList {
  bg: string;
  text?: string;
}

export const randomColor = (colorList: IColorList[]) => {
  const random = Math.floor(Math.random() * colorList.length);
  return colorList[random];
};