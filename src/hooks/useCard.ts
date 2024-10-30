import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/dateFormat";
import { CardSchemaType, UpdateCardSchemaType } from "@/zodSchema/cardSchema";

export const useCard = (columnId?: number, size: number = 10) => {
  const queryClient = useQueryClient();

  // 카드 목록 조회
  const { data: cards, ...queryRest } = useQuery({
    queryKey: ["cards", columnId, size],
    queryFn: async () => {
      const response = await axios.get(`/api/cards?columnId=${columnId}&size=${size}`);
      return response.data;
    },
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
      toast.success("카드가 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
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
      queryClient.invalidateQueries({ queryKey: ["cards"] });
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
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: () => {
      toast.error("카드 삭제에 실패했습니다");
    },
  });

  // 카드 드래그 앤 드롭 처리
  const moveCard = async (cardId: number, targetColumnId: number) => {
    try {
      await updateMutation.mutateAsync({
        cardId,
        columnId: targetColumnId,
      } as { cardId: number } & UpdateCardSchemaType);
    } catch (error) {
      console.error("카드 이동 실패:", error);
    }
  };

  return {
    cards,
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
