"use client";

import UpdateCard from "@/components/cards/UpdateCard";
import { useParams } from "next/navigation";

const UpdateCardForm = () => {
  const { cardId } = useParams();
  return <UpdateCard cardId={Number(cardId)} />;
};

export default UpdateCardForm;
