import { z } from "zod";
import { UserSchema } from "./authSchema";

// request schema
export const SignupSchema = z
  .object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(100, "비밀번호는 최대 100자까지 가능합니다"),
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다").max(20, "닉네임은 최대 20자까지 가능합니다"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type Signup = z.infer<typeof SignupSchema>;

export const UpdateUserProfileSchema = z.object({
  nickname: z.string(),
  profileImageUrl: z.string(),
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
