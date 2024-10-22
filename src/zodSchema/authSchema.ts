import { z } from "zod";
import { UserSchema } from "./commonSchema";

// request schema
export const LoginSchema = z.object({
  email: z
    .string()
    .email("이메일 형식으로 작성해 주세요.")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "8자 이상 입력해 주세요.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
    ),
});

export type Login = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "8자 이상 입력해 주세요.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
    ),
  newPassword: z
    .string()
    .min(8, "8자 이상 입력해 주세요.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
    ),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

// response schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
