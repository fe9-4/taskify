import Image from "next/image";
import InviteItem from "@/app/mydashboard/components/InviteItem";
import { useEffect, useRef, useState } from "react";
import { cls } from "@/lib/utils";
import { useInvitation } from "@/hooks/useInvitation";

const InviteList = () => {
  const [size] = useState(10);
  const observeRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInvitation(size);

  const invitationList = data?.pages.flat() ?? [];

  useEffect(() => {
    if (!observeRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = observeRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return null;

  return (
    <div
      className={cls(
        "flex max-h-[770px] flex-col space-y-[105px] overflow-auto bg-white px-5 pb-20 pt-6 md:max-h-[592px] xl:max-h-[650px] xl:w-[1022px] [&::-webkit-scrollbar]:hidden",
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
        <InviteItem invitationList={invitationList} />
      )}
      {hasNextPage && <div ref={observeRef} className="h-4 w-full" />}
    </div>
  );
};

export default InviteList;
