"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalTextAtom,
  CreateCardAtom,
  CreateColumnAtom,
  CreateDashboardAtom,
  InvitationDashboardAtom,
} from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import CreateCard from "../cards/CreateCard";
import AlertModal from "./AlertModal";
import CreateColumn from "./CreateColumn";
import InvitationDashboard from "./InvitationDashboard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useAtom(CreateColumnAtom);
  const [isInvitationDashboardOpen, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
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
      <ModalContent isOpen={isCreateColumnOpen} onRequestClose={() => setIsCreateColumnOpen(false)}>
        <CreateColumn />
      </ModalContent>
      <ModalContent isOpen={isInvitationDashboardOpen} onRequestClose={() => setIsInvitationDashboardOpen(false)}>
        <InvitationDashboard />
      </ModalContent>
      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        <AlertModal text={alertText} />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
