interface IProps {
  handleEdit: () => void;
  handleDelete: () => void;
}

const EditDeleteDropdown = ({ handleEdit, handleDelete }: IProps) => {
  return (
    <div className="flex h-[82px] w-[93px] flex-col items-center justify-center space-y-1 rounded-md border border-gray03 shadow-md">
      <button onClick={handleEdit} className="dropdown-custom-btn">수정하기</button>
      <button onClick={handleDelete} className="dropdown-custom-btn">삭제하기</button>
    </div>
  );
};

export default EditDeleteDropdown;
