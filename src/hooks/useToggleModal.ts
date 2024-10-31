import { initiModalState, ModalStateAtom } from "@/store/modalAtom";
import { useSetAtom } from "jotai";

// 모달 상태를 토글하는 함수
export const useToggleModal = () => {
  const setModalState = useSetAtom(ModalStateAtom);

  return (modalName: keyof typeof initiModalState, isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, [modalName]: isOpen }));
  };
};
