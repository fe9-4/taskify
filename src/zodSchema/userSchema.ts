import { z } from "zod";
import { UserSchema } from "./authSchema";

// request schema
export const SignupSchema = z.object({
  email: z.string(),
  password: z.string(),
  nickname: z.string(),
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
