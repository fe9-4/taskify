import { z } from "zod";

export const CardFormSchema = z.object({
  assigneeUserId: z.number(),
  dashboardId: z.number(),
  columnId: z.number(),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string().nullable(),
});

export type CardForm = z.infer<typeof CardFormSchema>;

export const CardResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  dueDate: z.string(),
  assignee: z.object({
    profileImageUrl: z.string().nullable(),
    nickname: z.string(),
    id: z.number(),
  }),
  imageUrl: z.string(),
  teamId: z.string(),
  columnId: z.number(),
  dashboardId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CardResponse = z.infer<typeof CardResponseSchema>;
