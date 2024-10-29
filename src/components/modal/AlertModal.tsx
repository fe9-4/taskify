import { AlertModalAtom } from "@/store/modalAtom";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { useAtom } from "jotai";

interface AlertModalProps {
  text: string;
  onConfirm: () => void;
}

const AlertModal = ({ text, onConfirm }: AlertModalProps) => {
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);

  const handleConfirm = () => {
    setIsAlertOpen(false);
    onConfirm();
  };

  return (
    <div className="flex h-[160px] w-[300px] flex-col items-center justify-center gap-8 rounded-2xl bg-white p-6 md:h-[174px] md:w-[500px]">
      <p className="text-lg font-medium md:text-2xl">{text}</p>
      <div className="flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setIsAlertOpen(false)}>취소</CancelBtn>
        <ConfirmBtn type="active" onClick={handleConfirm}>
          확인
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default AlertModal;
