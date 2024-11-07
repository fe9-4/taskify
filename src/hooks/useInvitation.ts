import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { IInvitation } from "@/types/myDashboardType";

export const useInvitation = (size: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["invitations"],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(`/api/invitations?size=${size}${pageParam ? `&cursorId=${pageParam}` : ""}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < size) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    initialPageParam: null,
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};
