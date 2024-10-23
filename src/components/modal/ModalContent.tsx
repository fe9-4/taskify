import { ReactNode } from "react";
import Modal from "react-modal";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalContent = ({ children, isOpen, onRequestClose }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center "
    >
      {children}
    </Modal>
  );
};

export default ModalContent;
