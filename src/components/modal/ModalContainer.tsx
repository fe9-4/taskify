"use client";

import React from "react";
import Modal from "react-modal";
import { useAtomValue } from "jotai";
import { ModalStateAtom } from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/dashboard/CreateDashboard";
import ModalContent from "./ModalContent";
import DeleteModal from "./DeleteModal";
import CreateCard from "@/components/modal/cards/CreateCard";
import DetailCard from "@/components/modal/cards/DetailCard";
import UpdateCard from "@/components/modal/cards/UpdateCard";
import CreateColumn from "./columns/CreateColumn";
import InvitationDashboard from "./dashboard/InvitationDashboard";
import EditColumn from "./columns/EditColumn";
import { useToggleModal } from "@/hooks/useToggleModal";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const modalState = useAtomValue(ModalStateAtom);
  const toggleModal = useToggleModal();

  return (
    <>
      {/* 대시보드 생성 모달 */}
      <ModalContent isOpen={modalState.createDashboard} onRequestClose={() => toggleModal("createDashboard", false)}>
        <CreateDashboard />
      </ModalContent>

      {/* 할 일 카드 생성 모달 */}
      <ModalContent isOpen={modalState.createCard} onRequestClose={() => toggleModal("createCard", false)}>
        <CreateCard />
      </ModalContent>

      {/* 할 일 카드 상세 모달 */}
      <ModalContent isOpen={modalState.detailCard} onRequestClose={() => toggleModal("detailCard", false)}>
        <DetailCard />
      </ModalContent>

      {/* 할 일 수정 모달 */}
      <ModalContent isOpen={modalState.updateCard} onRequestClose={() => toggleModal("updateCard", false)}>
        <UpdateCard />
      </ModalContent>

      {/* 대시 보드 초대 모달 */}
      <ModalContent
        isOpen={modalState.invitationDashboard}
        onRequestClose={() => toggleModal("invitationDashboard", false)}
      >
        <InvitationDashboard />
      </ModalContent>

      {/* 컬럼 생성 모달 */}
      <ModalContent isOpen={modalState.createColumn} onRequestClose={() => toggleModal("createColumn", false)}>
        <CreateColumn />
      </ModalContent>

      {/* 컬럼 수정 모달 */}
      <ModalContent isOpen={modalState.editColumn} onRequestClose={() => toggleModal("editColumn", false)}>
        <EditColumn />
      </ModalContent>

      {/* 삭제 모달 */}
      <ModalContent isOpen={modalState.deleteModal} onRequestClose={() => toggleModal("deleteModal", false)}>
        <DeleteModal />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
