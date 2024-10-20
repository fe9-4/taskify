import { z } from "zod";

// request schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: z.string().transform((date) => new Date(date).toLocaleDateString()),
  updatedAt: z.string().transform((date) => new Date(date).toLocaleDateString()),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().email("이메일 형식으로 작성해 주세요."),
  password: z.string().min(8, "8자 이상 입력해 주세요."),
});

export type Login = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  password: z.string().min(8, "8자 이상 입력해 주세요."),
  newPassword: z.string().min(8, "8자 이상 입력해 주세요."),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

// response schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
