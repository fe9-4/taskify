import { z } from "zod";
import { DateSchema } from "./commonSchema";

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

export const DashboardListSchema = z.object({
  dashboards: z.array(DashboardSchema),
  totalCount: z.number(),
  cursorId: z.number().nullable(),
});

export type DashboardList = z.infer<typeof DashboardListSchema>;

export const UserDashboardSchema = z.object({
  user: z.object({
    dashboards: z.array(DashboardSchema),
    totalCount: z.number(),
    cursorId: z.number().nullable(),
  }),
});

export type UserDashboard = z.infer<typeof UserDashboardSchema>;
