"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "jotai";

export default function ClientLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // 특정 경로에서는 마진을 0으로 설정
  const marginClass = ["/login", "/signup", "/"].includes(pathname) ? "" : "xl:ml-[300px] md:ml-[160px] ml-[67px]";

  // Jotai Provider를 적용할 경로 목록
  const jotaiRoutes = ["/mypage", "/dashboard"];

  // 현재 경로가 jotaiRoutes에 포함되어 있는지 확인
  const shouldUseJotai = jotaiRoutes.some((route) => pathname.startsWith(route));

  const content = <div className={marginClass}>{children}</div>;

  // Jotai Provider를 적용할 경로인 경우에만 Provider로 감싸기
  return shouldUseJotai ? <Provider>{content}</Provider> : content;
}
