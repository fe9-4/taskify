// useCard.tsx
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/dateFormat";
import { CardSchemaType, UpdateCardSchemaType } from "@/zodSchema/cardSchema";
import toastMessages from "@/lib/toastMessage";

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
    getNextPageParam: (lastPage) => lastPage.cursorId || null,
    initialPageParam: null,
    enabled: !!columnId,
  });

  // 카드 생성
  const createMutation = useMutation({
    mutationFn: async (data: CardSchemaType) => {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? formatDateTime(new Date(data.dueDate)) : null,
      };
      const response = await axios.post("/api/cards", formattedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(toastMessages.success.createCard);
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId, size] });
    },
    onError: () => {
      toast.error(toastMessages.error.createCard);
    },
  });

  // 카드 수정
  const updateMutation = useMutation({
    mutationFn: async (data: { cardId: number } & UpdateCardSchemaType) => {
      const { cardId, ...updateData } = data;
      const response = await axios.put(`/api/cards/${cardId}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(toastMessages.success.editCard);
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId] });
    },
    onError: (error) => {
      console.error("카드 수정 실패:", error);
      toast.error(toastMessages.error.editCard);
    },
  });

  // 카드 삭제
  const deleteMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const response = await axios.delete(`/api/cards/${cardId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success(toastMessages.success.deleteCard);
      queryClient.invalidateQueries({ queryKey: ["cardData"] });
    },
    onError: () => {
      toast.error(toastMessages.error.deleteCard);
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
      // 기존 카드 데이터 조회
      const cardResponse = await axios.get(`/api/cards/${cardId}`);
      const existingCard = cardResponse.data;

      // 기존 데이터를 유지하면서 columnId만 업데이트
      const updateData = {
        columnId: targetColumnId,
        assigneeUserId: existingCard.assignee.id,
        title: existingCard.title,
        description: existingCard.description,
        dueDate: existingCard.dueDate,
        tags: existingCard.tags,
        imageUrl: existingCard.imageUrl,
      };

      const response = await axios.put(`/api/cards/${cardId}`, updateData);
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
      toast.error(toastMessages.error.moveCard);
    },
    onSuccess: () => {
      toast.success(toastMessages.success.moveCard);
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
    updateCard: (data: { cardId: number } & UpdateCardSchemaType) => updateMutation.mutateAsync(data),
    deleteCard: deleteMutation.mutate,
    moveCard,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
