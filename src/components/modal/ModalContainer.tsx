"use client";

import React from "react";
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
import CreateCard from "../cards/CreateCard";
import AlertModal from "./AlertModal";
import UpdateCard from "../cards/UpdateCard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
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
