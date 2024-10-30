import { z } from "zod";

// 이메일 스키마
export const EmailSchema = z.string().email("이메일 형식으로 작성해 주세요.");

// 비밀번호 regex
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
  id: z.number(),
  email: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type UserSchemaType = z.infer<typeof UserSchema>;

// CardForm 관련 스키마
export const CardFormSchema = z.object({
  columnId: z.number(),
  assigneeUserId: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
});

export type CardFormSchemaType = z.infer<typeof CardFormSchema>;

export const AssigneeSchema = z.object({
  profileImageUrl: z.string().nullable(),
  nickname: z.string(),
  id: z.number(),
});

export type AssigneeSchemaType = z.infer<typeof AssigneeSchema>;

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
