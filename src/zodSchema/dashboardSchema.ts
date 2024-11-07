import { z } from "zod";
import { DateSchema } from "./commonSchema";

// 대시보드 생성 요청 스키마
export const CreateDashboardSchema = z.object({
  title: z.string(),
  color: z.string(),
});

export type CreateDashboard = z.infer<typeof CreateDashboardSchema>;
// 대시보드 수정 요청 스키마
export const UpdateDashboardSchema = z.object(CreateDashboardSchema.shape);

export type UpdateDashboard = z.infer<typeof UpdateDashboardSchema>;

// 대시보드 목록 요청 스키마
export const DashboardFormSchema = z.object({
  cursorId: z.number().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type DashboardForm = z.infer<typeof DashboardFormSchema>;

// 대시보드 응답 스키마
export const DashboardSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string(),
  userId: z.number(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  createdByMe: z.boolean(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

// 대시보드 목록 응답 스키마
export const DashboardListSchema = z.object({
  dashboards: z.array(DashboardSchema),
  totalCount: z.number(),
  cursorId: z.number().nullable(),
});

export type DashboardList = z.infer<typeof DashboardListSchema>;
