import { z } from "zod";

export const AssigneeSchema = z.object({
  profileImageUrl: z.string().nullable(),
  nickname: z.string(),
  id: z.number(),
});

export type AssigneeSchemaType = z.infer<typeof AssigneeSchema>;

// 카드 생성 요청 스키마
export const CreateCardSchema = z.object({
  dashboardId: z.number(),
  columnId: z.number(),
  assigneeUserId: z.number().nullable(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
});

export type CreateCardSchemaType = z.infer<typeof CreateCardSchema>;

// 카드 수정 요청 스키마
export const UpdateCardSchema = z.object({
  columnId: z.number(),
  assigneeUserId: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
});

export type UpdateCardSchemaType = z.infer<typeof UpdateCardSchema>;

// 카드 응답 스키마
export const CardResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  dueDate: z.string(),
  assignee: AssigneeSchema.nullable(),
  imageUrl: z.string(),
  teamId: z.string(),
  columnId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CardResponseSchemaType = z.infer<typeof CardResponseSchema>;

// 카드 목록 응답 스키마
export const CardListResponseSchema = z.object({
  cursorId: z.number(),
  totalCount: z.number(),
  cards: z.array(CardResponseSchema),
});

export type CardListResponseSchemaType = z.infer<typeof CardListResponseSchema>;
