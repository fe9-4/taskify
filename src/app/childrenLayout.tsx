"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const marginClass = ["/login", "/signup", "/"].includes(pathname) ? "" : "xl:ml-[300px] md:ml-[160px] ml-[67px]";

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrationBoundary>
          <div className={marginClass}>{children}</div>
          <Toaster />
        </HydrationBoundary>
      </Provider>
    </QueryClientProvider>
  );
}
