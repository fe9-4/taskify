"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { cls } from "@/lib/utils";
const onClickCancel = () => {
  //
};
const InviteItem = ({ item }: { item: any }) => {
  const { id, invitee } = item;
  const { email } = invitee;
  return (
    <div className={cls("flex w-full justify-between border-b border-gray04 px-5 py-3 md:px-7 md:py-4")}>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="">{email}</div>
      </div>
      <DeleteCancelBtn onClick={onClickCancel}>취소</DeleteCancelBtn>
    </div>
  );
};

export default InviteItem;
