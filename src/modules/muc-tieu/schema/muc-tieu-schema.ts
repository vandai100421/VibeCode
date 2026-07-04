import { z } from 'zod';

export const createMucTieuSchema = z.object({
  ten: z
    .string()
    .trim()
    .min(1, 'Tên mục tiêu là bắt buộc')
    .max(255, 'Tên mục tiêu không được quá 255 ký tự'),
});

export const updateMucTieuSchema = createMucTieuSchema;

export type CreateMucTieuInput = z.infer<typeof createMucTieuSchema>;
export type UpdateMucTieuInput = z.infer<typeof updateMucTieuSchema>;
