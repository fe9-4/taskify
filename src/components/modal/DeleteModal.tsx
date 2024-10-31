import { useToggleModal } from "@/hooks/useToggleModal";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { useAtomValue } from "jotai";
import { DeleteModalStateAtom } from "@/store/modalAtom";

const DeleteModal = () => {
  const toggleModal = useToggleModal();
  const deleteModalState = useAtomValue(DeleteModalStateAtom);

  const handleConfirm = () => {
    toggleModal("deleteModal", false);
    deleteModalState.confirm();
  };

  return (
    <div className="flex h-[160px] w-[300px] flex-col items-center justify-center gap-8 rounded-2xl bg-white p-6 md:h-[174px] md:w-[500px]">
      <p className="text-lg font-medium md:text-2xl">{deleteModalState.title}</p>
      <div className="flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => toggleModal("deleteModal", false)}>취소</CancelBtn>
        <ConfirmBtn type="active" onClick={handleConfirm}>
          확인
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default DeleteModal;
