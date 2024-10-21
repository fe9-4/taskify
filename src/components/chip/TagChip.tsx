import { cls } from "../../lib/utils";

// 입력한 태그명을 받아서 지정 색상을 적용해 return합니다.
const TagChip = ({ tag }: { tag: string }) => {
  const colorList = [
    { tag: "프로젝트", bg: "bg-[#F9EEE3]", text: "text-[#D58D49]" },
    { tag: "일반", bg: "bg-[#E7F7DB]", text: "text-[#86D549]" },
    { tag: ["프론트엔드", "백엔드"], bg: "bg-[#F7DBF0]", text: "text-[#D549B6]" },
    { tag: ["상", "중", "하"], bg: "bg-[#DBE6F7]", text: "text-[#4981D5]" },
  ];

  const anoterStringColor = { bg: "bg-violet02", text: "text-violet01" };

  const matchingColor = colorList.find((item) => Array.isArray(item.tag) ? item.tag.includes(tag) : item.tag === tag) || anoterStringColor;

  return (
    <span className={cls("w-fit rounded px-[6px] py-1 text-xs md:px-[6px] md:py-[2px] md:text-base", tag !== "" ? `${matchingColor.bg} ${matchingColor.text}` : "")}>
      {tag}
    </span>
  );
};

export default TagChip;
