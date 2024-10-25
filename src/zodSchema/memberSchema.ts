import { z } from "zod";
import { DateSchema } from "./commonSchema";

// 대시보드 멤버 요청 스키마
export const MemberFormSchema = z.object({
  dashboardId: z.number(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type MemberForm = z.infer<typeof MemberFormSchema>;

// 대시보드 멤버 응답 스키마
export const MemberSchema = z.object({
  id: z.number(),
  userId: z.number(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  isOwner: z.boolean(),
});

export type Member = z.infer<typeof MemberSchema>;

// 대시보드 멤버 목록 응답 스키마
export const MemberListSchema = z.object({
  members: z.array(MemberSchema),
  totalCount: z.number(),
});

export type MemberList = z.infer<typeof MemberListSchema>;
