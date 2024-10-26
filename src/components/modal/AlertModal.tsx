import { AlertModalAtom } from "@/store/modalAtom";
import { ConfirmBtn } from "../button/ButtonComponents";
import { useAtom } from "jotai";

const AlertModal = ({ text }: { text: string }) => {
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
  return (
    <div className="flex h-[164px] w-[272px] flex-col items-center justify-center gap-8 rounded-2xl bg-white md:h-[192px] md:w-[368px]">
      <p className="text-lg font-medium md:text-2xl">{text}</p>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[240px]">
        <ConfirmBtn type="active" onClick={() => setIsAlertOpen(false)}>
          확인
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default AlertModal;
