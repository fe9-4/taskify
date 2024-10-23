"use client";

import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { CreateDashboardAtom } from "@/components/modal/modalAtom";
import CreateDashboard from "./CreateDashboard";

Modal.setAppElement("#modal-root");

const ModalContainer = () => {
  const [isCreateDashboardOpen, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);

  const closeModal1 = () => setisCreateDashboardOpen(false);

  return (
    <>
      <Modal
        isOpen={isCreateDashboardOpen}
        onRequestClose={closeModal1}
        className="flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center "
      >
        <CreateDashboard />
      </Modal>
    </>
  );
};

export default ModalContainer;
