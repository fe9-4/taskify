import { z } from "zod";
import { DateSchema } from "./commonSchema";

// 컬럼 생성 요청 스키마
export const CreateColumnSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(20, "제목은 20자 이하로 입력해주세요"),
  dashboardId: z.number(),
});

export type CreateColumnSchemaType = z.infer<typeof CreateColumnSchema>;

// 컬럼 수정 요청 스키마
export const UpdateColumnSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(20, "제목은 20자 이하로 입력해주세요"),
  order: z.number().optional(),
});

export type UpdateColumnSchemaType = z.infer<typeof UpdateColumnSchema>;

// 단일 컬럼 스키마
export const ColumnSchema = z.object({
  id: z.number(),
  title: z.string(),
  teamId: z.string(),
  dashboardId: z.number(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type ColumnSchemaType = z.infer<typeof ColumnSchema>;

// 컬럼 목록 응답 스키마 (배열 형태로 수정)
export const ColumnListSchema = z.array(ColumnSchema);

export type ColumnListSchemaType = z.infer<typeof ColumnListSchema>;
