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
  CreateColumnAtom,
  InvitationDashboardAtom,
  AlertModalConfirmAtom,
} from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import AlertModal from "./AlertModal";
import CreateCard from "@/components/modal/cards/CreateCard";
import DetailCard from "@/components/modal/cards/DetailCard";
import UpdateCard from "@/components/modal/cards/UpdateCard";
import CreateColumn from "./CreateColumn";
import InvitationDashboard from "./InvitationDashboard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isDetailCardOpen, setIsDetailCardOpen] = useAtom(DetailCardAtom);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useAtom(CreateColumnAtom);
  const [isInvitationDashboardOpen, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);
  const alertText = useAtomValue(AlertModalTextAtom);
  const [onConfirm] = useAtom(AlertModalConfirmAtom);

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

      <ModalContent isOpen={isCreateColumnOpen} onRequestClose={() => setIsCreateColumnOpen(false)}>
        <CreateColumn />
      </ModalContent>

      <ModalContent isOpen={isInvitationDashboardOpen} onRequestClose={() => setIsInvitationDashboardOpen(false)}>
        <InvitationDashboard />
      </ModalContent>

      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        {onConfirm && <AlertModal text={alertText} onConfirm={onConfirm} />}
      </ModalContent>
    </>
  );
};

export default ModalContainer;
