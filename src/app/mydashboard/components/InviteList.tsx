import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import InviteItem from "@/app/mydashboard/components/InviteItem";
import { useCallback, useEffect, useRef, useState } from "react";
import { IInvitation } from "@/types/myDashboardType";
import { cls } from "@/lib/utils";

const InviteList = () => {
  const [invitationList, setInvitationList] = useState<IInvitation["invitations"]>([]);
  const [size, setSize] = useState(10);
  const [cursorId, setCursorId] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const getInvitationList = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/invitations?size=${size}&cursorId=${cursorId}`);

      if (response.status === 200) {
        setInvitationList((prev) => [...prev, ...response.data.inviteList]);
        setCursorId(response.data.cursorId);
      }

      if (response.data.inviteList.length === 0) {
        setHasMore(false);
      } else if (response.data.inviteList.length < size) {
        toast.success("더 가져올 초대목록이 없습니다.");
        setHasMore(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("내 대시보드 초대받은 목록 조회 실패", error);
        toast.error(error.response?.data);
      }
    }
  }, [hasMore, size, cursorId]);

  useEffect(() => {
    getInvitationList();

    observeRef.current = new IntersectionObserver((entries) => {
      const lastInviteItem = entries[0];

      if (lastInviteItem.isIntersecting && hasMore) {
        getInvitationList();
      }
    });

    if (loadingRef.current) {
      observeRef.current.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observeRef.current?.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, cursorId, size]);

  return (
    <div
      className={cls(
        "flex flex-col space-y-[105px] bg-white px-5 pb-20 pt-6 xl:w-[1022px]",
        invitationList.length > 0 ? "space-y-[10px] pb-6" : ""
      )}
    >
      <h2 className="font-bold md:text-3xl">초대받은 대시보드</h2>
      {invitationList.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg">
          <Image
            src="/images/myDashboard/invitation.svg"
            alt="초대"
            width={60}
            height={60}
            className="md:size-[100px]"
          />
          <span className="text-xs text-gray02 md:text-xl">아직 초대받은 대시보드가 없어요</span>
        </div>
      ) : (
        <>
          <InviteItem invitationList={invitationList} setInvitationList={setInvitationList} />
          <div ref={loadingRef} className="h-1" />
        </>
      )}
    </div>
  );
};

export default InviteList;
