"use client";

import { useAtom } from "jotai";
import { UpdateCardAtom } from "@/store/modalAtom";
import ModalContainer from "@/components/modal/ModalContainer";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const UpdateCardForm = () => {
  const { cardId } = useParams();
  const [, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);

  useEffect(() => {
    setIsUpdateCardOpen(true);
  }, [setIsUpdateCardOpen]);

  const handleCardUpdated = () => {
    setIsUpdateCardOpen(false);
  };

  return (
    <div className="p-4">
      <ModalContainer onCardUpdated={handleCardUpdated} cardId={Number(cardId)} />
    </div>
  );
};

export default UpdateCardForm;
