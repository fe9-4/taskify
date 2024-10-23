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

// 비밀번호 regex
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// 이메일 스키마
export const EmailSchema = z.string().email("이메일 형식으로 작성해 주세요.");

// 비밀번호 스키마
export const PasswordSchema = z
  .string()
  .min(8, "8자 이상 입력해 주세요.")
  .max(100, "비밀번호는 최대 100자까지 가능합니다")
  .regex(passwordRegex, "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");

// 닉네임 스키마
export const NicknameSchema = z
  .string()
  .min(2, "2자 이상으로 작성해 주세요.")
  .max(10, "10자 이하로 작성해 주세요.")
  .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 사용 가능합니다.");
