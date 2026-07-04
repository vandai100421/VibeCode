# Prompt — Sprint 02 (Nhu cầu ảnh core)

## Bối cảnh

Đọc trước: `PROJECT.md`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `DEVELOPMENT_RULES.md`, `docs/handoff/sprint-01.md`.

DB đã có schema `NhuCauAnh` + `NhuCauAnhLichSu` (migrate ở S1). Cấu trúc `src/modules/nhu-cau-anh/` đã scaffold rỗng.

## Mục tiêu

Xây dựng module `nhu-cau-anh` — thực thể trung tâm của hệ thống. Bao gồm: Zod discriminated union theo `loaiNhuCau`, service layer có state transition guard + audit log, route handlers CRUD + endpoint chuyển trạng thái, UI form conditional + list filter + detail timeline.

## Tasks (theo TASKS.md)

1. **Zod schema** `src/modules/nhu-cau-anh/schema/nhu-cau-anh-schema.ts`:
   - `createNhuCauSchema` = discriminated union theo `loaiNhuCau`:
     - `CO_DINH`: bắt buộc `thoiGianChup` (DateTime), `thoiGianMongMuonTu/Den` = undefined
     - `DOT_XUAT`: bắt buộc `thoiGianMongMuonTu` + `thoiGianMongMuonDen` (DateTime), `thoiGianChup` = undefined
   - Common fields: mucTieuId, nguonId, diaBan, loaiAnhChup, toaDoX, toaDoY, doPhanGiai, moTa?
   - `updateNhuCauSchema` tương tự nhưng cho phép partial
   - `transitionSchema`: { trangThaiMoi: TrangThaiNhuCau, ghiChu?: string }

2. **Service** `src/modules/nhu-cau-anh/api/nhu-cau-anh-service.ts`:
   - `listNhuCau(filters)` — filter theo trangThai, nguonId, mucTieuId, loaiNhuCau, loaiAnhChup + pagination
   - `getNhuCauById(id)` — include mucTieu, nguon, lichSu (orderBy thoiGian desc)
   - `createNhuCau(input)` — tạo NhuCauAnh + tạo NhuCauAnhLichSu (trangThaiCu=null, trangThaiMoi=CHO_DUYET) trong transaction
   - `updateNhuCau(id, input)` — cập nhật field (không cho đổi loaiNhuCau sau khi tạo)
   - `transitionState(id, { trangThaiMoi, ghiChu })` — validate transition hợp lệ theo workflow (xem PROJECT.md), throw StateTransitionError nếu lệch, tạo NhuCauAnhLichSu mới
   - `deleteNhuCau(id)` — chỉ cho xóa khi ở trạng thái CHO_DUYET/TU_CHOI/DA_HUY

3. **State transition rules** (ở `src/modules/nhu-cau-anh/lib/state-machine.ts`):
   - CHO_DUYET → DA_DUYET | TU_CHOI
   - DA_DUYET → DA_PHAN_CONG | DA_HUY
   - DA_PHAN_CONG → DANG_CHUP | DA_HUY
   - DANG_CHUP → DA_CHUP | DA_HUY
   - DA_CHUP → DA_TRA_ANH
   - TU_CHOI, DA_HUY, DA_TRA_ANH → terminal (không chuyển tiếp)

4. **Route handlers**:
   - `GET /api/nhu-cau-anh` — list + filter + pagination
   - `POST /api/nhu-cau-anh` — create
   - `GET /api/nhu-cau-anh/[id]` — detail with relations
   - `PUT /api/nhu-cau-anh/[id]` — update
   - `DELETE /api/nhu-cau-anh/[id]` — delete (chỉ ở trạng thái nhất định)
   - `POST /api/nhu-cau-anh/[id]/transition` — chuyển trạng thái

5. **UI**:
   - Form tạo/sửa conditional: khi chọn `loaiNhuCau=CO_DINH` → hiện field `thoiGianChup`; khi `DOT_XUAT` → hiện `thoiGianMongMuonTu` + `thoiGianMongMuonDen`
   - List page: table + filter bar (trạng thái, nguồn, mục tiêu, loại nhu cầu) + pagination
   - Detail page: thông tin đầy đủ + timeline lịch sử trạng thái (NhuCauAnhLichSu)
   - Detail page: nút chuyển trạng thái (chỉ hiện transition hợp lệ từ trạng thái hiện tại)

## Ràng buộc

- Tuân thủ `CODING_STANDARDS.md`.
- Discriminated union Zod phải đúng — đây là điểm mấu chốt của bài toán.
- Mọi state transition phải có audit log (NhuCauAnhLichSu).
- Không cho quay lui trạng thái (trừ DA_HUY từ DA_DUYET/DA_PHAN_CONG/DANG_CHUP).
- Sau khi xong: chạy typecheck + lint + format, cập nhật TASKS.md, viết `docs/handoff/sprint-02.md`.
