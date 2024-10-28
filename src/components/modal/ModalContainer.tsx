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
  EditColumnAtom,
  InvitationDashboardAtom,
} from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import CreateCard from "../cards/CreateCard";
import AlertModal from "./AlertModal";
import CreateColumn from "./CreateColumn";
import InvitationDashboard from "./InvitationDashboard";
import EditColumn from "./EditColumn";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isInvitationDashboardOpen, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useAtom(CreateColumnAtom);
  const [isEditColumnOpen, setIsEditColumnOpen] = useAtom(EditColumnAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);

  const alertText = useAtomValue(AlertModalTextAtom);

  return (
    <>
      {/* 대시보드 생성 모달 */}
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={() => setIsCreateDashboardOpen(false)}>
        <CreateDashboard />
      </ModalContent>

      {/* 대시보드 초대 모달 */}
      <ModalContent isOpen={isInvitationDashboardOpen} onRequestClose={() => setIsInvitationDashboardOpen(false)}>
        <InvitationDashboard />
      </ModalContent>

      {/* 할일 카드 생성 모달 */}
      <ModalContent isOpen={isCreateCardOpen} onRequestClose={() => setIsCreateCardOpen(false)}>
        <CreateCard />
      </ModalContent>

      {/* 컬럼 생성 모달 */}
      <ModalContent isOpen={isCreateColumnOpen} onRequestClose={() => setIsCreateColumnOpen(false)}>
        <CreateColumn />
      </ModalContent>

      {/* 컬럼 수정 모달 */}
      <ModalContent isOpen={isEditColumnOpen} onRequestClose={() => setIsEditColumnOpen(false)}>
        <EditColumn />
      </ModalContent>

      {/* 알람 모달 */}
      <ModalContent isOpen={isAlertOpen} onRequestClose={() => setIsAlertOpen(false)}>
        <AlertModal text={alertText} />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
