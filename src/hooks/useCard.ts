// useCard.tsx
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/dateFormat";
import { CardListResponseSchemaType, CreateCardFormSchemaType, UpdateCardFormSchemaType } from "@/zodSchema/cardSchema";
import { CardResponseSchemaType } from "@/zodSchema/commonSchema";

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
    mutationFn: async (data: CreateCardFormSchemaType) => {
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
    mutationFn: async ({ cardId, ...data }: { cardId: number } & UpdateCardFormSchemaType) => {
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

  // 카드 이동 (낙관적 업데이트 적용)
  const moveCardMutation = useMutation({
    mutationFn: async ({ cardId, targetColumnId }: { cardId: number; targetColumnId: number }) => {
      const response = await axios.put(`/api/cards/${cardId}`, { columnId: targetColumnId });
      return response.data;
    },
    onMutate: async ({ cardId, targetColumnId }) => {
      await queryClient.cancelQueries({ queryKey: ["cardData"] });

      const previousData = queryClient.getQueryData(["cardData"]);

      // 낙관적 업데이트
      queryClient.setQueryData(["cardData"], (oldData: any) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            const updatedCards = page.cards.filter((card: CardResponseSchemaType) => card.id !== cardId);
            return { ...page, cards: updatedCards };
          }),
        };

        // 이동한 카드 정보
        const movedCard = oldData.pages.flatMap((page: any) => page.cards).find((card: any) => card.id === cardId);

        if (movedCard) {
          movedCard.columnId = targetColumnId;

          // 대상 컬럼에 카드 추가
          const targetPageIndex = newData.pages.findIndex((page: any) => page.columnId === targetColumnId);
          if (targetPageIndex !== -1) {
            newData.pages[targetPageIndex].cards.push(movedCard);
          } else {
            // 대상 컬럼이 로드되지 않은 경우
            newData.pages.push({
              columnId: targetColumnId,
              cards: [movedCard],
            });
          }
        }

        return newData;
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 이전 데이터로 롤백
      queryClient.setQueryData(["cardData"], context?.previousData);
      toast.error("카드 이동에 실패했습니다");
    },
    onSettled: () => {
      // 데이터 재검증
      queryClient.invalidateQueries({ queryKey: ["cardData"] });
    },
  });

  const moveCard = (cardId: number, targetColumnId: number) => {
    moveCardMutation.mutate({ cardId, targetColumnId });
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
