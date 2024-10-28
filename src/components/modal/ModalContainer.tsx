"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalTextAtom,
  CreateCardAtom,
  CreateDashboardAtom,
  DetailCardAtom,
  UpdateCardAtom,
} from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import AlertModal from "./AlertModal";
import CreateCard from "@/components/modal/cards/CreateCard";
import DetailCard from "@/components/modal/cards/DetailCard";
import UpdateCard from "@/components/modal/cards/UpdateCard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isDetailCardOpen, setIsDetailCardOpen] = useAtom(DetailCardAtom);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);

  const alertText = useAtomValue(AlertModalTextAtom);

  return (
    <>
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={() => setIsCreateDashboardOpen(false)}>
        <CreateDashboard />
      </ModalContent>

      <ModalContent isOpen={isCreateCardOpen} onRequestClose={() => setIsCreateCardOpen(false)}>
        <CreateCard />
      </ModalContent>

      <ModalContent isOpen={isDetailCardOpen} onRequestClose={() => setIsDetailCardOpen(false)}>
        <DetailCard />
      </ModalContent>

      <ModalContent isOpen={isUpdateCardOpen} onRequestClose={() => setIsUpdateCardOpen(false)}>
        <UpdateCard />
      </ModalContent>

      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        <AlertModal text={alertText} />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
