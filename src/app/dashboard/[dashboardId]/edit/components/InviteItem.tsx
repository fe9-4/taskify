"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { Invitation } from "@/zodSchema/invitationSchema";

interface InviteItemProps {
  item: Invitation;
  onClick: (id: number) => void;
  disabled?: boolean;
}

const InviteItem = ({ item, onClick }: InviteItemProps) => {
  const onClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(item.id);
  };

  return (
    <div className="flex w-full justify-between border-b border-gray04 px-5 py-3 last:border-0 md:px-7 md:py-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div>{item.invitee.email}</div>
      </div>
      <DeleteCancelBtn onClick={onClickCancel}>취소</DeleteCancelBtn>
    </div>
  );
};

export default InviteItem;
