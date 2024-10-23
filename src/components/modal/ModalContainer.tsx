"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { CreateDashboardAtom } from "@/store/modalAtom";
import CreateDashboard from "@/components/modal/CreateDashboard";
import ModalContent from "./ModalContent";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);

  const closeModal1 = () => setisCreateDashboardOpen(false);

  return (
    <>
      <ModalContent isOpen={isCreateDashboardOpen} onRequestClose={closeModal1}>
        <CreateDashboard />
      </ModalContent>
    </>
  );
};

export default ModalContainer;
