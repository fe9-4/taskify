import { z } from "zod";
import { DateSchema, EmailSchema } from "./commonSchema";

// 초대 폼 스키마
export const FormSchema = z.object({
  email: EmailSchema,
});

export type FormData = z.infer<typeof FormSchema>;

// 초대된 사용자 정보 스키마
const InviteeSchema = z.object({
  nickname: z.string(),
  email: z.string().email(),
  id: z.number(),
});

// 초대한 사용자 정보 스키마
const InviterSchema = z.object({
  nickname: z.string(),
  email: z.string().email(),
  id: z.number(),
});

// 대시보드 정보 스키마
const DashboardInfoSchema = z.object({
  title: z.string(),
  id: z.number(),
});

// 초대 정보 스키마
export const InvitationSchema = z.object({
  id: z.number(),
  inviter: InviterSchema,
  teamId: z.string(),
  dashboard: DashboardInfoSchema,
  invitee: InviteeSchema,
  inviteAccepted: z.boolean(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

// 초대 목록 스키마
export const InvitationListSchema = z.object({
  invitations: z.array(InvitationSchema),
  totalCount: z.number(),
});

// 타입 추출
export type Invitation = z.infer<typeof InvitationSchema>;
export type InvitationList = z.infer<typeof InvitationListSchema>;
