"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { AlertModalAtom, AlertModalTextAtom, CreateCardAtom, CreateDashboardAtom } from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import CreateCard from "../cards/CreateCard";
import AlertModal from "./AlertModal";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);

  const [AlertText] = useAtom(AlertModalTextAtom);

  return (
    <>
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={() => setIsCreateDashboardOpen(false)}>
        <CreateDashboard />
      </ModalContent>
      <ModalContent isOpen={isCreateCardOpen} onRequestClose={() => setIsCreateCardOpen(false)}>
        <CreateCard />
      </ModalContent>
      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        <AlertModal text={AlertText} />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
