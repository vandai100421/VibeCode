# Handoff — Sprint 01 (Master data)

> Báo cáo bàn giao. Đọc kèm `TASKS.md` + `ARCHITECTURE.md` khi resume.

## Việc đã làm

Xây dựng master data đầy đủ: Prisma schema (4 model + 4 enum), migration, seed, CRUD API + UI cho 2 thực thể `MucTieu` và `Nguon`. Setup TanStack Query + layout dashboard.

## File đã tạo / sửa

### Prisma (schema + migration + seed)

- `prisma/schema.prisma` — định nghĩa đầy đủ 4 model + 4 enum, có `@@map` (table name snake_case), `@@index`, `onDelete: Cascade` cho NhuCauAnhLichSu
- `prisma/migrations/20260704072534_init/migration.sql` — migration đầu tiên (auto generate)
- `prisma/seed.ts` — seed 4 mục tiêu + 5 nguồn mẫu
- `prisma.config.ts` — thêm `migrations.seed: 'tsx prisma/seed.ts'`
- `package.json` — thêm devDep `tsx`

### Shared module

- `src/modules/shared/enums.ts` — re-export enum từ Prisma generated
- `src/modules/shared/constants.ts` — label tiếng Việt cho tất cả enum + `NGUON_LOAI_OPTIONS` + `PAGE_SIZE`
- `src/modules/shared/index.ts` — barrel

### Module muc-tieu

- `src/modules/muc-tieu/schema/muc-tieu-schema.ts` — Zod schema (ten: trim, min 1, max 255)
- `src/modules/muc-tieu/api/muc-tieu-service.ts` — service: list, getById, create, update, delete (check unique ten, block delete nếu có nhu cầu liên kết)
- `src/modules/muc-tieu/hooks/use-muc-tieu.ts` — TanStack Query hooks: useMucTieuList, useCreateMucTieu, useUpdateMucTieu, useDeleteMucTieu
- `src/modules/muc-tieu/components/muc-tieu-form-dialog.tsx` — form dialog tạo/sửa (react-hook-form + zodResolver)
- `src/modules/muc-tieu/components/muc-tieu-list.tsx` — list table + nút thêm/sửa/xóa
- `src/modules/muc-tieu/index.ts` — barrel

### Module nguon

- `src/modules/nguon/schema/nguon-schema.ts` — Zod schema (nguon enum, tenNguon, thoiGianSuDung, tinhTrang enum, danhGia optional)
- `src/modules/nguon/api/nguon-service.ts` — service: list, getById, create, update, delete (check unique tenNguon, block delete nếu có nhu cầu liên kết)
- `src/modules/nguon/hooks/use-nguon.ts` — 4 hooks tương tự muc-tieu
- `src/modules/nguon/components/nguon-form-dialog.tsx` — form dialog với Select cho enum + textarea cho danhGia
- `src/modules/nguon/components/nguon-list.tsx` — list table + badge cho tình trạng (xanh/vàng/đỏ)
- `src/modules/nguon/index.ts` — barrel

### API routes (Next.js 16 route handlers)

- `src/app/api/muc-tieu/route.ts` — GET (list) + POST (create)
- `src/app/api/muc-tieu/[id]/route.ts` — GET + PUT + DELETE
- `src/app/api/nguon/route.ts` — GET + POST
- `src/app/api/nguon/[id]/route.ts` — GET + PUT + DELETE

### UI / layout

- `src/app/(dashboard)/layout.tsx` — dashboard layout (Sidebar + QueryProvider)
- `src/app/(dashboard)/tong-quan/page.tsx` — trang tổng quan (3 card placeholder)
- `src/app/(dashboard)/muc-tieu/page.tsx` — render MucTieuList
- `src/app/(dashboard)/nguon/page.tsx` — render NguonList
- `src/app/page.tsx` — redirect → `/tong-quan`
- `src/components/layout/sidebar.tsx` — sidebar nav (Tổng quan, Nhu cầu ảnh, Nguồn, Mục tiêu)
- `src/lib/query-provider.tsx` — QueryProvider client component (staleTime 30s, retry 1)
- `src/lib/api.ts` — API fetcher (`api.get/post/put/delete`) với error envelope handling

## Quyết định kỹ thuật đã chốt

1. **Prisma 7 + SQLite hỗ trợ enum native** (từ v6.2.0) — lưu dạng TEXT, validate client-side. Không cần fallback String.
2. **Table naming**: dùng `@@map("snake_case")` cho tên bảng (muc_tieu, nguon, nhu_cau_anh, nhu_cau_anh_lich_su) — giữ convention DB snake_case, model PascalCase.
3. **Cascade delete**: `NhuCauAnhLichSu.nhuCau` có `onDelete: Cascade` — xóa nhu cầu sẽ tự xóa lịch sử. Ngược lại, `MucTieu`/`Nguon` KHÔNG cascade — service layer block delete nếu có nhu cầu liên kết (tránh mất dữ liệu).
4. **Next.js 16 `params` là Promise** — mọi route handler `[id]` đều `await ctx.params`. Dùng global helper `RouteContext<'/api/.../[id]'>` (không cần import). Phải chạy `npx next typegen` mỗi khi thêm route mới để generate type.
5. **Zod 4 API**: `z.enum(values, { message })` — không còn `errorMap` như Zod 3.
6. **react-hook-form + Zod 4**: `zodResolver(schema)` hoạt động nhưng có thể cần `as never` cast khi discriminated union. Trong Nguon form dùng `useWatch` thay `watch()` để tương thích React Compiler (lint warning).
7. **API envelope**: mọi response dạng `{ success, data? | error? }`. Helper `apiSuccess(data, status)` / `apiError(err, status)` ở `lib/errors.ts`. Client fetcher `lib/api.ts` tự parse + throw Error nếu `success: false`.
8. **TanStack Query**: `staleTime: 30s` (tránh refetch quá dồn dập), `retry: 1`, `refetchOnWindowFocus: false`. Mutation `invalidateQueries` sau khi thành công.
9. **Layout**: route group `(dashboard)` chứa sidebar + QueryProvider. Root `/` redirect → `/tong-quan`.
10. **Seed**: chạy `npx prisma db seed`. Reset data bằng `deleteMany()` trước khi insert (idempotent).

## Vấn đề còn tồn / TODO

- Trang tổng quan chỉ có placeholder, chưa có số liệu thực → S3 sẽ đếm từ DB.
- `NhuCauAnh` và `NhuCauAnhLichSu` đã có schema + migration nhưng chưa có service/UI → S2.
- Chưa có validation test (Vitest) → S3.
- Tiếng Việt trong terminal Windows (curl) hiển thị lỗi `?` — đây chỉ là vấn đề rendering terminal, trong trình duyệt + DB hiển thị đúng UTF-8.
- Sidebar có link "Nhu cầu ảnh" nhưng chưa có page → S2 sẽ tạo.

## Điều kiện tiên quyết cho S2

- Đã đọc `PROJECT.md` (đặc biệt workflow trạng thái + discriminated union CO_DINH/DOT_XUAT).
- Đã đọc `prompts/sprint-02.md` (sẽ viết tiếp).
- DB đã có schema `NhuCauAnh` + `NhuCauAnhLichSu` (đã migrate ở S1).
- `src/modules/nhu-cau-anh/` đã có cấu trúc rỗng sẵn sàng.
- Chạy `npm run typecheck` + `npm run lint` phải sạch trước khi bắt đầu.

## Lệnh kiểm tra trạng thái hiện tại

```bash
npm run typecheck   # 0 error
npm run lint        # 0 warning
npm run format:check
npm run build       # build production thành công
npm run dev         # mở http://localhost:3000 → redirect → /tong-quan
npx prisma studio   # xem DB (4 muc_tieu, 5 nguon)
```

## Routes đã có

| Method         | Path                 | Chức năng              |
| -------------- | -------------------- | ---------------------- |
| GET/POST       | `/api/muc-tieu`      | list + create muc tieu |
| GET/PUT/DELETE | `/api/muc-tieu/[id]` | CRUD 1 muc tieu        |
| GET/POST       | `/api/nguon`         | list + create nguon    |
| GET/PUT/DELETE | `/api/nguon/[id]`    | CRUD 1 nguon           |

UI: `/tong-quan`, `/muc-tieu`, `/nguon`. `/` redirect → `/tong-quan`.
