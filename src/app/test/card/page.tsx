"use client";

import { useState } from "react";
import CreateCard from "@/components/cards/CreateCard";
import UpdateCard from "@/components/cards/UpdateCard";

export default function CardTest() {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const openCreatePopup = () => setIsCreatePopupOpen(true);
  const closeCreatePopup = () => setIsCreatePopupOpen(false);

  const openUpdatePopup = (cardId: number) => {
    console.log("card id: ", cardId);
    setSelectedCardId(cardId);
    setIsUpdatePopupOpen(true);
  };
  const closeUpdatePopup = () => {
    setSelectedCardId(null);
    setIsUpdatePopupOpen(false);
  };

  const handleCardCreated = (cardId: number) => {
    setSelectedCardId(cardId);
  };

  return (
    <div className="p-4">
      <button
        onClick={openCreatePopup}
        className="mr-4 rounded bg-violet01 px-4 py-2 font-bold text-gray05 hover:bg-purple01"
      >
        카드 생성
      </button>
      <button
        onClick={() => selectedCardId && openUpdatePopup(selectedCardId)}
        className="rounded bg-violet01 px-4 py-2 font-bold text-gray05 hover:bg-purple01"
        disabled={!selectedCardId}
      >
        카드 수정
      </button>

      {isCreatePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black02 bg-opacity-50">
          <div className="w-[327px] rounded-lg bg-gray05 p-6 md:w-[584px]">
            <CreateCard closePopup={closeCreatePopup} onCardCreated={handleCardCreated} />
          </div>
        </div>
      )}

      {isUpdatePopupOpen && selectedCardId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black02 bg-opacity-50">
          <div className="w-[327px] rounded-lg bg-gray05 p-6 md:w-[584px]">
            <UpdateCard closePopup={closeUpdatePopup} cardId={selectedCardId} />
          </div>
        </div>
      )}
    </div>
  );
}
