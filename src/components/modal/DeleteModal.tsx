import { useToggleModal } from "@/hooks/useToggleModal";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { useAtom } from "jotai";

interface DeleteModalProps {
  text: string;
  onConfirm: () => void;
}

const DeleteModal = ({ text, onConfirm }: DeleteModalProps) => {
  const toggleModal = useToggleModal();

  const handleConfirm = () => {
    toggleModal("deleteModal", false);
    onConfirm();
  };

  return (
    <div className="flex h-[160px] w-[300px] flex-col items-center justify-center gap-8 rounded-2xl bg-white p-6 md:h-[174px] md:w-[500px]">
      <p className="text-lg font-medium md:text-2xl">{text}</p>
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
