"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const router = useRouter();
  const marginClass = ["/login", "/signup", "/"].includes(pathname) ? "" : "xl:ml-[300px] md:ml-[160px] ml-[67px]";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const handleSyntaxError = (event: ErrorEvent) => {
      if (event.error instanceof SyntaxError || event.message.includes("SyntaxError")) {
        console.error("SyntaxError detected, refreshing...");
        router.refresh();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("error", handleSyntaxError);
      window.onerror = (message, source, lineno, colno, error) => {
        if (error instanceof SyntaxError || message.toString().includes("SyntaxError")) {
          console.error("Global SyntaxError detected, refreshing...");
          router.refresh();
          return true;
        }
        return false;
      };
    }

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/checkCookie");
        const data = await response.json();
        setIsAuthenticated(data.success);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("error", handleSyntaxError);
        window.onerror = null;
      }
    };
  }, [router]);

  useEffect(() => {
    if (isAuthenticated === false) {
      if (pathname !== "/") {
        router.push("/login");
      } else {
        router.refresh();
      }
    }
  }, [isAuthenticated, pathname, router]);

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
