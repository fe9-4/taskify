import { ReactNode, useEffect } from "react";
import Modal from "react-modal";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalContent = ({ children, isOpen, onRequestClose }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 비활성화
    } else {
      document.body.style.overflow = "unset"; // 스크롤 활성화
    }

    // 클린업 함수
    return () => {
      document.body.style.overflow = "unset"; // 컴포넌트 언마운트 시 스크롤 활성화
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-h-[95%] items-center justify-center overflow-scroll rounded-2xl [&::-webkit-scrollbar]:hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      {children}
    </Modal>
  );
};

export default ModalContent;
