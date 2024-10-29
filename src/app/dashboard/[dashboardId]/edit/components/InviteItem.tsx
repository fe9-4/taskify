"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { cls } from "@/lib/utils";
const InviteItem = ({ item, onClick }: { item: any; onClick: (id: number) => void }) => {
  const onClickCancel = (id: number) => {
    onClick(id);
  };
  const { id, invitee } = item;
  const { email } = invitee;
  return (
    <div className="flex w-full justify-between border-b border-gray04 px-5 py-3 last:border-0 md:px-7 md:py-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div>{email}</div>
      </div>
      <DeleteCancelBtn onClick={() => onClickCancel(id)}>취소</DeleteCancelBtn>
    </div>
  );
};

export default InviteItem;
