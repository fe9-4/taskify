import { z } from "zod";
import { UserSchema, EmailSchema, PasswordSchema } from "./commonSchema";

// request schema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type Login = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  password: PasswordSchema,
  newPassword: PasswordSchema,
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

// response schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});
