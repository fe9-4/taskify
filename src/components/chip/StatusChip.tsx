// 등록할 컬럼 이름을 prop으로 받아 사용해주세요.
// title: "toDo", "progress", "done"
export const StatusTitleChip = ({ title }: { title: string }) => {
  return (
    <span className="statusChip-style">• {title}</span>
  )
}