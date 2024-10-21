import { z } from "zod";
import { UserSchema } from "./authSchema";

// request schema
export const SignupSchema = z
  .object({
    email: z
      .string()
      .email("이메일 형식으로 작성해 주세요.")
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "8자 이상 입력해주세요.")
      .max(100, "비밀번호는 최대 100자까지 가능합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
      ),
    nickname: z
      .string()
      .min(2, "2자 이상으로 작성해 주세요.")
      .max(10, "10자 이하로 작성해 주세요.")
      .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 사용 가능합니다."),
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
  nickname: z
    .string()
    .min(2, "2자 이상으로 작성해 주세요.")
    .max(10, "10자 이하로 작성해 주세요.")
    .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 사용 가능합니다."),
  profileImageUrl: z.string().url("올바른 URL 형식이 아닙니다."),
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
