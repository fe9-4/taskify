// useCard.tsx
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/dateFormat";
import {
  CardListResponseSchemaType,
  CreateCardSchemaType,
  UpdateCardSchemaType,
  CardResponseSchemaType,
} from "@/zodSchema/cardSchema";

export const useCard = (columnId?: number, size: number = 10) => {
  const queryClient = useQueryClient();

  // 카드 목록 조회
  const {
    data: cardData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...queryRest
  } = useInfiniteQuery({
    queryKey: ["cardData", columnId, size],
    queryFn: async ({ pageParam = null }) => {
      const cursorId = pageParam ? `&cursorId=${pageParam}` : "";
      const response = await axios.get(`/api/cards?columnId=${columnId}&size=${size}${cursorId}`);
      return response.data;
    },
    getNextPageParam: (lastPage: CardListResponseSchemaType) => lastPage.cursorId || null,
    initialPageParam: null,
    enabled: !!columnId,
  });

  // 카드 생성
  const createMutation = useMutation({
    mutationFn: async (data: CreateCardSchemaType) => {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? formatDateTime(new Date(data.dueDate)) : null,
      };
      const response = await axios.post("/api/cards", formattedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("카드가 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId, size] });
    },
    onError: () => {
      toast.error("카드 생성에 실패했습니다");
    },
  });

  // 카드 수정
  const updateMutation = useMutation({
    mutationFn: async ({ cardId, ...data }: { cardId: number } & UpdateCardSchemaType) => {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? formatDateTime(new Date(data.dueDate)) : null,
      };
      const response = await axios.put(`/api/cards/${cardId}`, formattedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardData"] });
    },
    onError: () => {
      toast.error("카드 수정에 실패했습니다");
    },
  });

  // 카드 삭제
  const deleteMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const response = await axios.delete(`/api/cards/${cardId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("카드가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["cardData"] });
    },
    onError: () => {
      toast.error("카드 삭제에 실패했습니다");
    },
  });

  // 카드 이동
  const moveCardMutation = useMutation({
    mutationFn: async ({
      cardId,
      targetColumnId,
      newIndex,
    }: {
      cardId: number;
      targetColumnId: number;
      newIndex: number;
    }) => {
      const response = await axios.put(`/api/cards/${cardId}`, { columnId: targetColumnId, newIndex });
      return response.data;
    },
    onMutate: async ({ cardId, targetColumnId }) => {
      await queryClient.cancelQueries({ queryKey: ["cardData"] });
      const previousData = queryClient.getQueryData(["cardData"]);
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["cardData"], context.previousData);
      }
      toast.error("카드 이동에 실패했습니다");
    },
    onSuccess: () => {
      toast.success("카드가 이동되었습니다");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cardData"] });
    },
  });

  const moveCard = async (cardId: number, targetColumnId: number, newIndex: number) => {
    return await moveCardMutation.mutateAsync({ cardId, targetColumnId, newIndex });
  };

  return {
    cards: cardData?.pages?.flatMap((page) => page.cards) || [],
    totalCount: cardData?.pages[0]?.totalCount || 0,
    cursorId: cardData?.pages[cardData.pages.length - 1]?.cursorId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...queryRest,
    createCard: createMutation.mutate,
    updateCard: updateMutation.mutate,
    deleteCard: deleteMutation.mutate,
    moveCard,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
