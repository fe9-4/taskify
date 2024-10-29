"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalTextAtom,
  CreateCardAtom,
  CreateDashboardAtom,
  EditColumnAtom,
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
import EditColumn from "./EditColumn";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isInvitationDashboardOpen, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);
  const [isCreateCardOpen, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const [isDetailCardOpen, setIsDetailCardOpen] = useAtom(DetailCardAtom);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useAtom(CreateColumnAtom);
  const [isEditColumnOpen, setIsEditColumnOpen] = useAtom(EditColumnAtom);
  const [isAlertOpen, setIsAlertOpen] = useAtom(AlertModalAtom);

  const alertText = useAtomValue(AlertModalTextAtom);
  const [onConfirm] = useAtom(AlertModalConfirmAtom);

  return (
    <>
      {/* 대시보드 생성 모달 */}
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={() => setIsCreateDashboardOpen(false)}>
        <CreateDashboard />
      </ModalContent>

      {/* 할 일 카드 생성 모달 */}
      <ModalContent isOpen={isCreateCardOpen} onRequestClose={() => setIsCreateCardOpen(false)}>
        <CreateCard />
      </ModalContent>

      {/* 할 일 카드 상세 모달 */}
      <ModalContent isOpen={isDetailCardOpen} onRequestClose={() => setIsDetailCardOpen(false)}>
        <DetailCard />
      </ModalContent>

      {/* 할 일 수정 모달 */}
      <ModalContent isOpen={isUpdateCardOpen} onRequestClose={() => setIsUpdateCardOpen(false)}>
        <UpdateCard />
      </ModalContent>

      {/* 대시 보드 초대 모달 */}
      <ModalContent isOpen={isInvitationDashboardOpen} onRequestClose={() => setIsInvitationDashboardOpen(false)}>
        <InvitationDashboard />
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
        {onConfirm && <AlertModal text={alertText} onConfirm={onConfirm} />}
      </ModalContent>
    </>
  );
};

export default ModalContainer;
