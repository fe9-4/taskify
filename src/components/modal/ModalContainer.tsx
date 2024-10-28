"use client";

import React, { useEffect } from "react";
import Modal from "react-modal";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalTextAtom,
  CreateCardAtom,
  CreateDashboardAtom,
  UpdateCardAtom,
} from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import CreateCard from "@/components/cards/CreateCard";
import UpdateCard from "../cards/UpdateCard";
import AlertModal from "./AlertModal";

Modal.setAppElement("#modal-root");

interface ModalContainerProps {
  onCardCreated?: (cardId: number) => void;
  onCardUpdated?: () => void;
  cardId?: number;
}

const ModalContainer = ({ onCardCreated, onCardUpdated, cardId }: ModalContainerProps) => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [createCardAtom, setCreateCardAtom] = useAtom(CreateCardAtom);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);

  const alertText = useAtomValue(AlertModalTextAtom);

  return (
    <>
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={() => setIsCreateDashboardOpen(false)}>
        <CreateDashboard />
      </ModalContent>
      <ModalContent
        isOpen={createCardAtom.isOpen}
        onRequestClose={() => setCreateCardAtom({ isOpen: false, columnId: null })}
      >
        <CreateCard
          closePopup={() => setCreateCardAtom({ isOpen: false, columnId: null })}
          onCardCreated={(cardId) => {
            onCardCreated && onCardCreated(cardId);
            setCreateCardAtom({ isOpen: false, columnId: null });
          }}
        />
      </ModalContent>
      {cardId && (
        <ModalContent isOpen={isUpdateCardOpen} onRequestClose={() => setIsUpdateCardOpen(false)}>
          <UpdateCard
            cardId={cardId}
            closePopup={() => {
              setIsUpdateCardOpen(false);
              onCardUpdated && onCardUpdated();
            }}
          />
        </ModalContent>
      )}
      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        <AlertModal text={alertText} />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
