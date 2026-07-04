import { z } from 'zod';
import { NGUON_LOAI_OPTIONS } from '@/modules/shared/constants';

export const createNguonSchema = z.object({
  nguon: z.enum(NGUON_LOAI_OPTIONS, {
    message: 'Loại nguồn không hợp lệ',
  }),
  tenNguon: z
    .string()
    .trim()
    .min(1, 'Tên nguồn là bắt buộc')
    .max(255, 'Tên nguồn không được quá 255 ký tự'),
  thoiGianSuDung: z
    .string()
    .trim()
    .min(1, 'Thời gian sử dụng là bắt buộc')
    .max(255, 'Thời gian sử dụng không được quá 255 ký tự'),
  tinhTrang: z.enum(['HOAT_DONG', 'BAO_TRI', 'NGUNG_HOAT_DONG'], {
    message: 'Tình trạng không hợp lệ',
  }),
  danhGia: z
    .string()
    .trim()
    .max(2000, 'Đánh giá không được quá 2000 ký tự')
    .optional()
    .or(z.literal('')),
});

export const updateNguonSchema = createNguonSchema;

export type CreateNguonInput = z.infer<typeof createNguonSchema>;
export type UpdateNguonInput = z.infer<typeof updateNguonSchema>;
