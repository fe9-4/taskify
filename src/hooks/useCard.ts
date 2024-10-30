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
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId, size] });
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
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId, size] });
    },
    onError: () => {
      toast.error("카드 삭제에 실패했습니다");
    },
  });

  // 카드 드래그 앤 드롭 처리
  const moveCard = async (cardId: number, targetColumnId: number) => {
    try {
      // 카드 목록이 로딩 중이거나 카드 데이터가 없는 경우 처리
      if (isLoading || !cardData?.pages?.length) {
        throw new Error("카드 데이터를 찾을 수 없습니다");
      }

      // 기존 카드 정보 가져오기
      const existingCard = cardData.pages
        .flatMap((page) => page.cards || [])
        .find((card: CardResponseSchemaType) => card.id === cardId);

      if (!existingCard) {
        throw new Error("카드를 찾을 수 없습니다");
      }

      // 필요한 필드를 추출하여 업데이트 데이터 생성
      const updatedCardData: UpdateCardFormSchemaType = {
        title: existingCard.title,
        description: existingCard.description,
        tags: existingCard.tags,
        dueDate: existingCard.dueDate,
        imageUrl: existingCard.imageUrl,
        columnId: targetColumnId,
        assigneeUserId: existingCard.assignee?.id || 0,
      };

      // API 호출
      await updateMutation.mutateAsync({
        cardId,
        ...updatedCardData,
      });

      // 성공 시 관련된 컬럼들의 카드 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["cardData", existingCard.columnId, size] });
      queryClient.invalidateQueries({ queryKey: ["cardData", targetColumnId, size] });

      toast.success("카드가 이동되었습니다");
    } catch (error) {
      toast.error("카드 이동에 실패했습니다");

      // 실패 시 전체 카드 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["cardData", columnId, size] });
    }
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
