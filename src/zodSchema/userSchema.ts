import { z } from "zod";
import { UserSchema, EmailSchema, PasswordSchema, NicknameSchema } from "./commonSchema";

// request schema
export const SignupSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    nickname: NicknameSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type Signup = z.infer<typeof SignupSchema>;

export const UpdateUserProfileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2글자 이상이어야 합니다.").max(10, "닉네임은 10글자 이하여야 합니다."),
  profileImageUrl: z.string().url().nullable().optional(),
});

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

// response schema
export const SignupResponseSchema = z.object({
  user: UserSchema,
});

export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const UserProfileResponseSchema = z.object({
  user: UserSchema,
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

export const UpdateUserProfileResponseSchema = z.object({
  user: UserSchema,
});

export type UpdateUserProfileResponse = z.infer<typeof UpdateUserProfileResponseSchema>;

export const UploadUserProfileImageResponseSchema = z.object({
  profileImageUrl: z.string(),
});

export type UploadUserProfileImageResponse = z.infer<typeof UploadUserProfileImageResponseSchema>;

export const UpdateUserPasswordSchema = z
  .object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type UpdateUserPassword = z.infer<typeof UpdateUserPasswordSchema>;
