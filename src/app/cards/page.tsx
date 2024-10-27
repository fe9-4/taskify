"use client";

import { useAtom } from "jotai";
import { CreateCardAtom } from "@/store/modalAtom";
import ModalContainer from "@/components/modal/ModalContainer";

const CreateCardForm = () => {
  const [, setIsCreateCardOpen] = useAtom(CreateCardAtom);

  const openCreateCardModal = () => {
    setIsCreateCardOpen({ isOpen: true, columnId: null });
  };

  const handleCardCreated = (cardId: number) => {
    //console.log("Created card with ID:", cardId);
    setIsCreateCardOpen({ isOpen: false, columnId: null });
  };

  return (
    <div className="p-4">
      <button
        onClick={openCreateCardModal}
        className="rounded bg-violet01 px-4 py-2 font-bold text-gray05 hover:bg-purple01"
      >
        카드 생성
      </button>
      <ModalContainer onCardCreated={handleCardCreated} />
    </div>
  );
};

export default CreateCardForm;
