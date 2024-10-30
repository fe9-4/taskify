interface IProps {
  handleEdit: () => void;
  handleDelete: () => void;
}

const buttonBaseClasses =
  "block w-full px-4 py-1 text-center text-base font-medium text-black03 hover:rounded-md hover:bg-violet-100 hover:text-violet01";

const EditDeleteDropdown = ({ handleEdit, handleDelete }: IProps) => {
  return (
    <div className="absolute right-6 top-7 w-[100px] rounded-md bg-white p-2 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset md:right-10 md:top-8">
      <button className={buttonBaseClasses} onClick={handleEdit}>
        수정하기
      </button>
      <button className={buttonBaseClasses} onClick={handleDelete}>
        삭제하기
      </button>
    </div>
  );
};

export default EditDeleteDropdown;
