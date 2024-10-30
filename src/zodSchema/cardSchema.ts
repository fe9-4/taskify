import { z } from "zod";
import { CardFormSchema, CardResponseSchema } from "./commonSchema";

// 카드 생성 요청 스키마
export const CreateCardFormSchema = z.object(CardFormSchema.shape);

export type CreateCardFormSchemaType = z.infer<typeof CreateCardFormSchema>;

// 카드 수정 요청 스키마
export const UpdateCardFormSchema = z.object(CardFormSchema.shape);

export type UpdateCardFormSchemaType = z.infer<typeof UpdateCardFormSchema>;

// 카드 수정 응답 스키마
export const UpdateCardResponseSchema = z.object(CardResponseSchema.shape);

export type UpdateCardResponseSchemaType = z.infer<typeof UpdateCardResponseSchema>;

// 카드 상세 응답 스키마
export const CardDetailResponseSchema = z.object(CardResponseSchema.shape);

export type CardDetailResponseSchemaType = z.infer<typeof CardDetailResponseSchema>;

// 카드 목록 응답 스키마
export const CardListResponseSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  cards: z.array(CardResponseSchema),
});

export type CardListResponseSchemaType = z.infer<typeof CardListResponseSchema>;
