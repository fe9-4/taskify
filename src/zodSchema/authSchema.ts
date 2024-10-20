import { z } from "zod";

// request schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: z.date().transform((date) => date.toLocaleDateString()),
  updatedAt: z.date().transform((date) => date.toLocaleDateString()),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type Login = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

// response schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
