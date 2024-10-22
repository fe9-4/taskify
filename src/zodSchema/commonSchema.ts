import { z } from "zod";

// 에러 응답 스키마
export const ErrorResponseSchema = z.object({
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Date 관련 스키마
export const DateSchema = z.string().transform((date) => new Date(date).toLocaleDateString());

export type Date = z.infer<typeof DateSchema>;

// User 관련 스키마
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type User = z.infer<typeof UserSchema>;
