import { z } from "zod";
import { DateSchema } from "./commonSchema";

// 대시보드 목록 요청 스키마
export const DashboardFormSchema = z.object({
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

// 사용자 대시보드 응답 스키마
export const UserDashboardSchema = z.object({
  user: z.object({
    dashboards: z.array(DashboardSchema),
    totalCount: z.number(),
    cursorId: z.number().nullable(),
  }),
});

export type UserDashboard = z.infer<typeof UserDashboardSchema>;
