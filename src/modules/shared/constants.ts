import type {
  LoaiAnhChup,
  LoaiNhuCau,
  TinhTrangNguon,
  TrangThaiNhuCau,
} from '@/infrastructure/prisma/generated/client';

export const LOAI_NHU_CAU_LABELS: Record<LoaiNhuCau, string> = {
  CO_DINH: 'Cố định',
  DOT_XUAT: 'Đột xuất',
};

export const LOAI_ANH_CHUP_LABELS: Record<LoaiAnhChup, string> = {
  QUANG_HOC: 'Quang học',
  HONG_NGOAI: 'Hồng ngoại',
  SAR: 'SAR',
  DA_PHO: 'Đa phổ',
  SIEU_PHO: 'Siêu phổ',
  NHIET: 'Nhiệt',
  VIDEO: 'Video',
};

export const TRANG_THAI_NHU_CAU_LABELS: Record<TrangThaiNhuCau, string> = {
  CHO_DUYET: 'Chờ duyệt',
  DA_DUYET: 'Đã duyệt',
  DA_PHAN_CONG: 'Đã phân công',
  DANG_CHUP: 'Đang chụp',
  DA_CHUP: 'Đã chụp',
  DA_TRA_ANH: 'Đã trả ảnh',
  TU_CHOI: 'Từ chối',
  DA_HUY: 'Đã hủy',
};

export const TINH_TRANG_NGUON_LABELS: Record<TinhTrangNguon, string> = {
  HOAT_DONG: 'Hoạt động',
  BAO_TRI: 'Bảo trì',
  NGUNG_HOAT_DONG: 'Ngừng hoạt động',
};

export const NGUON_LOAI_OPTIONS = ['vệ tinh', 'UAV', 'hàng không'] as const;
export type NguonLoai = (typeof NGUON_LOAI_OPTIONS)[number];

export const NGUON_LOAI_LABELS: Record<NguonLoai, string> = {
  'vệ tinh': 'Vệ tinh',
  UAV: 'UAV',
  'hàng không': 'Hàng không',
};

export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
