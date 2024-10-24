"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { CreateCardAtom, CreateDashboardAtom } from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";
import CreateCard from "../cards/CreateCard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [isCreateCard, setIsCreateCardOpen] = useAtom(CreateCardAtom);

  const closeCreateDashboard = () => setIsCreateDashboardOpen(false);
  const closeCreateCard = () => setIsCreateCardOpen(false);

  return (
    <>
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={closeCreateDashboard}>
        <CreateDashboard />
      </ModalContent>
      <ModalContent isOpen={isCreateCard} onRequestClose={closeCreateCard}>
        <CreateCard />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
